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
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.jest.json',
    },
  },
};

export default config;
