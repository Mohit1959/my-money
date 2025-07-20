import {
  Account,
  Transaction,
  CashbookEntry,
  Investment,
  InvestmentTransaction,
  FinancialSummary,
  BalanceSheet,
  IncomeStatement,
  Category,
  FinancialYear,
} from './financial';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth API types
export interface LoginRequest {
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
}

export interface AuthSession {
  isAuthenticated: boolean;
  expiresAt: number;
}

// Transaction API types
export interface CreateTransactionRequest {
  date: string;
  description: string;
  reference?: string;
  entries: {
    accountId: string;
    debit: number;
    credit: number;
  }[];
  category?: string;
}

export interface UpdateTransactionRequest
  extends Partial<CreateTransactionRequest> {
  id: string;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  accountId?: string;
  category?: string;
  description?: string;
  financialYear?: string;
}

// Account API types
export interface CreateAccountRequest {
  name: string;
  type: 'asset' | 'liability' | 'income' | 'expense' | 'equity';
  subType: string;
  initialBalance?: number;
}

export interface UpdateAccountRequest extends Partial<CreateAccountRequest> {
  id: string;
  isActive?: boolean;
}

// Cashbook API types
export interface CreateCashbookEntryRequest {
  date: string;
  description: string;
  bankAccount: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  category: string;
  reference?: string;
}

export interface UpdateCashbookEntryRequest
  extends Partial<CreateCashbookEntryRequest> {
  id: string;
  reconciled?: boolean;
}

// Investment API types
export interface CreateInvestmentRequest {
  symbol: string;
  name: string;
  type: 'stock' | 'mutual_fund' | 'bond' | 'crypto' | 'other';
  initialQuantity: number;
  initialPrice: number;
}

export interface UpdateInvestmentRequest
  extends Partial<CreateInvestmentRequest> {
  id: string;
  currentPrice?: number;
}

export interface CreateInvestmentTransactionRequest {
  investmentId: string;
  date: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  fees?: number;
  notes?: string;
}

// Reports API types
export interface ReportFilters {
  financialYear?: string;
  startDate?: string;
  endDate?: string;
  accountTypes?: string[];
}

export interface DashboardData {
  summary: FinancialSummary;
  recentTransactions: Transaction[];
  netWorthTrend: { date: string; value: number }[];
  expensesByCategory: { category: string; amount: number }[];
  investmentPerformance: Investment[];
}

// Google Sheets API types
export interface SheetRange {
  range: string;
  values: any[][];
}

export interface BatchUpdateRequest {
  updates: {
    range: string;
    values: any[][];
  }[];
}

export interface SheetConfig {
  transactionsSheet: string;
  accountsSheet: string;
  cashbookSheet: string;
  investmentsSheet: string;
  categoriesSheet: string;
  dashboardSheet: string;
  configSheet: string;
}

// Error types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationErrorResponse extends ApiResponse {
  errors: ValidationError[];
}
