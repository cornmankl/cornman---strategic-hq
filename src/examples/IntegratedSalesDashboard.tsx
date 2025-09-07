/**
 * Example integration of new utilities into an existing component
 * This demonstrates how to use the new error handling, performance monitoring,
 * optimized state management, and service utilities together
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ErrorBoundary } from '../components/feedback/ErrorBoundary';
import { errorHandler, getErrorMessage } from '../utils/errorHandler';
import { performanceMonitor, withPerformanceTracking } from '../utils/performanceMonitor';
import { useEnhancedService } from '../utils/serviceHelpers';
import { useAppSales, useOptimizedActions } from '../hooks/useOptimizedState';

// Example component showing integration of all utilities
const EnhancedSalesDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use optimized state management
  const { sales, totalRevenue, lastSale } = useAppSales();
  const { setSales, setLoading: setGlobalLoading, setError: setGlobalError } = useOptimizedActions();
  
  // Use enhanced service with rate limiting and retry logic
  const service = useEnhancedService({
    baseURL: '/api',
    rateLimit: { requests: 50, windowMs: 60000 },
    retries: 3,
    language: 'en'
  });

  // Load sales data with comprehensive error handling
  const loadSalesData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Record API call performance
      const startTime = performance.now();
      const { data, error: apiError } = await service.fetch<any[]>('/sales');
      const duration = performance.now() - startTime;
      
      performanceMonitor.recordApiCall('/sales', duration, apiError ? 500 : 200);
      
      if (apiError) {
        throw apiError;
      }
      
      setSales(data || []);
      
    } catch (err) {
      const error = err as Error;
      
      // Use centralized error handling
      await errorHandler.handleError(error, {
        component: 'EnhancedSalesDashboard',
        action: 'loadSalesData',
        metadata: { timestamp: Date.now() }
      });
      
      // Set user-friendly error message
      const userMessage = getErrorMessage(error, 'en');
      setError(userMessage);
      setGlobalError(userMessage);
      
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  }, [service, setSales, setGlobalLoading, setGlobalError]);

  // Monitor component performance
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const renderTime = performance.now() - startTime;
      performanceMonitor.recordRender('EnhancedSalesDashboard', renderTime);
    };
  });

  // Load data on mount
  useEffect(() => {
    loadSalesData();
  }, [loadSalesData]);

  // Handle retry with optimistic updates
  const handleRetry = useCallback(async () => {
    await loadSalesData();
  }, [loadSalesData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading sales data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-medium">Error Loading Sales Data</h3>
        <p className="text-red-600 mt-1">{error}</p>
        <button
          onClick={handleRetry}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Sales Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-blue-800 font-medium">Total Sales</h3>
            <p className="text-2xl font-bold text-blue-900">{sales.length}</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-green-800 font-medium">Total Revenue</h3>
            <p className="text-2xl font-bold text-green-900">${totalRevenue.toLocaleString()}</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="text-purple-800 font-medium">Last Sale</h3>
            <p className="text-sm text-purple-900">
              {lastSale ? `${lastSale.customer} - $${lastSale.amount}` : 'No sales yet'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Recent Sales</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.slice(0, 10).map((sale) => (
                <tr key={sale.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sale.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sale.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${sale.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(sale.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      sale.status === 'completed' ? 'bg-green-100 text-green-800' :
                      sale.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Wrap component with performance tracking
const PerformanceTrackedSalesDashboard = withPerformanceTracking(
  EnhancedSalesDashboard,
  'EnhancedSalesDashboard'
);

// Final component with error boundary
export const SalesDashboardWithErrorHandling: React.FC = () => {
  return (
    <ErrorBoundary 
      componentName="SalesDashboard"
      language="en"
      onError={(error, errorInfo) => {
        console.error('Sales Dashboard Error:', error, errorInfo);
      }}
    >
      <PerformanceTrackedSalesDashboard />
    </ErrorBoundary>
  );
};

// Performance monitoring hook example
export const usePerformanceDashboard = () => {
  const [metrics, setMetrics] = useState(performanceMonitor.getMetrics());
  
  useEffect(() => {
    return performanceMonitor.subscribe(setMetrics);
  }, []);
  
  return {
    metrics,
    summary: performanceMonitor.getPerformanceSummary(),
    startMonitoring: () => performanceMonitor.startMonitoring(),
    stopMonitoring: () => performanceMonitor.stopMonitoring(),
  };
};

// Service integration example
export const useApiService = () => {
  const service = useEnhancedService({
    baseURL: process.env.REACT_APP_API_URL || '/api',
    rateLimit: { requests: 100, windowMs: 60000 },
    retries: 3,
    timeout: 10000,
  });
  
  const cachedService = service.createCachedService('api-cache', 300000); // 5 min cache
  
  return {
    fetch: service.fetch,
    cachedFetch: cachedService.get,
    invalidateCache: cachedService.invalidate,
    getStats: service.getStats,
  };
};

export default SalesDashboardWithErrorHandling;