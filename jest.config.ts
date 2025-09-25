import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  setupFiles: ['<rootDir>/tests/setupJest.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setupJest.ts'],
  testEnvironment: 'node',
  // testEnvironment: 'jest-environment-jsdom',
  verbose: true,
  collectCoverageFrom: ['src/**/*.ts', 'app/**/*.ts'],
  collectCoverage: true,
};

export default createJestConfig(config);
