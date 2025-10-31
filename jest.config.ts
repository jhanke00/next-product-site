import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';

const config: Config = {
  testEnvironment: 'jsdom',
  setupFiles: [],
  setupFilesAfterEnv: ['@testing-library/jest-dom', '<rootDir>/tests/setupJest.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@type/(.*)$': '<rootDir>/src/type/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@mock/(.*)$': '<rootDir>/src/mock/$1',
    '^next/link$': '<rootDir>/__mocks__/next/link.tsx',
    '^next/navigation$': '<rootDir>/__mocks__/next/navigation.ts',
  },
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
  verbose: true,
  passWithNoTests: false,
  collectCoverageFrom: ['src/components/StarRating.tsx', 'src/components/AuthBar.tsx'],
  coveragePathIgnorePatterns: ['/node_modules/', 'app/api/', 'src/server/', 'src/utils/'],
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 83,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};

export default config;
