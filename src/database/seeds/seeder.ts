import { randomUUID } from 'crypto';
import { AppDataSource } from '../data-source';
import { Employee } from '../../employees/entities/employee.entity';
import { Salary } from '../../salaries/entities/salary.entity';
import { SalaryHistory } from '../../salaries/entities/salary-history.entity';

const FIRST_NAMES = [
  'James',
  'John',
  'Robert',
  'Michael',
  'William',
  'David',
  'Richard',
  'Joseph',
  'Thomas',
  'Charles',
  'Christopher',
  'Daniel',
  'Matthew',
  'Anthony',
  'Mark',
  'Donald',
  'Steven',
  'Paul',
  'Andrew',
  'Joshua',
  'Kenneth',
  'Kevin',
  'Brian',
  'George',
  'Timothy',
  'Mary',
  'Patricia',
  'Jennifer',
  'Linda',
  'Elizabeth',
  'Barbara',
  'Susan',
  'Jessica',
  'Sarah',
  'Karen',
  'Lisa',
  'Nancy',
  'Betty',
  'Sandra',
  'Margaret',
  'Ashley',
  'Kimberly',
  'Emily',
  'Donna',
  'Michelle',
  'Carol',
  'Amanda',
  'Dorothy',
  'Melissa',
  'Deborah',
];

const LAST_NAMES = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Rodriguez',
  'Martinez',
  'Hernandez',
  'Lopez',
  'Gonzalez',
  'Wilson',
  'Anderson',
  'Thomas',
  'Taylor',
  'Moore',
  'Jackson',
  'Martin',
  'Lee',
  'Perez',
  'Thompson',
  'White',
  'Harris',
  'Sanchez',
  'Clark',
  'Ramirez',
  'Lewis',
  'Robinson',
  'Walker',
  'Young',
  'Allen',
  'King',
  'Wright',
  'Scott',
  'Torres',
  'Nguyen',
  'Hill',
  'Flores',
  'Green',
  'Adams',
  'Nelson',
  'Baker',
  'Hall',
  'Rivera',
  'Campbell',
  'Mitchell',
  'Carter',
  'Roberts',
];

const DEPARTMENTS = ['Engineering', 'Product', 'Marketing', 'Sales', 'HR', 'Finance'];

const DESIGNATIONS_BY_DEPT: Record<string, string[]> = {
  Engineering: [
    'Junior Software Engineer',
    'Senior Software Engineer',
    'Lead Engineer',
    'Director of Engineering',
  ],
  Product: [
    'Associate Product Manager',
    'Senior Product Manager',
    'Lead Product Manager',
    'Director of Product',
  ],
  Marketing: [
    'Marketing Coordinator',
    'Senior Marketing Specialist',
    'Marketing Manager',
    'Director of Marketing',
  ],
  Sales: ['Sales Representative', 'Account Executive', 'Sales Manager', 'Director of Sales'],
  HR: ['HR Associate', 'HR Specialist', 'HR Manager', 'Director of HR'],
  Finance: [
    'Financial Analyst',
    'Senior Finance Specialist',
    'Finance Manager',
    'Director of Finance',
  ],
};

const COUNTRIES = [
  { name: 'United States', currency: 'USD', multiplier: 1.0 },
  { name: 'United Kingdom', currency: 'GBP', multiplier: 0.8 },
  { name: 'Germany', currency: 'EUR', multiplier: 0.9 },
  { name: 'India', currency: 'INR', multiplier: 15.0 },
  { name: 'Canada', currency: 'CAD', multiplier: 1.15 },
];

const ROLE_SALARY_RANGES: Record<string, { min: number; max: number }> = {
  Junior: { min: 50000, max: 80000 },
  Senior: { min: 90000, max: 140000 },
  Lead: { min: 145000, max: 190000 },
  Director: { min: 200000, max: 290000 },
};

function getRoleRank(designation: string): string {
  if (designation.includes('Director')) return 'Director';
  if (designation.includes('Lead')) return 'Lead';
  if (designation.includes('Senior')) return 'Senior';
  return 'Junior';
}

async function seed() {
  console.log('Initializing database connection...');
  await AppDataSource.initialize();

  console.log('Cleaning up existing data...');
  await AppDataSource.query('TRUNCATE TABLE employees CASCADE');

  console.log('Generating seed data in memory...');
  const employees: Partial<Employee>[] = [];
  const salaries: Partial<Salary>[] = [];
  const salaryHistories: Partial<SalaryHistory>[] = [];

  for (let i = 1; i <= 10000; i++) {
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const employeeCode = `EMP-${10000 + i}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${i}@company.com`;
    const department = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
    const designations = DESIGNATIONS_BY_DEPT[department];
    const designation = designations[Math.floor(Math.random() * designations.length)];
    const countryObj = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];

    const employeeId = randomUUID();
    const roleRank = getRoleRank(designation);
    const range = ROLE_SALARY_RANGES[roleRank];
    const baseUsd = range.min + Math.random() * (range.max - range.min);
    const baseSalaryRaw = baseUsd * countryObj.multiplier;
    const baseSalary = Math.round(baseSalaryRaw * 100) / 100;

    let bonusPct = 0;
    if (roleRank === 'Junior') bonusPct = Math.random() * 0.1;
    else if (roleRank === 'Senior') bonusPct = 0.05 + Math.random() * 0.15;
    else if (roleRank === 'Lead') bonusPct = 0.1 + Math.random() * 0.2;
    else if (roleRank === 'Director') bonusPct = 0.2 + Math.random() * 0.3;

    const bonus = Math.round(baseSalary * bonusPct * 100) / 100;

    const currentEffectiveYear = 2025;
    const currentEffectiveMonth = Math.floor(Math.random() * 12) + 1;
    const currentEffectiveDay = Math.floor(Math.random() * 28) + 1;
    const currentEffectiveDateStr = `${currentEffectiveYear}-${String(currentEffectiveMonth).padStart(2, '0')}-${String(currentEffectiveDay).padStart(2, '0')}`;

    const hasHistory = i <= 2000;

    if (hasHistory) {
      const discount = 0.1 + Math.random() * 0.1;
      const oldBaseSalary = Math.round(baseSalary * (1 - discount) * 100) / 100;
      const oldBonus = Math.round(oldBaseSalary * (bonusPct * 0.8) * 100) / 100;

      const oldEffectiveYear = 2024;
      const oldEffectiveMonth = Math.floor(Math.random() * 12) + 1;
      const oldEffectiveDay = Math.floor(Math.random() * 28) + 1;
      const oldEffectiveDateStr = `${oldEffectiveYear}-${String(oldEffectiveMonth).padStart(2, '0')}-${String(oldEffectiveDay).padStart(2, '0')}`;

      const oldSalaryId = randomUUID();
      const currentSalaryId = randomUUID();

      salaries.push({
        id: oldSalaryId,
        employeeId,
        baseSalary: oldBaseSalary,
        bonus: oldBonus,
        effectiveDate: oldEffectiveDateStr,
        isCurrent: false,
        createdAt: new Date(`${oldEffectiveDateStr}T09:00:00Z`),
      });

      salaries.push({
        id: currentSalaryId,
        employeeId,
        baseSalary,
        bonus,
        effectiveDate: currentEffectiveDateStr,
        isCurrent: true,
        createdAt: new Date(`${currentEffectiveDateStr}T09:00:00Z`),
      });

      const reasons = [
        'Annual Performance Review',
        'Promotion',
        'Market Adjustment',
        'Cost of Living Adjustment',
      ];
      const reason = reasons[Math.floor(Math.random() * reasons.length)];

      salaryHistories.push({
        id: randomUUID(),
        employeeId,
        oldSalary: oldBaseSalary,
        newSalary: baseSalary,
        reason,
        changedAt: new Date(`${currentEffectiveDateStr}T09:00:00Z`),
      });
    } else {
      salaries.push({
        id: randomUUID(),
        employeeId,
        baseSalary,
        bonus,
        effectiveDate: currentEffectiveDateStr,
        isCurrent: true,
        createdAt: new Date(`${currentEffectiveDateStr}T09:00:00Z`),
      });
    }

    employees.push({
      id: employeeId,
      employeeCode,
      firstName,
      lastName,
      email,
      department,
      designation,
      country: countryObj.name,
      currency: countryObj.currency,
      createdAt: new Date('2023-01-15T09:00:00Z'),
      updatedAt: new Date(`${currentEffectiveDateStr}T09:00:00Z`),
    });
  }

  console.log(`Bulk inserting ${employees.length} employees...`);
  for (let c = 0; c < employees.length; c += 1000) {
    const chunk = employees.slice(c, c + 1000);
    await AppDataSource.createQueryBuilder().insert().into(Employee).values(chunk).execute();
  }

  console.log(`Bulk inserting ${salaries.length} salaries...`);
  for (let c = 0; c < salaries.length; c += 1000) {
    const chunk = salaries.slice(c, c + 1000);
    await AppDataSource.createQueryBuilder().insert().into(Salary).values(chunk).execute();
  }

  console.log(`Bulk inserting ${salaryHistories.length} salary histories...`);
  for (let c = 0; c < salaryHistories.length; c += 1000) {
    const chunk = salaryHistories.slice(c, c + 1000);
    await AppDataSource.createQueryBuilder().insert().into(SalaryHistory).values(chunk).execute();
  }

  console.log('Seeding completed successfully!');
  await AppDataSource.destroy();
}

seed().catch((error) => {
  console.error('Error during seeding:', error);
  process.exit(1);
});
