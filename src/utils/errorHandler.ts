import { useState, useCallback, useRef, useEffect } from 'react';

interface ErrorContext {
  type: 'network' | 'auth' | 'state' | 'component' | 'api';
  operation?: string;
  stateKey?: string;
  errorInfo?: any;
  timestamp?: number;
  retryable?: boolean;
}

interface ErrorLog {
  id: string;
  error: Error;
  context: ErrorContext;
  timestamp: number;
  resolved: boolean;
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLogs: ErrorLog[] = [];
  private onErrorCallback?: (error: Error, context: ErrorContext) => void;

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  setErrorCallback(callback: (error: Error, context: ErrorContext) => void) {
    this.onErrorCallback = callback;
  }

  async handleError(error: Error, context: ErrorContext): Promise<void> {
    const errorLog: ErrorLog = {
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      error,
      context: {
        ...context,
        timestamp: Date.now(),
      },
      timestamp: Date.now(),
      resolved: false,
    };

    this.errorLogs.push(errorLog);

    // Log error
    console.error('Application Error:', error, context);

    // Notify callback
    this.onErrorCallback?.(error, context);

    // Report to external service in production
    if (import.meta.env.PROD) {
      await this.reportError(error, context);
    }

    // Attempt recovery if possible
    if (context.retryable !== false) {
      await this.attemptRecovery(error, context);
    }
  }

  private async reportError(error: Error, context: ErrorContext): Promise<void> {
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
            message: error.message,
            stack: error.stack,
            name: error.name,
          },
          context,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          url: window.location.href,
          appVersion: import.meta.env.VITE_APP_VERSION || 'unknown',
        }),
      });
    } catch (reportingError) {
      console.warn('Failed to report error:', reportingError);
    }
  }

  private async attemptRecovery(error: Error, context: ErrorContext): Promise<void> {
    try {
      switch (context.type) {
        case 'network':
          await this.retryNetworkOperation(context);
          break;
        case 'auth':
          await this.refreshAuth(context);
          break;
        case 'state':
          await this.resetState(context);
          break;
        case 'api':
          await this.retryApiOperation(context);
          break;
        default:
          // No specific recovery available
          break;
      }
    } catch (recoveryError) {
      console.warn('Recovery attempt failed:', recoveryError);
    }
  }

  private async retryNetworkOperation(context: ErrorContext): Promise<void> {
    if (context.operation && navigator.onLine) {
      // Implement retry logic
      console.log('Retrying network operation:', context.operation);
    }
  }

  private async refreshAuth(context: ErrorContext): Promise<void> {
    // Attempt to refresh authentication
    console.log('Attempting auth refresh');
    // Implementation would depend on auth provider
  }

  private async resetState(context: ErrorContext): Promise<void> {
    if (context.stateKey) {
      // Reset specific state
      console.log('Resetting state:', context.stateKey);
      localStorage.removeItem(`app-state-${context.stateKey}`);
    }
  }

  private async retryApiOperation(context: ErrorContext): Promise<void> {
    if (context.operation) {
      // Implement API retry with exponential backoff
      console.log('Retrying API operation:', context.operation);
    }
  }

  getErrorLogs(): ErrorLog[] {
    return [...this.errorLogs];
  }

  clearErrorLogs(): void {
    this.errorLogs = [];
  }

  markErrorResolved(errorId: string): void {
    const errorLog = this.errorLogs.find(log => log.id === errorId);
    if (errorLog) {
      errorLog.resolved = true;
    }
  }
}

// Hook for error handling
export const useErrorHandler = () => {
  const [error, setError] = useState<Error | null>(null);
  const [errorHistory, setErrorHistory] = useState<ErrorLog[]>([]);
  const errorHandler = useRef(ErrorHandler.getInstance());

  useEffect(() => {
    const handler = errorHandler.current;
    handler.setErrorCallback((error, context) => {
      setError(error);
      setErrorHistory(handler.getErrorLogs());
    });
  }, []);

  const handleError = useCallback(async (error: Error, context: ErrorContext) => {
    await errorHandler.current.handleError(error, context);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearHistory = useCallback(() => {
    errorHandler.current.clearErrorLogs();
    setErrorHistory([]);
  }, []);

  const resolveError = useCallback((errorId: string) => {
    errorHandler.current.markErrorResolved(errorId);
    setErrorHistory(errorHandler.current.getErrorLogs());
  }, []);

  return {
    error,
    errorHistory,
    handleError,
    clearError,
    clearHistory,
    resolveError,
  };
};

// Hook for handling async operations with error recovery
export const useAsyncOperation = <T,>(
  operation: () => Promise<T>,
  context: Partial<ErrorContext> = {}
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);
  const { handleError } = useErrorHandler();

  const execute = useCallback(async (...args: any[]) => {
    setLoading(true);
    setError(null);

    try {
      const result = await operation();
      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      
      await handleError(error, {
        type: 'api',
        retryable: true,
        ...context,
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, [operation, context, handleError]);

  const retry = useCallback(async () => {
    return execute();
  }, [execute]);

  return {
    loading,
    error,
    data,
    execute,
    retry,
  };
};

// Utility function for wrapping functions with error handling
export const withErrorHandling = <T extends (...args: any[]) => any>(
  fn: T,
  context: Partial<ErrorContext> = {}
): T => {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      await ErrorHandler.getInstance().handleError(
        error instanceof Error ? error : new Error(String(error)),
        {
          type: 'component',
          retryable: false,
          ...context,
        }
      );
      throw error;
    }
  }) as T;
};

export default ErrorHandler;