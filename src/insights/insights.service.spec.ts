import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InsightsService } from './insights.service';
import { Employee } from '../employees/entities/employee.entity';
import { Salary } from '../salaries/entities/salary.entity';

describe('InsightsService', () => {
  let service: InsightsService;
  let salaryRepository: Repository<Salary>;

  const mockQueryBuilder = {
    innerJoin: jest.fn().mockReturnThis(),
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    getRawOne: jest.fn(),
    getMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InsightsService,
        {
          provide: getRepositoryToken(Employee),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
          },
        },
        {
          provide: getRepositoryToken(Salary),
          useValue: {
            count: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<InsightsService>(InsightsService);
    salaryRepository = module.get<Repository<Salary>>(getRepositoryToken(Salary));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('query', () => {
    it('returns average salary of a valid country', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValueOnce({ avg: '45000.50' });

      const result = await service.query('What is the average salary in India?');

      expect(result.answer).toBe('The average salary in India is $45,001.');
    });

    it('returns error message if no employee records found for country', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValueOnce({ avg: null });

      const result = await service.query('What is the average salary in Antarctica?');

      expect(result.answer).toBe('No employee records found for country: Antarctica.');
    });

    it('returns department with highest average salary', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValueOnce({
        department: 'Engineering',
        average: '120000.00',
      });

      const result = await service.query('Which department has the highest average salary?');

      expect(result.answer).toBe(
        'The Engineering department has the highest average salary at $120,000.',
      );
    });

    it('returns fallback message if highest average salary query has no data', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValueOnce(null);

      const result = await service.query('Which department has the highest average salary?');

      expect(result.answer).toBe('No department data found.');
    });

    it('returns employee count earning more than a threshold', async () => {
      jest.spyOn(salaryRepository, 'count').mockResolvedValueOnce(15);

      const result = await service.query('How many employees earn more than $100,000?');

      expect(result.answer).toBe('There are 15 employees who earn more than $100,000.');
    });

    it('returns top 10 highest-paid employees formatted as a list', async () => {
      const mockEmployees = [
        {
          firstName: 'Alice',
          lastName: 'Smith',
          employeeCode: 'EMP001',
          department: 'Engineering',
          salaries: [{ baseSalary: 150000 }],
        },
        {
          firstName: 'Bob',
          lastName: 'Jones',
          employeeCode: 'EMP002',
          department: 'HR',
          salaries: [{ baseSalary: 80000 }],
        },
      ];

      mockQueryBuilder.getMany.mockResolvedValueOnce(mockEmployees);

      const result = await service.query('Who are the top 10 highest-paid employees?');

      expect(result.answer).toContain('Here are the top 10 highest-paid employees:');
      expect(result.answer).toContain('1. Alice Smith (EMP001) - $150,000 (Engineering)');
      expect(result.answer).toContain('2. Bob Jones (EMP002) - $80,000 (HR)');
    });

    it('returns error message if top paid search finds no employees', async () => {
      mockQueryBuilder.getMany.mockResolvedValueOnce([]);

      const result = await service.query('Who are the top 10 highest-paid employees?');

      expect(result.answer).toBe('No employee records found.');
    });

    it('returns menu suggestions when question is not supported', async () => {
      const result = await service.query('What is the weather today?');

      expect(result.answer).toContain(
        "I'm sorry, I couldn't understand your question. Try asking one of the following:",
      );
    });
  });
});
