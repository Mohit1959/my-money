'use client';

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Paper,
  useTheme,
  useMediaQuery,
  Stack,
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
import { useAccounts, useTransactions } from '@/hooks/use-sheets-data';
import { useFinancialYear } from '@/hooks/use-financial-year';
import { formatCurrency, formatDate } from '@/lib/utils';

const LedgerPage: React.FC = () => {
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
      <Box sx={{ minHeight: '100vh', backgroundColor: 'grey.50' }}>
        <Header />
        <LoadingPage />
      </Box>
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
              Ledger
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
            >
              Double-entry transaction management for FY {selectedFinancialYear}
            </Typography>
          </Box>

          <Button
            variant="primary"
            sx={{
              alignSelf: { xs: 'stretch', sm: 'flex-start' },
              height: { xs: 40, md: 44 },
            }}
          >
            Add Transaction
          </Button>
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
                Account Filter:
              </Typography>
              <FormControl
                size="small"
                sx={{ minWidth: { xs: '100%', sm: 200 } }}
              >
                <Select
                  value={selectedAccount}
                  onChange={e => setSelectedAccount(e.target.value)}
                >
                  <MenuItem value="all">All Accounts</MenuItem>
                  {accounts.map(account => (
                    <MenuItem key={account.id} value={account.id}>
                      {account.name} ({account.type})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </CardContent>
        </Card>

        {/* Transactions Table */}
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
              Transactions
              {selectedAccount !== 'all' && (
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                >
                  {' '}
                  - {accounts.find(acc => acc.id === selectedAccount)?.name}
                </Typography>
              )}
            </Typography>
          </CardHeader>
          <CardContent sx={{ p: 0 }}>
            {sortedTransactions.length > 0 ? (
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
                  {sortedTransactions.map(transaction => (
                    <Paper
                      key={transaction.id}
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
                            {formatDate(transaction.date)}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          sx={{
                            fontSize: { xs: '0.875rem', md: '1rem' },
                            ml: 1,
                            flexShrink: 0,
                          }}
                        >
                          {formatCurrency(transaction.totalAmount)}
                        </Typography>
                      </Box>

                      {/* Transaction entries */}
                      <Box sx={{ mb: 1 }}>
                        {transaction.entries.map((entry, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              fontSize: '0.75rem',
                              color: 'text.secondary',
                              py: 0.25,
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                            >
                              {entry.accountName}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                            >
                              {entry.debit > 0
                                ? `Dr ${formatCurrency(entry.debit)}`
                                : `Cr ${formatCurrency(entry.credit)}`}
                            </Typography>
                          </Box>
                        ))}
                      </Box>

                      {/* Additional details */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {transaction.reference && (
                            <Chip
                              label={`Ref: ${transaction.reference}`}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontSize: { xs: '0.7rem', md: '0.75rem' },
                                height: { xs: 20, md: 24 },
                              }}
                            />
                          )}
                          {transaction.category && (
                            <Chip
                              label={transaction.category}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontSize: { xs: '0.7rem', md: '0.75rem' },
                                height: { xs: 20, md: 24 },
                              }}
                            />
                          )}
                        </Box>
                        <Chip
                          label={
                            transaction.isBalanced ? 'Balanced' : 'Unbalanced'
                          }
                          size="small"
                          color={transaction.isBalanced ? 'success' : 'warning'}
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
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {transaction.description}
                            </Typography>
                            <Box sx={{ mt: 0.5 }}>
                              {transaction.entries.map((entry, index) => (
                                <Box
                                  key={index}
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '0.75rem',
                                    color: 'text.secondary',
                                  }}
                                >
                                  <Typography variant="caption">
                                    {entry.accountName}
                                  </Typography>
                                  <Typography variant="caption">
                                    {entry.debit > 0
                                      ? `Dr ${formatCurrency(entry.debit)}`
                                      : `Cr ${formatCurrency(entry.credit)}`}
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{transaction.reference || '-'}</TableCell>
                        <TableCell>{transaction.category || '-'}</TableCell>
                        <TableCell>
                          {formatCurrency(transaction.totalAmount)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={
                              transaction.isBalanced ? 'Balanced' : 'Unbalanced'
                            }
                            size="small"
                            color={
                              transaction.isBalanced ? 'success' : 'warning'
                            }
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
                No transactions found
              </Typography>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LedgerPage;
