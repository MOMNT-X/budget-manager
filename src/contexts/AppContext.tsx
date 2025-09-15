'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

// Types
interface WalletData {
  balance: number;
  subaccountCode: string;
  bankName: string;
  accountNumber: string;
}

interface Transaction {
  id: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'EXPENSE' | 'INCOME';
  description: string;
  reference: string;
  status: string;
  timestamp: string;
  categoryId?: string;
}

interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  spent: number;
  startDate: string;
  endDate: string;
  category?: Category;
}

interface Expense {
  id: string;
  amount: number;
  description: string;
  categoryId: string;
  timestamp: string;
  category?: Category;
}

interface DashboardSummary {
  userName: string;
  totalExpenses: number;
  monthlyBudget: number;
  remainingBudget: number;
  savingsGoal: number;
  currentSavings: number;
}

// App State Interface
interface AppState {
  // Data
  walletData: WalletData | null;
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  expenses: Expense[];
  dashboardSummary: DashboardSummary | null;
  
  // Loading states
  loading: {
    wallet: boolean;
    transactions: boolean;
    categories: boolean;
    budgets: boolean;
    expenses: boolean;
    dashboard: boolean;
    action: boolean;
  };
  
  // Data freshness tracking
  lastFetched: {
    wallet: number | null;
    transactions: number | null;
    categories: number | null;
    budgets: number | null;
    expenses: number | null;
    dashboard: number | null;
  };
  
  // Actions
  fetchWalletData: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchBudgets: () => Promise<void>;
  fetchExpenses: () => Promise<void>;
  fetchDashboardSummary: () => Promise<void>;
  refreshAll: () => Promise<void>;
  setActionLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppState | null>(null);

// Cache duration (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// Check if data is stale
const isDataStale = (lastFetched: number | null): boolean => {
  if (!lastFetched) return true;
  return Date.now() - lastFetched > CACHE_DURATION;
};

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null);

  const [loading, setLoading] = useState({
    wallet: false,
    transactions: false,
    categories: false,
    budgets: false,
    expenses: false,
    dashboard: false,
    action: false,
  });

  const [lastFetched, setLastFetched] = useState({
    wallet: null as number | null,
    transactions: null as number | null,
    categories: null as number | null,
    budgets: null as number | null,
    expenses: null as number | null,
    dashboard: null as number | null,
  });

  const updateLoading = (key: keyof typeof loading, value: boolean) => {
    setLoading(prev => ({ ...prev, [key]: value }));
  };

  const updateLastFetched = (key: keyof typeof lastFetched) => {
    setLastFetched(prev => ({ ...prev, [key]: Date.now() }));
  };
const api = 'http://localhost:3000'
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  });

  const fetchWalletData = async (force = false) => {
    if (!force && !isDataStale(lastFetched.wallet) && walletData) {
      return; // Use cached data
    }

    updateLoading('wallet', true);
    try {
      const response = await fetch(`${api}/wallet/balance`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch wallet balance');
      const data = await response.json();
      setWalletData(data);
      updateLastFetched('wallet');
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      if (force) toast.error("Failed to fetch wallet balance");
    } finally {
      updateLoading('wallet', false);
    }
  };

  const fetchTransactions = async (force = false) => {
    if (!force && !isDataStale(lastFetched.transactions) && transactions.length > 0) {
      return;
    }

    updateLoading('transactions', true);
    try {
      const response = await fetch(`${api}/transactions`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      setTransactions(data);
      updateLastFetched('transactions');
    } catch (error) {
      console.error('Error fetching transactions:', error);
      if (force) toast.error("Failed to fetch transactions");
    } finally {
      updateLoading('transactions', false);
    }
  };

  const fetchCategories = async (force = false) => {
    if (!force && !isDataStale(lastFetched.categories) && categories.length > 0) {
      return;
    }

    updateLoading('categories', true);
    try {
      const response = await fetch(`${api}/categories`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
      updateLastFetched('categories');
    } catch (error) {
      console.error('Error fetching categories:', error);
      if (force) toast.error("Failed to fetch categories");
    } finally {
      updateLoading('categories', false);
    }
  };

  const fetchBudgets = async (force = false) => {
    if (!force && !isDataStale(lastFetched.budgets) && budgets.length > 0) {
      return;
    }

    updateLoading('budgets', true);
    try {
      const response = await fetch(`${api}/budgets`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch budgets');
      const data = await response.json();
      setBudgets(data);
      updateLastFetched('budgets');
    } catch (error) {
      console.error('Error fetching budgets:', error);
      if (force) toast.error("Failed to fetch budgets");
    } finally {
      updateLoading('budgets', false);
    }
  };

  const fetchExpenses = async (force = false) => {
    if (!force && !isDataStale(lastFetched.expenses) && expenses.length > 0) {
      return;
    }

    updateLoading('expenses', true);
    try {
      const response = await fetch(`${api}/expenses`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch expenses');
      const data = await response.json();
      setExpenses(data);
      updateLastFetched('expenses');
    } catch (error) {
      console.error('Error fetching expenses:', error);
      if (force) toast.error("Failed to fetch expenses");
    } finally {
      updateLoading('expenses', false);
    }
  };

  const fetchDashboardSummary = async (force = false) => {
    if (!force && !isDataStale(lastFetched.dashboard) && dashboardSummary) {
      return;
    }

    updateLoading('dashboard', true);
    try {
      const response = await fetch(`${api}/dashboard/summary`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch dashboard summary');
      const data = await response.json();
      setDashboardSummary(data);
      updateLastFetched('dashboard');
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      if (force) toast.error("Failed to fetch dashboard summary");
    } finally {
      updateLoading('dashboard', false);
    }
  };

  const refreshAll = async () => {
    toast.promise(
      Promise.all([
        fetchWalletData(true),
        fetchTransactions(true),
        fetchCategories(true),
        fetchBudgets(true),
        fetchExpenses(true),
        fetchDashboardSummary(true),
      ]),
      {
        loading: 'Refreshing all data...',
        success: 'Data refreshed successfully!',
        error: 'Failed to refresh some data',
      }
    );
  };

  const setActionLoading = (loading: boolean) => {
    updateLoading('action', loading);
  };

  // Initial data fetch on mount
  useEffect(() => {
    const initializeApp = async () => {
      await Promise.all([
        fetchCategories(), // Fetch categories first as they're needed by other components
        fetchDashboardSummary(),
      ]);
    };

    initializeApp();
  }, []);

  const value: AppState = {
    // Data
    walletData,
    transactions,
    categories,
    budgets,
    expenses,
    dashboardSummary,
    
    // Loading states
    loading,
    lastFetched,
    
    // Actions
    fetchWalletData,
    fetchTransactions,
    fetchCategories,
    fetchBudgets,
    fetchExpenses,
    fetchDashboardSummary,
    refreshAll,
    setActionLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook to use the app context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}