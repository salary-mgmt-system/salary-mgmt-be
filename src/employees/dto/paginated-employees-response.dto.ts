import { ApiProperty } from '@nestjs/swagger';
import { Employee } from '../entities/employee.entity';

export class PaginatedEmployeesResponseDto {
  @ApiProperty({ type: [Employee] })
  data: Employee[];

  @ApiProperty({ example: 10452 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;
}
