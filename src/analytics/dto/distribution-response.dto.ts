import { ApiProperty } from '@nestjs/swagger';

export class DistributionResponseDto {
  @ApiProperty({ example: '$80k - $120k', description: 'Salary bracket range descriptor' })
  bracket: string;

  @ApiProperty({ example: 4520, description: 'Number of employees falling in this salary bracket' })
  count: number;
}
