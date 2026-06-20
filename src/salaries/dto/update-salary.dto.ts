import { IsNumber, Min, IsISO8601, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSalaryDto {
  @ApiProperty({ example: 85000, description: 'The new base salary for the employee' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  baseSalary: number;

  @ApiProperty({ example: 10000, description: 'The new annual bonus for the employee' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bonus: number;

  @ApiProperty({
    example: '2026-06-01',
    description: 'The effective date for the new salary (YYYY-MM-DD)',
  })
  @IsISO8601()
  effectiveDate: string;

  @ApiProperty({
    example: 'Annual Promotion',
    description: 'The reason for this compensation update',
  })
  @IsString()
  @IsNotEmpty()
  reason: string;
}
