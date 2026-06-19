import { Employee } from '../entities/employee.entity';

export class PaginatedEmployeesResponseDto {
  data: Employee[];
  total: number;
  page: number;
}
