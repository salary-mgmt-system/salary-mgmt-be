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
import { Employee } from '../../employees/entities/employee.entity';

@Entity('salary_history')
@Check('chk_salary_history_old_salary_min', '"old_salary" >= 0')
@Check('chk_salary_history_new_salary_min', '"new_salary" >= 0')
@Index(['employeeId', 'changedAt']) // Index for listing an employee's history sorted by change date
export class SalaryHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
  newSalary: number;

  @Column()
  reason: string;

  @CreateDateColumn({ type: 'timestamp', name: 'changed_at' })
  changedAt: Date;

  @ManyToOne(() => Employee, (employee) => employee.salaryHistories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}
