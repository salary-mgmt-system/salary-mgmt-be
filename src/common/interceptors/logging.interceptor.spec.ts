import { LoggingInterceptor } from './logging.interceptor';
import { ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { of } from 'rxjs';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  let logSpy: jest.SpyInstance;

  const mockRequest = { method: 'GET', url: '/api/employees' };
  const mockResponse = { statusCode: 200 };

  const createMockContext = (): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: () => mockResponse,
      }),
    }) as unknown as ExecutionContext;

  const createMockCallHandler = (result: any = {}): CallHandler => ({
    handle: () => of(result),
  });

  beforeEach(() => {
    interceptor = new LoggingInterceptor();
    logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should call next.handle() and return its value', (done) => {
    const payload = { id: '1' };
    const context = createMockContext();
    const handler = createMockCallHandler(payload);

    interceptor.intercept(context, handler).subscribe((result) => {
      expect(result).toEqual(payload);
      done();
    });
  });

  it('should log method, url, status code, and elapsed time', (done) => {
    const context = createMockContext();
    const handler = createMockCallHandler();

    interceptor.intercept(context, handler).subscribe(() => {
      expect(logSpy).toHaveBeenCalledTimes(1);
      const logMessage = logSpy.mock.calls[0][0] as string;
      expect(logMessage).toContain('GET');
      expect(logMessage).toContain('/api/employees');
      expect(logMessage).toContain('200');
      expect(logMessage).toMatch(/\d+ms/);
      done();
    });
  });
});
