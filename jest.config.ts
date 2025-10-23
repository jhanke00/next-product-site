import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import fs from 'fs';
import path from 'path';

// Read tsconfig.json via fs to avoid needing JSON import assertions in this environment
const tsconfigPath = path.resolve(process.cwd(), 'tsconfig.json');
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
const compilerOptions = tsconfig.compilerOptions || {};

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setupJest.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  transform: { '^.+\\.(ts|tsx)$': 'ts-jest' },
  testMatch: ['**/__tests__/**/*.(ts|tsx|js)', '**/?(*.)+(spec|test).(ts|tsx|js)'],
  verbose: true,
  passWithNoTests: true,
  // Collect coverage only from utility TS files for the demo (avoids JSX instrumentation issues).
  collectCoverage: true,
  collectCoverageFrom: ['src/utils/**/*.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
};

export default config;
