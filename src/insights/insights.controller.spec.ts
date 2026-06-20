import { Test, TestingModule } from '@nestjs/testing';
import { InsightsController } from './insights.controller';
import { InsightsService } from './insights.service';
import { InsightsRequestDto } from './dto/insights-request.dto';
import { InsightsResponseDto } from './dto/insights-response.dto';

describe('InsightsController', () => {
  let controller: InsightsController;
  let service: InsightsService;

  const mockResponse: InsightsResponseDto = {
    answer: 'The average salary in India is $45,000.',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InsightsController],
      providers: [
        {
          provide: InsightsService,
          useValue: {
            query: jest.fn().mockResolvedValue(mockResponse),
          },
        },
      ],
    }).compile();

    controller = module.get<InsightsController>(InsightsController);
    service = module.get<InsightsService>(InsightsService);
  });

  it('getInsights calls service.query', async () => {
    const dto: InsightsRequestDto = {
      question: 'What is the average salary in India?',
    };

    const spy = jest.spyOn(service, 'query');
    const result = await controller.getInsights(dto);

    expect(spy).toHaveBeenCalledWith(dto.question);
    expect(result).toEqual(mockResponse);
  });
});
