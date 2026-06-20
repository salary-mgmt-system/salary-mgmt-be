import { ApiProperty } from '@nestjs/swagger';

export class InsightsResponseDto {
  @ApiProperty({
    example: 'The average salary in India is ₹1,200,000.',
    description: 'Natural-language answer to the insight question',
  })
  answer: string;
}
