import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Salary } from './entities/salary.entity';
import { SalaryHistory } from './entities/salary-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Salary, SalaryHistory])],
  controllers: [],
  providers: [],
  exports: [],
})
export class SalariesModule {}
