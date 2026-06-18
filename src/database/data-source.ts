import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Employee } from '../employees/entities/employee.entity';
import { Salary } from '../salaries/entities/salary.entity';
import { SalaryHistory } from '../salaries/entities/salary-history.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [Employee, Salary, SalaryHistory],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
