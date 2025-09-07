/**
 * Service Enhancement Utilities
 * Service wrapper utilities with advanced features: rate limiting, retry logic, multi-language responses
 */

import React from 'react';

export interface ServiceConfig {
  baseURL?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  rateLimit?: {
    requests: number;
    windowMs: number;
  };
  headers?: Record<string, string>;
  language?: 'en' | 'ms';
}

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
  retryableErrors: string[];
}

export interface RateLimiter {
  requests: Array<{ timestamp: number; id: string }>;
  maxRequests: number;
  windowMs: number;
}

export class ServiceEnhancer {
  private config: Required<ServiceConfig>;
  private rateLimiter: RateLimiter;
  private retryConfig: RetryConfig;
  
  constructor(config: ServiceConfig = {}) {
    this.config = {
      baseURL: config.baseURL || '',
      timeout: config.timeout || 10000,
      retries: config.retries || 3,
      retryDelay: config.retryDelay || 1000,
      rateLimit: config.rateLimit || { requests: 60, windowMs: 60000 },
      headers: config.headers || {},
      language: config.language || 'en',
    };

    this.rateLimiter = {
      requests: [],
      maxRequests: this.config.rateLimit.requests,
      windowMs: this.config.rateLimit.windowMs,
    };

    this.retryConfig = {
      maxRetries: this.config.retries,
      baseDelay: this.config.retryDelay,
      maxDelay: 30000,
      backoffFactor: 2,
      retryableErrors: ['NETWORK_ERROR', 'TIMEOUT', 'SERVER_ERROR', '503', '502', '500', '429'],
    };
  }

  /**
   * Enhanced fetch with retry logic, rate limiting, and error handling
   */
  async enhancedFetch<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<{ data?: T; error?: Error; status: number }> {
    const fullUrl = this.config.baseURL ? `${this.config.baseURL}${url}` : url;
    
    // Check rate limiting
    const rateLimitCheck = this.checkRateLimit();
    if (!rateLimitCheck.allowed) {
      return {
        error: new Error(this.getLocalizedMessage('rateLimitExceeded')),
        status: 429,
      };
    }

    // Add request to rate limiter
    this.addToRateLimit();

    // Enhanced options with timeout and headers
    const enhancedOptions: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': this.config.language,
        ...this.config.headers,
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.config.timeout),
    };

    return this.executeWithRetry(fullUrl, enhancedOptions);
  }

  /**
   * Execute request with retry logic
   */
  private async executeWithRetry<T>(
    url: string, 
    options: RequestInit, 
    attempt = 1
  ): Promise<{ data?: T; error?: Error; status: number }> {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const shouldRetry = this.shouldRetry(response.status, attempt);
        if (shouldRetry) {
          await this.delay(this.calculateDelay(attempt));
          return this.executeWithRetry(url, options, attempt + 1);
        }
        
        return {
          error: new Error(this.getLocalizedMessage('serverError')),
          status: response.status,
        };
      }

      const data = await response.json();
      return { data, status: response.status };
      
    } catch (error) {
      const shouldRetry = this.shouldRetryError(error as Error, attempt);
      if (shouldRetry) {
        await this.delay(this.calculateDelay(attempt));
        return this.executeWithRetry(url, options, attempt + 1);
      }
      
      return {
        error: this.enhanceError(error as Error),
        status: 0,
      };
    }
  }

  /**
   * Check if request should be retried based on status code
   */
  private shouldRetry(status: number, attempt: number): boolean {
    if (attempt >= this.retryConfig.maxRetries) return false;
    return this.retryConfig.retryableErrors.includes(status.toString());
  }

  /**
   * Check if request should be retried based on error
   */
  private shouldRetryError(error: Error, attempt: number): boolean {
    if (attempt >= this.retryConfig.maxRetries) return false;
    
    const errorMessage = error.message.toLowerCase();
    return this.retryConfig.retryableErrors.some(retryableError => 
      errorMessage.includes(retryableError.toLowerCase())
    );
  }

  /**
   * Calculate delay for retry with exponential backoff
   */
  private calculateDelay(attempt: number): number {
    const delay = this.retryConfig.baseDelay * Math.pow(this.retryConfig.backoffFactor, attempt - 1);
    return Math.min(delay, this.retryConfig.maxDelay);
  }

  /**
   * Check rate limiting
   */
  private checkRateLimit(): { allowed: boolean; resetTime?: number } {
    const now = Date.now();
    const windowStart = now - this.rateLimiter.windowMs;
    
    // Remove old requests
    this.rateLimiter.requests = this.rateLimiter.requests.filter(
      req => req.timestamp > windowStart
    );
    
    if (this.rateLimiter.requests.length >= this.rateLimiter.maxRequests) {
      const oldestRequest = this.rateLimiter.requests[0];
      const resetTime = oldestRequest.timestamp + this.rateLimiter.windowMs;
      return { allowed: false, resetTime };
    }
    
    return { allowed: true };
  }

  /**
   * Add request to rate limiter
   */
  private addToRateLimit(): void {
    this.rateLimiter.requests.push({
      timestamp: Date.now(),
      id: Math.random().toString(36).substr(2, 9),
    });
  }

  /**
   * Enhance error with additional context
   */
  private enhanceError(error: Error): Error {
    const enhancedError = new Error(this.getLocalizedMessage('networkError'));
    enhancedError.name = 'EnhancedServiceError';
    enhancedError.stack = error.stack;
    (enhancedError as any).originalError = error;
    return enhancedError;
  }

  /**
   * Get localized message
   */
  private getLocalizedMessage(key: string): string {
    const messages = {
      en: {
        networkError: 'Network error occurred. Please check your connection and try again.',
        serverError: 'Server error occurred. Please try again later.',
        rateLimitExceeded: 'Too many requests. Please wait before trying again.',
        timeout: 'Request timed out. Please try again.',
        unauthorized: 'Authentication required. Please log in and try again.',
        forbidden: 'Access denied. You don\'t have permission for this action.',
        notFound: 'Requested resource not found.',
        validationError: 'Invalid data provided. Please check your input.',
      },
      ms: {
        networkError: 'Ralat rangkaian berlaku. Sila semak sambungan anda dan cuba lagi.',
        serverError: 'Ralat pelayan berlaku. Sila cuba lagi kemudian.',
        rateLimitExceeded: 'Terlalu banyak permintaan. Sila tunggu sebelum cuba lagi.',
        timeout: 'Permintaan tamat masa. Sila cuba lagi.',
        unauthorized: 'Pengesahan diperlukan. Sila log masuk dan cuba lagi.',
        forbidden: 'Akses ditolak. Anda tidak mempunyai kebenaran untuk tindakan ini.',
        notFound: 'Sumber yang diminta tidak dijumpai.',
        validationError: 'Data tidak sah disediakan. Sila semak input anda.',
      },
    };

    return messages[this.config.language][key] || messages.en[key] || 'An error occurred';
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Create a cached version of the service
   */
  createCachedService<T>(
    cacheKey: string, 
    ttl: number = 300000 // 5 minutes default
  ) {
    const cache = new Map<string, { data: T; timestamp: number }>();

    return {
      get: async (url: string, options?: RequestInit): Promise<{ data?: T; error?: Error; status: number; fromCache?: boolean }> => {
        const key = `${cacheKey}_${url}_${JSON.stringify(options)}`;
        const cached = cache.get(key);
        
        if (cached && Date.now() - cached.timestamp < ttl) {
          return { data: cached.data, status: 200, fromCache: true };
        }
        
        const result = await this.enhancedFetch<T>(url, options);
        
        if (result.data && result.status === 200) {
          cache.set(key, { data: result.data, timestamp: Date.now() });
        }
        
        return result;
      },
      
      invalidate: (pattern?: string): void => {
        if (pattern) {
          const regex = new RegExp(pattern);
          for (const key of cache.keys()) {
            if (regex.test(key)) {
              cache.delete(key);
            }
          }
        } else {
          cache.clear();
        }
      },
      
      getCacheSize: (): number => cache.size,
    };
  }

  /**
   * Create a queued service for managing request order
   */
  createQueuedService() {
    const queue: Array<{
      url: string;
      options: RequestInit;
      resolve: (value: any) => void;
      reject: (error: Error) => void;
    }> = [];
    
    let processing = false;

    const processQueue = async () => {
      if (processing || queue.length === 0) return;
      
      processing = true;
      
      while (queue.length > 0) {
        const request = queue.shift()!;
        
        try {
          const result = await this.enhancedFetch(request.url, request.options);
          request.resolve(result);
        } catch (error) {
          request.reject(error as Error);
        }
        
        // Small delay between requests
        await this.delay(100);
      }
      
      processing = false;
    };

    return {
      enqueue: <T>(url: string, options?: RequestInit): Promise<{ data?: T; error?: Error; status: number }> => {
        return new Promise((resolve, reject) => {
          queue.push({ url, options: options || {}, resolve, reject });
          processQueue();
        });
      },
      
      getQueueLength: (): number => queue.length,
      isProcessing: (): boolean => processing,
    };
  }

  /**
   * Update service configuration
   */
  updateConfig(newConfig: Partial<ServiceConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (newConfig.rateLimit) {
      this.rateLimiter.maxRequests = newConfig.rateLimit.requests;
      this.rateLimiter.windowMs = newConfig.rateLimit.windowMs;
    }
  }

  /**
   * Get service statistics
   */
  getStats(): {
    requestsInWindow: number;
    rateLimitReset: number;
    averageResponseTime: number;
    totalRequests: number;
  } {
    const now = Date.now();
    const windowStart = now - this.rateLimiter.windowMs;
    const requestsInWindow = this.rateLimiter.requests.filter(
      req => req.timestamp > windowStart
    ).length;
    
    const rateLimitReset = this.rateLimiter.requests.length > 0
      ? this.rateLimiter.requests[0].timestamp + this.rateLimiter.windowMs
      : now;

    return {
      requestsInWindow,
      rateLimitReset,
      averageResponseTime: 0, // Would need to track this
      totalRequests: this.rateLimiter.requests.length,
    };
  }
}

// Default service instance
export const defaultService = new ServiceEnhancer();

// Convenience functions
export const createService = (config?: ServiceConfig) => new ServiceEnhancer(config);

export const enhancedFetch = <T>(url: string, options?: RequestInit) =>
  defaultService.enhancedFetch<T>(url, options);

// React hook for service usage
export const useEnhancedService = (config?: ServiceConfig) => {
  const serviceRef = React.useRef<ServiceEnhancer>();
  
  if (!serviceRef.current) {
    serviceRef.current = new ServiceEnhancer(config);
  }

  React.useEffect(() => {
    if (config) {
      serviceRef.current!.updateConfig(config);
    }
  }, [config]);

  return {
    fetch: <T>(url: string, options?: RequestInit) => 
      serviceRef.current!.enhancedFetch<T>(url, options),
    createCachedService: <T>(cacheKey: string, ttl?: number) =>
      serviceRef.current!.createCachedService<T>(cacheKey, ttl),
    createQueuedService: () => serviceRef.current!.createQueuedService(),
    getStats: () => serviceRef.current!.getStats(),
    updateConfig: (newConfig: Partial<ServiceConfig>) =>
      serviceRef.current!.updateConfig(newConfig),
  };
};

// React imports handled above