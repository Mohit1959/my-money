'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/header';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { LoadingPage } from '@/components/ui/loading';
import { useRequireAuth } from '@/hooks/use-auth';
import { useAccounts, useTransactions } from '@/hooks/use-sheets-data';
import { useFinancialYear } from '@/hooks/use-financial-year';
import { formatCurrency, formatDate } from '@/lib/utils';

const LedgerPage: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const { selectedFinancialYear } = useFinancialYear();

  const { accounts, isLoading: accountsLoading } = useAccounts(
    selectedFinancialYear
  );
  const { transactions, isLoading: transactionsLoading } = useTransactions(
    selectedFinancialYear
  );

  const [selectedAccount, setSelectedAccount] = useState<string>('all');

  if (authLoading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const isLoading = accountsLoading || transactionsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <LoadingPage />
      </div>
    );
  }

  // Filter transactions by selected account
  const filteredTransactions =
    selectedAccount === 'all'
      ? transactions
      : transactions.filter(transaction =>
          transaction.entries.some(entry => entry.accountId === selectedAccount)
        );

  // Sort transactions by date (newest first)
  const sortedTransactions = filteredTransactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ledger</h1>
            <p className="text-gray-600">
              Double-entry transaction management for FY {selectedFinancialYear}
            </p>
          </div>

          <Button variant="primary">Add Transaction</Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">
                Account Filter:
              </label>
              <select
                value={selectedAccount}
                onChange={e => setSelectedAccount(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Accounts</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name} ({account.type})
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">
              Transactions
              {selectedAccount !== 'all' && (
                <span className="text-sm text-gray-500 font-normal">
                  - {accounts.find(acc => acc.id === selectedAccount)?.name}
                </span>
              )}
            </h3>
          </CardHeader>
          <CardContent className="p-0">
            {sortedTransactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTransactions.map(transaction => (
                    <TableRow key={transaction.id}>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {transaction.description}
                          </p>
                          <div className="text-xs text-gray-500 mt-1">
                            {transaction.entries.map((entry, index) => (
                              <div key={index} className="flex justify-between">
                                <span>{entry.accountName}</span>
                                <span>
                                  {entry.debit > 0
                                    ? `Dr ${formatCurrency(entry.debit)}`
                                    : `Cr ${formatCurrency(entry.credit)}`}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{transaction.reference || '-'}</TableCell>
                      <TableCell>{transaction.category || '-'}</TableCell>
                      <TableCell>
                        {formatCurrency(transaction.totalAmount)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`status-badge ${
                            transaction.isBalanced
                              ? 'status-success'
                              : 'status-error'
                          }`}
                        >
                          {transaction.isBalanced ? 'Balanced' : 'Unbalanced'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">No transactions found</p>
                <p className="text-sm text-gray-400 mt-2">
                  {selectedAccount !== 'all'
                    ? 'Try selecting a different account or create your first transaction'
                    : 'Create your first transaction to get started'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500">
                  Total Transactions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredTransactions.length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500">
                  Balanced Transactions
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredTransactions.filter(t => t.isBalanced).length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    filteredTransactions.reduce(
                      (sum, t) => sum + t.totalAmount,
                      0
                    )
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default LedgerPage;
