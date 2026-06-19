import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { GetEmployeesFilterDto } from './dto/get-employees-filter.dto';

describe('EmployeesController', () => {
  let controller: EmployeesController;
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
  };

  const mockSalary = {
    id: 'sal-1',
    baseSalary: 100000,
    bonus: 10000,
    isCurrent: true,
    effectiveDate: '2025-01-01',
  };

  const mockEmployeesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeesController],
      providers: [
        {
          provide: EmployeesService,
          useValue: mockEmployeesService,
        },
      ],
    }).compile();

    controller = module.get<EmployeesController>(EmployeesController);
    service = module.get<EmployeesService>(EmployeesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated employees list', async () => {
      const mockResult = {
        data: [mockEmployee as any],
        total: 1,
        page: 1,
      };
      mockEmployeesService.findAll.mockResolvedValue(mockResult);

      const filterDto: GetEmployeesFilterDto = { page: 1, pageSize: 10 };
      const result = await controller.findAll(filterDto);

      expect(service.findAll).toHaveBeenCalledWith(filterDto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findOne', () => {
    it('should return employee and current salary', async () => {
      const mockResult = {
        employee: mockEmployee as any,
        currentSalary: mockSalary as any,
      };
      mockEmployeesService.findOne.mockResolvedValue(mockResult);

      const result = await controller.findOne('mock-id');

      expect(service.findOne).toHaveBeenCalledWith('mock-id');
      expect(result).toEqual(mockResult);
    });
  });
});
