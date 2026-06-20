import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { OverviewResponseDto } from './dto/overview-response.dto';
import { GroupAnalyticsDto } from './dto/group-analytics.dto';
import { DistributionResponseDto } from './dto/distribution-response.dto';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Retrieve high-level compensation overview statistics' })
  @ApiResponse({
    status: 200,
    description: 'Overview metrics successfully retrieved.',
    type: OverviewResponseDto,
  })
  async getOverview(): Promise<OverviewResponseDto> {
    return this.analyticsService.getOverview();
  }

  @Get('country')
  @ApiOperation({ summary: 'Retrieve compensation metrics grouped by country' })
  @ApiResponse({
    status: 200,
    description: 'Country grouping stats successfully retrieved.',
    type: [GroupAnalyticsDto],
  })
  async getCountryAnalytics(): Promise<GroupAnalyticsDto[]> {
    return this.analyticsService.getCountryAnalytics();
  }

  @Get('department')
  @ApiOperation({ summary: 'Retrieve compensation metrics grouped by department' })
  @ApiResponse({
    status: 200,
    description: 'Department grouping stats successfully retrieved.',
    type: [GroupAnalyticsDto],
  })
  async getDepartmentAnalytics(): Promise<GroupAnalyticsDto[]> {
    return this.analyticsService.getDepartmentAnalytics();
  }

  @Get('distribution')
  @ApiOperation({ summary: 'Retrieve employee counts binned into USD-normalized salary brackets' })
  @ApiResponse({
    status: 200,
    description: 'Salary bracket distribution successfully retrieved.',
    type: [DistributionResponseDto],
  })
  async getSalaryDistribution(): Promise<DistributionResponseDto[]> {
    return this.analyticsService.getSalaryDistribution();
  }
}
