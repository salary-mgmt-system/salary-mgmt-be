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
    const res = await request(app.getHttpServer()).get('/employees').expect(200);

    interface TestSalary {
      baseSalary: number;
    }
    interface TestEmployee {
      employeeCode: string;
      firstName: string;
      lastName: string;
      email: string;
      department: string;
      designation: string;
      country: string;
      currency: string;
      salaries: TestSalary[];
    }
    interface TestResponseBody {
      data: TestEmployee[];
      total: number;
      page: number;
    }

    const body = res.body as TestResponseBody;

    expect(body).toHaveProperty('data');
    expect(body).toHaveProperty('total');
    expect(body).toHaveProperty('page');
    expect(body.page).toBe(1);
    expect(body.data.length).toBeGreaterThan(0);

    const employee = body.data[0];
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
    return request(app.getHttpServer()).get('/employees/not-a-uuid').expect(400);
  });

  describe('/employees/:id/salary (PUT) & /employees/:id/salary-history (GET)', () => {
    async function getFirstEmployeeId(): Promise<{ id: string; baseSalary: number }> {
      const res = await request(app.getHttpServer()).get('/employees').expect(200);
      const body = res.body as { data: { id: string; salaries: { baseSalary: number }[] }[] };
      const employee = body.data[0];
      return {
        id: employee.id,
        baseSalary: Number(employee.salaries[0]?.baseSalary || 0),
      };
    }

    it('should successfully update salary and record audit history', async () => {
      const { id: employeeId, baseSalary: originalBaseSalary } = await getFirstEmployeeId();

      const updatePayload = {
        baseSalary: originalBaseSalary + 10000,
        bonus: 12000,
        effectiveDate: '2026-06-01',
        reason: 'Test Promotion',
      };

      const putRes = await request(app.getHttpServer())
        .put(`/employees/${employeeId}/salary`)
        .send(updatePayload)
        .expect(200);

      expect(putRes.body).toHaveProperty('employee');
      expect(putRes.body).toHaveProperty('currentSalary');
      expect(putRes.body.employee.id).toBe(employeeId);
      expect(Number(putRes.body.currentSalary.baseSalary)).toBe(updatePayload.baseSalary);
      expect(Number(putRes.body.currentSalary.bonus)).toBe(updatePayload.bonus);
      expect(putRes.body.currentSalary.effectiveDate).toBe(updatePayload.effectiveDate);
      expect(putRes.body.currentSalary.isCurrent).toBe(true);

      const getHistoryRes = await request(app.getHttpServer())
        .get(`/employees/${employeeId}/salary-history`)
        .expect(200);

      const history = getHistoryRes.body as {
        oldSalary: number;
        newSalary: number;
        reason: string;
      }[];
      expect(history.length).toBeGreaterThan(0);
      expect(history[0]).toHaveProperty('oldSalary');
      expect(history[0]).toHaveProperty('newSalary');
      expect(history[0]).toHaveProperty('reason');
      expect(Number(history[0].oldSalary)).toBe(originalBaseSalary);
      expect(Number(history[0].newSalary)).toBe(updatePayload.baseSalary);
      expect(history[0].reason).toBe(updatePayload.reason);
    });

    it('should return 400 Bad Request on invalid salary update payload', async () => {
      const { id: employeeId } = await getFirstEmployeeId();
      const invalidPayload = {
        baseSalary: -5000,
        bonus: 'invalid',
        effectiveDate: 'invalid-date',
      };

      await request(app.getHttpServer())
        .put(`/employees/${employeeId}/salary`)
        .send(invalidPayload)
        .expect(400);
    });

    it('should return 404 Not Found when employee does not exist', async () => {
      const randomUuid = '00000000-0000-0000-0000-000000000000';
      const updatePayload = {
        baseSalary: 150000,
        bonus: 10000,
        effectiveDate: '2026-06-01',
        reason: 'Missing Employee',
      };

      await request(app.getHttpServer())
        .put(`/employees/${randomUuid}/salary`)
        .send(updatePayload)
        .expect(404);

      await request(app.getHttpServer()).get(`/employees/${randomUuid}/salary-history`).expect(404);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
