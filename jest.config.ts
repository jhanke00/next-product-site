import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const config: Config = {
  setupFiles: ['<rootDir>/tests/setupJest.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  transform: { '^.+\\.ts$': 'ts-jest' },
  verbose: true,
  passWithNoTests: true,
  collectCoverageFrom: ['src/**/*.ts'],
  collectCoverage: true,
};

export default config;
