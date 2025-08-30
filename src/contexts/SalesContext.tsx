import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { api } from '../services/api';
import type { Sale } from '../types';

interface SalesState {
  sales: Sale[];
  loading: boolean;
  error: string | null;
}

interface SalesContextType extends SalesState {
  addSale: (sale: Omit<Sale, 'id'>) => Promise<void>;
  updateSale: (id: string, updates: Partial<Sale>) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
  getSalesByDateRange: (start: Date, end: Date) => Sale[];
  totalSales: number;
  dailyAverage: number;
  refreshSales: () => Promise<void>;
}

type SalesAction =
  | { type: 'SET_SALES'; payload: Sale[] }
  | { type: 'ADD_SALE'; payload: Sale }
  | { type: 'UPDATE_SALE'; payload: { id: string; updates: Partial<Sale> } }
  | { type: 'DELETE_SALE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: SalesState = {
  sales: [],
  loading: false,
  error: null,
};

const salesReducer = (state: SalesState, action: SalesAction): SalesState => {
  switch (action.type) {
    case 'SET_SALES':
      return { ...state, sales: action.payload, loading: false };
    case 'ADD_SALE':
      return { ...state, sales: [action.payload, ...state.sales] };
    case 'UPDATE_SALE':
      return {
        ...state,
        sales: state.sales.map(sale =>
          sale.id === action.payload.id ? { ...sale, ...action.payload.updates } : sale
        ),
      };
    case 'DELETE_SALE':
      return {
        ...state,
        sales: state.sales.filter(sale => sale.id !== action.payload),
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const SalesContext = createContext<SalesContextType | undefined>(undefined);

interface SalesProviderProps {
  children: React.ReactNode;
}

export const SalesProvider: React.FC<SalesProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(salesReducer, initialState);

  const refreshSales = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const sales = await api.getSales();
      dispatch({ type: 'SET_SALES', payload: sales });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch sales' });
    }
  }, []);

  const addSale = useCallback(async (saleData: Omit<Sale, 'id'>) => {
    try {
      const sale = await api.createSale(saleData);
      dispatch({ type: 'ADD_SALE', payload: sale });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add sale' });
    }
  }, []);

  const updateSale = useCallback(async (id: string, updates: Partial<Sale>) => {
    try {
      const updatedSale = await api.updateSale({ ...updates, id } as any);
      dispatch({ type: 'UPDATE_SALE', payload: { id, updates: updatedSale } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update sale' });
    }
  }, []);

  const deleteSale = useCallback(async (id: string) => {
    try {
      await api.deleteSale(id);
      dispatch({ type: 'DELETE_SALE', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete sale' });
    }
  }, []);

  const getSalesByDateRange = useCallback(
    (start: Date, end: Date): Sale[] => {
      return state.sales.filter(sale => {
        const saleDate = new Date(sale.createdAt);
        return saleDate >= start && saleDate <= end;
      });
    },
    [state.sales]
  );

  const totalSales = useMemo(() => state.sales.length, [state.sales]);
  
  const dailyAverage = useMemo(() => {
    if (state.sales.length === 0) return 0;
    
    // Calculate date range in days
    const dates = state.sales.map(sale => new Date(sale.createdAt));
    const minDate = new Date(Math.min(...dates.map(date => date.getTime())));
    const maxDate = new Date(Math.max(...dates.map(date => date.getTime())));
    const days = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;
    
    return state.sales.length / days;
  }, [state.sales]);

  const value = useMemo(
    () => ({
      ...state,
      addSale,
      updateSale,
      deleteSale,
      getSalesByDateRange,
      totalSales,
      dailyAverage,
      refreshSales,
    }),
    [state, addSale, updateSale, deleteSale, getSalesByDateRange, totalSales, dailyAverage, refreshSales]
  );

  return <SalesContext.Provider value={value}>{children}</SalesContext.Provider>;
};

export const useSales = (): SalesContextType => {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
};