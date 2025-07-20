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
              Ledger
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Double-entry transaction management for FY {selectedFinancialYear}
            </Typography>
          </Box>

          <Button variant="primary">Add Transaction</Button>
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
                Account Filter:
              </Typography>
              <FormControl size="small" sx={{ minWidth: 200 }}>
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
            </Box>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <Typography variant="h6" component="h3">
              Transactions
              {selectedAccount !== 'all' && (
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                  fontWeight="normal"
                >
                  {' '}
                  - {accounts.find(acc => acc.id === selectedAccount)?.name}
                </Typography>
              )}
            </Typography>
          </CardHeader>
          <CardContent sx={{ p: 0 }}>
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
                          color={transaction.isBalanced ? 'success' : 'error'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            View
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
                  No transactions found
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {selectedAccount !== 'all'
                    ? 'Try selecting a different account or create your first transaction'
                    : 'Create your first transaction to get started'}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
            mt: 3,
          }}
        >
          <Card>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="medium"
              >
                Total Transactions
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold">
                {filteredTransactions.length}
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
                Balanced Transactions
              </Typography>
              <Typography
                variant="h4"
                component="div"
                fontWeight="bold"
                color="success.main"
              >
                {filteredTransactions.filter(t => t.isBalanced).length}
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
                Total Value
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold">
                {formatCurrency(
                  filteredTransactions.reduce(
                    (sum, t) => sum + t.totalAmount,
                    0
                  )
                )}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default LedgerPage;
