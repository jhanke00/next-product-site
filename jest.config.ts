import type { Config } from 'jest';

const config: Config = {
  setupFiles: ['<rootDir>/tests/setupJest.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@type/(.*)$': '<rootDir>/src/type/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@mock/(.*)$': '<rootDir>/src/mock/$1',
  },
  transform: { '^.+\\.ts$': 'ts-jest' },
  verbose: true,
  passWithNoTests: true,
  collectCoverageFrom: ['src/**/*.ts'],
  collectCoverage: true,
};

export default config;
