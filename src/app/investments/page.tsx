'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
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
      <Box sx={{ minHeight: '100vh', backgroundColor: 'grey.50' }}>
        <Header />
        <LoadingPage />
      </Box>
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
    <Box sx={{ minHeight: '100vh', backgroundColor: 'grey.50' }}>
      <Header />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Page Header */}
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Investments
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Portfolio management for FY {selectedFinancialYear}
            </Typography>
          </Box>

          <Button variant="primary">Add Investment</Button>
        </Box>

        {/* Portfolio Summary */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(4, 1fr)',
            },
            gap: 3,
            mb: 4,
          }}
        >
          <Card>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="medium"
              >
                Total Investment
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold">
                {formatCurrency(portfolioData.totalInvestment)}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="medium"
              >
                Current Value
              </Typography>
              <Typography
                variant="h4"
                component="div"
                fontWeight="bold"
                color="primary.main"
              >
                {formatCurrency(portfolioData.currentValue)}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="medium"
              >
                Total Gain/Loss
              </Typography>
              <Typography
                variant="h4"
                component="div"
                fontWeight="bold"
                color={
                  portfolioData.totalGainLoss >= 0
                    ? 'success.main'
                    : 'error.main'
                }
              >
                {formatCurrency(portfolioData.totalGainLoss)}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="medium"
              >
                Return %
              </Typography>
              <Typography
                variant="h4"
                component="div"
                fontWeight="bold"
                color={
                  portfolioData.totalGainLossPercentage >= 0
                    ? 'success.main'
                    : 'error.main'
                }
              >
                {portfolioData.totalGainLossPercentage.toFixed(2)}%
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography
                variant="body2"
                fontWeight="medium"
                color="text.secondary"
              >
                Investment Type:
              </Typography>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <Select
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  {investmentTypes.map(type => (
                    <MenuItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() +
                        type.slice(1).replace('_', ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>

        {/* Investments Table */}
        <Card>
          <CardHeader>
            <Typography variant="h6" component="h3">
              Investment Portfolio
              {filterType !== 'all' && (
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                  fontWeight="normal"
                >
                  {' '}
                  -{' '}
                  {filterType.charAt(0).toUpperCase() +
                    filterType.slice(1).replace('_', ' ')}
                </Typography>
              )}
            </Typography>
          </CardHeader>
          <CardContent sx={{ p: 0 }}>
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
                        <Typography variant="body2" fontWeight="medium">
                          {investment.symbol}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {investment.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ textTransform: 'capitalize' }}
                        >
                          {investment.type.replace('_', ' ')}
                        </Typography>
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
                        <Typography
                          variant="body2"
                          color={
                            investment.gainLoss >= 0
                              ? 'success.main'
                              : 'error.main'
                          }
                        >
                          {formatCurrency(investment.gainLoss)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color={
                            investment.gainLossPercentage >= 0
                              ? 'success.main'
                              : 'error.main'
                          }
                        >
                          {investment.gainLossPercentage.toFixed(2)}%
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            Trade
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Box sx={{ p: 6, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  No investments found
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {filterType !== 'all'
                    ? 'Try selecting a different investment type or add your first investment'
                    : 'Add your first investment to start tracking your portfolio'}
                </Typography>
                <Button variant="primary" sx={{ mt: 2 }}>
                  Add Investment
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Investment Allocation */}
        {investments.length > 0 && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
              gap: 4,
              mt: 3,
            }}
          >
            <Card>
              <CardHeader>
                <Typography variant="h6" component="h3">
                  Top Performers
                </Typography>
              </CardHeader>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {investments
                    .sort((a, b) => b.gainLossPercentage - a.gainLossPercentage)
                    .slice(0, 5)
                    .map(investment => (
                      <Box
                        key={investment.id}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {investment.symbol}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {investment.name}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(investment.currentValue)}
                          </Typography>
                          <Typography
                            variant="caption"
                            color={
                              investment.gainLossPercentage >= 0
                                ? 'success.main'
                                : 'error.main'
                            }
                          >
                            {investment.gainLossPercentage.toFixed(2)}%
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Typography variant="h6" component="h3">
                  Asset Allocation
                </Typography>
              </CardHeader>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                      <Box
                        key={type}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Box>
                          <Typography
                            variant="body2"
                            fontWeight="medium"
                            sx={{ textTransform: 'capitalize' }}
                          >
                            {type.replace('_', ' ')}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {typeInvestments.length} investments
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(typeValue)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {percentage.toFixed(1)}%
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default InvestmentsPage;
