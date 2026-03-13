// ── Domain Types ──

export interface Transaction {
  date: Date;
  year: number;
  month: number;
  monthKey: string;
  amount: number;
  type: string;
  category: string;
  account: string;
  payee: string;
  paymentType: string;
  note: string;
  labels: string[];
  currency: string;
  rawAmount: number;
}

export interface Filters {
  periodMode: 'monthly' | 'yearly';
  selectedYear: number | null;
  selectedMonth: string | null;
  categoryFilter: string[];
  accountFilter: string[];
  excludeCategories: string[];
}

export interface WalletState {
  rawTransactions: Transaction[];
  filters: Filters;
  isLoading: boolean;
  error: string | null;
}

// ── Reducer Actions ──

export type WalletAction =
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PERIOD_MODE'; payload: 'monthly' | 'yearly' }
  | { type: 'SET_YEAR'; payload: number | null }
  | { type: 'SET_MONTH'; payload: string | null }
  | { type: 'SET_CATEGORY_FILTER'; payload: string[] }
  | { type: 'SET_ACCOUNT_FILTER'; payload: string[] }
  | { type: 'SET_EXCLUDE_CATEGORIES'; payload: string[] }
  | { type: 'CLEAR_DATA' };

// ── Context Types ──

export interface WalletContextValue extends WalletState {
  setTransactions: (txns: Transaction[]) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
  setPeriodMode: (m: 'monthly' | 'yearly') => void;
  setYear: (y: number | null) => void;
  setMonth: (m: string | null) => void;
  setCategoryFilter: (c: string[]) => void;
  setAccountFilter: (a: string[]) => void;
  setExcludeCategories: (c: string[]) => void;
  clearData: () => void;
}

export interface ColorModeContextValue {
  mode: 'light' | 'dark';
  toggleMode: () => void;
}

// ── Analytics Return Types ──

export interface Summary {
  totalIncome: number;
  totalExpense: number;
  net: number;
  avgDailySpend: number;
  transactionCount: number;
}

export interface PeriodData {
  period: string;
  income: number;
  expense: number;
}

export interface CategoryData {
  category: string;
  amount: number;
  count: number;
}

export interface SpendingTrendPoint {
  date: string;
  amount: number;
  cumulative: number;
}

export interface PaymentTypeData {
  paymentType: string;
  amount: number;
  count: number;
}

export interface TopPayee {
  payee: string;
  amount: number;
  count: number;
}

export interface AccountSummaryRow {
  account: string;
  income: number;
  expense: number;
  count: number;
  net: number;
}

export interface MonthlyAvgDaily {
  monthKey: string;
  avgDaily: number;
  total: number;
}

export interface DayOfWeekData {
  dayName: string;
  total: number;
  avg: number;
}

export interface SavingsRateData {
  monthKey: string;
  income: number;
  expense: number;
  savingsRate: number;
}

export interface MonthOverMonthData {
  monthKey: string;
  total: number;
  changePercent: number;
}

export interface HourlySpendingData {
  hour: number;
  label: string;
  total: number;
  avg: number;
  count: number;
}

export interface AvgSpendByCategoryData {
  category: string;
  total: number;
  count: number;
  avgSpend: number;
}

export interface WalletAnalytics {
  rawTransactions: Transaction[];
  filteredTransactions: Transaction[];
  availableYears: number[];
  availableMonths: string[];
  availableCategories: string[];
  availableAccounts: string[];
  summary: Summary;
  periodData: PeriodData[];
  categoryData: CategoryData[];
  spendingTrends: SpendingTrendPoint[];
  paymentTypeData: PaymentTypeData[];
  topPayees: TopPayee[];
  accountSummary: AccountSummaryRow[];
  monthlyAvgDailySpend: MonthlyAvgDaily[];
  dayOfWeekSpending: DayOfWeekData[];
  savingsRate: SavingsRateData[];
  monthOverMonth: MonthOverMonthData[];
  spendingByHour: HourlySpendingData[];
  avgSpendByCategory: AvgSpendByCategoryData[];
}

// ── Prediction Types ──

export interface SpendingProfile {
  categories: string[];
  avgMonthly: Record<string, number>;
  avgMonthlyIncome: number;
  historicalMonths: number;
  selectedYears: string[];
}

export interface PredictionMonth {
  monthKey: string;
  month: number;
  income: number;
  expense: number;
  net: number;
  avgDaily: number;
  [category: string]: string | number;
}

export interface PredictionResult {
  months: PredictionMonth[];
  totalExpense: number;
  totalIncome: number;
  totalNet: number;
  avgDailySpend: number;
}

// ── Chart Theme ──

export interface ChartTheme {
  tick: { fill: string; fontWeight: number };
  labelFill: string;
  labelFillSecondary: string;
  gridStroke: string;
  tooltipBg: string;
  tooltipBorder: string;
  refLineStroke: string;
}

// ── Component Props ──

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  height?: number;
  action?: React.ReactNode;
  expandedHeight?: number;
  expandedContent?: React.ReactNode;
  expanded?: boolean;
  onClose?: () => void;
}

export interface SidebarProps {
  open: boolean;
  onClose: () => void;
  activePage: string;
  onNavigate: (page: string) => void;
}

export interface AppHeaderProps {
  onMenuClick: () => void;
}
