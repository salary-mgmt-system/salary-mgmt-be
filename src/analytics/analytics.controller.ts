import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { OverviewResponseDto } from './dto/overview-response.dto';
import { GroupAnalyticsDto } from './dto/group-analytics.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  async getOverview(): Promise<OverviewResponseDto> {
    return this.analyticsService.getOverview();
  }

  @Get('country')
  async getCountryAnalytics(): Promise<GroupAnalyticsDto[]> {
    return this.analyticsService.getCountryAnalytics();
  }

  @Get('department')
  async getDepartmentAnalytics(): Promise<GroupAnalyticsDto[]> {
    return this.analyticsService.getDepartmentAnalytics();
  }
}
