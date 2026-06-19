import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
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

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
  });

  it('/employees (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/employees')
      .expect(200);

    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('page');
    expect(res.body.page).toBe(1);
    expect(res.body.data.length).toBeGreaterThan(0);

    const employee = res.body.data[0];
    expect(employee).toHaveProperty('employeeCode');
    expect(employee).toHaveProperty('firstName');
    expect(employee).toHaveProperty('lastName');
    expect(employee).toHaveProperty('email');
    expect(employee).toHaveProperty('department');
    expect(employee).toHaveProperty('designation');
    expect(employee).toHaveProperty('country');
    expect(employee).toHaveProperty('currency');
    expect(employee).toHaveProperty('salaries');
    expect(employee.salaries[0]).toHaveProperty('baseSalary');
  });

  it('/employees/:id (GET) with invalid uuid', () => {
    return request(app.getHttpServer())
      .get('/employees/not-a-uuid')
      .expect(400);
  });

  afterEach(async () => {
    await app.close();
  });
});
