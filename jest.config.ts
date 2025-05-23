import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const config: Config = {
  setupFilesAfterEnv: ['<rootDir>/tests/setupJest.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  transform: {
    '^.+\\.(tsx|jsx)$': ['babel-jest', { presets: ['next/babel'] }],
    '^.+\\.ts$': 'ts-jest',
  },
  testEnvironment: 'jest-environment-jsdom',
  verbose: true,
  passWithNoTests: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}'],
  collectCoverage: true,
};

export default config;
