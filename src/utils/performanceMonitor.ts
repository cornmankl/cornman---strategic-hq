import { useCallback, useMemo } from 'react';
import { useAppState } from '../contexts/AppStateContext';

// Performance budget definitions
const PERFORMANCE_BUDGETS = {
  renderTime: 16, // 60fps
  memoryUsage: 100, // MB
  bundleSize: 500, // KB
  apiResponseTime: 1000, // ms
  interactionTime: 100, // ms
};

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  apiResponseTime: number;
  interactionTime: number;
  timestamp: number;
}

interface PerformanceAlert {
  type: 'budget_exceeded' | 'memory_leak' | 'slow_render' | 'slow_api';
  metric: keyof PerformanceMetrics;
  value: number;
  budget: number;
  timestamp: number;
  severity: 'low' | 'medium' | 'high';
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];
  private alerts: PerformanceAlert[] = [];
  private observers: PerformanceObserver[] = [];

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  initialize() {
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.duration > PERFORMANCE_BUDGETS.renderTime) {
            this.addAlert({
              type: 'slow_render',
              metric: 'renderTime',
              value: entry.duration,
              budget: PERFORMANCE_BUDGETS.renderTime,
              timestamp: Date.now(),
              severity: entry.duration > 50 ? 'high' : 'medium',
            });
          }
        });
      });

      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.push(longTaskObserver);
      } catch (error) {
        console.warn('Long task monitoring not supported');
      }

      // Monitor navigation timing
      const navigationObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          const responseTime = entry.responseEnd - entry.responseStart;
          if (responseTime > PERFORMANCE_BUDGETS.apiResponseTime) {
            this.addAlert({
              type: 'slow_api',
              metric: 'apiResponseTime',
              value: responseTime,
              budget: PERFORMANCE_BUDGETS.apiResponseTime,
              timestamp: Date.now(),
              severity: responseTime > 3000 ? 'high' : 'medium',
            });
          }
        });
      });

      try {
        navigationObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navigationObserver);
      } catch (error) {
        console.warn('Navigation timing monitoring not supported');
      }
    }

    // Monitor memory usage
    this.startMemoryMonitoring();
  }

  private startMemoryMonitoring() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        const usedMemory = memory.usedJSHeapSize / 1024 / 1024; // MB

        this.addMetric({
          renderTime: 0,
          memoryUsage: usedMemory,
          apiResponseTime: 0,
          interactionTime: 0,
          timestamp: Date.now(),
        });

        if (usedMemory > PERFORMANCE_BUDGETS.memoryUsage) {
          this.addAlert({
            type: 'memory_leak',
            metric: 'memoryUsage',
            value: usedMemory,
            budget: PERFORMANCE_BUDGETS.memoryUsage,
            timestamp: Date.now(),
            severity: usedMemory > 200 ? 'high' : 'medium',
          });
        }
      }, 30000); // Check every 30 seconds
    }
  }

  addMetric(metric: PerformanceMetrics) {
    this.metrics.push(metric);
    
    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  addAlert(alert: PerformanceAlert) {
    this.alerts.push(alert);
    
    // Keep only last 50 alerts
    if (this.alerts.length > 50) {
      this.alerts = this.alerts.slice(-50);
    }

    // Log high severity alerts
    if (alert.severity === 'high') {
      console.warn(`🚨 Performance Alert: ${alert.type}`, alert);
    }

    // Report to analytics in production
    if (import.meta.env.PROD) {
      this.reportAlert(alert);
    }
  }

  private async reportAlert(alert: PerformanceAlert) {
    try {
      const endpoint = import.meta.env.VITE_PERFORMANCE_MONITORING_ENDPOINT;
      if (!endpoint) return;

      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alert),
      });
    } catch (error) {
      console.warn('Failed to report performance alert:', error);
    }
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  getAlerts(): PerformanceAlert[] {
    return [...this.alerts];
  }

  clearAlerts() {
    this.alerts = [];
  }

  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Hook for performance monitoring with budgets
export const usePerformanceWithBudgets = (customBudgets?: Partial<typeof PERFORMANCE_BUDGETS>) => {
  const budgets = useMemo(() => ({
    ...PERFORMANCE_BUDGETS,
    ...customBudgets,
  }), [customBudgets]);

  const measureWithBudget = useCallback((name: string, operation: () => void) => {
    const startTime = performance.now();
    operation();
    const duration = performance.now() - startTime;

    if (duration > budgets.renderTime) {
      PerformanceMonitor.getInstance().addAlert({
        type: 'budget_exceeded',
        metric: 'renderTime',
        value: duration,
        budget: budgets.renderTime,
        timestamp: Date.now(),
        severity: duration > budgets.renderTime * 2 ? 'high' : 'medium',
      });
    }

    return duration;
  }, [budgets]);

  const measureAsyncWithBudget = useCallback(async (name: string, operation: () => Promise<any>) => {
    const startTime = performance.now();
    const result = await operation();
    const duration = performance.now() - startTime;

    if (duration > budgets.apiResponseTime) {
      PerformanceMonitor.getInstance().addAlert({
        type: 'budget_exceeded',
        metric: 'apiResponseTime',
        value: duration,
        budget: budgets.apiResponseTime,
        timestamp: Date.now(),
        severity: duration > budgets.apiResponseTime * 2 ? 'high' : 'medium',
      });
    }

    return { result, duration };
  }, [budgets]);

  return {
    measureWithBudget,
    measureAsyncWithBudget,
    budgets,
  };
};

// Hook for real-time performance monitoring
export const useRealTimePerformance = () => {
  const monitor = useMemo(() => PerformanceMonitor.getInstance(), []);

  const metrics = useMemo(() => {
    const allMetrics = monitor.getMetrics();
    const latest = allMetrics[allMetrics.length - 1];

    if (!latest) {
      return {
        fps: 60,
        memoryUsage: 0,
        renderTime: 0,
        apiResponseTime: 0,
      };
    }

    // Calculate FPS from render time
    const fps = Math.min(60, Math.round(1000 / Math.max(latest.renderTime, 16)));

    return {
      fps,
      memoryUsage: latest.memoryUsage,
      renderTime: latest.renderTime,
      apiResponseTime: latest.apiResponseTime,
    };
  }, [monitor]);

  const alerts = useMemo(() => monitor.getAlerts(), [monitor]);

  const clearAlerts = useCallback(() => {
    monitor.clearAlerts();
  }, [monitor]);

  return {
    metrics,
    alerts,
    clearAlerts,
  };
};

// Hook for optimizing expensive operations
export const useOptimizedOperation = <T>(
  operation: () => T,
  dependencies: any[],
  options: {
    cache?: boolean;
    measurePerformance?: boolean;
    budget?: number;
  } = {}
) => {
  const { measureWithBudget } = usePerformanceWithBudgets();
  
  return useMemo(() => {
    if (options.measurePerformance) {
      return measureWithBudget('optimized-operation', operation);
    }
    return operation();
  }, dependencies);
};

// Initialize performance monitoring
export const initializePerformanceMonitoring = () => {
  PerformanceMonitor.getInstance().initialize();
};

export default PerformanceMonitor;