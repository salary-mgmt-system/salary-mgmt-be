import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Employee } from '../employees/entities/employee.entity';
import { Salary } from '../salaries/entities/salary.entity';
import { InsightsResponseDto } from './dto/insights-response.dto';

@Injectable()
export class InsightsService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Salary)
    private readonly salaryRepository: Repository<Salary>,
  ) {}

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  async query(question: string): Promise<InsightsResponseDto> {
    const trimmedQuestion = question.trim();

    // 1. Average salary in a country
    const countryMatch = trimmedQuestion.match(/average salary in ([a-zA-Z\s]+)/i);
    if (countryMatch) {
      const country = countryMatch[1].trim();
      const result = await this.employeeRepository
        .createQueryBuilder('employee')
        .innerJoin('employee.salaries', 'salary', 'salary.isCurrent = :isCurrent', {
          isCurrent: true,
        })
        .select('AVG(salary.baseSalary)', 'avg')
        .where('LOWER(employee.country) = LOWER(:country)', { country })
        .getRawOne<{ avg: string | null }>();

      if (!result || result.avg === null) {
        return {
          answer: `No employee records found for country: ${country}.`,
        };
      }

      const avgSalary = parseFloat(result.avg);
      return {
        answer: `The average salary in ${country} is ${this.formatCurrency(avgSalary)}.`,
      };
    }

    // 2. Highest average salary department
    if (/department.*highest average salary|highest average salary/i.test(trimmedQuestion)) {
      const result = await this.employeeRepository
        .createQueryBuilder('employee')
        .innerJoin('employee.salaries', 'salary', 'salary.isCurrent = :isCurrent', {
          isCurrent: true,
        })
        .select(['employee.department AS department', 'AVG(salary.baseSalary) AS average'])
        .groupBy('employee.department')
        .orderBy('average', 'DESC')
        .limit(1)
        .getRawOne<{ department: string; average: string | null }>();

      if (!result || result.average === null) {
        return {
          answer: 'No department data found.',
        };
      }

      const avgSalary = parseFloat(result.average);
      return {
        answer: `The ${result.department} department has the highest average salary at ${this.formatCurrency(avgSalary)}.`,
      };
    }

    // 3. Employee count above salary threshold
    const thresholdMatch = trimmedQuestion.match(/earn (?:more than|over) \$?([0-9,]+)/i);
    if (thresholdMatch) {
      const thresholdVal = parseInt(thresholdMatch[1].replace(/,/g, ''), 10);
      const count = await this.salaryRepository.count({
        where: {
          isCurrent: true,
          baseSalary: MoreThan(thresholdVal),
        },
      });

      return {
        answer: `There are ${count} employees who earn more than ${this.formatCurrency(thresholdVal)}.`,
      };
    }

    // 4. Top 10 highest-paid employees
    if (/top 10 highest-paid|highest-paid employees/i.test(trimmedQuestion)) {
      const topEmployees = await this.employeeRepository
        .createQueryBuilder('employee')
        .innerJoinAndSelect('employee.salaries', 'salary', 'salary.isCurrent = :isCurrent', {
          isCurrent: true,
        })
        .orderBy('salary.baseSalary', 'DESC')
        .limit(10)
        .getMany();

      if (topEmployees.length === 0) {
        return {
          answer: 'No employee records found.',
        };
      }

      let answer = 'Here are the top 10 highest-paid employees:\n';
      topEmployees.forEach((emp, index) => {
        const salary = emp.salaries[0];
        const formattedSalary = this.formatCurrency(salary.baseSalary);
        answer += `${index + 1}. ${emp.firstName} ${emp.lastName} (${emp.employeeCode}) - ${formattedSalary} (${emp.department})\n`;
      });

      return {
        answer: answer.trim(),
      };
    }

    // Fallback response
    return {
      answer: `I'm sorry, I couldn't understand your question. Try asking one of the following:
- What is the average salary in India?
- Which department has the highest average salary?
- How many employees earn more than $100,000?
- Who are the top 10 highest-paid employees?`,
    };
  }
}
