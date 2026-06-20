import { Controller, Post, Body } from '@nestjs/common';
import { InsightsService } from './insights.service';
import { InsightsRequestDto } from './dto/insights-request.dto';
import { InsightsResponseDto } from './dto/insights-response.dto';

@Controller('insights')
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Post('query')
  async getInsights(@Body() dto: InsightsRequestDto): Promise<InsightsResponseDto> {
    return this.insightsService.query(dto.question);
  }
}
