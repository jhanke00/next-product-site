import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const tsconfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'tsconfig.json'), 'utf8'));

const config: Config = {
  setupFilesAfterEnv: ['<rootDir>/tests/setupJest.ts'],
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsconfig.compilerOptions.paths, { prefix: '<rootDir>/' }),
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
        },
      },
    ],
  },
  verbose: true,
  passWithNoTests: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', 'app/**/*.{ts,tsx}', '!**/*.d.ts', '!**/node_modules/**'],
  collectCoverage: true,
};

export default config;
