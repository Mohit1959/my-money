'use client';

import React from 'react';
import { Container, Typography, Box, Paper, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
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
      <Box sx={{ minHeight: '100vh', backgroundColor: 'grey.50' }}>
        <Header />
        <LoadingPage />
      </Box>
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
      color: netWorthData.netWorth >= 0 ? 'success.main' : 'error.main',
      icon:
        netWorthData.netWorth >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />,
    },
    {
      title: 'Total Assets',
      value: formatCurrency(netWorthData.totalAssets),
      description: 'All asset accounts',
      color: 'info.main',
      icon: <AccountBalanceIcon />,
    },
    {
      title: 'Investment Value',
      value: formatCurrency(portfolioData.currentValue),
      description: 'Current portfolio value',
      color: portfolioData.totalGainLoss >= 0 ? 'success.main' : 'error.main',
      icon:
        portfolioData.totalGainLoss >= 0 ? (
          <TrendingUpIcon />
        ) : (
          <TrendingDownIcon />
        ),
    },
    {
      title: 'Cash Balance',
      value: formatCurrency(totalCash),
      description: 'Available cash',
      color: 'primary.main',
      icon: <AttachMoneyIcon />,
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'grey.50' }}>
      <Header />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Page Title */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Overview of your financial health for FY {selectedFinancialYear}
          </Typography>
        </Box>

        {/* Metrics Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 3,
            mb: 4,
          }}
        >
          {metrics.map((metric, index) => (
            <Card key={index}>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {metric.title}
                    </Typography>
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{ color: metric.color, fontWeight: 'bold' }}
                    >
                      {metric.value}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {metric.description}
                    </Typography>
                  </Box>
                  <Box sx={{ color: metric.color }}>{metric.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
            gap: 4,
          }}
        >
          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <Typography variant="h6" component="h3">
                Recent Transactions
              </Typography>
            </CardHeader>
            <CardContent>
              {recentTransactions.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {recentTransactions.map(transaction => (
                    <Box
                      key={transaction.id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 1,
                        borderBottom: '1px solid',
                        borderColor: 'grey.100',
                        '&:last-child': {
                          borderBottom: 'none',
                        },
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {transaction.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(transaction.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(transaction.totalAmount)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography
                  color="text.secondary"
                  align="center"
                  sx={{ py: 4 }}
                >
                  No transactions found
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Investment Performance */}
          <Card>
            <CardHeader>
              <Typography variant="h6" component="h3">
                Investment Performance
              </Typography>
            </CardHeader>
            <CardContent>
              {investments.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Total Investment
                        </Typography>
                        <Typography variant="h6" fontWeight="semibold">
                          {formatCurrency(portfolioData.totalInvestment)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Current Value
                        </Typography>
                        <Typography variant="h6" fontWeight="semibold">
                          {formatCurrency(portfolioData.currentValue)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Gain/Loss
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight="semibold"
                          color={
                            portfolioData.totalGainLoss >= 0
                              ? 'success.main'
                              : 'error.main'
                          }
                        >
                          {formatCurrency(portfolioData.totalGainLoss)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Return %
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight="semibold"
                          color={
                            portfolioData.totalGainLossPercentage >= 0
                              ? 'success.main'
                              : 'error.main'
                          }
                        >
                          {portfolioData.totalGainLossPercentage.toFixed(2)}%
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>

                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    {investments.slice(0, 5).map(investment => (
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
                          <Chip
                            label={`${investment.gainLossPercentage.toFixed(2)}%`}
                            size="small"
                            color={
                              investment.gainLoss >= 0 ? 'success' : 'error'
                            }
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ) : (
                <Typography
                  color="text.secondary"
                  align="center"
                  sx={{ py: 4 }}
                >
                  No investments found
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default DashboardPage;
