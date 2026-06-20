import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AnalyticsController (e2e)', () => {
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

  describe('GET /analytics/overview', () => {
    it('should return company compensation overview statistics', async () => {
      const res = await request(app.getHttpServer()).get('/analytics/overview').expect(200);

      const body = res.body as Record<string, unknown>;
      expect(body).toHaveProperty('employeeCount');
      expect(body).toHaveProperty('averageSalary');
      expect(body).toHaveProperty('medianSalary');
      expect(body).toHaveProperty('highestSalary');
      expect(body).toHaveProperty('lowestSalary');

      expect(typeof body.employeeCount).toBe('number');
      expect(typeof body.averageSalary).toBe('number');
      expect(typeof body.medianSalary).toBe('number');
      expect(typeof body.highestSalary).toBe('number');
      expect(typeof body.lowestSalary).toBe('number');

      expect(body.employeeCount).toBeGreaterThan(0);
      expect(body.averageSalary).toBeGreaterThan(0);
      expect(body.medianSalary).toBeGreaterThan(0);
      expect(body.highestSalary).toBeGreaterThan(0);
      expect(body.lowestSalary).toBeGreaterThan(0);
    });
  });

  describe('GET /analytics/country', () => {
    it('should return compensation statistics grouped by country', async () => {
      const res = await request(app.getHttpServer()).get('/analytics/country').expect(200);

      const body = res.body as Record<string, unknown>[];
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);

      const item = body[0];
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('employeeCount');
      expect(item).toHaveProperty('averageSalary');
      expect(item).toHaveProperty('medianSalary');
      expect(item).toHaveProperty('highestSalary');
      expect(item).toHaveProperty('lowestSalary');

      expect(typeof item.name).toBe('string');
      expect(typeof item.employeeCount).toBe('number');
      expect(typeof item.averageSalary).toBe('number');
      expect(typeof item.medianSalary).toBe('number');
      expect(typeof item.highestSalary).toBe('number');
      expect(typeof item.lowestSalary).toBe('number');
    });
  });

  describe('GET /analytics/department', () => {
    it('should return compensation statistics grouped by department', async () => {
      const res = await request(app.getHttpServer()).get('/analytics/department').expect(200);

      const body = res.body as Record<string, unknown>[];
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);

      const item = body[0];
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('employeeCount');
      expect(item).toHaveProperty('averageSalary');
      expect(item).toHaveProperty('medianSalary');
      expect(item).toHaveProperty('highestSalary');
      expect(item).toHaveProperty('lowestSalary');

      expect(typeof item.name).toBe('string');
      expect(typeof item.employeeCount).toBe('number');
      expect(typeof item.averageSalary).toBe('number');
      expect(typeof item.medianSalary).toBe('number');
      expect(typeof item.highestSalary).toBe('number');
      expect(typeof item.lowestSalary).toBe('number');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
