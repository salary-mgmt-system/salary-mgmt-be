import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('InsightsController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  describe('POST /insights/query', () => {
    it('should return answers for valid questions', async () => {
      const payload = {
        question: 'What is the average salary in India?',
      };

      const res = await request(app.getHttpServer())
        .post('/insights/query')
        .send(payload)
        .expect(201);

      const body = res.body as Record<string, unknown>;
      expect(body).toHaveProperty('answer');
      expect(typeof body.answer).toBe('string');
      expect(body.answer).toContain('salary');
    });

    it('should return fallback suggestions for unsupported questions', async () => {
      const payload = {
        question: 'Who is the CEO of ACME?',
      };

      const res = await request(app.getHttpServer())
        .post('/insights/query')
        .send(payload)
        .expect(201);

      const body = res.body as Record<string, unknown>;
      expect(body).toHaveProperty('answer');
      expect(body.answer).toContain("I'm sorry, I couldn't understand your question.");
    });

    it('should return 400 Bad Request if question is missing', async () => {
      const invalidPayload = {};

      await request(app.getHttpServer()).post('/insights/query').send(invalidPayload).expect(400);
    });

    it('should return 400 Bad Request if question is empty string', async () => {
      const invalidPayload = {
        question: '',
      };

      await request(app.getHttpServer()).post('/insights/query').send(invalidPayload).expect(400);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
