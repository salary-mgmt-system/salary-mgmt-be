import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Employee } from '../employees/entities/employee.entity';
import { Salary } from './entities/salary.entity';
import { SalaryHistory } from './entities/salary-history.entity';
import { UpdateSalaryDto } from './dto/update-salary.dto';

@Injectable()
export class SalariesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Salary)
    private readonly salaryRepository: Repository<Salary>,
    @InjectRepository(SalaryHistory)
    private readonly salaryHistoryRepository: Repository<SalaryHistory>,
    private readonly dataSource: DataSource,
  ) {}

  async updateSalary(
    employeeId: string,
    dto: UpdateSalaryDto,
  ): Promise<{ employee: Employee; currentSalary: Salary }> {
    return this.dataSource.transaction(async (manager) => {
      const employee = await manager.findOne(Employee, {
        where: { id: employeeId },
      });

      if (!employee) {
        throw new NotFoundException(`Employee with ID ${employeeId} not found`);
      }

      const currentSalary = await manager.findOne(Salary, {
        where: { employeeId, isCurrent: true },
      });

      let oldSalary = 0;
      if (currentSalary) {
        oldSalary = currentSalary.baseSalary;
        currentSalary.isCurrent = false;
        await manager.save(Salary, currentSalary);
      }

      const newSalary = manager.create(Salary, {
        employeeId,
        baseSalary: dto.baseSalary,
        bonus: dto.bonus,
        effectiveDate: dto.effectiveDate,
        isCurrent: true,
      });
      const savedSalary = await manager.save(Salary, newSalary);

      const salaryHistory = manager.create(SalaryHistory, {
        employeeId,
        oldSalary,
        newSalary: dto.baseSalary,
        reason: dto.reason,
        changedAt: new Date(),
      });
      await manager.save(SalaryHistory, salaryHistory);

      return {
        employee,
        currentSalary: savedSalary,
      };
    });
  }

  async getSalaryHistory(employeeId: string): Promise<SalaryHistory[]> {
    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId },
      select: { id: true },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }

    return this.salaryHistoryRepository.find({
      where: { employeeId },
      order: { changedAt: 'DESC' },
    });
  }
}
