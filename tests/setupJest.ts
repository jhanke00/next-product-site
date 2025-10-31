// Note: jest-dom is loaded via setupFilesAfterEnv in jest.config.ts

// Mock window.scrollTo to avoid errors in components that call it
Object.defineProperty(window, 'scrollTo', { value: () => {}, writable: true });

// Stub window.location.reload to avoid full reloads in tests
try {
  Object.defineProperty(window.location, 'reload', { value: () => {}, writable: true });
} catch {}
