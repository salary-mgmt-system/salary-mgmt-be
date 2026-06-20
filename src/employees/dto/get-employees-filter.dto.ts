import { IsOptional, IsString, IsInt, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetEmployeesFilterDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number for pagination' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Number of items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 10;

  @ApiPropertyOptional({ example: 'John', description: 'Search term for name, code or email' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'Engineering', description: 'Filter by department name' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ example: 'United States', description: 'Filter by country' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    example: 'employeeCode',
    description: 'Field to sort the results by',
    enum: [
      'employeeCode',
      'firstName',
      'lastName',
      'email',
      'department',
      'designation',
      'country',
      'baseSalary',
      'bonus',
    ],
  })
  @IsOptional()
  @IsString()
  @IsIn([
    'employeeCode',
    'firstName',
    'lastName',
    'email',
    'department',
    'designation',
    'country',
    'baseSalary',
    'bonus',
  ])
  sortBy?: string = 'employeeCode';

  @ApiPropertyOptional({
    example: 'ASC',
    description: 'Sort direction order',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}
