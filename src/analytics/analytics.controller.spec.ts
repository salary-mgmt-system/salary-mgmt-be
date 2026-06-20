import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { OverviewResponseDto } from './dto/overview-response.dto';
import { GroupAnalyticsDto } from './dto/group-analytics.dto';
import { DistributionResponseDto } from './dto/distribution-response.dto';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;
  let service: AnalyticsService;

  const mockOverview: OverviewResponseDto = {
    employeeCount: 10,
    averageSalary: 50000,
    medianSalary: 50000,
    highestSalary: 80000,
    lowestSalary: 30000,
  };

  const mockCountryAnalytics: GroupAnalyticsDto[] = [
    {
      name: 'USA',
      employeeCount: 5,
      averageSalary: 60000,
      medianSalary: 60000,
      highestSalary: 80000,
      lowestSalary: 40000,
    },
  ];

  const mockDeptAnalytics: GroupAnalyticsDto[] = [
    {
      name: 'Engineering',
      employeeCount: 5,
      averageSalary: 70000,
      medianSalary: 70000,
      highestSalary: 90000,
      lowestSalary: 50000,
    },
  ];

  const mockDistribution: DistributionResponseDto[] = [
    {
      bracket: '< $80k',
      count: 10,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        {
          provide: AnalyticsService,
          useValue: {
            getOverview: jest.fn().mockResolvedValue(mockOverview),
            getCountryAnalytics: jest.fn().mockResolvedValue(mockCountryAnalytics),
            getDepartmentAnalytics: jest.fn().mockResolvedValue(mockDeptAnalytics),
            getSalaryDistribution: jest.fn().mockResolvedValue(mockDistribution),
          },
        },
      ],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
    service = module.get<AnalyticsService>(AnalyticsService);
  });

  it('getOverview calls service.getOverview', async () => {
    const spy = jest.spyOn(service, 'getOverview');
    const result = await controller.getOverview();

    expect(spy).toHaveBeenCalled();
    expect(result).toEqual(mockOverview);
  });

  it('getCountryAnalytics calls service.getCountryAnalytics', async () => {
    const spy = jest.spyOn(service, 'getCountryAnalytics');
    const result = await controller.getCountryAnalytics();

    expect(spy).toHaveBeenCalled();
    expect(result).toEqual(mockCountryAnalytics);
  });

  it('getDepartmentAnalytics calls service.getDepartmentAnalytics', async () => {
    const spy = jest.spyOn(service, 'getDepartmentAnalytics');
    const result = await controller.getDepartmentAnalytics();

    expect(spy).toHaveBeenCalled();
    expect(result).toEqual(mockDeptAnalytics);
  });

  it('getSalaryDistribution calls service.getSalaryDistribution', async () => {
    const spy = jest.spyOn(service, 'getSalaryDistribution');
    const result = await controller.getSalaryDistribution();

    expect(spy).toHaveBeenCalled();
    expect(result).toEqual(mockDistribution);
  });
});
