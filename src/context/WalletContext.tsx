import { createContext, useContext, useReducer, useMemo, useCallback, type ReactNode } from 'react';
import type { Transaction, Filters, WalletState, WalletAction, WalletContextValue, WalletAnalytics } from '../types';
import {
  computeSummary,
  groupByPeriod,
  groupByCategory,
  computeSpendingTrends,
  groupByPaymentType,
  computeTopPayees,
  computeAccountSummary,
  getAvailableYears,
  getAvailableMonths,
  getAvailableCategories,
  getAvailableAccounts,
  computeMonthlyAvgDailySpend,
  computeDayOfWeekSpending,
  computeSavingsRate,
  computeMonthOverMonth,
  computeSpendingByHour,
  computeAvgSpendByCategory,
} from '../utils/analytics';

const WalletContext = createContext<WalletContextValue | null>(null);

const initialState: WalletState = {
  rawTransactions: [],
  filters: {
    periodMode: 'monthly',
    selectedYear: null,
    selectedMonth: null,
    categoryFilter: [],
    accountFilter: [],
    excludeCategories: [],
  },
  isLoading: false,
  error: null,
};

function reducer(state: WalletState, action: WalletAction): WalletState {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        rawTransactions: action.payload,
        isLoading: false,
        error: null,
        filters: {
          ...initialState.filters,
          selectedYear: getLatestYear(action.payload),
        },
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_PERIOD_MODE':
      return {
        ...state,
        filters: { ...state.filters, periodMode: action.payload, selectedMonth: null },
      };
    case 'SET_YEAR':
      return {
        ...state,
        filters: { ...state.filters, selectedYear: action.payload, selectedMonth: null },
      };
    case 'SET_MONTH':
      return { ...state, filters: { ...state.filters, selectedMonth: action.payload } };
    case 'SET_CATEGORY_FILTER':
      return { ...state, filters: { ...state.filters, categoryFilter: action.payload } };
    case 'SET_ACCOUNT_FILTER':
      return { ...state, filters: { ...state.filters, accountFilter: action.payload } };
    case 'SET_EXCLUDE_CATEGORIES':
      return { ...state, filters: { ...state.filters, excludeCategories: action.payload } };
    case 'CLEAR_DATA':
      return initialState;
    default:
      return state;
  }
}

function getLatestYear(transactions: Transaction[]): number | null {
  if (!transactions.length) return null;
  return Math.max(...transactions.map((t) => t.year));
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setTransactions = useCallback((txns: Transaction[]) => {
    dispatch({ type: 'SET_TRANSACTIONS', payload: txns });
  }, []);
  const setLoading = useCallback((v: boolean) => dispatch({ type: 'SET_LOADING', payload: v }), []);
  const setError = useCallback((e: string | null) => dispatch({ type: 'SET_ERROR', payload: e }), []);
  const setPeriodMode = useCallback((m: 'monthly' | 'yearly') => dispatch({ type: 'SET_PERIOD_MODE', payload: m }), []);
  const setYear = useCallback((y: number | null) => dispatch({ type: 'SET_YEAR', payload: y }), []);
  const setMonth = useCallback((m: string | null) => dispatch({ type: 'SET_MONTH', payload: m }), []);
  const setCategoryFilter = useCallback(
    (c: string[]) => dispatch({ type: 'SET_CATEGORY_FILTER', payload: c }),
    []
  );
  const setAccountFilter = useCallback(
    (a: string[]) => dispatch({ type: 'SET_ACCOUNT_FILTER', payload: a }),
    []
  );
  const setExcludeCategories = useCallback(
    (c: string[]) => dispatch({ type: 'SET_EXCLUDE_CATEGORIES', payload: c }),
    []
  );
  const clearData = useCallback(() => dispatch({ type: 'CLEAR_DATA' }), []);

  const value = useMemo(
    () => ({
      ...state,
      setTransactions,
      setLoading,
      setError,
      setPeriodMode,
      setYear,
      setMonth,
      setCategoryFilter,
      setAccountFilter,
      setExcludeCategories,
      clearData,
    }),
    [
      state,
      setTransactions,
      setLoading,
      setError,
      setPeriodMode,
      setYear,
      setMonth,
      setCategoryFilter,
      setAccountFilter,
      setExcludeCategories,
      clearData,
    ]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}

export function useWalletAnalytics(): WalletAnalytics {
  const { rawTransactions, filters } = useWallet();

  const filteredTransactions = useMemo(() => {
    let txns = rawTransactions;
    if (filters.selectedYear) {
      txns = txns.filter((t) => t.year === filters.selectedYear);
    }
    if (filters.selectedMonth) {
      txns = txns.filter((t) => t.monthKey === filters.selectedMonth);
    }
    if (filters.categoryFilter.length > 0) {
      txns = txns.filter((t) => filters.categoryFilter.includes(t.category));
    }
    if (filters.accountFilter.length > 0) {
      txns = txns.filter((t) => filters.accountFilter.includes(t.account));
    }
    if (filters.excludeCategories.length > 0) {
      txns = txns.filter((t) => !filters.excludeCategories.includes(t.category));
    }
    return txns;
  }, [rawTransactions, filters]);

  const availableYears = useMemo(() => getAvailableYears(rawTransactions), [rawTransactions]);
  const availableMonths = useMemo(
    () => getAvailableMonths(rawTransactions, filters.selectedYear),
    [rawTransactions, filters.selectedYear]
  );
  const availableCategories = useMemo(
    () => getAvailableCategories(rawTransactions),
    [rawTransactions]
  );
  const availableAccounts = useMemo(
    () => getAvailableAccounts(rawTransactions),
    [rawTransactions]
  );

  const summary = useMemo(() => computeSummary(filteredTransactions), [filteredTransactions]);
  const periodData = useMemo(
    () => groupByPeriod(filteredTransactions, filters.periodMode),
    [filteredTransactions, filters.periodMode]
  );
  const categoryData = useMemo(
    () => groupByCategory(filteredTransactions),
    [filteredTransactions]
  );
  const spendingTrends = useMemo(
    () => computeSpendingTrends(filteredTransactions),
    [filteredTransactions]
  );
  const paymentTypeData = useMemo(
    () => groupByPaymentType(filteredTransactions),
    [filteredTransactions]
  );
  const topPayees = useMemo(() => computeTopPayees(filteredTransactions), [filteredTransactions]);
  const accountSummary = useMemo(
    () => computeAccountSummary(filteredTransactions),
    [filteredTransactions]
  );
  const monthlyAvgDailySpend = useMemo(
    () => computeMonthlyAvgDailySpend(filteredTransactions),
    [filteredTransactions]
  );
  const dayOfWeekSpending = useMemo(
    () => computeDayOfWeekSpending(filteredTransactions),
    [filteredTransactions]
  );
  const savingsRate = useMemo(
    () => computeSavingsRate(filteredTransactions),
    [filteredTransactions]
  );
  const monthOverMonth = useMemo(
    () => computeMonthOverMonth(filteredTransactions),
    [filteredTransactions]
  );
  const spendingByHour = useMemo(
    () => computeSpendingByHour(filteredTransactions),
    [filteredTransactions]
  );
  const avgSpendByCategory = useMemo(
    () => computeAvgSpendByCategory(filteredTransactions),
    [filteredTransactions]
  );

  return {
    rawTransactions,
    filteredTransactions,
    availableYears,
    availableMonths,
    availableCategories,
    availableAccounts,
    summary,
    periodData,
    categoryData,
    spendingTrends,
    paymentTypeData,
    topPayees,
    accountSummary,
    monthlyAvgDailySpend,
    dayOfWeekSpending,
    savingsRate,
    monthOverMonth,
    spendingByHour,
    avgSpendByCategory,
  };
}
