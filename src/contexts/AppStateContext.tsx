import React, { createContext, useContext, useReducer, useCallback, useMemo, useEffect } from 'react';
import type { Sale, InventoryItem, Customer, Invoice, Project, ScheduledPost } from '../types';

// ============================================================================
// ADVANCED CONTEXT ENGINEERING - CORNMAN Strategic HQ
// ============================================================================

// State Interface with Advanced Typing
interface AppState {
  // Business Data
  sales: Sale[];
  inventory: InventoryItem[];
  customers: Customer[];
  invoices: Invoice[];
  projects: Project[];
  scheduledPosts: ScheduledPost[];
  
  // Metrics & Analytics
  totalRevenue: number;
  cogs: number;
  fixedExpenses: number;
  profit: number;
  monthlyGoal: number;
  
  // AI & System Status
  aiInsight: string;
  isBriefingLoading: boolean;
  isBotConnected: boolean;
  
  // Real-time & Performance
  lastUpdated: number;
  isRealTimeActive: boolean;
  pendingChanges: string[];
  
  // UI State
  activeView: string;
  sidebarCollapsed: boolean;
  notifications: AppNotification[];
}

interface AppNotification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actions?: Array<{
    label: string;
    action: string;
    variant?: 'primary' | 'secondary';
  }>;
}

// Advanced Action Types with Payload Discrimination
type AppAction =
  | { type: 'SALES_ADD'; payload: Sale }
  | { type: 'SALES_UPDATE'; payload: { id: string; updates: Partial<Sale> } }
  | { type: 'SALES_BULK_ADD'; payload: Sale[] }
  | { type: 'INVENTORY_UPDATE'; payload: { id: string; updates: Partial<InventoryItem> } }
  | { type: 'INVENTORY_RESTOCK'; payload: { id: string; quantity: number } }
  | { type: 'CUSTOMER_ADD'; payload: Customer }
  | { type: 'CUSTOMER_UPDATE'; payload: { id: string; updates: Partial<Customer> } }
  | { type: 'INVOICE_GENERATE'; payload: Invoice }
  | { type: 'PROJECT_ADD'; payload: Project }
  | { type: 'PROJECT_UPDATE_TASK'; payload: { projectId: string; taskId: string; completed: boolean } }
  | { type: 'POST_SCHEDULE'; payload: ScheduledPost }
  | { type: 'POST_UPDATE_STATUS'; payload: { id: string; status: ScheduledPost['status']; publishedAt?: string } }
  | { type: 'AI_INSIGHT_UPDATE'; payload: { insight: string; loading: boolean } }
  | { type: 'BOT_CONNECTION_TOGGLE'; payload: boolean }
  | { type: 'REVENUE_UPDATE'; payload: number }
  | { type: 'FINANCIAL_RECALCULATE' }
  | { type: 'NOTIFICATION_ADD'; payload: AppNotification }
  | { type: 'NOTIFICATION_MARK_READ'; payload: string }
  | { type: 'NOTIFICATION_DISMISS'; payload: string }
  | { type: 'UI_SET_ACTIVE_VIEW'; payload: string }
  | { type: 'UI_TOGGLE_SIDEBAR' }
  | { type: 'REALTIME_STATUS_UPDATE'; payload: boolean }
  | { type: 'PENDING_CHANGES_ADD'; payload: string }
  | { type: 'PENDING_CHANGES_CLEAR' }
  | { type: 'BULK_STATE_UPDATE'; payload: Partial<AppState> };

// Mock Initial Data
const MOCK_INITIAL_SALES: Sale[] = [
  { 
    id: 'sale-1', 
    product: 'CRNMN Signature', 
    amount: 12.90, 
    time: '10:30', 
    customerId: 'cust-1',
    items: [{ id: 'item1', name: 'CRNMN Signature', quantity: 1, price: 12.90 }],
    total: 12.90,
    createdAt: '2024-12-20T10:30:00Z',
    status: 'completed'
  },
  { 
    id: 'sale-2', 
    product: 'Spicy Sambal', 
    amount: 8.90, 
    time: '11:15', 
    customerId: 'cust-2',
    items: [{ id: 'item2', name: 'Spicy Sambal', quantity: 1, price: 8.90 }],
    total: 8.90,
    createdAt: '2024-12-20T11:15:00Z',
    status: 'completed'
  },
  { 
    id: 'sale-3', 
    product: 'Cheesy Cheeza', 
    amount: 10.90, 
    time: '12:00', 
    customerId: 'cust-3',
    items: [{ id: 'item3', name: 'Cheesy Cheeza', quantity: 1, price: 10.90 }],
    total: 10.90,
    createdAt: '2024-12-20T12:00:00Z',
    status: 'completed'
  },
];

const MOCK_INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'inv-1', name: 'Jagung Premium Grade A', stock: 45, threshold: 20, unit: 'kg', cost: 3.50, price: 8.90, category: 'Grains', supplier: 'Local Farm' },
  { id: 'inv-2', name: 'Cawan Kraft Eco-Friendly', stock: 120, threshold: 50, unit: 'pcs', cost: 0.80, price: 2.50, category: 'Packaging', supplier: 'Supply Co' },
  { id: 'inv-3', name: 'Minyak Masak Berkualiti', stock: 8, threshold: 10, unit: 'liter', cost: 8.50, price: 18.90, category: 'Cooking Oil', supplier: 'Oil Co' },
];

const MOCK_INITIAL_CUSTOMERS: Customer[] = [
  { id: 'cust-1', name: 'Ahmad Razak', phone: '+60123456789', lastSeen: '20/12/2024', totalSpent: 89.50 },
  { id: 'cust-2', name: 'Siti Aminah', phone: '+60198765432', lastSeen: '19/12/2024', totalSpent: 156.30 },
  { id: 'cust-3', name: 'Chen Wei Ming', phone: '+60167890123', lastSeen: '18/12/2024', totalSpent: 234.80 },
];

// Advanced Reducer with Performance Optimizations
const appReducer = (state: AppState, action: AppAction): AppState => {
  const timestamp = Date.now();
  
  switch (action.type) {
    case 'SALES_ADD':
      return {
        ...state,
        sales: [action.payload, ...state.sales].slice(0, 100), // Keep last 100 sales
        totalRevenue: state.totalRevenue + action.payload.amount,
        lastUpdated: timestamp,
        pendingChanges: [...state.pendingChanges, `Sale added: ${action.payload.product}`],
      };

    case 'SALES_UPDATE':
      return {
        ...state,
        sales: state.sales.map(sale =>
          sale.id === action.payload.id ? { ...sale, ...action.payload.updates } : sale
        ),
        lastUpdated: timestamp,
      };

    case 'SALES_BULK_ADD':
      const bulkRevenue = action.payload.reduce((sum, sale) => sum + sale.amount, 0);
      return {
        ...state,
        sales: [...action.payload, ...state.sales].slice(0, 100),
        totalRevenue: state.totalRevenue + bulkRevenue,
        lastUpdated: timestamp,
        pendingChanges: [...state.pendingChanges, `${action.payload.length} sales added`],
      };

    case 'INVENTORY_UPDATE':
      return {
        ...state,
        inventory: state.inventory.map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload.updates } : item
        ),
        lastUpdated: timestamp,
      };

    case 'INVENTORY_RESTOCK':
      return {
        ...state,
        inventory: state.inventory.map(item =>
          item.id === action.payload.id
            ? { ...item, stock: item.stock + action.payload.quantity }
            : item
        ),
        lastUpdated: timestamp,
        notifications: [
          ...state.notifications,
          {
            id: `restock-${timestamp}`,
            type: 'success',
            title: 'Inventory Restocked',
            message: `Added ${action.payload.quantity} units`,
            timestamp,
            read: false,
          }
        ],
      };

    case 'CUSTOMER_ADD':
      return {
        ...state,
        customers: [action.payload, ...state.customers],
        lastUpdated: timestamp,
        notifications: [
          ...state.notifications,
          {
            id: `customer-${timestamp}`,
            type: 'info',
            title: 'New Customer Added',
            message: `${action.payload.name} joined your customer base`,
            timestamp,
            read: false,
          }
        ],
      };

    case 'PROJECT_ADD':
      return {
        ...state,
        projects: [action.payload, ...state.projects],
        lastUpdated: timestamp,
      };

    case 'PROJECT_UPDATE_TASK':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.projectId
            ? {
                ...project,
                tasks: project.tasks.map(task =>
                  task.id === action.payload.taskId
                    ? { ...task, completed: action.payload.completed }
                    : task
                )
              }
            : project
        ),
        lastUpdated: timestamp,
      };

    case 'AI_INSIGHT_UPDATE':
      return {
        ...state,
        aiInsight: action.payload.insight,
        isBriefingLoading: action.payload.loading,
        lastUpdated: timestamp,
      };

    case 'FINANCIAL_RECALCULATE':
      const cogs = state.totalRevenue * 0.4;
      const profit = state.totalRevenue - cogs - state.fixedExpenses;
      return {
        ...state,
        cogs,
        profit,
        lastUpdated: timestamp,
      };

    case 'INVOICE_GENERATE':
      return {
        ...state,
        invoices: [action.payload, ...state.invoices].slice(0, 100),
        lastUpdated: timestamp,
      };

    case 'POST_SCHEDULE':
      return {
        ...state,
        scheduledPosts: [action.payload, ...state.scheduledPosts].slice(0, 100),
        lastUpdated: timestamp,
      };

    case 'POST_UPDATE_STATUS':
      return {
        ...state,
        scheduledPosts: state.scheduledPosts.map(post =>
          post.id === action.payload.id
            ? { ...post, status: action.payload.status, publishedAt: action.payload.publishedAt }
            : post
        ),
        lastUpdated: timestamp,
      };

    case 'NOTIFICATION_ADD':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications].slice(0, 50), // Keep last 50 notifications
      };

    case 'NOTIFICATION_MARK_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload ? { ...notif, read: true } : notif
        ),
      };

    case 'NOTIFICATION_DISMISS':
      return {
        ...state,
        notifications: state.notifications.filter(notif => notif.id !== action.payload),
      };

    case 'UI_SET_ACTIVE_VIEW':
      return {
        ...state,
        activeView: action.payload,
      };

    case 'UI_TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarCollapsed: !state.sidebarCollapsed,
      };

    case 'REALTIME_STATUS_UPDATE':
      return {
        ...state,
        isRealTimeActive: action.payload,
      };

    case 'PENDING_CHANGES_CLEAR':
      return {
        ...state,
        pendingChanges: [],
      };

    case 'BULK_STATE_UPDATE':
      return {
        ...state,
        ...action.payload,
        lastUpdated: timestamp,
      };

    default:
      return state;
  }
};

// Initial State with Calculated Values
const createInitialState = (): AppState => {
  const initialRevenue = MOCK_INITIAL_SALES.reduce((sum, sale) => sum + sale.amount, 0);
  const fixedExpenses = 1500;
  const cogs = initialRevenue * 0.4;
  const profit = initialRevenue - cogs - fixedExpenses;

  return {
    sales: MOCK_INITIAL_SALES,
    inventory: MOCK_INITIAL_INVENTORY,
    customers: MOCK_INITIAL_CUSTOMERS,
    invoices: [],
    projects: [],
    scheduledPosts: [],
    totalRevenue: initialRevenue,
    cogs,
    fixedExpenses,
    profit,
    monthlyGoal: 10000,
    aiInsight: '',
    isBriefingLoading: true,
    isBotConnected: false,
    lastUpdated: Date.now(),
    isRealTimeActive: false,
    pendingChanges: [],
    activeView: 'dashboard',
    sidebarCollapsed: false,
    notifications: [],
  };
};

// Context Type with Advanced Methods
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  
  // Business Operations
  addSale: (sale: Sale) => void;
  restockInventory: (itemId: string, quantity: number) => void;
  addCustomer: (customer: Customer) => void;
  generateInvoice: (sale: Sale) => void;
  schedulePost: (post: ScheduledPost) => void;
  
  // Project Management
  addProject: (project: Project) => void;
  toggleTask: (projectId: string, taskId: string) => void;
  
  // Analytics & Insights
  updateAIInsight: (insight: string, loading?: boolean) => void;
  recalculateFinancials: () => void;
  
  // Notifications
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp'>) => void;
  markNotificationRead: (id: string) => void;
  dismissNotification: (id: string) => void;
  
  // UI Management
  setActiveView: (view: string) => void;
  toggleSidebar: () => void;
  
  // Real-time Management
  setRealTimeStatus: (active: boolean) => void;
  clearPendingChanges: () => void;
  
  // Computed Values (Memoized)
  metrics: {
    totalCustomers: number;
    avgOrderValue: number;
    profitMargin: number;
    goalProgress: number;
    lowStockItems: InventoryItem[];
    unreadNotifications: number;
    recentSales: Sale[];
  };
}

// Create Context
const AppStateContext = createContext<AppContextType | undefined>(undefined);

// Provider Component with Advanced Features
interface AppStateProviderProps {
  children: React.ReactNode;
  initialData?: Partial<AppState>;
}

export const AppStateProvider: React.FC<AppStateProviderProps> = ({ 
  children, 
  initialData 
}) => {
  const [state, dispatch] = useReducer(appReducer, createInitialState());

  // Apply initial data if provided
  useEffect(() => {
    if (initialData) {
      dispatch({ type: 'BULK_STATE_UPDATE', payload: initialData });
    }
  }, [initialData]);

  // Business Operations - Memoized for Performance
  const addSale = useCallback((sale: Sale) => {
    dispatch({ type: 'SALES_ADD', payload: sale });
    dispatch({ type: 'FINANCIAL_RECALCULATE' });
  }, []);

  const restockInventory = useCallback((itemId: string, quantity: number) => {
    dispatch({ type: 'INVENTORY_RESTOCK', payload: { id: itemId, quantity } });
  }, []);

  const addCustomer = useCallback((customer: Customer) => {
    dispatch({ type: 'CUSTOMER_ADD', payload: customer });
  }, []);

  const generateInvoice = useCallback((sale: Sale) => {
    const customer = state.customers.find(c => c.id === sale.customerId);
    if (!customer) return;

    const invoice: Invoice = {
      id: `INV-${Date.now()}`,
      customerName: customer.name,
      amount: sale.amount,
      date: new Date().toLocaleDateString('en-GB'),
      status: Math.random() > 0.5 ? 'paid' : 'pending',
    };
    
    dispatch({ type: 'INVOICE_GENERATE', payload: invoice });
  }, [state.customers]);

  const schedulePost = useCallback((post: ScheduledPost) => {
    dispatch({ type: 'POST_SCHEDULE', payload: post });
  }, []);

  const addProject = useCallback((project: Project) => {
    dispatch({ type: 'PROJECT_ADD', payload: project });
  }, []);

  const toggleTask = useCallback((projectId: string, taskId: string) => {
    const project = state.projects.find(p => p.id === projectId);
    const task = project?.tasks.find(t => t.id === taskId);
    if (!task) return;

    dispatch({
      type: 'PROJECT_UPDATE_TASK',
      payload: { projectId, taskId, completed: !task.completed }
    });
  }, [state.projects]);

  const updateAIInsight = useCallback((insight: string, loading = false) => {
    dispatch({ type: 'AI_INSIGHT_UPDATE', payload: { insight, loading } });
  }, []);

  const recalculateFinancials = useCallback(() => {
    dispatch({ type: 'FINANCIAL_RECALCULATE' });
  }, []);

  const addNotification = useCallback((notification: Omit<AppNotification, 'id' | 'timestamp'>) => {
    const fullNotification: AppNotification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: Date.now(),
    };
    dispatch({ type: 'NOTIFICATION_ADD', payload: fullNotification });
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    dispatch({ type: 'NOTIFICATION_MARK_READ', payload: id });
  }, []);

  const dismissNotification = useCallback((id: string) => {
    dispatch({ type: 'NOTIFICATION_DISMISS', payload: id });
  }, []);

  const setActiveView = useCallback((view: string) => {
    dispatch({ type: 'UI_SET_ACTIVE_VIEW', payload: view });
  }, []);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'UI_TOGGLE_SIDEBAR' });
  }, []);

  const setRealTimeStatus = useCallback((active: boolean) => {
    dispatch({ type: 'REALTIME_STATUS_UPDATE', payload: active });
  }, []);

  const clearPendingChanges = useCallback(() => {
    dispatch({ type: 'PENDING_CHANGES_CLEAR' });
  }, []);

  // Computed Metrics - Heavily Memoized for Performance
  const metrics = useMemo(() => {
    const totalCustomers = state.customers.length;
    const avgOrderValue = state.sales.length > 0 
      ? state.totalRevenue / state.sales.length 
      : 0;
    const profitMargin = state.totalRevenue > 0 
      ? (state.profit / state.totalRevenue) * 100 
      : 0;
    const goalProgress = (state.totalRevenue / state.monthlyGoal) * 100;
    const lowStockItems = state.inventory.filter(item => item.stock <= item.threshold);
    const unreadNotifications = state.notifications.filter(n => !n.read).length;
    const recentSales = state.sales.slice(0, 10);

    return {
      totalCustomers,
      avgOrderValue,
      profitMargin,
      goalProgress,
      lowStockItems,
      unreadNotifications,
      recentSales,
    };
  }, [
    state.customers.length,
    state.totalRevenue,
    state.sales.length,
    state.profit,
    state.monthlyGoal,
    state.inventory,
    state.notifications,
    state.sales,
  ]);

  // Context Value - Memoized to Prevent Unnecessary Re-renders
  const contextValue = useMemo<AppContextType>(() => ({
    state,
    dispatch,
    addSale,
    restockInventory,
    addCustomer,
    generateInvoice,
    schedulePost,
    addProject,
    toggleTask,
    updateAIInsight,
    recalculateFinancials,
    addNotification,
    markNotificationRead,
    dismissNotification,
    setActiveView,
    toggleSidebar,
    setRealTimeStatus,
    clearPendingChanges,
    metrics,
  }), [
    state,
    addSale,
    restockInventory,
    addCustomer,
    generateInvoice,
    schedulePost,
    addProject,
    toggleTask,
    updateAIInsight,
    recalculateFinancials,
    addNotification,
    markNotificationRead,
    dismissNotification,
    setActiveView,
    toggleSidebar,
    setRealTimeStatus,
    clearPendingChanges,
    metrics,
  ]);

  return (
    <AppStateContext.Provider value={contextValue}>
      {children}
    </AppStateContext.Provider>
  );
};

// Custom Hook with Error Handling
export const useAppState = (): AppContextType => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

// Selective Hooks for Performance (Prevent Unnecessary Re-renders)
export const useAppMetrics = () => {
  const { metrics } = useAppState();
  return metrics;
};

export const useAppNotifications = () => {
  const { state, markNotificationRead, dismissNotification } = useAppState();
  return {
    notifications: state.notifications,
    unreadCount: state.notifications.filter(n => !n.read).length,
    markAsRead: markNotificationRead,
    dismiss: dismissNotification,
  };
};

export const useAppFinancials = () => {
  const { state, recalculateFinancials } = useAppState();
  return {
    totalRevenue: state.totalRevenue,
    cogs: state.cogs,
    profit: state.profit,
    expenses: state.fixedExpenses,
    goal: state.monthlyGoal,
    recalculate: recalculateFinancials,
  };
};

export const useAppUI = () => {
  const { state, setActiveView, toggleSidebar } = useAppState();
  return {
    activeView: state.activeView,
    sidebarCollapsed: state.sidebarCollapsed,
    setActiveView,
    toggleSidebar,
  };
};
