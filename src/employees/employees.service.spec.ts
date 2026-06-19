import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Employee } from './entities/employee.entity';

describe('EmployeesService', () => {
  let service: EmployeesService;

  const mockEmployee = {
    id: 'mock-id',
    employeeCode: 'EMP-10001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    department: 'Engineering',
    designation: 'Senior Engineer',
    country: 'United States',
    currency: 'USD',
    salaries: [
      {
        id: 'sal-1',
        baseSalary: 100000,
        bonus: 10000,
        isCurrent: true,
        effectiveDate: '2025-01-01',
      },
      {
        id: 'sal-2',
        baseSalary: 90000,
        bonus: 5000,
        isCurrent: false,
        effectiveDate: '2024-01-01',
      },
    ],
  };

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[mockEmployee], 1]),
  };

  const mockRepository = {
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        {
          provide: getRepositoryToken(Employee),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should query employees with default filters and sorting', async () => {
      const result = await service.findAll({ page: 1, pageSize: 10 });

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('employee');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'employee.salaries',
        'salary',
        'salary.is_current = :isCurrent',
        { isCurrent: true },
      );
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('employee.employee_code', 'ASC');
      expect(result).toEqual({
        data: [mockEmployee],
        total: 1,
        page: 1,
      });
    });

    it('should apply filters, search and sorting', async () => {
      await service.findAll({
        page: 2,
        pageSize: 5,
        search: 'John',
        department: 'Engineering',
        country: 'United States',
        sortBy: 'baseSalary',
        sortOrder: 'DESC',
      });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('employee.department = :department', {
        department: 'Engineering',
      });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('employee.country = :country', {
        country: 'United States',
      });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '(employee.first_name ILIKE :search OR employee.last_name ILIKE :search OR employee.email ILIKE :search OR employee.employee_code ILIKE :search)',
        { search: '%John%' },
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('salary.base_salary', 'DESC');
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(5);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(5);
    });

    it('should sort by bonus', async () => {
      await service.findAll({
        page: 1,
        pageSize: 10,
        sortBy: 'bonus',
        sortOrder: 'ASC',
      });
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('salary.bonus', 'ASC');
    });

    it('should sort by firstName (non-salary field)', async () => {
      await service.findAll({
        page: 1,
        pageSize: 10,
        sortBy: 'firstName',
        sortOrder: 'DESC',
      });
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('employee.first_name', 'DESC');
    });

    it('should fallback to employeeCode sorting when invalid field is provided', async () => {
      await service.findAll({
        sortBy: 'invalidField',
        sortOrder: 'ASC',
      });
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('employee.employee_code', 'ASC');
    });

    it('should use default page and pageSize when they are not provided', async () => {
      await service.findAll({});

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
    });
  });

  describe('findOne', () => {
    it('should return employee and current salary', async () => {
      mockRepository.findOne.mockResolvedValue({ ...mockEmployee });

      const result = await service.findOne('mock-id');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'mock-id' },
        relations: { salaries: true },
      });
      expect(result.employee.id).toBe('mock-id');
      expect(result.currentSalary?.id).toBe('sal-1');
      expect((result.employee as any).salaries).toBeUndefined(); // Should be cleaned up
    });

    it('should throw NotFoundException if employee not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });

    it('should return null currentSalary if no current salary exists for employee', async () => {
      const mockEmployeeNoCurrent = {
        ...mockEmployee,
        salaries: [
          {
            id: 'sal-2',
            baseSalary: 90000,
            bonus: 5000,
            isCurrent: false,
            effectiveDate: '2024-01-01',
          },
        ],
      };
      mockRepository.findOne.mockResolvedValueOnce(mockEmployeeNoCurrent);

      const result = await service.findOne('mock-id');

      expect(result.currentSalary).toBeNull();
    });
  });
});
