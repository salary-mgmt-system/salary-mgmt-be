import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { SalariesService } from './salaries.service';
import { Employee } from '../employees/entities/employee.entity';
import { Salary } from './entities/salary.entity';
import { SalaryHistory } from './entities/salary-history.entity';

describe('SalariesService', () => {
  let service: SalariesService;
  let employeeRepository: Repository<Employee>;
  let salaryHistoryRepository: Repository<SalaryHistory>;

  const mockEmployee = {
    id: 'emp-1',
    employeeCode: 'EMP001',
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice@example.com',
  } as Employee;

  const mockCurrentSalary = {
    id: 'sal-1',
    employeeId: 'emp-1',
    baseSalary: 100000,
    bonus: 10000,
    effectiveDate: '2025-01-01',
    isCurrent: true,
  } as Salary;

  const mockEntityManager = {
    findOne: jest.fn(),
    save: jest.fn().mockImplementation(<T>(entityClassOrEntity: T, entity?: unknown) => {
      return Promise.resolve((entity ?? entityClassOrEntity) as T);
    }),
    create: jest.fn().mockImplementation((_entityClass: unknown, data: unknown) => data),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalariesService,
        {
          provide: getRepositoryToken(Employee),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Salary),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(SalaryHistory),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            transaction: jest
              .fn()
              .mockImplementation((cb: (manager: unknown) => unknown) => cb(mockEntityManager)),
          },
        },
      ],
    }).compile();

    service = module.get<SalariesService>(SalariesService);
    employeeRepository = module.get<Repository<Employee>>(getRepositoryToken(Employee));
    salaryHistoryRepository = module.get<Repository<SalaryHistory>>(
      getRepositoryToken(SalaryHistory),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateSalary', () => {
    it('successfully demotes previous salary, saves new salary and history', async () => {
      mockEntityManager.findOne
        .mockResolvedValueOnce(mockEmployee)
        .mockResolvedValueOnce(mockCurrentSalary);

      const dto = {
        baseSalary: 120000,
        bonus: 15000,
        effectiveDate: '2026-01-01',
        reason: 'Promotion',
      };

      const result = await service.updateSalary('emp-1', dto);

      expect(mockEntityManager.findOne).toHaveBeenCalledTimes(2);
      expect(mockCurrentSalary.isCurrent).toBe(false);
      expect(mockEntityManager.save).toHaveBeenCalledTimes(3);
      expect(result.employee).toEqual(mockEmployee);
      expect(result.currentSalary.baseSalary).toBe(dto.baseSalary);
      expect(result.currentSalary.isCurrent).toBe(true);
    });

    it('successfully updates salary when no current salary exists (edge case)', async () => {
      mockEntityManager.findOne.mockResolvedValueOnce(mockEmployee).mockResolvedValueOnce(null);

      const dto = {
        baseSalary: 120000,
        bonus: 15000,
        effectiveDate: '2026-01-01',
        reason: 'Promotion',
      };

      const result = await service.updateSalary('emp-1', dto);

      expect(mockEntityManager.save).toHaveBeenCalledTimes(2);
      expect(result.currentSalary.baseSalary).toBe(dto.baseSalary);
    });

    it('throws NotFoundException if employee is not found', async () => {
      mockEntityManager.findOne.mockResolvedValueOnce(null);

      const dto = {
        baseSalary: 120000,
        bonus: 15000,
        effectiveDate: '2026-01-01',
        reason: 'Promotion',
      };

      await expect(service.updateSalary('invalid-emp', dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getSalaryHistory', () => {
    it('returns sorted salary history list', async () => {
      const mockHistory = [
        {
          id: 'hist-2',
          employeeId: 'emp-1',
          oldSalary: 100000,
          newSalary: 120000,
          reason: 'Promotion',
          changedAt: new Date('2026-01-01'),
        },
        {
          id: 'hist-1',
          employeeId: 'emp-1',
          oldSalary: 80000,
          newSalary: 100000,
          reason: 'Merit',
          changedAt: new Date('2025-01-01'),
        },
      ];
      const findOneSpy = jest
        .spyOn(employeeRepository, 'findOne')
        .mockResolvedValueOnce({ id: 'emp-1' } as Employee);
      const findSpy = jest
        .spyOn(salaryHistoryRepository, 'find')
        .mockResolvedValueOnce(mockHistory as unknown as SalaryHistory[]);

      const result = await service.getSalaryHistory('emp-1');

      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id: 'emp-1' },
        select: { id: true },
      });
      expect(findSpy).toHaveBeenCalledWith({
        where: { employeeId: 'emp-1' },
        order: { changedAt: 'DESC' },
      });
      expect(result).toEqual(mockHistory);
    });

    it('throws NotFoundException if employee is not found', async () => {
      jest.spyOn(employeeRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.getSalaryHistory('invalid-emp')).rejects.toThrow(NotFoundException);
    });
  });
});
