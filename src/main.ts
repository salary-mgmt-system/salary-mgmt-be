import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

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

  // Global API prefix
  app.setGlobalPrefix('api');

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

  await app.listen(port);
  console.log(`Application running on port ${port}`);
}
void bootstrap();
