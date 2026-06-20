import { Controller, Get, Put, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SalariesService } from './salaries.service';
import { UpdateSalaryDto } from './dto/update-salary.dto';
import { SalaryHistory } from './entities/salary-history.entity';
import { Salary } from './entities/salary.entity';
import { Employee } from '../employees/entities/employee.entity';

@ApiTags('salaries')
@Controller('employees/:id')
export class SalariesController {
  constructor(private readonly salariesService: SalariesService) {}

  @Put('salary')
  @ApiOperation({ summary: "Update an employee's salary and record change history" })
  @ApiResponse({ status: 200, description: 'Salary successfully updated.' })
  @ApiResponse({ status: 400, description: 'Invalid payload or invalid UUID.' })
  @ApiResponse({ status: 404, description: 'Employee not found.' })
  async updateSalary(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSalaryDto: UpdateSalaryDto,
  ): Promise<{ employee: Employee; currentSalary: Salary }> {
    return this.salariesService.updateSalary(id, updateSalaryDto);
  }

  @Get('salary-history')
  @ApiOperation({ summary: 'Retrieve salary changes history for an employee by UUID' })
  @ApiResponse({
    status: 200,
    description: 'Salary history successfully retrieved.',
    type: [SalaryHistory],
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID provided.' })
  @ApiResponse({ status: 404, description: 'Employee not found.' })
  async getSalaryHistory(@Param('id', ParseUUIDPipe) id: string): Promise<SalaryHistory[]> {
    return this.salariesService.getSalaryHistory(id);
  }
}
