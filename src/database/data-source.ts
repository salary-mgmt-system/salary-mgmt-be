import { DataSource } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { Employee } from '../employees/entities/employee.entity';
import { Salary } from '../salaries/entities/salary.entity';
import { SalaryHistory } from '../salaries/entities/salary-history.entity';

// Load .env.test when NODE_ENV is test, otherwise .env
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: path.resolve(__dirname, '..', '..', envFile) });

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
