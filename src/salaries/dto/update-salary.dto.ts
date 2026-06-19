import { IsNumber, Min, IsISO8601, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSalaryDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  baseSalary: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bonus: number;

  @IsISO8601()
  effectiveDate: string;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
