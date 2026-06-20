import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe — strips unknown properties, transforms payloads to DTO types
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global logging interceptor — logs method, url, status, and response time
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Global HTTP exception filter — consistent error responses with timestamp
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global API prefix
  app.setGlobalPrefix('api');

  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('Salary Management API')
    .setDescription('The API documentation for the Salary Management System')
    .setVersion('1.0')
    .addTag('employees', 'Employee management endpoints')
    .addTag('salaries', 'Compensation management and update endpoints')
    .addTag('analytics', 'Compensation metrics and grouping statistics')
    .addTag('insights', 'Predefined question insights assistant')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port', 3000);
  const nodeEnv = configService.get<string>('app.nodeEnv');
  const frontendUrl = configService.get<string>('app.frontendUrl');

  // Enable CORS for frontend
  if (nodeEnv === 'production' && frontendUrl) {
    app.enableCors({
      origin: frontendUrl,
      credentials: true,
    });
  } else {
    app.enableCors();
  }

  const logger = new Logger('Bootstrap');
  await app.listen(port);
  logger.log(`Application running on port ${port}`);
}
void bootstrap();
