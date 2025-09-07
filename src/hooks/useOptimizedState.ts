import { useCallback, useMemo, useRef } from 'react';
import { useAppState } from '../contexts/AppStateContext';

// Selective state subscriptions to prevent unnecessary re-renders
export const useAppSales = () => {
  const { state } = useAppState();
  const previousSales = useRef(state.sales);
  
  return useMemo(() => {
    if (previousSales.current !== state.sales) {
      previousSales.current = state.sales;
    }
    return {
      sales: state.sales,
      totalRevenue: state.totalRevenue,
      lastSale: state.sales[0] || null,
      salesCount: state.sales.length,
    };
  }, [state.sales, state.totalRevenue]);
};

export const useAppInventory = () => {
  const { state } = useAppState();
  const previousInventory = useRef(state.inventory);
  
  return useMemo(() => {
    if (previousInventory.current !== state.inventory) {
      previousInventory.current = state.inventory;
    }
    
    const lowStockItems = state.inventory.filter(item => item.stock <= item.threshold);
    const outOfStockItems = state.inventory.filter(item => item.stock === 0);
    const totalValue = state.inventory.reduce((sum, item) => sum + (item.stock * item.cost), 0);
    
    return {
      inventory: state.inventory,
      lowStockItems,
      outOfStockItems,
      totalValue,
      itemCount: state.inventory.length,
    };
  }, [state.inventory]);
};

export const useAppCustomers = () => {
  const { state } = useAppState();
  const previousCustomers = useRef(state.customers);
  
  return useMemo(() => {
    if (previousCustomers.current !== state.customers) {
      previousCustomers.current = state.customers;
    }
    
    return {
      customers: state.customers,
      customerCount: state.customers.length,
      recentCustomers: state.customers.slice(0, 5),
    };
  }, [state.customers]);
};

export const useAppFinancials = () => {
  const { state } = useAppState();
  
  return useMemo(() => {
    const grossProfit = state.totalRevenue - state.cogs;
    const netProfit = grossProfit - state.fixedExpenses;
    const profitMargin = state.totalRevenue > 0 ? (netProfit / state.totalRevenue) * 100 : 0;
    const goalProgress = state.monthlyGoal > 0 ? (state.totalRevenue / state.monthlyGoal) * 100 : 0;
    
    return {
      totalRevenue: state.totalRevenue,
      cogs: state.cogs,
      fixedExpenses: state.fixedExpenses,
      grossProfit,
      netProfit,
      profitMargin,
      monthlyGoal: state.monthlyGoal,
      goalProgress,
    };
  }, [state.totalRevenue, state.cogs, state.fixedExpenses, state.monthlyGoal]);
};

export const useAppNotifications = () => {
  const { state } = useAppState();
  
  return useMemo(() => {
    const unreadCount = state.notifications.filter(n => !n.read).length;
    const recentNotifications = state.notifications
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);
    
    return {
      notifications: state.notifications,
      unreadCount,
      recentNotifications,
    };
  }, [state.notifications]);
};

// Optimized actions with batching
export const useAppActions = () => {
  const { addSale, updateInventory, addCustomer, dispatch } = useAppState();
  
  const batchedDispatch = useCallback((actions: Array<{ type: string; payload: any }>) => {
    // Batch multiple state updates
    actions.forEach(action => {
      dispatch(action);
    });
  }, [dispatch]);
  
  const addSaleWithInventoryUpdate = useCallback(async (saleData: any, inventoryUpdates: any[]) => {
    const actions = [
      { type: 'SALES_ADD', payload: saleData },
      ...inventoryUpdates.map(update => ({ type: 'INVENTORY_UPDATE', payload: update }))
    ];
    batchedDispatch(actions);
  }, [batchedDispatch]);
  
  const bulkInventoryUpdate = useCallback((updates: any[]) => {
    const actions = updates.map(update => ({ type: 'INVENTORY_UPDATE', payload: update }));
    batchedDispatch(actions);
  }, [batchedDispatch]);
  
  return {
    addSale,
    updateInventory,
    addCustomer,
    addSaleWithInventoryUpdate,
    bulkInventoryUpdate,
    batchedDispatch,
  };
};

// Performance-optimized state slice hook
export const useAppStateSlice = <T>(
  selector: (state: any) => T,
  equalityFn?: (a: T, b: T) => boolean
) => {
  const { state } = useAppState();
  const selectedState = useRef<T>();
  
  return useMemo(() => {
    const newState = selector(state);
    
    if (equalityFn) {
      if (!selectedState.current || !equalityFn(selectedState.current, newState)) {
        selectedState.current = newState;
      }
      return selectedState.current;
    } else {
      if (selectedState.current !== newState) {
        selectedState.current = newState;
      }
      return selectedState.current;
    }
  }, [state, selector, equalityFn]);
};

// Computed metrics with memoization
export const useComputedMetrics = () => {
  const { state } = useAppState();
  
  return useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().toISOString().slice(0, 7);
    
    // Today's metrics
    const todaySales = state.sales.filter(sale => 
      sale.date && sale.date.startsWith(today)
    );
    const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.amount, 0);
    
    // This month's metrics
    const monthSales = state.sales.filter(sale => 
      sale.date && sale.date.startsWith(thisMonth)
    );
    const monthRevenue = monthSales.reduce((sum, sale) => sum + sale.amount, 0);
    
    // Average order value
    const avgOrderValue = state.sales.length > 0 
      ? state.totalRevenue / state.sales.length 
      : 0;
    
    // Growth calculations (simplified)
    const growthRate = monthRevenue > 0 ? 
      ((todayRevenue - (monthRevenue / new Date().getDate())) / (monthRevenue / new Date().getDate())) * 100 
      : 0;
    
    // Best selling products (from sales data)
    const productSales = state.sales.reduce((acc, sale) => {
      const productName = (sale as any).productName || 'Unknown Product';
      acc[productName] = (acc[productName] || 0) + sale.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const bestSellingProducts = Object.entries(productSales)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, revenue]) => ({ name, revenue }));
    
    return {
      todayRevenue,
      monthRevenue,
      avgOrderValue,
      growthRate,
      bestSellingProducts,
      salesCount: {
        today: todaySales.length,
        month: monthSales.length,
        total: state.sales.length,
      },
    };
  }, [state.sales, state.totalRevenue]);
};

// Real-time dashboard data hook
export const useDashboardData = () => {
  const sales = useAppSales();
  const inventory = useAppInventory();
  const customers = useAppCustomers();
  const financials = useAppFinancials();
  const notifications = useAppNotifications();
  const metrics = useComputedMetrics();
  
  return useMemo(() => ({
    sales,
    inventory,
    customers,
    financials,
    notifications,
    metrics,
    lastUpdated: Date.now(),
  }), [sales, inventory, customers, financials, notifications, metrics]);
};