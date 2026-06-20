import { ApiProperty } from '@nestjs/swagger';

export class GroupAnalyticsDto {
  @ApiProperty({
    example: 'Engineering',
    description: 'Name of the grouping segment (e.g. Country or Department name)',
  })
  name: string;

  @ApiProperty({ example: 450, description: 'Number of active employees in this group' })
  employeeCount: number;

  @ApiProperty({ example: 125000, description: 'Average base salary for this group' })
  averageSalary: number;

  @ApiProperty({ example: 120000, description: 'Median base salary for this group' })
  medianSalary: number;

  @ApiProperty({ example: 220000, description: 'Highest base salary in this group' })
  highestSalary: number;

  @ApiProperty({ example: 55000, description: 'Lowest base salary in this group' })
  lowestSalary: number;
}
