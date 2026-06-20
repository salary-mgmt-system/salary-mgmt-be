import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalyticsService } from './analytics.service';
import { Employee } from '../employees/entities/employee.entity';
import { Salary } from '../salaries/entities/salary.entity';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let salaryRepository: Repository<Salary>;

  const mockQueryBuilder = {
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: getRepositoryToken(Employee),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
          },
        },
        {
          provide: getRepositoryToken(Salary),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    salaryRepository = module.get<Repository<Salary>>(getRepositoryToken(Salary));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOverview', () => {
    it('returns default zero values when no salaries exist', async () => {
      jest.spyOn(salaryRepository, 'find').mockResolvedValueOnce([]);

      const result = await service.getOverview();

      expect(result).toEqual({
        employeeCount: 0,
        averageSalary: 0,
        medianSalary: 0,
        highestSalary: 0,
        lowestSalary: 0,
      });
    });

    it('calculates average, min, max and median for odd number of salaries', async () => {
      const mockSalaries = [
        { baseSalary: 100 },
        { baseSalary: 300 },
        { baseSalary: 200 },
      ] as Salary[];

      jest.spyOn(salaryRepository, 'find').mockResolvedValueOnce(mockSalaries);

      const result = await service.getOverview();

      expect(result).toEqual({
        employeeCount: 3,
        averageSalary: 200,
        medianSalary: 200,
        highestSalary: 300,
        lowestSalary: 100,
      });
    });

    it('calculates median correctly for even number of salaries', async () => {
      const mockSalaries = [
        { baseSalary: 100 },
        { baseSalary: 400 },
        { baseSalary: 200 },
        { baseSalary: 300 },
      ] as Salary[];

      jest.spyOn(salaryRepository, 'find').mockResolvedValueOnce(mockSalaries);

      const result = await service.getOverview();

      expect(result.medianSalary).toBe(250); // average of 200 and 300
    });
  });

  describe('getCountryAnalytics', () => {
    it('returns grouped analytics by country', async () => {
      const mockEmployees = [
        {
          id: '1',
          country: 'USA',
          salaries: [{ baseSalary: 100000 }],
        },
        {
          id: '2',
          country: 'USA',
          salaries: [{ baseSalary: 120000 }],
        },
        {
          id: '3',
          country: 'Canada',
          salaries: [{ baseSalary: 90000 }],
        },
        {
          id: '4',
          country: 'Mexico',
          salaries: [], // no salary, should be ignored
        },
      ];

      mockQueryBuilder.getMany.mockResolvedValueOnce(mockEmployees);

      const result = await service.getCountryAnalytics();

      expect(result).toHaveLength(2);
      const usa = result.find((r) => r.name === 'USA');
      const canada = result.find((r) => r.name === 'Canada');
      const mexico = result.find((r) => r.name === 'Mexico');

      expect(usa).toBeDefined();
      expect(usa?.employeeCount).toBe(2);
      expect(usa?.averageSalary).toBe(110000);
      expect(usa?.medianSalary).toBe(110000);
      expect(usa?.highestSalary).toBe(120000);
      expect(usa?.lowestSalary).toBe(100000);

      expect(canada).toBeDefined();
      expect(canada?.employeeCount).toBe(1);
      expect(canada?.averageSalary).toBe(90000);

      expect(mexico).toBeUndefined();
    });
  });

  describe('getDepartmentAnalytics', () => {
    it('returns grouped analytics by department', async () => {
      const mockEmployees = [
        {
          id: '1',
          department: 'Engineering',
          salaries: [{ baseSalary: 150000 }],
        },
        {
          id: '2',
          department: 'HR',
          salaries: [{ baseSalary: 80000 }],
        },
        {
          id: '3',
          department: 'Engineering',
          salaries: [{ baseSalary: 170000 }],
        },
        {
          id: '4',
          department: 'Marketing',
          salaries: [], // no salary, should be ignored
        },
      ];

      mockQueryBuilder.getMany.mockResolvedValueOnce(mockEmployees);

      const result = await service.getDepartmentAnalytics();

      expect(result).toHaveLength(2);
      const eng = result.find((r) => r.name === 'Engineering');
      const mkt = result.find((r) => r.name === 'Marketing');

      expect(eng?.averageSalary).toBe(160000);
      expect(mkt).toBeUndefined();
    });
  });

  describe('getSalaryDistribution', () => {
    it('returns salary counts correctly grouped by USD brackets using country multipliers', async () => {
      const mockEmployees = [
        {
          id: '1',
          country: 'United States',
          salaries: [{ baseSalary: 75000 }], // 75000 / 1.0 = 75000 (< $80k)
        },
        {
          id: '2',
          country: 'United Kingdom',
          salaries: [{ baseSalary: 80000 }], // 80000 / 0.8 = 100000 ($80k - $120k)
        },
        {
          id: '3',
          country: 'Germany',
          salaries: [{ baseSalary: 135000 }], // 135000 / 0.9 = 150000 ($120k - $160k)
        },
        {
          id: '4',
          country: 'Canada',
          salaries: [{ baseSalary: 207000 }], // 207000 / 1.15 = 180000 ($160k - $200k)
        },
        {
          id: '5',
          country: 'India',
          salaries: [{ baseSalary: 3300000 }], // 3300000 / 15.0 = 220000 ($200k - $240k)
        },
        {
          id: '6',
          country: 'United States',
          salaries: [{ baseSalary: 260000 }], // 260000 / 1.0 = 260000 ($240k+)
        },
        {
          id: '7',
          country: 'India',
          salaries: [], // no salary, should be ignored
        },
        {
          id: '8',
          country: 'Mexico', // fallback multiplier 1.0
          salaries: [{ baseSalary: 75000 }], // 75000 / 1.0 = 75000 (< $80k)
        },
      ];

      mockQueryBuilder.getMany.mockResolvedValueOnce(mockEmployees);

      const result = await service.getSalaryDistribution();

      expect(result).toHaveLength(6);
      expect(result.find((r) => r.bracket === '< $80k')?.count).toBe(2);
      expect(result.find((r) => r.bracket === '$80k - $120k')?.count).toBe(1);
      expect(result.find((r) => r.bracket === '$120k - $160k')?.count).toBe(1);
      expect(result.find((r) => r.bracket === '$160k - $200k')?.count).toBe(1);
      expect(result.find((r) => r.bracket === '$200k - $240k')?.count).toBe(1);
      expect(result.find((r) => r.bracket === '$240k+')?.count).toBe(1);
    });
  });
});
