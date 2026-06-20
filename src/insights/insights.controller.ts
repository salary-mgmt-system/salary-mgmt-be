import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InsightsService } from './insights.service';
import { InsightsRequestDto } from './dto/insights-request.dto';
import { InsightsResponseDto } from './dto/insights-response.dto';

@ApiTags('insights')
@Controller('insights')
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Post('query')
  @ApiOperation({
    summary: 'Submit a predefined compensation question and receive a natural-language answer',
  })
  @ApiResponse({
    status: 201,
    description: 'Insight answer successfully generated.',
    type: InsightsResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid or unrecognised question string.' })
  async getInsights(@Body() dto: InsightsRequestDto): Promise<InsightsResponseDto> {
    return this.insightsService.query(dto.question);
  }
}
