import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Response, Request } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HttpExceptionFilter');

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorBody =
      typeof exceptionResponse === 'string'
        ? { statusCode: status, message: exceptionResponse, error: exceptionResponse }
        : (exceptionResponse as Record<string, any>);

    this.logger.warn(
      `${request.method} ${request.url} ${status} — ${errorBody.message ?? exception.message}`,
    );

    response.status(status).json({
      ...errorBody,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
