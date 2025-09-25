import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  clearMocks: true,
  collectCoverageFrom: ['**/*.{ts,tsx}', '!**/*.d.ts', '!**/*.spec.ts'],
  coveragePathIgnorePatterns: ['/dist/', '/node_modules/'],
  passWithNoTests: true,
  moduleNameMapper: {
    '^uuid$': '<rootDir>/src/test-utils/uuid-test-double.ts',
    '^@prisma/client$': '<rootDir>/src/test-utils/prisma-client-test-double.ts',
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.jest.json',
    },
  },
};

export default config;
