import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { GetEmployeesFilterDto } from '../employees/dto/get-employees-filter.dto';
import { PaginatedEmployeesResponseDto } from '../employees/dto/paginated-employees-response.dto';
import { UpdateSalaryDto } from '../salaries/dto/update-salary.dto';
import { PaginationDto } from './dto/pagination.dto';

describe('DTO Validation and Transformation', () => {
  it('should transform page and pageSize to numbers in PaginationDto', async () => {
    const plain = { page: '3', pageSize: '12', search: 'john' };
    const instance = plainToInstance(PaginationDto, plain);

    expect(instance.page).toBe(3);
    expect(instance.pageSize).toBe(12);
    expect(instance.search).toBe('john');

    const errors = await validate(instance);
    expect(errors.length).toBe(0);
  });

  it('should transform page and pageSize to numbers in GetEmployeesFilterDto', async () => {
    const plain = {
      page: '2',
      pageSize: '15',
      search: 'Smith',
      sortBy: 'baseSalary',
      sortOrder: 'DESC',
    };
    const instance = plainToInstance(GetEmployeesFilterDto, plain);

    expect(instance.page).toBe(2);
    expect(instance.pageSize).toBe(15);
    expect(instance.sortBy).toBe('baseSalary');
    expect(instance.sortOrder).toBe('DESC');

    const errors = await validate(instance);
    expect(errors.length).toBe(0);
  });

  it('should transform baseSalary and bonus to numbers in UpdateSalaryDto', async () => {
    const plain = {
      baseSalary: '5000',
      bonus: '500',
      effectiveDate: '2026-06-19',
      reason: 'Annual increase',
    };
    const instance = plainToInstance(UpdateSalaryDto, plain);

    expect(instance.baseSalary).toBe(5000);
    expect(instance.bonus).toBe(500);
    expect(instance.effectiveDate).toBe('2026-06-19');
    expect(instance.reason).toBe('Annual increase');

    const errors = await validate(instance);
    expect(errors.length).toBe(0);
  });

  it('should instantiate PaginatedEmployeesResponseDto correctly', () => {
    const response = new PaginatedEmployeesResponseDto();
    response.data = [];
    response.total = 0;
    response.page = 1;

    expect(response.data).toEqual([]);
    expect(response.total).toBe(0);
    expect(response.page).toBe(1);
  });
});
