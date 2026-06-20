import { IsNotEmpty, IsString } from 'class-validator';

export class InsightsRequestDto {
  @IsNotEmpty()
  @IsString()
  question: string;
}
