// Setup file for E2E tests
import 'reflect-metadata';

// Increase default timeout for all tests
jest.setTimeout(15000);

// Mock console logs to reduce noise during tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
};

// Add global test utilities if needed
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidGiftTemplate(): R;
    }
  }
}

// Add custom matchers
expect.extend({
  toBeValidGiftTemplate(received) {
    const pass = received && 
                 typeof received.id === 'number' &&
                 typeof received.title === 'string' &&
                 received.title.length >= 3;
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid gift template`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid gift template`,
        pass: false,
      };
    }
  },
});