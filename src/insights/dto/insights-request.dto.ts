import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InsightsRequestDto {
  @ApiProperty({
    example: 'What is the average salary in India?',
    description: 'Predefined compensation question string',
  })
  @IsNotEmpty()
  @IsString()
  question: string;
}
