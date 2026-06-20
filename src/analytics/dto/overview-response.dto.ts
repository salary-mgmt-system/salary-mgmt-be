import { ApiProperty } from '@nestjs/swagger';

export class OverviewResponseDto {
  @ApiProperty({ example: 10452, description: 'Total number of active employees' })
  employeeCount: number;

  @ApiProperty({ example: 85432.5, description: 'Average base salary' })
  averageSalary: number;

  @ApiProperty({ example: 81000, description: 'Median base salary' })
  medianSalary: number;

  @ApiProperty({ example: 250000, description: 'Highest base salary in the organization' })
  highestSalary: number;

  @ApiProperty({ example: 31500, description: 'Lowest base salary in the organization' })
  lowestSalary: number;
}
