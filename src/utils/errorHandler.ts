/**
 * Centralized Error Handler
 * Provides production-ready error handling with automatic recovery mechanisms
 */

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  timestamp?: number;
  metadata?: Record<string, unknown>;
}

export interface ErrorReport {
  error: Error;
  context: ErrorContext;
  id: string;
  reportedAt: number;
}

export type ErrorLevel = 'info' | 'warning' | 'error' | 'critical';

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorReports: ErrorReport[] = [];
  private maxReports = 100;
  private retryAttempts = new Map<string, number>();
  private maxRetries = 3;

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Handle an error with context and attempt recovery
   */
  async handleError(error: Error, context: ErrorContext = {}): Promise<void> {
    const errorId = this.generateErrorId();
    const enhancedContext = {
      ...context,
      timestamp: Date.now(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };

    const errorReport: ErrorReport = {
      error,
      context: enhancedContext,
      id: errorId,
      reportedAt: Date.now(),
    };

    // Store error report
    this.storeErrorReport(errorReport);

    // Log error
    this.logError(errorReport);

    // Attempt recovery
    await this.attemptRecovery(error, enhancedContext);

    // Report to external service in production
    if (import.meta.env.PROD) {
      await this.reportToService(errorReport);
    }
  }

  /**
   * Get user-friendly error message with multi-language support
   */
  getUserFriendlyMessage(error: Error, language: 'en' | 'ms' = 'en'): string {
    const errorType = this.classifyError(error);
    
    const messages = {
      en: {
        network: 'Connection problem. Please check your internet connection and try again.',
        validation: 'Please check your input and try again.',
        auth: 'Please log in again to continue.',
        permission: 'You don\'t have permission to perform this action.',
        notFound: 'The requested item was not found.',
        server: 'Server error. Please try again later.',
        unknown: 'Something went wrong. Please try again.',
      },
      ms: {
        network: 'Masalah sambungan. Sila semak sambungan internet anda dan cuba lagi.',
        validation: 'Sila semak input anda dan cuba lagi.',
        auth: 'Sila log masuk semula untuk meneruskan.',
        permission: 'Anda tidak mempunyai kebenaran untuk melakukan tindakan ini.',
        notFound: 'Item yang diminta tidak dijumpai.',
        server: 'Ralat pelayan. Sila cuba lagi kemudian.',
        unknown: 'Sesuatu telah berlaku. Sila cuba lagi.',
      },
    };

    return messages[language][errorType] || messages[language].unknown;
  }

  /**
   * Attempt automatic recovery based on error type
   */
  private async attemptRecovery(error: Error, context: ErrorContext): Promise<void> {
    const errorType = this.classifyError(error);
    const retryKey = `${context.component}-${context.action}`;
    const currentRetries = this.retryAttempts.get(retryKey) || 0;

    if (currentRetries >= this.maxRetries) {
      console.warn(`Max retries reached for ${retryKey}`);
      return;
    }

    switch (errorType) {
      case 'network':
        await this.retryWithBackoff(retryKey, currentRetries);
        break;
      case 'auth':
        await this.handleAuthError();
        break;
      case 'validation':
        // No automatic recovery for validation errors
        break;
      default:
        if (currentRetries < 2) {
          await this.retryWithBackoff(retryKey, currentRetries);
        }
    }
  }

  /**
   * Classify error type for appropriate handling
   */
  private classifyError(error: Error): string {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
      return 'network';
    }
    if (message.includes('unauthorized') || message.includes('auth')) {
      return 'auth';
    }
    if (message.includes('permission') || message.includes('forbidden')) {
      return 'permission';
    }
    if (message.includes('not found') || message.includes('404')) {
      return 'notFound';
    }
    if (message.includes('validation') || message.includes('invalid')) {
      return 'validation';
    }
    if (message.includes('server') || message.includes('500') || message.includes('503')) {
      return 'server';
    }
    
    return 'unknown';
  }

  /**
   * Retry with exponential backoff
   */
  private async retryWithBackoff(retryKey: string, currentRetries: number): Promise<void> {
    const delay = Math.pow(2, currentRetries) * 1000; // 1s, 2s, 4s, ...
    this.retryAttempts.set(retryKey, currentRetries + 1);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Clear retry count after successful operation
    setTimeout(() => {
      this.retryAttempts.delete(retryKey);
    }, 60000); // Clear after 1 minute
  }

  /**
   * Handle authentication errors
   */
  private async handleAuthError(): Promise<void> {
    try {
      // Attempt to refresh token or redirect to login
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (currentPath !== '/login') {
          sessionStorage.setItem('redirectAfterLogin', currentPath);
        }
      }
    } catch (error) {
      console.warn('Failed to handle auth error:', error);
    }
  }

  /**
   * Log error to console with appropriate level
   */
  private logError(errorReport: ErrorReport): void {
    const level = this.getErrorLevel(errorReport.error);
    const logMessage = `[${level.toUpperCase()}] ${errorReport.error.message}`;
    
    switch (level) {
      case 'critical':
      case 'error':
        console.error(logMessage, errorReport);
        break;
      case 'warning':
        console.warn(logMessage, errorReport);
        break;
      default:
        console.info(logMessage, errorReport);
    }
  }

  /**
   * Determine error level based on error characteristics
   */
  private getErrorLevel(error: Error): ErrorLevel {
    const message = error.message.toLowerCase();
    
    if (message.includes('critical') || message.includes('fatal')) {
      return 'critical';
    }
    if (message.includes('error') || error.name === 'Error') {
      return 'error';
    }
    if (message.includes('warning') || message.includes('deprecated')) {
      return 'warning';
    }
    
    return 'info';
  }

  /**
   * Store error report in memory (with rotation)
   */
  private storeErrorReport(errorReport: ErrorReport): void {
    this.errorReports.unshift(errorReport);
    
    if (this.errorReports.length > this.maxReports) {
      this.errorReports = this.errorReports.slice(0, this.maxReports);
    }
  }

  /**
   * Report error to external service
   */
  private async reportToService(errorReport: ErrorReport): Promise<void> {
    try {
      const endpoint = import.meta.env.VITE_ERROR_REPORTING_ENDPOINT;
      if (!endpoint) return;

      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: {
            message: errorReport.error.message,
            stack: errorReport.error.stack,
            name: errorReport.error.name,
          },
          context: errorReport.context,
          id: errorReport.id,
          timestamp: errorReport.reportedAt,
        }),
      });
    } catch (error) {
      console.warn('Failed to report error to service:', error);
    }
  }

  /**
   * Generate unique error ID
   */
  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get error reports for debugging
   */
  getErrorReports(): ErrorReport[] {
    return [...this.errorReports];
  }

  /**
   * Clear error reports
   */
  clearErrorReports(): void {
    this.errorReports = [];
    this.retryAttempts.clear();
  }
}

// Singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Convenience function for quick error handling
export const handleError = (error: Error, context?: ErrorContext) => {
  return errorHandler.handleError(error, context);
};

// Convenience function for user-friendly messages
export const getErrorMessage = (error: Error, language?: 'en' | 'ms') => {
  return errorHandler.getUserFriendlyMessage(error, language);
};