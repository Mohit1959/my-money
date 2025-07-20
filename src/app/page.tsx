'use client';

import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

      <Container
        maxWidth="xl"
        sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, sm: 2 } }}
      >
        {/* Page Title */}
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Typography
            variant={isSmallMobile ? 'h5' : 'h4'}
            component="h1"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Dashboard
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
          >
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
            gap: { xs: 2, md: 3 },
            mb: { xs: 3, md: 4 },
          }}
        >
          {metrics.map((metric, index) => (
            <Card key={index}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                      sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
                    >
                      {metric.title}
                    </Typography>
                    <Typography
                      variant={isSmallMobile ? 'h6' : 'h4'}
                      component="div"
                      sx={{
                        color: metric.color,
                        fontWeight: 'bold',
                        fontSize: {
                          xs: '1.125rem',
                          sm: '1.25rem',
                          md: '1.5rem',
                        },
                      }}
                    >
                      {metric.value}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        mt: 0.5,
                        fontSize: { xs: '0.7rem', md: '0.75rem' },
                      }}
                    >
                      {metric.description}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      color: metric.color,
                      ml: 1,
                      '& svg': {
                        fontSize: { xs: '1.5rem', md: '2rem' },
                      },
                    }}
                  >
                    {metric.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
            gap: { xs: 3, md: 4 },
          }}
        >
          {/* Recent Transactions */}
          <Card>
            <CardHeader
              sx={{
                pb: { xs: 1, md: 2 },
                '& .MuiCardHeader-content': {
                  minWidth: 0,
                },
              }}
            >
              <Typography
                variant={isSmallMobile ? 'h6' : 'h6'}
                component="h3"
                sx={{ fontWeight: 600 }}
              >
                Recent Transactions
              </Typography>
            </CardHeader>
            <CardContent sx={{ pt: 0 }}>
              {recentTransactions.length > 0 ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: { xs: 1, md: 2 },
                  }}
                >
                  {recentTransactions.map(transaction => (
                    <Box
                      key={transaction.id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        py: { xs: 1, md: 1.5 },
                        px: { xs: 1, md: 1.5 },
                        borderRadius: 1,
                        '&:hover': {
                          backgroundColor: 'grey.50',
                        },
                        '&:not(:last-child)': {
                          borderBottom: '1px solid',
                          borderColor: 'grey.100',
                        },
                      }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0, mr: 1 }}>
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          sx={{
                            fontSize: { xs: '0.875rem', md: '1rem' },
                            mb: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {transaction.description}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
                        >
                          {new Date(transaction.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        sx={{
                          fontSize: { xs: '0.875rem', md: '1rem' },
                          textAlign: 'right',
                          flexShrink: 0,
                        }}
                      >
                        {formatCurrency(transaction.totalAmount)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography
                  color="text.secondary"
                  align="center"
                  sx={{ py: 4, fontSize: { xs: '0.875rem', md: '1rem' } }}
                >
                  No transactions found
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Investment Performance */}
          <Card>
            <CardHeader
              sx={{
                pb: { xs: 1, md: 2 },
                '& .MuiCardHeader-content': {
                  minWidth: 0,
                },
              }}
            >
              <Typography
                variant={isSmallMobile ? 'h6' : 'h6'}
                component="h3"
                sx={{ fontWeight: 600 }}
              >
                Investment Performance
              </Typography>
            </CardHeader>
            <CardContent sx={{ pt: 0 }}>
              {investments.length > 0 ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: { xs: 2, md: 3 },
                  }}
                >
                  <Paper
                    sx={{
                      p: { xs: 1.5, md: 2 },
                      backgroundColor: 'grey.50',
                      borderRadius: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                          xs: 'repeat(2, 1fr)',
                          sm: 'repeat(2, 1fr)',
                        },
                        gap: { xs: 1.5, md: 2 },
                      }}
                    >
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                        >
                          Total Investment
                        </Typography>
                        <Typography
                          variant={isSmallMobile ? 'body2' : 'h6'}
                          fontWeight="semibold"
                          sx={{ fontSize: { xs: '0.875rem', md: '1.125rem' } }}
                        >
                          {formatCurrency(portfolioData.totalInvestment)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                        >
                          Current Value
                        </Typography>
                        <Typography
                          variant={isSmallMobile ? 'body2' : 'h6'}
                          fontWeight="semibold"
                          sx={{ fontSize: { xs: '0.875rem', md: '1.125rem' } }}
                        >
                          {formatCurrency(portfolioData.currentValue)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                        >
                          Gain/Loss
                        </Typography>
                        <Typography
                          variant={isSmallMobile ? 'body2' : 'h6'}
                          fontWeight="semibold"
                          color={
                            portfolioData.totalGainLoss >= 0
                              ? 'success.main'
                              : 'error.main'
                          }
                          sx={{ fontSize: { xs: '0.875rem', md: '1.125rem' } }}
                        >
                          {formatCurrency(portfolioData.totalGainLoss)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                        >
                          Return %
                        </Typography>
                        <Typography
                          variant={isSmallMobile ? 'body2' : 'h6'}
                          fontWeight="semibold"
                          color={
                            portfolioData.totalGainLossPercentage >= 0
                              ? 'success.main'
                              : 'error.main'
                          }
                          sx={{ fontSize: { xs: '0.875rem', md: '1.125rem' } }}
                        >
                          {portfolioData.totalGainLossPercentage.toFixed(2)}%
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: { xs: 1, md: 1.5 },
                    }}
                  >
                    {investments.slice(0, 5).map(investment => (
                      <Box
                        key={investment.id}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          py: { xs: 1, md: 1.5 },
                          px: { xs: 1, md: 1.5 },
                          borderRadius: 1,
                          '&:hover': {
                            backgroundColor: 'grey.50',
                          },
                        }}
                      >
                        <Box sx={{ flex: 1, minWidth: 0, mr: 1 }}>
                          <Typography
                            variant="body2"
                            fontWeight="medium"
                            sx={{
                              fontSize: { xs: '0.875rem', md: '1rem' },
                              mb: 0.5,
                            }}
                          >
                            {investment.symbol}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              fontSize: { xs: '0.75rem', md: '0.875rem' },
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {investment.name}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                          <Typography
                            variant="body2"
                            fontWeight="medium"
                            sx={{
                              fontSize: { xs: '0.875rem', md: '1rem' },
                              mb: 0.5,
                            }}
                          >
                            {formatCurrency(investment.currentValue)}
                          </Typography>
                          <Chip
                            label={`${investment.gainLossPercentage.toFixed(2)}%`}
                            size="small"
                            color={
                              investment.gainLoss >= 0 ? 'success' : 'error'
                            }
                            variant="outlined"
                            sx={{
                              fontSize: { xs: '0.7rem', md: '0.75rem' },
                              height: { xs: 20, md: 24 },
                            }}
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
                  sx={{ py: 4, fontSize: { xs: '0.875rem', md: '1rem' } }}
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
