import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { GetEmployeesFilterDto } from './dto/get-employees-filter.dto';
import { PaginatedEmployeesResponseDto } from './dto/paginated-employees-response.dto';
import { Salary } from '../salaries/entities/salary.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async findAll(filterDto: GetEmployeesFilterDto): Promise<PaginatedEmployeesResponseDto> {
    const { page, pageSize, search, department, country, sortBy, sortOrder } = filterDto;

    const query = this.employeeRepository.createQueryBuilder('employee');

    // Left join and select only the current salary
    query.leftJoinAndSelect('employee.salaries', 'salary', 'salary.is_current = :isCurrent', {
      isCurrent: true,
    });

    // Apply department filter
    if (department) {
      query.andWhere('employee.department = :department', { department });
    }

    // Apply country filter
    if (country) {
      query.andWhere('employee.country = :country', { country });
    }

    // Apply search (firstName, lastName, email, employeeCode)
    if (search) {
      query.andWhere(
        '(employee.first_name ILIKE :search OR employee.last_name ILIKE :search OR employee.email ILIKE :search OR employee.employee_code ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply sorting
    if (sortBy) {
      if (sortBy === 'baseSalary' || sortBy === 'bonus') {
        const orderColumn = sortBy === 'baseSalary' ? 'salary.base_salary' : 'salary.bonus';
        query.orderBy(orderColumn, sortOrder);
      } else {
        const sortMapping: Record<string, string> = {
          employeeCode: 'employee.employee_code',
          firstName: 'employee.first_name',
          lastName: 'employee.last_name',
          email: 'employee.email',
          department: 'employee.department',
          designation: 'employee.designation',
          country: 'employee.country',
        };
        const orderColumn = sortMapping[sortBy] || 'employee.employee_code';
        query.orderBy(orderColumn, sortOrder);
      }
    } else {
      query.orderBy('employee.employee_code', 'ASC');
    }

    // Apply pagination
    const pageNum = Math.max(1, Number(page) || 1);
    const pageSizeNum = Math.max(1, Number(pageSize) || 10);
    query.skip((pageNum - 1) * pageSizeNum).take(pageSizeNum);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page: pageNum,
    };
  }

  async findOne(id: string): Promise<{ employee: Employee; currentSalary: Salary | null }> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: { salaries: true },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    const currentSalary = employee.salaries?.find((s) => s.isCurrent) || null;

    // Remove the full salaries array from the response object to prevent returning full history here
    delete (employee as any).salaries;

    return {
      employee,
      currentSalary,
    };
  }
}
