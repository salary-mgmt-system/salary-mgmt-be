import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Salary } from '../../salaries/entities/salary.entity';
import { SalaryHistory } from '../../salaries/entities/salary-history.entity';

@Entity('employees')
@Index(['employeeCode'], { unique: true })
@Index(['email'], { unique: true })
@Index(['department'])
@Index(['country'])
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'employee_code' })
  employeeCode: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  email: string;

  @Column()
  department: string;

  @Column()
  designation: string;

  @Column()
  country: string;

  @Column()
  currency: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Salary, (salary) => salary.employee, { cascade: true })
  salaries: Salary[];

  @OneToMany(() => SalaryHistory, (history) => history.employee, { cascade: true })
  salaryHistories: SalaryHistory[];
}
