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
  useTheme,
  useMediaQuery,
  Stack,
  Paper,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

      <Container
        maxWidth="xl"
        sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, sm: 2 } }}
      >
        {/* Page Header */}
        <Box
          sx={{
            mb: { xs: 3, md: 4 },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Box>
            <Typography
              variant={isSmallMobile ? 'h5' : 'h4'}
              component="h1"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Investments
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
            >
              Portfolio management for FY {selectedFinancialYear}
            </Typography>
          </Box>

          <Button
            variant="primary"
            sx={{
              alignSelf: { xs: 'stretch', sm: 'flex-start' },
              height: { xs: 40, md: 44 },
            }}
          >
            Add Investment
          </Button>
        </Box>

        {/* Portfolio Summary */}
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
          <Card>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography
                variant="body2"
                color="text.secondary"
                gutterBottom
                sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
              >
                Total Investment
              </Typography>
              <Typography
                variant={isSmallMobile ? 'h6' : 'h4'}
                component="div"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
                }}
              >
                {formatCurrency(portfolioData.totalInvestment)}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography
                variant="body2"
                color="text.secondary"
                gutterBottom
                sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
              >
                Current Value
              </Typography>
              <Typography
                variant={isSmallMobile ? 'h6' : 'h4'}
                component="div"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
                }}
              >
                {formatCurrency(portfolioData.currentValue)}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography
                variant="body2"
                color="text.secondary"
                gutterBottom
                sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
              >
                Total Gain/Loss
              </Typography>
              <Typography
                variant={isSmallMobile ? 'h6' : 'h4'}
                component="div"
                sx={{
                  fontWeight: 'bold',
                  color:
                    portfolioData.totalGainLoss >= 0
                      ? 'success.main'
                      : 'error.main',
                  fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
                }}
              >
                {formatCurrency(portfolioData.totalGainLoss)}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography
                variant="body2"
                color="text.secondary"
                gutterBottom
                sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
              >
                Return %
              </Typography>
              <Typography
                variant={isSmallMobile ? 'h6' : 'h4'}
                component="div"
                sx={{
                  fontWeight: 'bold',
                  color:
                    portfolioData.totalGainLossPercentage >= 0
                      ? 'success.main'
                      : 'error.main',
                  fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
                }}
              >
                {portfolioData.totalGainLossPercentage.toFixed(2)}%
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: { xs: 2, md: 3 } }}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1, sm: 2 }}
              alignItems={{ xs: 'stretch', sm: 'center' }}
            >
              <Typography
                variant="body2"
                fontWeight="medium"
                color="text.secondary"
                sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
              >
                Filter by Type:
              </Typography>
              <FormControl
                size="small"
                sx={{ minWidth: { xs: '100%', sm: 200 } }}
              >
                <Select
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  {investmentTypes.map(type => (
                    <MenuItem key={type} value={type}>
                      {type.replace('_', ' ').toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </CardContent>
        </Card>

        {/* Investments Table */}
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
              Investment Portfolio
              {filterType !== 'all' && (
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                >
                  {' '}
                  - {filterType.replace('_', ' ').toUpperCase()}
                </Typography>
              )}
            </Typography>
          </CardHeader>
          <CardContent sx={{ p: 0 }}>
            {filteredInvestments.length > 0 ? (
              isMobile ? (
                // Mobile card view
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    p: { xs: 1, sm: 2 },
                  }}
                >
                  {filteredInvestments.map(investment => (
                    <Paper
                      key={investment.id}
                      sx={{
                        p: { xs: 1.5, sm: 2 },
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'grey.200',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 1,
                        }}
                      >
                        <Box sx={{ flex: 1, minWidth: 0 }}>
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

                      {/* Investment details */}
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          gap: { xs: 1, md: 1.5 },
                          mt: 1,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                          >
                            Quantity
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                          >
                            {investment.quantity}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                          >
                            Avg Price
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                          >
                            {formatCurrency(investment.averagePrice)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                          >
                            Current Price
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                          >
                            {formatCurrency(investment.currentPrice)}
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
                            variant="body2"
                            color={
                              investment.gainLoss >= 0
                                ? 'success.main'
                                : 'error.main'
                            }
                            sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                          >
                            {formatCurrency(investment.gainLoss)}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Type chip */}
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label={investment.type
                            .replace('_', ' ')
                            .toUpperCase()}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: { xs: '0.7rem', md: '0.75rem' },
                            height: { xs: 20, md: 24 },
                          }}
                        />
                      </Box>
                    </Paper>
                  ))}
                </Box>
              ) : (
                // Desktop table view
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Avg Price</TableHead>
                      <TableHead>Current Price</TableHead>
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
                        <TableCell>{investment.name}</TableCell>
                        <TableCell>
                          <Chip
                            label={investment.type
                              .replace('_', ' ')
                              .toUpperCase()}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{investment.quantity}</TableCell>
                        <TableCell>
                          {formatCurrency(investment.averagePrice)}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(investment.currentPrice)}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(investment.currentValue)}
                        </TableCell>
                        <TableCell>
                          <Typography
                            color={
                              investment.gainLoss >= 0
                                ? 'success.main'
                                : 'error.main'
                            }
                            fontWeight="medium"
                          >
                            {formatCurrency(investment.gainLoss)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${investment.gainLossPercentage.toFixed(2)}%`}
                            size="small"
                            color={
                              investment.gainLoss >= 0 ? 'success' : 'error'
                            }
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )
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
      </Container>
    </Box>
  );
};

export default InvestmentsPage;
