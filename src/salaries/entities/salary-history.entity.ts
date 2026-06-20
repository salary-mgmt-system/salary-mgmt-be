import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Check,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Employee } from '../../employees/entities/employee.entity';

@Entity('salary_history')
@Check('chk_salary_history_old_salary_min', '"old_salary" >= 0')
@Check('chk_salary_history_new_salary_min', '"new_salary" >= 0')
@Index(['employeeId', 'changedAt']) // Index for listing an employee's history sorted by change date
export class SalaryHistory {
  @ApiProperty({ example: '7d9e83b4-f3a2-4a0b-8521-8254b2a859e2' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: '85834923-389d-483a-8452-9e5832a8523a' })
  @Column({ name: 'employee_id', type: 'uuid', nullable: false })
  employeeId: string;

  @Column({
    name: 'old_salary',
    type: 'decimal',
    precision: 15,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  @ApiProperty({ example: 75000 })
  oldSalary: number;

  @Column({
    name: 'new_salary',
    type: 'decimal',
    precision: 15,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  @ApiProperty({ example: 85000 })
  newSalary: number;

  @ApiProperty({ example: 'Annual Performance Review' })
  @Column()
  reason: string;

  @ApiProperty({ example: '2026-06-20T12:00:00.000Z' })
  @CreateDateColumn({ type: 'timestamp', name: 'changed_at' })
  changedAt: Date;

  @ManyToOne(() => Employee, (employee) => employee.salaryHistories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}
