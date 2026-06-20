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

@Entity('salaries')
@Check('chk_salaries_base_salary_min', '"base_salary" >= 0')
@Check('chk_salaries_bonus_min', '"bonus" >= 0')
@Index(['employeeId', 'isCurrent']) // Fast lookup for an employee's current salary
@Index('UQ_employee_current_salary', ['employeeId'], { unique: true, where: 'is_current = true' })
export class Salary {
  @ApiProperty({ example: '325e83b4-f3a2-4a0b-8521-8254b2a859e2' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: '85834923-389d-483a-8452-9e5832a8523a' })
  @Column({ name: 'employee_id', type: 'uuid', nullable: false })
  employeeId: string;

  @Column({
    name: 'base_salary',
    type: 'decimal',
    precision: 15,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  @ApiProperty({ example: 85000 })
  baseSalary: number;

  @Column({
    name: 'bonus',
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0.0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  @ApiProperty({ example: 10000 })
  bonus: number;

  @ApiProperty({ example: '2026-06-01' })
  @Column({ name: 'effective_date', type: 'date' })
  effectiveDate: string; // Stored as 'YYYY-MM-DD' string or Date, string is safer for timezone independence

  @ApiProperty({ example: true })
  @Column({ name: 'is_current', type: 'boolean', default: true })
  isCurrent: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => Employee, (employee) => employee.salaries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}
