/**
 * Optimized State Management Hooks
 * Selective state subscription hooks to prevent unnecessary re-renders
 */

import React, { useMemo, useRef, useEffect, useCallback } from 'react';

// Base types for state management
export interface AppState {
  sales: Sale[];
  inventory: InventoryItem[];
  customers: Customer[];
  projects: Project[];
  analytics: AnalyticsData;
  totalRevenue: number;
  loading: boolean;
  error: string | null;
}

export interface Sale {
  id: string;
  amount: number;
  date: string;
  customer: string;
  product: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category: string;
  lowStock: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  totalPurchases: number;
  lastPurchase: string;
}

export interface Project {
  id: string;
  name: string;
  status: 'planning' | 'in-progress' | 'completed';
  progress: number;
  deadline: string;
}

export interface AnalyticsData {
  totalSales: number;
  totalCustomers: number;
  averageOrderValue: number;
  conversionRate: number;
  topProducts: Array<{ name: string; sales: number }>;
}

// Context for state management
export interface AppStateContextType {
  state: AppState;
  dispatch: React.Dispatch<AppStateAction>;
}

export type AppStateAction = 
  | { type: 'SET_SALES'; payload: Sale[] }
  | { type: 'ADD_SALE'; payload: Sale }
  | { type: 'UPDATE_SALE'; payload: { id: string; updates: Partial<Sale> } }
  | { type: 'SET_INVENTORY'; payload: InventoryItem[] }
  | { type: 'UPDATE_INVENTORY'; payload: { id: string; updates: Partial<InventoryItem> } }
  | { type: 'SET_CUSTOMERS'; payload: Customer[] }
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'UPDATE_PROJECT'; payload: { id: string; updates: Partial<Project> } }
  | { type: 'SET_ANALYTICS'; payload: AnalyticsData }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Hook for selective state subscription
export function useSelector<T>(
  selector: (state: AppState) => T,
  equalityFn?: (a: T, b: T) => boolean
): T {
  const { state } = useAppState();
  const selectedRef = useRef<T>();
  const equalityRef = useRef(equalityFn);

  // Update equality function
  equalityRef.current = equalityFn;

  return useMemo(() => {
    const selected = selector(state);
    
    // Use custom equality function or shallow comparison
    if (equalityRef.current) {
      if (selectedRef.current !== undefined && equalityRef.current(selectedRef.current, selected)) {
        return selectedRef.current;
      }
    } else if (selectedRef.current === selected) {
      return selectedRef.current;
    }
    
    selectedRef.current = selected;
    return selected;
  }, [state, selector]);
}

// Optimized sales hook
export const useAppSales = () => {
  return useSelector(
    useCallback((state: AppState) => ({
      sales: state.sales,
      totalRevenue: state.totalRevenue,
      lastSale: state.sales[0] || null,
      salesCount: state.sales.length,
      pendingSales: state.sales.filter(sale => sale.status === 'pending'),
    }), []),
    (a, b) => 
      a.sales.length === b.sales.length &&
      a.totalRevenue === b.totalRevenue &&
      a.lastSale?.id === b.lastSale?.id
  );
};

// Optimized inventory hook
export const useAppInventory = () => {
  return useSelector(
    useCallback((state: AppState) => ({
      inventory: state.inventory,
      lowStockItems: state.inventory.filter(item => item.lowStock),
      totalItems: state.inventory.reduce((sum, item) => sum + item.quantity, 0),
      totalValue: state.inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0),
    }), []),
    (a, b) => 
      a.inventory.length === b.inventory.length &&
      a.lowStockItems.length === b.lowStockItems.length &&
      a.totalItems === b.totalItems &&
      a.totalValue === b.totalValue
  );
};

// Optimized customers hook
export const useAppCustomers = () => {
  return useSelector(
    useCallback((state: AppState) => ({
      customers: state.customers,
      totalCustomers: state.customers.length,
      topCustomers: state.customers
        .sort((a, b) => b.totalPurchases - a.totalPurchases)
        .slice(0, 5),
      averageCustomerValue: state.customers.length > 0
        ? state.customers.reduce((sum, customer) => sum + customer.totalPurchases, 0) / state.customers.length
        : 0,
    }), []),
    (a, b) => 
      a.customers.length === b.customers.length &&
      a.topCustomers.length === b.topCustomers.length &&
      a.averageCustomerValue === b.averageCustomerValue
  );
};

// Optimized projects hook
export const useAppProjects = () => {
  return useSelector(
    useCallback((state: AppState) => ({
      projects: state.projects,
      activeProjects: state.projects.filter(project => project.status === 'in-progress'),
      completedProjects: state.projects.filter(project => project.status === 'completed'),
      overallProgress: state.projects.length > 0
        ? state.projects.reduce((sum, project) => sum + project.progress, 0) / state.projects.length
        : 0,
    }), []),
    (a, b) => 
      a.projects.length === b.projects.length &&
      a.activeProjects.length === b.activeProjects.length &&
      a.completedProjects.length === b.completedProjects.length &&
      a.overallProgress === b.overallProgress
  );
};

// Optimized analytics hook
export const useAppAnalytics = () => {
  return useSelector(
    useCallback((state: AppState) => ({
      analytics: state.analytics,
      loading: state.loading,
      error: state.error,
    }), []),
    (a, b) => 
      a.analytics === b.analytics &&
      a.loading === b.loading &&
      a.error === b.error
  );
};

// Hook for loading and error states
export const useAppStatus = () => {
  return useSelector(
    useCallback((state: AppState) => ({
      loading: state.loading,
      error: state.error,
      hasData: state.sales.length > 0 || state.inventory.length > 0 || state.customers.length > 0,
    }), []),
    (a, b) => 
      a.loading === b.loading &&
      a.error === b.error &&
      a.hasData === b.hasData
  );
};

// Memoized action creators to prevent unnecessary re-renders
export const useOptimizedActions = () => {
  const { dispatch } = useAppState();

  return useMemo(() => ({
    setSales: (sales: Sale[]) => dispatch({ type: 'SET_SALES', payload: sales }),
    addSale: (sale: Sale) => dispatch({ type: 'ADD_SALE', payload: sale }),
    updateSale: (id: string, updates: Partial<Sale>) => 
      dispatch({ type: 'UPDATE_SALE', payload: { id, updates } }),
    
    setInventory: (inventory: InventoryItem[]) => 
      dispatch({ type: 'SET_INVENTORY', payload: inventory }),
    updateInventory: (id: string, updates: Partial<InventoryItem>) =>
      dispatch({ type: 'UPDATE_INVENTORY', payload: { id, updates } }),
    
    setCustomers: (customers: Customer[]) => 
      dispatch({ type: 'SET_CUSTOMERS', payload: customers }),
    addCustomer: (customer: Customer) => 
      dispatch({ type: 'ADD_CUSTOMER', payload: customer }),
    
    setProjects: (projects: Project[]) => 
      dispatch({ type: 'SET_PROJECTS', payload: projects }),
    updateProject: (id: string, updates: Partial<Project>) =>
      dispatch({ type: 'UPDATE_PROJECT', payload: { id, updates } }),
    
    setAnalytics: (analytics: AnalyticsData) => 
      dispatch({ type: 'SET_ANALYTICS', payload: analytics }),
    setLoading: (loading: boolean) => 
      dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error: string | null) => 
      dispatch({ type: 'SET_ERROR', payload: error }),
  }), [dispatch]);
};

// Debounced state updates to prevent rapid re-renders
export const useDebouncedActions = (delay = 300) => {
  const actions = useOptimizedActions();
  const timeoutRef = useRef<Record<string, NodeJS.Timeout>>({});

  const debouncedActions = useMemo(() => {
    const createDebouncedAction = <T extends unknown[]>(
      action: (...args: T) => void,
      key: string
    ) => {
      return (...args: T) => {
        if (timeoutRef.current[key]) {
          clearTimeout(timeoutRef.current[key]);
        }
        
        timeoutRef.current[key] = setTimeout(() => {
          action(...args);
          delete timeoutRef.current[key];
        }, delay);
      };
    };

    return {
      setSales: createDebouncedAction(actions.setSales, 'setSales'),
      setInventory: createDebouncedAction(actions.setInventory, 'setInventory'),
      setCustomers: createDebouncedAction(actions.setCustomers, 'setCustomers'),
      setProjects: createDebouncedAction(actions.setProjects, 'setProjects'),
      setAnalytics: createDebouncedAction(actions.setAnalytics, 'setAnalytics'),
      // Non-debounced actions for immediate updates
      addSale: actions.addSale,
      updateSale: actions.updateSale,
      updateInventory: actions.updateInventory,
      addCustomer: actions.addCustomer,
      updateProject: actions.updateProject,
      setLoading: actions.setLoading,
      setError: actions.setError,
    };
  }, [actions, delay]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(timeoutRef.current).forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  return debouncedActions;
};

// Batched updates for multiple state changes
export const useBatchedUpdates = () => {
  const actions = useOptimizedActions();
  const batchRef = useRef<Array<() => void>>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const addToBatch = useCallback((action: () => void) => {
    batchRef.current.push(action);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      // Execute all batched actions
      batchRef.current.forEach(action => action());
      batchRef.current = [];
    }, 16); // Next animation frame
  }, []);

  const batchedActions = useMemo(() => ({
    setSales: (sales: Sale[]) => addToBatch(() => actions.setSales(sales)),
    setInventory: (inventory: InventoryItem[]) => addToBatch(() => actions.setInventory(inventory)),
    setCustomers: (customers: Customer[]) => addToBatch(() => actions.setCustomers(customers)),
    setProjects: (projects: Project[]) => addToBatch(() => actions.setProjects(projects)),
    setAnalytics: (analytics: AnalyticsData) => addToBatch(() => actions.setAnalytics(analytics)),
    
    // Immediate actions
    addSale: actions.addSale,
    updateSale: actions.updateSale,
    updateInventory: actions.updateInventory,
    addCustomer: actions.addCustomer,
    updateProject: actions.updateProject,
    setLoading: actions.setLoading,
    setError: actions.setError,
    
    // Manual flush
    flush: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        batchRef.current.forEach(action => action());
        batchRef.current = [];
      }
    },
  }), [actions, addToBatch]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return batchedActions;
};

// Placeholder for useAppState hook (should be imported from context)
function useAppState(): AppStateContextType {
  throw new Error('useAppState must be imported from AppStateContext');
}