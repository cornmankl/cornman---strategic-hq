import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import React from 'react';

// Mock data generators for testing
export const mockData = {
  sales: {
    generate: (overrides = {}) => ({
      id: `sale-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      customerName: 'Test Customer',
      amount: 100,
      date: new Date().toISOString(),
      status: 'completed',
      ...overrides,
    }),

    generateMultiple: (count = 5) => 
      Array.from({ length: count }, (_, index) => 
        mockData.sales.generate({
          id: `sale-${index}`,
          customerName: `Customer ${index + 1}`,
          amount: (index + 1) * 50,
        })
      ),
  },

  inventory: {
    generate: (overrides = {}) => ({
      id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: 'Test Product',
      stock: 50,
      threshold: 10,
      unit: 'pcs',
      cost: 10,
      price: 25,
      category: 'Test Category',
      supplier: 'Test Supplier',
      ...overrides,
    }),

    generateMultiple: (count = 5) =>
      Array.from({ length: count }, (_, index) =>
        mockData.inventory.generate({
          id: `inv-${index}`,
          name: `Product ${index + 1}`,
          stock: 50 - (index * 10),
        })
      ),
  },

  customers: {
    generate: (overrides = {}) => ({
      id: `cust-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: 'Test Customer',
      email: 'test@example.com',
      phone: '+1234567890',
      address: 'Test Address',
      totalPurchases: 0,
      lastPurchase: null,
      ...overrides,
    }),

    generateMultiple: (count = 5) =>
      Array.from({ length: count }, (_, index) =>
        mockData.customers.generate({
          id: `cust-${index}`,
          name: `Customer ${index + 1}`,
          email: `customer${index + 1}@example.com`,
        })
      ),
  },
};

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div data-testid="test-wrapper">{children}</div>;
};

// Enhanced render function with providers
export const renderWithProviders = (ui: React.ReactElement, options = {}) => {
  return render(ui, { wrapper: TestWrapper, ...options });
};

// Hook testing utilities
export const renderHookWithProviders = <TProps, TResult>(
  hook: (props: TProps) => TResult,
  options: { initialProps?: TProps } = {}
) => {
  return renderHook(hook, { wrapper: TestWrapper, ...options });
};

// Performance measurement utilities
export const measurePerformance = {
  renderTime: async (renderFn: () => void) => {
    const start = performance.now();
    renderFn();
    const end = performance.now();
    return end - start;
  },

  asyncOperation: async <T>(operation: () => Promise<T>) => {
    const start = performance.now();
    const result = await operation();
    const end = performance.now();
    return { result, duration: end - start };
  },
};

// API service mocks
export const createMockApiService = () => ({
  sales: {
    getSales: vi.fn().mockResolvedValue(mockData.sales.generateMultiple()),
    addSale: vi.fn().mockResolvedValue(mockData.sales.generate()),
    updateSale: vi.fn().mockResolvedValue(mockData.sales.generate()),
    deleteSale: vi.fn().mockResolvedValue({ success: true }),
  },

  inventory: {
    getInventory: vi.fn().mockResolvedValue(mockData.inventory.generateMultiple()),
    updateStock: vi.fn().mockResolvedValue(mockData.inventory.generate()),
    createItem: vi.fn().mockResolvedValue(mockData.inventory.generate()),
    deleteItem: vi.fn().mockResolvedValue({ success: true }),
  },

  customers: {
    getCustomers: vi.fn().mockResolvedValue(mockData.customers.generateMultiple()),
    addCustomer: vi.fn().mockResolvedValue(mockData.customers.generate()),
    updateCustomer: vi.fn().mockResolvedValue(mockData.customers.generate()),
    deleteCustomer: vi.fn().mockResolvedValue({ success: true }),
  },

  reset: function() {
    Object.values(this).forEach(service => {
      if (typeof service === 'object' && service !== null) {
        Object.values(service).forEach(method => {
          if (vi.isMockFunction(method)) {
            method.mockClear();
          }
        });
      }
    });
  },
});

// Common test assertions
export const assertions = {
  elementExists: (testId: string) => {
    expect(screen.getByTestId(testId)).toBeInTheDocument();
  },

  elementHasText: (testId: string, text: string) => {
    expect(screen.getByTestId(testId)).toHaveTextContent(text);
  },

  buttonEnabled: (testId: string) => {
    expect(screen.getByTestId(testId)).toBeEnabled();
  },

  buttonDisabled: (testId: string) => {
    expect(screen.getByTestId(testId)).toBeDisabled();
  },

  errorShown: (errorMessage: string) => {
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  },

  loadingShown: () => {
    const loading = screen.queryByTestId('loading-spinner') || screen.queryByText(/loading/i);
    expect(loading).toBeInTheDocument();
  },
};

// User interaction helpers
export const userActions = {
  clickButton: async (testId: string) => {
    const button = screen.getByTestId(testId);
    fireEvent.click(button);
    await waitFor(() => {}, { timeout: 100 });
  },

  fillInput: async (testId: string, value: string) => {
    const input = screen.getByTestId(testId);
    fireEvent.change(input, { target: { value } });
    await waitFor(() => {}, { timeout: 100 });
  },

  submitForm: async (formTestId: string) => {
    const form = screen.getByTestId(formTestId);
    fireEvent.submit(form);
    await waitFor(() => {}, { timeout: 100 });
  },
};

// Test scenario generators
export const testScenarios = {
  basicCRUD: (entityName: string, createData: any, updateData: any) => {
    describe(`${entityName} CRUD Operations`, () => {
      it(`should create ${entityName}`, async () => {
        // Implementation would be provided by the test
      });

      it(`should read ${entityName}`, async () => {
        // Implementation would be provided by the test
      });

      it(`should update ${entityName}`, async () => {
        // Implementation would be provided by the test
      });

      it(`should delete ${entityName}`, async () => {
        // Implementation would be provided by the test
      });
    });
  },

  errorHandling: (componentName: string, errorTests: Array<{
    name: string;
    setup: () => void;
    expectedError: string;
  }>) => {
    describe(`${componentName} Error Handling`, () => {
      errorTests.forEach(({ name, setup, expectedError }) => {
        it(`should handle ${name}`, async () => {
          setup();
          await waitFor(() => {
            assertions.errorShown(expectedError);
          });
        });
      });
    });
  },

  performance: (componentName: string, performanceTests: Array<{
    name: string;
    test: () => Promise<void>;
    maxDuration: number;
  }>) => {
    describe(`${componentName} Performance`, () => {
      performanceTests.forEach(({ name, test, maxDuration }) => {
        it(`should ${name} within ${maxDuration}ms`, async () => {
          const { duration } = await measurePerformance.asyncOperation(test);
          expect(duration).toBeLessThan(maxDuration);
        });
      });
    });
  },

  integrationFlow: (
    flowName: string,
    steps: Array<{
      name: string;
      action: () => Promise<void>;
      verification: () => void;
    }>
  ) => {
    describe(`${flowName} Integration Flow`, () => {
      it(`should complete ${flowName} successfully`, async () => {
        for (const step of steps) {
          await step.action();
          step.verification();
        }
      });
    });
  },
};

// Setup and teardown utilities
export const setupTests = {
  beforeEach: () => {
    beforeEach(() => {
      localStorage.clear();
      vi.clearAllTimers();
    });
  },

  afterEach: () => {
    afterEach(() => {
      vi.clearAllMocks();
    });
  },

  complete: () => {
    setupTests.beforeEach();
    setupTests.afterEach();
  },
};

// Export commonly used testing utilities
export {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  render,
  screen,
  fireEvent,
  waitFor,
  renderHook,
  act,
};