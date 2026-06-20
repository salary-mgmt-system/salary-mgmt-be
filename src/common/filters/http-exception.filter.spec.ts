import { HttpExceptionFilter } from './http-exception.filter';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let warnSpy: jest.SpyInstance;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockResponse: { status: jest.Mock };
  let mockRequest: { method: string; url: string };

  const createMockHost = (): ArgumentsHost =>
    ({
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    }) as unknown as ArgumentsHost;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
    warnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockResponse = { status: mockStatus };
    mockRequest = { method: 'GET', url: '/api/employees/bad-id' };
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should handle HttpException with object response', () => {
    const exception = new HttpException(
      { statusCode: 400, message: 'Bad Request', error: 'Bad Request' },
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(exception, createMockHost());

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: 'Bad Request',
        error: 'Bad Request',
        path: '/api/employees/bad-id',
        timestamp: expect.any(String) as string,
      }),
    );
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  it('should handle HttpException with string response', () => {
    const exception = new HttpException('Not Found', HttpStatus.NOT_FOUND);

    filter.catch(exception, createMockHost());

    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        message: 'Not Found',
        error: 'Not Found',
        path: '/api/employees/bad-id',
        timestamp: expect.any(String) as string,
      }),
    );
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  it('should log the warning with method, url, status, and message', () => {
    const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    filter.catch(exception, createMockHost());

    const logMessage = warnSpy.mock.calls[0][0] as string;
    expect(logMessage).toContain('GET');
    expect(logMessage).toContain('/api/employees/bad-id');
    expect(logMessage).toContain('403');
    expect(logMessage).toContain('Forbidden');
  });

  it('should include ISO timestamp in the response body', () => {
    const exception = new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);

    filter.catch(exception, createMockHost());

    const responseBody = mockJson.mock.calls[0][0] as Record<string, unknown>;
    expect(responseBody.timestamp).toBeDefined();
    expect(() => new Date(responseBody.timestamp as string).toISOString()).not.toThrow();
  });
});
