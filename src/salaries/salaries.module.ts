import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Salary } from './entities/salary.entity';
import { SalaryHistory } from './entities/salary-history.entity';
import { Employee } from '../employees/entities/employee.entity';
import { SalariesController } from './salaries.controller';
import { SalariesService } from './salaries.service';

@Module({
  imports: [TypeOrmModule.forFeature([Salary, SalaryHistory, Employee])],
  controllers: [SalariesController],
  providers: [SalariesService],
  exports: [SalariesService],
})
export class SalariesModule {}
