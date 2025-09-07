/**
 * Comprehensive Testing Framework
 * Testing utilities with mock data generators, performance testing, and integration helpers
 */

import React from 'react';
import { vi } from 'vitest';

// Mock data types
export interface MockSale {
  id: string;
  amount: number;
  date: string;
  customer: string;
  product: string;
  status: 'pending' | 'completed' | 'cancelled';
  paymentMethod?: string;
  notes?: string;
}

export interface MockInventoryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category: string;
  lowStock: boolean;
  supplier?: string;
  sku?: string;
}

export interface MockCustomer {
  id: string;
  name: string;
  email: string;
  totalPurchases: number;
  lastPurchase: string;
  phone?: string;
  address?: string;
  preferences?: string[];
}

export interface MockProject {
  id: string;
  name: string;
  status: 'planning' | 'in-progress' | 'completed';
  progress: number;
  deadline: string;
  description?: string;
  team?: string[];
  budget?: number;
}

export interface MockOrder {
  id: string;
  customerId: string;
  items: Array<{ productId: string; quantity: number; price: number }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  shippingAddress?: string;
}

export interface MockProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  images?: string[];
  tags?: string[];
}

/**
 * Mock data generators
 */
export const mockData = {
  sales: {
    generate: (count = 10, overrides: Partial<MockSale> = {}): MockSale[] => {
      return Array.from({ length: count }, (_, index) => ({
        id: `sale_${index + 1}`,
        amount: Math.floor(Math.random() * 1000) + 50,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        customer: `Customer ${index + 1}`,
        product: `Product ${String.fromCharCode(65 + (index % 26))}`,
        status: ['pending', 'completed', 'cancelled'][Math.floor(Math.random() * 3)] as any,
        paymentMethod: ['credit_card', 'paypal', 'bank_transfer'][Math.floor(Math.random() * 3)],
        notes: Math.random() > 0.7 ? `Note for sale ${index + 1}` : undefined,
        ...overrides,
      }));
    },

    generateSingle: (overrides: Partial<MockSale> = {}): MockSale => {
      return mockData.sales.generate(1, overrides)[0];
    },
  },

  inventory: {
    generate: (count = 20, overrides: Partial<MockInventoryItem> = {}): MockInventoryItem[] => {
      const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books'];
      
      return Array.from({ length: count }, (_, index) => {
        const quantity = Math.floor(Math.random() * 100);
        return {
          id: `item_${index + 1}`,
          name: `Item ${index + 1}`,
          quantity,
          price: Math.floor(Math.random() * 500) + 10,
          category: categories[index % categories.length],
          lowStock: quantity < 10,
          supplier: `Supplier ${String.fromCharCode(65 + (index % 5))}`,
          sku: `SKU${String(index + 1).padStart(4, '0')}`,
          ...overrides,
        };
      });
    },

    generateSingle: (overrides: Partial<MockInventoryItem> = {}): MockInventoryItem => {
      return mockData.inventory.generate(1, overrides)[0];
    },
  },

  customers: {
    generate: (count = 15, overrides: Partial<MockCustomer> = {}): MockCustomer[] => {
      const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana', 'Eve', 'Frank'];
      const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller'];
      
      return Array.from({ length: count }, (_, index) => {
        const firstName = firstNames[index % firstNames.length];
        const lastName = lastNames[index % lastNames.length];
        const name = `${firstName} ${lastName}`;
        
        return {
          id: `customer_${index + 1}`,
          name,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
          totalPurchases: Math.floor(Math.random() * 5000),
          lastPurchase: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
          phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          address: `${index + 1}${index % 2 === 0 ? 'st' : 'nd'} Street, City ${index % 5 + 1}`,
          preferences: ['email', 'sms', 'phone'].filter(() => Math.random() > 0.5),
          ...overrides,
        };
      });
    },

    generateSingle: (overrides: Partial<MockCustomer> = {}): MockCustomer => {
      return mockData.customers.generate(1, overrides)[0];
    },
  },

  projects: {
    generate: (count = 8, overrides: Partial<MockProject> = {}): MockProject[] => {
      const projectNames = [
        'Website Redesign', 'Mobile App Development', 'Marketing Campaign',
        'Product Launch', 'System Integration', 'Data Migration', 'Security Audit', 'User Training'
      ];
      
      return Array.from({ length: count }, (_, index) => ({
        id: `project_${index + 1}`,
        name: projectNames[index % projectNames.length],
        status: ['planning', 'in-progress', 'completed'][Math.floor(Math.random() * 3)] as any,
        progress: Math.floor(Math.random() * 100),
        deadline: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        description: `Description for ${projectNames[index % projectNames.length]}`,
        team: [`Developer ${index + 1}`, `Designer ${index + 1}`].filter(() => Math.random() > 0.5),
        budget: Math.floor(Math.random() * 50000) + 5000,
        ...overrides,
      }));
    },

    generateSingle: (overrides: Partial<MockProject> = {}): MockProject => {
      return mockData.projects.generate(1, overrides)[0];
    },
  },

  orders: {
    generate: (count = 12, overrides: Partial<MockOrder> = {}): MockOrder[] => {
      return Array.from({ length: count }, (_, index) => {
        const itemCount = Math.floor(Math.random() * 5) + 1;
        const items = Array.from({ length: itemCount }, (_, itemIndex) => ({
          productId: `product_${itemIndex + 1}`,
          quantity: Math.floor(Math.random() * 3) + 1,
          price: Math.floor(Math.random() * 100) + 10,
        }));
        
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        return {
          id: `order_${index + 1}`,
          customerId: `customer_${(index % 15) + 1}`,
          items,
          total,
          status: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'][Math.floor(Math.random() * 5)] as any,
          orderDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          shippingAddress: `${index + 1} Shipping Street, City ${index % 3 + 1}`,
          ...overrides,
        };
      });
    },

    generateSingle: (overrides: Partial<MockOrder> = {}): MockOrder => {
      return mockData.orders.generate(1, overrides)[0];
    },
  },

  products: {
    generate: (count = 25, overrides: Partial<MockProduct> = {}): MockProduct[] => {
      const productNames = [
        'Laptop', 'Smartphone', 'Headphones', 'Tablet', 'Camera', 'Speaker', 'Monitor',
        'Keyboard', 'Mouse', 'Printer', 'Router', 'Watch', 'Charger', 'Cable', 'Stand'
      ];
      const categories = ['Electronics', 'Accessories', 'Computing', 'Audio', 'Mobile'];
      
      return Array.from({ length: count }, (_, index) => ({
        id: `product_${index + 1}`,
        name: `${productNames[index % productNames.length]} ${index + 1}`,
        description: `High-quality ${productNames[index % productNames.length].toLowerCase()} with advanced features`,
        price: Math.floor(Math.random() * 1000) + 50,
        category: categories[index % categories.length],
        inStock: Math.random() > 0.1,
        images: [`/images/product_${index + 1}_1.jpg`, `/images/product_${index + 1}_2.jpg`],
        tags: ['popular', 'new', 'bestseller', 'premium'].filter(() => Math.random() > 0.7),
        ...overrides,
      }));
    },

    generateSingle: (overrides: Partial<MockProduct> = {}): MockProduct => {
      return mockData.products.generate(1, overrides)[0];
    },
  },
};

/**
 * Performance testing utilities
 */
export const performanceTestUtils = {
  /**
   * Measure function execution time
   */
  measureTime: async <T>(fn: () => Promise<T> | T, label?: string): Promise<{ result: T; duration: number }> => {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;
    
    if (label) {
      console.log(`${label}: ${duration.toFixed(2)}ms`);
    }
    
    return { result, duration };
  },

  /**
   * Run performance benchmarks
   */
  benchmark: async (
    tests: Array<{ name: string; fn: () => Promise<any> | any }>,
    iterations = 10
  ): Promise<Array<{ name: string; avgTime: number; minTime: number; maxTime: number }>> => {
    const results = [];
    
    for (const test of tests) {
      const times: number[] = [];
      
      for (let i = 0; i < iterations; i++) {
        const { duration } = await performanceTestUtils.measureTime(test.fn);
        times.push(duration);
      }
      
      results.push({
        name: test.name,
        avgTime: times.reduce((sum, time) => sum + time, 0) / times.length,
        minTime: Math.min(...times),
        maxTime: Math.max(...times),
      });
    }
    
    return results;
  },

  /**
   * Simulate network delay
   */
  networkDelay: (ms: number = 100): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * Memory usage tracker
   */
  trackMemory: () => {
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
      };
    }
    return null;
  },
};

/**
 * API testing utilities
 */
export const apiTestUtils = {
  /**
   * Mock fetch responses
   */
  mockFetch: (responses: Array<{ url: string; response: any; status?: number; delay?: number }>) => {
    const originalFetch = global.fetch;
    
    global.fetch = vi.fn().mockImplementation(async (url: string) => {
      const mockResponse = responses.find(r => url.includes(r.url));
      
      if (mockResponse) {
        if (mockResponse.delay) {
          await performanceTestUtils.networkDelay(mockResponse.delay);
        }
        
        return Promise.resolve({
          ok: (mockResponse.status || 200) < 400,
          status: mockResponse.status || 200,
          json: () => Promise.resolve(mockResponse.response),
          text: () => Promise.resolve(JSON.stringify(mockResponse.response)),
        });
      }
      
      return Promise.reject(new Error(`No mock response found for ${url}`));
    });
    
    return () => {
      global.fetch = originalFetch;
    };
  },

  /**
   * Test API endpoint with various scenarios
   */
  testEndpoint: async (
    endpoint: string,
    scenarios: Array<{
      name: string;
      request: RequestInit;
      expectedStatus: number;
      validate?: (response: any) => boolean;
    }>
  ) => {
    const results = [];
    
    for (const scenario of scenarios) {
      try {
        const { result: response, duration } = await performanceTestUtils.measureTime(
          () => fetch(endpoint, scenario.request)
        );
        
        const isValid = scenario.validate ? scenario.validate(response) : true;
        
        results.push({
          name: scenario.name,
          success: response.status === scenario.expectedStatus && isValid,
          status: response.status,
          duration,
          error: null,
        });
      } catch (error) {
        results.push({
          name: scenario.name,
          success: false,
          status: 0,
          duration: 0,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
    
    return results;
  },
};

/**
 * Component testing utilities
 */
export const componentTestUtils = {
  /**
   * Wait for component to update
   */
  waitForUpdate: (ms: number = 0): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * Mock React context
   */
  mockContext: <T>(defaultValue: T) => {
    const Context = React.createContext(defaultValue);
    const MockProvider = ({ children, value }: { children: React.ReactNode; value?: T }) => (
      React.createElement(Context.Provider, { value: value || defaultValue }, children)
    );
    
    return { Context, MockProvider };
  },

  /**
   * Create mock component props
   */
  createMockProps: <T>(overrides: Partial<T> = {}): T => {
    const baseMockProps = {
      onClick: vi.fn(),
      onChange: vi.fn(),
      onSubmit: vi.fn(),
      onLoad: vi.fn(),
      onError: vi.fn(),
    };
    
    return { ...baseMockProps, ...overrides } as T;
  },
};

/**
 * Integration test helpers
 */
export const integrationTestUtils = {
  /**
   * Setup test environment
   */
  setupTestEnv: () => {
    // Mock environment variables
    Object.defineProperty(import.meta, 'env', {
      value: {
        VITE_GEMINI_API_KEY: 'test-api-key',
        VITE_SUPABASE_URL: 'https://test.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'test-anon-key',
        VITE_FIREBASE_API_KEY: 'test-firebase-key',
        VITE_FIREBASE_AUTH_DOMAIN: 'test.firebaseapp.com',
        VITE_FIREBASE_PROJECT_ID: 'test-project',
        DEV: true,
        PROD: false,
      },
      writable: true,
    });

    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    // Mock sessionStorage
    const sessionStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

    return {
      localStorage: localStorageMock,
      sessionStorage: sessionStorageMock,
    };
  },

  /**
   * Cleanup test environment
   */
  cleanupTestEnv: () => {
    vi.clearAllMocks();
    vi.clearAllTimers();
  },

  /**
   * Create test data set
   */
  createTestDataSet: () => ({
    sales: mockData.sales.generate(5),
    inventory: mockData.inventory.generate(10),
    customers: mockData.customers.generate(8),
    projects: mockData.projects.generate(3),
    orders: mockData.orders.generate(6),
    products: mockData.products.generate(15),
  }),
};

// React imports handled above