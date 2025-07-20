import {
  Account,
  Transaction,
  TransactionEntry,
  Investment,
  CashbookEntry,
} from '@/types/financial';

export function validateDoubleEntry(entries: TransactionEntry[]): {
  isValid: boolean;
  totalDebits: number;
  totalCredits: number;
  difference: number;
} {
  const totalDebits = entries.reduce(
    (sum, entry) => sum + (entry.debit || 0),
    0
  );
  const totalCredits = entries.reduce(
    (sum, entry) => sum + (entry.credit || 0),
    0
  );
  const difference = Math.abs(totalDebits - totalCredits);

  return {
    isValid: difference < 0.01, // Allow for minor rounding differences
    totalDebits,
    totalCredits,
    difference,
  };
}

export function calculateAccountBalance(
  account: Account,
  transactions: Transaction[]
): number {
  let balance = 0;

  // Filter transactions for this account
  const relevantTransactions = transactions.filter(transaction =>
    transaction.entries.some(entry => entry.accountId === account.id)
  );

  for (const transaction of relevantTransactions) {
    const accountEntries = transaction.entries.filter(
      entry => entry.accountId === account.id
    );

    for (const entry of accountEntries) {
      if (account.type === 'asset' || account.type === 'expense') {
        // For assets and expenses, debits increase balance
        balance += (entry.debit || 0) - (entry.credit || 0);
      } else {
        // For liabilities, income, and equity, credits increase balance
        balance += (entry.credit || 0) - (entry.debit || 0);
      }
    }
  }

  return balance;
}

export function calculateRunningBalance(
  entries: CashbookEntry[],
  startingBalance = 0
): CashbookEntry[] {
  let runningBalance = startingBalance;

  // Sort entries by date
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return sortedEntries.map(entry => {
    if (entry.type === 'deposit') {
      runningBalance += entry.amount;
    } else {
      runningBalance -= entry.amount;
    }

    return {
      ...entry,
      balance: runningBalance,
    };
  });
}

export function calculateNetWorth(accounts: Account[]): {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
} {
  const totalAssets = accounts
    .filter(account => account.type === 'asset' && account.isActive)
    .reduce((sum, account) => sum + account.balance, 0);

  const totalLiabilities = accounts
    .filter(account => account.type === 'liability' && account.isActive)
    .reduce((sum, account) => sum + account.balance, 0);

  return {
    totalAssets,
    totalLiabilities,
    netWorth: totalAssets - totalLiabilities,
  };
}

export function calculateInvestmentMetrics(investment: Investment): {
  totalInvestment: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercentage: number;
} {
  const totalInvestment = investment.quantity * investment.averagePrice;
  const currentValue = investment.quantity * investment.currentPrice;
  const gainLoss = currentValue - totalInvestment;
  const gainLossPercentage =
    totalInvestment > 0 ? (gainLoss / totalInvestment) * 100 : 0;

  return {
    totalInvestment,
    currentValue,
    gainLoss,
    gainLossPercentage,
  };
}

export function calculatePortfolioValue(investments: Investment[]): {
  totalInvestment: number;
  currentValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
} {
  const totalInvestment = investments.reduce(
    (sum, inv) => sum + inv.quantity * inv.averagePrice,
    0
  );
  const currentValue = investments.reduce(
    (sum, inv) => sum + inv.quantity * inv.currentPrice,
    0
  );
  const totalGainLoss = currentValue - totalInvestment;
  const totalGainLossPercentage =
    totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0;

  return {
    totalInvestment,
    currentValue,
    totalGainLoss,
    totalGainLossPercentage,
  };
}

export function calculateMonthlyIncome(
  transactions: Transaction[],
  accounts: Account[],
  month: string
): number {
  const incomeAccounts = accounts.filter(account => account.type === 'income');
  const monthTransactions = transactions.filter(transaction => {
    const transactionMonth = transaction.date.substring(0, 7); // YYYY-MM
    return transactionMonth === month;
  });

  let totalIncome = 0;

  for (const transaction of monthTransactions) {
    for (const entry of transaction.entries) {
      const account = incomeAccounts.find(acc => acc.id === entry.accountId);
      if (account) {
        totalIncome += entry.credit || 0;
      }
    }
  }

  return totalIncome;
}

export function calculateMonthlyExpenses(
  transactions: Transaction[],
  accounts: Account[],
  month: string
): number {
  const expenseAccounts = accounts.filter(
    account => account.type === 'expense'
  );
  const monthTransactions = transactions.filter(transaction => {
    const transactionMonth = transaction.date.substring(0, 7); // YYYY-MM
    return transactionMonth === month;
  });

  let totalExpenses = 0;

  for (const transaction of monthTransactions) {
    for (const entry of transaction.entries) {
      const account = expenseAccounts.find(acc => acc.id === entry.accountId);
      if (account) {
        totalExpenses += entry.debit || 0;
      }
    }
  }

  return totalExpenses;
}

export function calculateExpensesByCategory(
  transactions: Transaction[],
  accounts: Account[],
  startDate?: string,
  endDate?: string
): { category: string; amount: number }[] {
  const expenseAccounts = accounts.filter(
    account => account.type === 'expense'
  );
  const filteredTransactions = transactions.filter(transaction => {
    if (startDate && transaction.date < startDate) return false;
    if (endDate && transaction.date > endDate) return false;
    return true;
  });

  const categoryTotals: { [category: string]: number } = {};

  for (const transaction of filteredTransactions) {
    for (const entry of transaction.entries) {
      const account = expenseAccounts.find(acc => acc.id === entry.accountId);
      if (account && entry.debit) {
        const category =
          transaction.category || account.subType || 'Uncategorized';
        categoryTotals[category] =
          (categoryTotals[category] || 0) + entry.debit;
      }
    }
  }

  return Object.entries(categoryTotals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function calculateCashFlow(
  cashbookEntries: CashbookEntry[],
  startDate?: string,
  endDate?: string
): {
  totalInflow: number;
  totalOutflow: number;
  netCashFlow: number;
} {
  const filteredEntries = cashbookEntries.filter(entry => {
    if (startDate && entry.date < startDate) return false;
    if (endDate && entry.date > endDate) return false;
    return true;
  });

  const totalInflow = filteredEntries
    .filter(entry => entry.type === 'deposit')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const totalOutflow = filteredEntries
    .filter(entry => entry.type === 'withdrawal')
    .reduce((sum, entry) => sum + entry.amount, 0);

  return {
    totalInflow,
    totalOutflow,
    netCashFlow: totalInflow - totalOutflow,
  };
}

export function generateAccountCode(
  type: string,
  subType: string,
  existingAccounts: Account[]
): string {
  const typePrefix =
    {
      asset: '1',
      liability: '2',
      equity: '3',
      income: '4',
      expense: '5',
    }[type] || '9';

  const existingCodes = existingAccounts
    .filter(account => account.type === type)
    .map(account => account.id)
    .filter(id => id.startsWith(typePrefix));

  const maxNumber =
    existingCodes.length > 0
      ? Math.max(...existingCodes.map(code => parseInt(code.slice(1)) || 0))
      : 0;

  const nextNumber = (maxNumber + 1).toString().padStart(3, '0');
  return `${typePrefix}${nextNumber}`;
}

export function validateTransaction(transaction: Partial<Transaction>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!transaction.description?.trim()) {
    errors.push('Description is required');
  }

  if (!transaction.date) {
    errors.push('Date is required');
  }

  if (!transaction.entries || transaction.entries.length === 0) {
    errors.push('At least one entry is required');
  }

  if (transaction.entries) {
    const validation = validateDoubleEntry(transaction.entries);
    if (!validation.isValid) {
      errors.push(
        `Transaction is not balanced. Difference: ${validation.difference.toFixed(
          2
        )}`
      );
    }

    for (const entry of transaction.entries) {
      if (!entry.accountId) {
        errors.push('All entries must have an account');
      }

      if (!entry.debit && !entry.credit) {
        errors.push('Each entry must have either a debit or credit amount');
      }

      if (entry.debit && entry.credit) {
        errors.push('Each entry cannot have both debit and credit amounts');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
