'use client';

import React from 'react';
import Header from '@/components/layout/header';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { LoadingPage } from '@/components/ui/loading';
import { useRequireAuth } from '@/hooks/use-auth';
import {
  useAccounts,
  useTransactions,
  useInvestments,
} from '@/hooks/use-sheets-data';
import { useFinancialYear } from '@/hooks/use-financial-year';
import { formatCurrency } from '@/lib/utils';
import {
  calculateNetWorth,
  calculatePortfolioValue,
} from '@/lib/financial-calculations';

const DashboardPage: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const { selectedFinancialYear } = useFinancialYear();

  const { accounts, isLoading: accountsLoading } = useAccounts(
    selectedFinancialYear
  );
  const { transactions, isLoading: transactionsLoading } = useTransactions(
    selectedFinancialYear
  );
  const { investments, isLoading: investmentsLoading } = useInvestments(
    selectedFinancialYear
  );

  if (authLoading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  const isLoading =
    accountsLoading || transactionsLoading || investmentsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <LoadingPage />
      </div>
    );
  }

  // Calculate financial metrics
  const netWorthData = calculateNetWorth(accounts);
  const portfolioData = calculatePortfolioValue(investments);

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const totalCash = accounts
    .filter(
      acc => acc.type === 'asset' && acc.subType.toLowerCase().includes('cash')
    )
    .reduce((sum, acc) => sum + acc.balance, 0);

  const metrics = [
    {
      title: 'Net Worth',
      value: formatCurrency(netWorthData.netWorth),
      description: 'Total assets minus liabilities',
      color: netWorthData.netWorth >= 0 ? 'text-green-600' : 'text-red-600',
    },
    {
      title: 'Total Assets',
      value: formatCurrency(netWorthData.totalAssets),
      description: 'All asset accounts',
      color: 'text-blue-600',
    },
    {
      title: 'Investment Value',
      value: formatCurrency(portfolioData.currentValue),
      description: 'Current portfolio value',
      color:
        portfolioData.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600',
    },
    {
      title: 'Cash Balance',
      value: formatCurrency(totalCash),
      description: 'Available cash',
      color: 'text-primary-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Overview of your financial health for FY {selectedFinancialYear}
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {metric.title}
                    </p>
                    <p className={`text-2xl font-bold ${metric.color}`}>
                      {metric.value}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {metric.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">
                Recent Transactions
              </h3>
            </CardHeader>
            <CardContent>
              {recentTransactions.length > 0 ? (
                <div className="space-y-4">
                  {recentTransactions.map(transaction => (
                    <div
                      key={transaction.id}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(transaction.totalAmount)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No transactions found
                </p>
              )}
            </CardContent>
          </Card>

          {/* Investment Performance */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">
                Investment Performance
              </h3>
            </CardHeader>
            <CardContent>
              {investments.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500">Total Investment</p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(portfolioData.totalInvestment)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Current Value</p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(portfolioData.currentValue)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Gain/Loss</p>
                      <p
                        className={`text-lg font-semibold ${
                          portfolioData.totalGainLoss >= 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {formatCurrency(portfolioData.totalGainLoss)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Return %</p>
                      <p
                        className={`text-lg font-semibold ${
                          portfolioData.totalGainLossPercentage >= 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {portfolioData.totalGainLossPercentage.toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {investments.slice(0, 5).map(investment => (
                      <div
                        key={investment.id}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {investment.symbol}
                          </p>
                          <p className="text-xs text-gray-500">
                            {investment.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {formatCurrency(investment.currentValue)}
                          </p>
                          <p
                            className={`text-xs ${
                              investment.gainLoss >= 0
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {investment.gainLossPercentage.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No investments found
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
