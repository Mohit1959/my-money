import { useState, useEffect, useCallback } from 'react';
import {
  Account,
  Transaction,
  CashbookEntry,
  Investment,
  Category,
} from '@/types/financial';
import { ApiResponse } from '@/types/api';

export function useAccounts(financialYear?: string) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const url = financialYear
        ? `/api/sheets/accounts?financialYear=${financialYear}`
        : '/api/sheets/accounts';

      const response = await fetch(url);
      const data: ApiResponse<Account[]> = await response.json();

      if (data.success && data.data) {
        setAccounts(data.data);
      } else {
        setError(data.error || 'Failed to fetch accounts');
      }
    } catch (err) {
      setError('Network error while fetching accounts');
      console.error('Error fetching accounts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [financialYear]);

  const createAccount = useCallback(
    async (account: Omit<Account, 'id' | 'createdAt' | 'financialYear'>) => {
      try {
        const response = await fetch('/api/sheets/accounts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(account),
        });

        const data: ApiResponse<Account> = await response.json();

        if (data.success && data.data) {
          setAccounts(prev => [...prev, data.data!]);
          return { success: true, data: data.data };
        } else {
          return { success: false, error: data.error };
        }
      } catch (err) {
        console.error('Error creating account:', err);
        return { success: false, error: 'Network error' };
      }
    },
    []
  );

  const updateAccount = useCallback(
    async (id: string, updates: Partial<Account>) => {
      try {
        const response = await fetch(`/api/sheets/accounts/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });

        const data: ApiResponse<Account> = await response.json();

        if (data.success && data.data) {
          setAccounts(prev =>
            prev.map(acc => (acc.id === id ? data.data! : acc))
          );
          return { success: true, data: data.data };
        } else {
          return { success: false, error: data.error };
        }
      } catch (err) {
        console.error('Error updating account:', err);
        return { success: false, error: 'Network error' };
      }
    },
    []
  );

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return {
    accounts,
    isLoading,
    error,
    fetchAccounts,
    createAccount,
    updateAccount,
  };
}

export function useTransactions(financialYear?: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const url = financialYear
        ? `/api/sheets/transactions?financialYear=${financialYear}`
        : '/api/sheets/transactions';

      const response = await fetch(url);
      const data: ApiResponse<Transaction[]> = await response.json();

      if (data.success && data.data) {
        setTransactions(data.data);
      } else {
        setError(data.error || 'Failed to fetch transactions');
      }
    } catch (err) {
      setError('Network error while fetching transactions');
      console.error('Error fetching transactions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [financialYear]);

  const createTransaction = useCallback(
    async (
      transaction: Omit<
        Transaction,
        'id' | 'createdAt' | 'updatedAt' | 'financialYear'
      >
    ) => {
      try {
        const response = await fetch('/api/sheets/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transaction),
        });

        const data: ApiResponse<Transaction> = await response.json();

        if (data.success && data.data) {
          setTransactions(prev => [data.data!, ...prev]);
          return { success: true, data: data.data };
        } else {
          return { success: false, error: data.error };
        }
      } catch (err) {
        console.error('Error creating transaction:', err);
        return { success: false, error: 'Network error' };
      }
    },
    []
  );

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    isLoading,
    error,
    fetchTransactions,
    createTransaction,
  };
}

export function useInvestments(financialYear?: string) {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvestments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const url = financialYear
        ? `/api/sheets/investments?financialYear=${financialYear}`
        : '/api/sheets/investments';

      const response = await fetch(url);
      const data: ApiResponse<Investment[]> = await response.json();

      if (data.success && data.data) {
        setInvestments(data.data);
      } else {
        setError(data.error || 'Failed to fetch investments');
      }
    } catch (err) {
      setError('Network error while fetching investments');
      console.error('Error fetching investments:', err);
    } finally {
      setIsLoading(false);
    }
  }, [financialYear]);

  const createInvestment = useCallback(
    async (
      investment: Omit<Investment, 'id' | 'financialYear' | 'lastUpdated'>
    ) => {
      try {
        const response = await fetch('/api/sheets/investments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(investment),
        });

        const data: ApiResponse<Investment> = await response.json();

        if (data.success && data.data) {
          setInvestments(prev => [...prev, data.data!]);
          return { success: true, data: data.data };
        } else {
          return { success: false, error: data.error };
        }
      } catch (err) {
        console.error('Error creating investment:', err);
        return { success: false, error: 'Network error' };
      }
    },
    []
  );

  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  return {
    investments,
    isLoading,
    error,
    fetchInvestments,
    createInvestment,
  };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/sheets/categories');
      const data: ApiResponse<Category[]> = await response.json();

      if (data.success && data.data) {
        setCategories(data.data);
      } else {
        setError(data.error || 'Failed to fetch categories');
      }
    } catch (err) {
      setError('Network error while fetching categories');
      console.error('Error fetching categories:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    isLoading,
    error,
    fetchCategories,
  };
}
