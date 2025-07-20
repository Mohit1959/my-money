export interface Account {
  id: string;
  name: string;
  type: 'asset' | 'liability' | 'income' | 'expense' | 'equity';
  subType: string;
  balance: number;
  isActive: boolean;
  createdAt: string;
  financialYear: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  reference?: string;
  entries: TransactionEntry[];
  totalAmount: number;
  isBalanced: boolean;
  category?: string;
  financialYear: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionEntry {
  accountId: string;
  accountName: string;
  debit: number;
  credit: number;
}

export interface CashbookEntry {
  id: string;
  date: string;
  description: string;
  bankAccount: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  balance: number;
  category: string;
  reference?: string;
  reconciled: boolean;
  financialYear: string;
  createdAt: string;
}

export interface Investment {
  id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'mutual_fund' | 'bond' | 'crypto' | 'other';
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  totalInvestment: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercentage: number;
  lastUpdated: string;
  financialYear: string;
}

export interface InvestmentTransaction {
  id: string;
  investmentId: string;
  date: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  totalAmount: number;
  fees: number;
  notes?: string;
  financialYear: string;
  createdAt: string;
}

export interface FinancialSummary {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  investmentValue: number;
  cashBalance: number;
  lastUpdated: string;
}

export interface BalanceSheetItem {
  accountName: string;
  accountType: string;
  amount: number;
  percentage?: number;
}

export interface BalanceSheet {
  assets: BalanceSheetItem[];
  liabilities: BalanceSheetItem[];
  equity: BalanceSheetItem[];
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  asOfDate: string;
  financialYear: string;
}

export interface IncomeStatement {
  income: BalanceSheetItem[];
  expenses: BalanceSheetItem[];
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  period: {
    from: string;
    to: string;
  };
  financialYear: string;
}

export interface ChartData {
  name: string;
  value: number;
  date?: string;
  category?: string;
}

export interface NetWorthData {
  date: string;
  assets: number;
  liabilities: number;
  netWorth: number;
}

export interface MonthlyExpenseData {
  month: string;
  amount: number;
  category: string;
}

export interface InvestmentPerformanceData {
  symbol: string;
  name: string;
  investment: number;
  currentValue: number;
  gainLoss: number;
  percentage: number;
}

export interface FinancialYear {
  year: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  isActive: boolean;
  createdAt: string;
}
