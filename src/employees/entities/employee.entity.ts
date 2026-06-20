import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Salary } from '../../salaries/entities/salary.entity';
import { SalaryHistory } from '../../salaries/entities/salary-history.entity';

@Entity('employees')
@Index(['employeeCode'], { unique: true })
@Index(['email'], { unique: true })
@Index(['department'])
@Index(['country'])
export class Employee {
  @ApiProperty({ example: '85834923-389d-483a-8452-9e5832a8523a' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'EMP-10001' })
  @Column({ name: 'employee_code' })
  employeeCode: string;

  @ApiProperty({ example: 'John' })
  @Column({ name: 'first_name' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @Column({ name: 'last_name' })
  lastName: string;

  @ApiProperty({ example: 'john.doe@company.com' })
  @Column()
  email: string;

  @ApiProperty({ example: 'Engineering' })
  @Column()
  department: string;

  @ApiProperty({ example: 'Senior Software Engineer' })
  @Column()
  designation: string;

  @ApiProperty({ example: 'United States' })
  @Column()
  country: string;

  @ApiProperty({ example: 'USD' })
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
