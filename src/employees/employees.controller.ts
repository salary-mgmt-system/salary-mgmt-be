import { Controller, Get, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { GetEmployeesFilterDto } from './dto/get-employees-filter.dto';
import { PaginatedEmployeesResponseDto } from './dto/paginated-employees-response.dto';
import { Employee } from './entities/employee.entity';
import { Salary } from '../salaries/entities/salary.entity';

@ApiTags('employees')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve paginated employees list with filtering and sorting' })
  @ApiResponse({
    status: 200,
    description: 'Paginated employee list successfully retrieved.',
    type: PaginatedEmployeesResponseDto,
  })
  async findAll(@Query() filterDto: GetEmployeesFilterDto): Promise<PaginatedEmployeesResponseDto> {
    return this.employeesService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve details and current salary of a single employee by UUID' })
  @ApiResponse({ status: 200, description: 'Employee details successfully retrieved.' })
  @ApiResponse({ status: 400, description: 'Invalid UUID provided.' })
  @ApiResponse({ status: 404, description: 'Employee not found.' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ employee: Employee; currentSalary: Salary | null }> {
    return this.employeesService.findOne(id);
  }
}
