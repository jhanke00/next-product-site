# Frontend Testing Documentation

This document provides documentation for testing strategies, frameworks, and implementation patterns used in the Next.js Product Site frontend.

## Testing Frameworks

### Jest Configuration

**Primary Framework**: Jest 30.1.3 with TypeScript support

### React Testing Library

**Purpose**: Component testing with user-centric approach

**Key Principles**:

- Test behavior, not implementation
- Query by accessibility attributes
- Simulate user interactions
- Assert on visible changes

### Playwright E2E Testing

**Purpose**: End-to-end testing of complete user workflows
