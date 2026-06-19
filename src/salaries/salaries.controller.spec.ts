import { Test, TestingModule } from '@nestjs/testing';
import { SalariesController } from './salaries.controller';
import { SalariesService } from './salaries.service';
import { UpdateSalaryDto } from './dto/update-salary.dto';
import { Salary } from './entities/salary.entity';
import { SalaryHistory } from './entities/salary-history.entity';
import { Employee } from '../employees/entities/employee.entity';

describe('SalariesController', () => {
  let controller: SalariesController;
  let service: SalariesService;

  const mockEmployee = { id: 'emp-1', firstName: 'Alice' } as Employee;
  const mockSalary = { id: 'sal-1', baseSalary: 120000 } as Salary;
  const mockHistory = [{ id: 'hist-1', oldSalary: 100000, newSalary: 120000 }] as SalaryHistory[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalariesController],
      providers: [
        {
          provide: SalariesService,
          useValue: {
            updateSalary: jest.fn().mockResolvedValue({
              employee: mockEmployee,
              currentSalary: mockSalary,
            }),
            getSalaryHistory: jest.fn().mockResolvedValue(mockHistory),
          },
        },
      ],
    }).compile();

    controller = module.get<SalariesController>(SalariesController);
    service = module.get<SalariesService>(SalariesService);
  });

  it('updateSalary calls service.updateSalary', async () => {
    const dto: UpdateSalaryDto = {
      baseSalary: 120000,
      bonus: 15000,
      effectiveDate: '2026-01-01',
      reason: 'Promotion',
    };

    const updateSalarySpy = jest.spyOn(service, 'updateSalary');
    const result = await controller.updateSalary('emp-1', dto);

    expect(updateSalarySpy).toHaveBeenCalledWith('emp-1', dto);
    expect(result).toEqual({
      employee: mockEmployee,
      currentSalary: mockSalary,
    });
  });

  it('getSalaryHistory calls service.getSalaryHistory', async () => {
    const getSalaryHistorySpy = jest.spyOn(service, 'getSalaryHistory');
    const result = await controller.getSalaryHistory('emp-1');

    expect(getSalaryHistorySpy).toHaveBeenCalledWith('emp-1');
    expect(result).toEqual(mockHistory);
  });
});
