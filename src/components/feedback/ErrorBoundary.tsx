import React, { Component, ErrorInfo, ReactNode } from 'react';
import { errorHandler, getErrorMessage } from '../../utils/errorHandler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  componentName?: string;
  language?: 'en' | 'ms';
}

interface State {
  hasError: boolean;
  error?: Error;
  userFriendlyMessage?: string;
  retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error,
      userFriendlyMessage: getErrorMessage(error),
      retryCount: 0,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Use our centralized error handler
    errorHandler.handleError(error, {
      component: this.props.componentName || 'ErrorBoundary',
      action: 'componentDidCatch',
      metadata: {
        errorInfo,
        componentStack: errorInfo.componentStack,
        retryCount: this.state.retryCount,
      },
    });
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: undefined,
      userFriendlyMessage: undefined,
      retryCount: prevState.retryCount + 1,
    }));
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const userMessage = this.state.error 
        ? getErrorMessage(this.state.error, this.props.language || 'en')
        : 'Something went wrong';

      return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-status-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h1 className="text-heading-lg text-dark-100 mb-2">
              {this.props.language === 'ms' ? 'Sesuatu telah berlaku' : 'Something went wrong'}
            </h1>
            <p className="text-dark-300 mb-4">
              {userMessage}
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 bg-brand-electric text-dark-900 rounded-lg font-medium hover:bg-brand-electric/90 transition-colors"
              >
                {this.props.language === 'ms' ? 'Cuba Lagi' : 'Try Again'}
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-dark-700 text-dark-100 rounded-lg font-medium hover:bg-dark-600 transition-colors"
              >
                {this.props.language === 'ms' ? 'Muat Semula' : 'Refresh Page'}
              </button>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-dark-400 cursor-pointer text-sm">
                  Error Details (Dev Mode)
                </summary>
                <pre className="mt-2 p-3 bg-dark-800 rounded text-xs text-red-400 overflow-auto max-h-40">
                  {this.state.error.stack}
                </pre>
                {this.state.retryCount > 0 && (
                  <p className="mt-2 text-xs text-dark-400">
                    Retry attempts: {this.state.retryCount}
                  </p>
                )}
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
