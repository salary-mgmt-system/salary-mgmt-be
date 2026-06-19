import { Controller, Get, Put, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { SalariesService } from './salaries.service';
import { UpdateSalaryDto } from './dto/update-salary.dto';
import { SalaryHistory } from './entities/salary-history.entity';
import { Salary } from './entities/salary.entity';
import { Employee } from '../employees/entities/employee.entity';

@Controller('employees/:id')
export class SalariesController {
  constructor(private readonly salariesService: SalariesService) {}

  @Put('salary')
  async updateSalary(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSalaryDto: UpdateSalaryDto,
  ): Promise<{ employee: Employee; currentSalary: Salary }> {
    return this.salariesService.updateSalary(id, updateSalaryDto);
  }

  @Get('salary-history')
  async getSalaryHistory(@Param('id', ParseUUIDPipe) id: string): Promise<SalaryHistory[]> {
    return this.salariesService.getSalaryHistory(id);
  }
}
