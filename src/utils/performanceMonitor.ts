/**
 * Performance Monitoring & Optimization
 * Real-time performance monitoring with configurable budgets
 */

import React from 'react';

export interface PerformanceBudgets {
  renderTime: number; // milliseconds
  memoryUsage: number; // MB
  apiResponseTime: number; // milliseconds
  bundleSize: number; // KB
  fps: number; // frames per second
}

export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  apiCalls: Array<{
    url: string;
    duration: number;
    timestamp: number;
    status: number;
  }>;
  componentPerformance: Record<string, {
    renders: number;
    totalTime: number;
    avgTime: number;
    slowest: number;
  }>;
  fps: number;
  violations: Array<{
    type: string;
    threshold: number;
    actual: number;
    timestamp: number;
  }>;
}

export const PERFORMANCE_BUDGETS: PerformanceBudgets = {
  renderTime: 16, // 60fps
  memoryUsage: 100, // 100MB
  apiResponseTime: 1000, // 1 second
  bundleSize: 500, // 500KB
  fps: 60,
};

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private isMonitoring = false;
  private metrics: PerformanceMetrics = {
    renderTime: 0,
    memoryUsage: 0,
    apiCalls: [],
    componentPerformance: {},
    fps: 0,
    violations: [],
  };
  private budgets: PerformanceBudgets = { ...PERFORMANCE_BUDGETS };
  private observers: Array<(metrics: PerformanceMetrics) => void> = [];
  private memoryLeakDetector?: ReturnType<typeof setInterval>;
  private fpsCounter?: {
    lastTime: number;
    frames: number;
    fps: number;
  };

  private constructor() {
    this.setupPerformanceObserver();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Start performance monitoring
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.setupMemoryLeakDetection();
    this.setupFPSMonitoring();
    this.notifyObservers();
  }

  /**
   * Stop performance monitoring
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
    
    if (this.memoryLeakDetector) {
      clearInterval(this.memoryLeakDetector);
      this.memoryLeakDetector = undefined;
    }
    
    this.fpsCounter = undefined;
    this.notifyObservers();
  }

  /**
   * Record component render time
   */
  recordRender(componentName: string, duration: number): void {
    if (!this.isMonitoring) return;

    const existing = this.metrics.componentPerformance[componentName] || {
      renders: 0,
      totalTime: 0,
      avgTime: 0,
      slowest: 0,
    };

    const updated = {
      renders: existing.renders + 1,
      totalTime: existing.totalTime + duration,
      avgTime: (existing.totalTime + duration) / (existing.renders + 1),
      slowest: Math.max(existing.slowest, duration),
    };

    this.metrics.componentPerformance[componentName] = updated;
    this.metrics.renderTime = duration;

    // Check render time budget
    if (duration > this.budgets.renderTime) {
      this.recordViolation('renderTime', this.budgets.renderTime, duration);
    }

    this.notifyObservers();
  }

  /**
   * Record API call performance
   */
  recordApiCall(url: string, duration: number, status: number): void {
    if (!this.isMonitoring) return;

    const apiCall = {
      url,
      duration,
      timestamp: Date.now(),
      status,
    };

    this.metrics.apiCalls.unshift(apiCall);
    
    // Keep only last 100 API calls
    if (this.metrics.apiCalls.length > 100) {
      this.metrics.apiCalls = this.metrics.apiCalls.slice(0, 100);
    }

    // Check API response time budget
    if (duration > this.budgets.apiResponseTime) {
      this.recordViolation('apiResponseTime', this.budgets.apiResponseTime, duration);
    }

    this.notifyObservers();
  }

  /**
   * Get current memory usage
   */
  getCurrentMemoryUsage(): number {
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / (1024 * 1024); // Convert to MB
    }
    return 0;
  }

  /**
   * Detect memory leaks
   */
  private setupMemoryLeakDetection(): void {
    this.memoryLeakDetector = setInterval(() => {
      const memoryUsage = this.getCurrentMemoryUsage();
      this.metrics.memoryUsage = memoryUsage;

      // Check memory usage budget
      if (memoryUsage > this.budgets.memoryUsage) {
        this.recordViolation('memoryUsage', this.budgets.memoryUsage, memoryUsage);
      }

      this.notifyObservers();
    }, 5000); // Check every 5 seconds
  }

  /**
   * Monitor FPS
   */
  private setupFPSMonitoring(): void {
    this.fpsCounter = {
      lastTime: performance.now(),
      frames: 0,
      fps: 0,
    };

    const countFPS = (timestamp: number) => {
      if (!this.fpsCounter || !this.isMonitoring) return;

      this.fpsCounter.frames++;
      const elapsed = timestamp - this.fpsCounter.lastTime;

      if (elapsed >= 1000) { // Update every second
        this.fpsCounter.fps = Math.round((this.fpsCounter.frames * 1000) / elapsed);
        this.metrics.fps = this.fpsCounter.fps;

        // Check FPS budget
        if (this.fpsCounter.fps < this.budgets.fps) {
          this.recordViolation('fps', this.budgets.fps, this.fpsCounter.fps);
        }

        this.fpsCounter.frames = 0;
        this.fpsCounter.lastTime = timestamp;
        this.notifyObservers();
      }

      requestAnimationFrame(countFPS);
    };

    requestAnimationFrame(countFPS);
  }

  /**
   * Setup performance observer for additional metrics
   */
  private setupPerformanceObserver(): void {
    if (typeof PerformanceObserver === 'undefined') return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            // Track page load performance
            const navEntry = entry as PerformanceNavigationTiming;
            console.log('Page Load Time:', navEntry.loadEventEnd - navEntry.navigationStart);
          } else if (entry.entryType === 'paint') {
            // Track paint metrics
            console.log(`${entry.name}:`, entry.startTime);
          }
        });
      });

      observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }
  }

  /**
   * Record performance budget violation
   */
  private recordViolation(type: string, threshold: number, actual: number): void {
    const violation = {
      type,
      threshold,
      actual,
      timestamp: Date.now(),
    };

    this.metrics.violations.unshift(violation);
    
    // Keep only last 50 violations
    if (this.metrics.violations.length > 50) {
      this.metrics.violations = this.metrics.violations.slice(0, 50);
    }

    // Log critical violations
    if (actual > threshold * 2) {
      console.warn(`Critical performance violation: ${type}`, violation);
    }
  }

  /**
   * Update performance budgets
   */
  updateBudgets(newBudgets: Partial<PerformanceBudgets>): void {
    this.budgets = { ...this.budgets, ...newBudgets };
  }

  /**
   * Get current metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): {
    isHealthy: boolean;
    violations: number;
    slowestComponent: string | null;
    averageApiTime: number;
    memoryTrend: 'increasing' | 'stable' | 'decreasing';
  } {
    const violations = this.metrics.violations.length;
    const isHealthy = violations === 0;

    let slowestComponent: string | null = null;
    let maxTime = 0;
    
    Object.entries(this.metrics.componentPerformance).forEach(([name, stats]) => {
      if (stats.avgTime > maxTime) {
        maxTime = stats.avgTime;
        slowestComponent = name;
      }
    });

    const recentApiCalls = this.metrics.apiCalls.slice(0, 10);
    const averageApiTime = recentApiCalls.length > 0
      ? recentApiCalls.reduce((sum, call) => sum + call.duration, 0) / recentApiCalls.length
      : 0;

    // Simple memory trend analysis
    const recentViolations = this.metrics.violations
      .filter(v => v.type === 'memoryUsage' && Date.now() - v.timestamp < 60000);
    const memoryTrend = recentViolations.length > 3 ? 'increasing' : 'stable';

    return {
      isHealthy,
      violations,
      slowestComponent,
      averageApiTime,
      memoryTrend,
    };
  }

  /**
   * Subscribe to performance updates
   */
  subscribe(callback: (metrics: PerformanceMetrics) => void): () => void {
    this.observers.push(callback);
    
    return () => {
      const index = this.observers.indexOf(callback);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  /**
   * Notify observers of metric changes
   */
  private notifyObservers(): void {
    this.observers.forEach(callback => {
      try {
        callback(this.metrics);
      } catch (error) {
        console.warn('Error in performance observer callback:', error);
      }
    });
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = {
      renderTime: 0,
      memoryUsage: 0,
      apiCalls: [],
      componentPerformance: {},
      fps: 0,
      violations: [],
    };
    this.notifyObservers();
  }

  /**
   * Export metrics for reporting
   */
  exportMetrics(): string {
    return JSON.stringify({
      ...this.metrics,
      summary: this.getPerformanceSummary(),
      budgets: this.budgets,
      timestamp: Date.now(),
    }, null, 2);
  }
}

// Singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// React hook for performance monitoring
export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>(performanceMonitor.getMetrics());

  React.useEffect(() => {
    return performanceMonitor.subscribe(setMetrics);
  }, []);

  return {
    metrics,
    summary: performanceMonitor.getPerformanceSummary(),
    startMonitoring: () => performanceMonitor.startMonitoring(),
    stopMonitoring: () => performanceMonitor.stopMonitoring(),
    recordRender: (component: string, duration: number) => 
      performanceMonitor.recordRender(component, duration),
    recordApiCall: (url: string, duration: number, status: number) =>
      performanceMonitor.recordApiCall(url, duration, status),
  };
};

// HOC for component performance tracking
export function withPerformanceTracking<P extends {}>(
  Component: React.ComponentType<P>,
  componentName?: string
) {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => {
    const name = componentName || Component.displayName || Component.name || 'Unknown';
    const startTime = React.useRef<number>();

    React.useLayoutEffect(() => {
      startTime.current = performance.now();
    });

    React.useEffect(() => {
      if (startTime.current) {
        const duration = performance.now() - startTime.current;
        performanceMonitor.recordRender(name, duration);
      }
    });

    return React.createElement(Component, { ...props, ref });
  });

  WrappedComponent.displayName = `withPerformanceTracking(${componentName || Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// React imports handled above