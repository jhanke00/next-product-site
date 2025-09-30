import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Read tsconfig.json using process.cwd() for current working directory
const tsconfig = JSON.parse(
  readFileSync(resolve(process.cwd(), './tsconfig.json'), 'utf-8')
);
const { compilerOptions } = tsconfig;

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/tests/setupJest.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react',
        },
      },
    ],
  },
  verbose: true,
  passWithNoTests: true,
  testPathIgnorePatterns: ['/node_modules/', '/e2e/', '\\.spec\\.(ts|tsx)$'],
  testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx)', '**/*.(test|spec).(ts|tsx)'],
};

export default config;
