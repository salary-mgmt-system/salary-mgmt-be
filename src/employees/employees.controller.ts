import { Controller, Get, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { GetEmployeesFilterDto } from './dto/get-employees-filter.dto';
import { PaginatedEmployeesResponseDto } from './dto/paginated-employees-response.dto';
import { Employee } from './entities/employee.entity';
import { Salary } from '../salaries/entities/salary.entity';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  async findAll(@Query() filterDto: GetEmployeesFilterDto): Promise<PaginatedEmployeesResponseDto> {
    return this.employeesService.findAll(filterDto);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ employee: Employee; currentSalary: Salary | null }> {
    return this.employeesService.findOne(id);
  }
}
