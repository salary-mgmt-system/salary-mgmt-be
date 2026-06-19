import 'reflect-metadata';
import { getMetadataArgsStorage } from 'typeorm';
import { Employee } from '../employees/entities/employee.entity';
import { Salary } from '../salaries/entities/salary.entity';
import { SalaryHistory } from '../salaries/entities/salary-history.entity';

describe('Entity Transformers and Relations Coverage', () => {
  it('should cover all column transformers for Salary and SalaryHistory entities', () => {
    const storage = getMetadataArgsStorage();
    const columns = storage.columns.filter(
      (c) => c.target === Salary || c.target === SalaryHistory,
    );

    expect(columns.length).toBeGreaterThan(0);

    for (const col of columns) {
      if (col.options && col.options.transformer) {
        const transformer = col.options.transformer;

        // Test standard transformer object
        if (
          typeof transformer === 'object' &&
          transformer !== null &&
          !Array.isArray(transformer)
        ) {
          const t = transformer;
          if (typeof t.to === 'function') {
            const value = 1234.56;
            expect(t.to(value)).toBe(value);
          }
          if (typeof t.from === 'function') {
            expect(t.from('1234.56')).toBe(1234.56);
          }
        }
      }
    }
  });

  it('should cover all relation type functions and inverse property callbacks', () => {
    const storage = getMetadataArgsStorage();
    const relations = storage.relations.filter(
      (r) => r.target === Employee || r.target === Salary || r.target === SalaryHistory,
    );

    expect(relations.length).toBeGreaterThan(0);

    for (const rel of relations) {
      // Execute the 'type' function (e.g., () => Salary)
      if (typeof rel.type === 'function') {
        const targetType = (rel.type as () => unknown)();
        expect(targetType).toBeDefined();
      }

      // Execute the 'inverseSideProperty' function if it is defined as a callback
      if (typeof rel.inverseSideProperty === 'function') {
        // Pass a mock object with property keys to satisfy the callback
        const mockProxy = new Proxy(
          {},
          {
            get: (target, prop) => {
              return prop;
            },
          },
        );
        const inverseProp = (rel.inverseSideProperty as (x: unknown) => unknown)(mockProxy);
        expect(inverseProp).toBeDefined();
      }
    }
  });
});
