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
import { useInvestments } from '@/hooks/use-sheets-data';
import { useFinancialYear } from '@/hooks/use-financial-year';
import { formatCurrency } from '@/lib/utils';
import { calculatePortfolioValue } from '@/lib/financial-calculations';

const InvestmentsPage: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const { selectedFinancialYear } = useFinancialYear();

  const { investments, isLoading: investmentsLoading } = useInvestments(
    selectedFinancialYear
  );

  const [filterType, setFilterType] = useState<string>('all');

  if (authLoading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (investmentsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <LoadingPage />
      </div>
    );
  }

  // Filter investments by type
  const filteredInvestments =
    filterType === 'all'
      ? investments
      : investments.filter(investment => investment.type === filterType);

  // Calculate portfolio metrics
  const portfolioData = calculatePortfolioValue(investments);

  // Get unique investment types
  const investmentTypes = [...new Set(investments.map(inv => inv.type))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Investments</h1>
            <p className="text-gray-600">
              Portfolio management for FY {selectedFinancialYear}
            </p>
          </div>

          <Button variant="primary">Add Investment</Button>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500">
                  Total Investment
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(portfolioData.totalInvestment)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500">
                  Current Value
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(portfolioData.currentValue)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500">
                  Total Gain/Loss
                </p>
                <p
                  className={`text-2xl font-bold ${
                    portfolioData.totalGainLoss >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {formatCurrency(portfolioData.totalGainLoss)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500">Return %</p>
                <p
                  className={`text-2xl font-bold ${
                    portfolioData.totalGainLossPercentage >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {portfolioData.totalGainLossPercentage.toFixed(2)}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">
                Investment Type:
              </label>
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Types</option>
                {investmentTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() +
                      type.slice(1).replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Investments Table */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">
              Investment Portfolio
              {filterType !== 'all' && (
                <span className="text-sm text-gray-500 font-normal">
                  -{' '}
                  {filterType.charAt(0).toUpperCase() +
                    filterType.slice(1).replace('_', ' ')}
                </span>
              )}
            </h3>
          </CardHeader>
          <CardContent className="p-0">
            {filteredInvestments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Avg Price</TableHead>
                    <TableHead>Current Price</TableHead>
                    <TableHead>Investment</TableHead>
                    <TableHead>Current Value</TableHead>
                    <TableHead>Gain/Loss</TableHead>
                    <TableHead>Return %</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvestments.map(investment => (
                    <TableRow key={investment.id}>
                      <TableCell>
                        <div className="font-medium">{investment.symbol}</div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {investment.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="capitalize">
                          {investment.type.replace('_', ' ')}
                        </span>
                      </TableCell>
                      <TableCell>
                        {investment.quantity.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(investment.averagePrice)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(investment.currentPrice)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(investment.totalInvestment)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(investment.currentValue)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            investment.gainLoss >= 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }
                        >
                          {formatCurrency(investment.gainLoss)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            investment.gainLossPercentage >= 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }
                        >
                          {investment.gainLossPercentage.toFixed(2)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            Trade
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">No investments found</p>
                <p className="text-sm text-gray-400 mt-2">
                  {filterType !== 'all'
                    ? 'Try selecting a different investment type or add your first investment'
                    : 'Add your first investment to start tracking your portfolio'}
                </p>
                <Button variant="primary" className="mt-4">
                  Add Investment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Investment Allocation */}
        {investments.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium text-gray-900">
                  Top Performers
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {investments
                    .sort((a, b) => b.gainLossPercentage - a.gainLossPercentage)
                    .slice(0, 5)
                    .map(investment => (
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
                              investment.gainLossPercentage >= 0
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium text-gray-900">
                  Asset Allocation
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {investmentTypes.map(type => {
                    const typeInvestments = investments.filter(
                      inv => inv.type === type
                    );
                    const typeValue = typeInvestments.reduce(
                      (sum, inv) => sum + inv.currentValue,
                      0
                    );
                    const percentage =
                      portfolioData.currentValue > 0
                        ? (typeValue / portfolioData.currentValue) * 100
                        : 0;

                    return (
                      <div
                        key={type}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <p className="text-sm font-medium capitalize">
                            {type.replace('_', ' ')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {typeInvestments.length} investments
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {formatCurrency(typeValue)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {percentage.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default InvestmentsPage;
