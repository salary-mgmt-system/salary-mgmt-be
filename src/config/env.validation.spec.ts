import 'reflect-metadata';
import { validateEnv } from './env.validation';

describe('env.validation', () => {
  it('should successfully validate and return config when all required variables are correct', () => {
    const validConfig = {
      NODE_ENV: 'production',
      PORT: '4000',
      DATABASE_HOST: 'localhost',
      DATABASE_PORT: '5432',
      DATABASE_USERNAME: 'admin',
      DATABASE_PASSWORD: 'password123',
      DATABASE_NAME: 'test_db',
    };

    const result = validateEnv(validConfig);

    expect(result.NODE_ENV).toBe('production');
    expect(result.PORT).toBe(4000);
    expect(result.DATABASE_HOST).toBe('localhost');
    expect(result.DATABASE_PORT).toBe(5432);
    expect(result.DATABASE_USERNAME).toBe('admin');
    expect(result.DATABASE_PASSWORD).toBe('password123');
    expect(result.DATABASE_NAME).toBe('test_db');
  });

  it('should fallback to defaults for optional fields', () => {
    const minimalConfig = {
      DATABASE_HOST: 'localhost',
      DATABASE_USERNAME: 'admin',
      DATABASE_PASSWORD: 'password123',
      DATABASE_NAME: 'test_db',
    };

    const result = validateEnv(minimalConfig);

    expect(result.NODE_ENV).toBe('development');
    expect(result.PORT).toBe(3000);
    expect(result.DATABASE_PORT).toBe(5432);
  });

  it('should throw an error if a required environment variable is missing', () => {
    const incompleteConfig = {
      PORT: '3000',
      DATABASE_HOST: 'localhost',
      // DATABASE_USERNAME missing
      DATABASE_PASSWORD: 'password123',
      DATABASE_NAME: 'test_db',
    };

    expect(() => validateEnv(incompleteConfig)).toThrow(/Environment validation failed:/);
  });

  it('should throw an error if a variable has an invalid type', () => {
    const invalidTypeConfig = {
      DATABASE_HOST: 'localhost',
      DATABASE_USERNAME: 'admin',
      DATABASE_PASSWORD: 'password123',
      DATABASE_NAME: 'test_db',
      PORT: 'not-a-number',
    };

    expect(() => validateEnv(invalidTypeConfig)).toThrow(/Environment validation failed:/);
  });

  it('should throw an error if NODE_ENV has an invalid enum value', () => {
    const invalidEnvConfig = {
      DATABASE_HOST: 'localhost',
      DATABASE_USERNAME: 'admin',
      DATABASE_PASSWORD: 'password123',
      DATABASE_NAME: 'test_db',
      NODE_ENV: 'invalid-environment',
    };

    expect(() => validateEnv(invalidEnvConfig)).toThrow(/Environment validation failed:/);
  });
});
