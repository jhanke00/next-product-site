import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import fs from 'fs';
import path from 'path';

const compilerOptions = JSON.parse(fs.readFileSync(path.resolve('tsconfig.json'), 'utf-8')).compilerOptions;

const config: Config = {
  setupFilesAfterEnv: ['<rootDir>/tests/setupJest.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'tsx', 'json'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.jest.json' }],
  },
  verbose: true,
  testEnvironment: 'jsdom',
  passWithNoTests: true,
  collectCoverage: true,
  coverageReporters: ['text', 'lcov'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}', '!src/**/*.d.ts', '!src/**/index.ts'],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};

export default config;
