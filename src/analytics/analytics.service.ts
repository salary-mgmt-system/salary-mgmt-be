import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../employees/entities/employee.entity';
import { Salary } from '../salaries/entities/salary.entity';
import { OverviewResponseDto } from './dto/overview-response.dto';
import { GroupAnalyticsDto } from './dto/group-analytics.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Salary)
    private readonly salaryRepository: Repository<Salary>,
  ) {}

  private calculateMedian(numbers: number[]): number {
    const count = numbers.length;

    const sorted = [...numbers].sort((a, b) => a - b);
    const middle = Math.floor(count / 2);

    if (count % 2 !== 0) {
      return sorted[middle];
    } else {
      return (sorted[middle - 1] + sorted[middle]) / 2;
    }
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }

  async getOverview(): Promise<OverviewResponseDto> {
    const salaries = await this.salaryRepository.find({
      where: { isCurrent: true },
      select: { baseSalary: true },
    });

    const employeeCount = salaries.length;
    if (employeeCount === 0) {
      return {
        employeeCount: 0,
        averageSalary: 0,
        medianSalary: 0,
        highestSalary: 0,
        lowestSalary: 0,
      };
    }

    const baseSalaries = salaries.map((s) => s.baseSalary);
    const sum = baseSalaries.reduce((acc, val) => acc + val, 0);

    return {
      employeeCount,
      averageSalary: this.round(sum / employeeCount),
      medianSalary: this.round(this.calculateMedian(baseSalaries)),
      highestSalary: this.round(Math.max(...baseSalaries)),
      lowestSalary: this.round(Math.min(...baseSalaries)),
    };
  }

  async getCountryAnalytics(): Promise<GroupAnalyticsDto[]> {
    const employees = await this.employeeRepository
      .createQueryBuilder('employee')
      .innerJoinAndSelect('employee.salaries', 'salary', 'salary.isCurrent = :isCurrent', {
        isCurrent: true,
      })
      .select(['employee.id', 'employee.country', 'salary.id', 'salary.baseSalary'])
      .getMany();

    const groups: { [key: string]: number[] } = {};
    for (const emp of employees) {
      const country = emp.country;
      const salary = emp.salaries?.[0]?.baseSalary;
      if (salary === undefined) continue;

      if (!groups[country]) {
        groups[country] = [];
      }
      groups[country].push(salary);
    }

    return Object.entries(groups).map(([name, salaries]) => {
      const employeeCount = salaries.length;
      const sum = salaries.reduce((acc, val) => acc + val, 0);
      return {
        name,
        employeeCount,
        averageSalary: this.round(sum / employeeCount),
        medianSalary: this.round(this.calculateMedian(salaries)),
        highestSalary: this.round(Math.max(...salaries)),
        lowestSalary: this.round(Math.min(...salaries)),
      };
    });
  }

  async getDepartmentAnalytics(): Promise<GroupAnalyticsDto[]> {
    const employees = await this.employeeRepository
      .createQueryBuilder('employee')
      .innerJoinAndSelect('employee.salaries', 'salary', 'salary.isCurrent = :isCurrent', {
        isCurrent: true,
      })
      .select(['employee.id', 'employee.department', 'salary.id', 'salary.baseSalary'])
      .getMany();

    const groups: { [key: string]: number[] } = {};
    for (const emp of employees) {
      const dept = emp.department;
      const salary = emp.salaries?.[0]?.baseSalary;
      if (salary === undefined) continue;

      if (!groups[dept]) {
        groups[dept] = [];
      }
      groups[dept].push(salary);
    }

    return Object.entries(groups).map(([name, salaries]) => {
      const employeeCount = salaries.length;
      const sum = salaries.reduce((acc, val) => acc + val, 0);
      return {
        name,
        employeeCount,
        averageSalary: this.round(sum / employeeCount),
        medianSalary: this.round(this.calculateMedian(salaries)),
        highestSalary: this.round(Math.max(...salaries)),
        lowestSalary: this.round(Math.min(...salaries)),
      };
    });
  }
}
