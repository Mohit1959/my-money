'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';

const LoginPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(password);

      if (!result.success) {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'grey.50',
        py: { xs: 2, sm: 4, lg: 6 },
        px: { xs: 1, sm: 2, lg: 4 },
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 3, sm: 4 },
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant={isSmallMobile ? 'h4' : 'h3'}
              component="h1"
              fontWeight="bold"
              gutterBottom
              sx={{
                fontSize: { xs: '1.75rem', sm: '2.25rem' },
                mb: { xs: 1, sm: 2 },
              }}
            >
              MoMoney
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.875rem', sm: '1rem' },
                px: { xs: 1, sm: 0 },
              }}
            >
              Enter your password to access your financial data
            </Typography>
          </Box>

          <Card>
            <CardHeader
              sx={{
                pb: { xs: 1, sm: 2 },
                '& .MuiCardHeader-content': {
                  minWidth: 0,
                },
              }}
            >
              <Typography
                variant={isSmallMobile ? 'h6' : 'h6'}
                component="h2"
                sx={{ fontWeight: 600 }}
              >
                Sign In
              </Typography>
            </CardHeader>
            <CardContent sx={{ pt: 0 }}>
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: { xs: 2, sm: 3 },
                }}
              >
                <Input
                  type="password"
                  label="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  error={error}
                  placeholder="Enter your password"
                  required
                  autoFocus
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  fullWidth
                  sx={{
                    height: { xs: 44, sm: 48 },
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                  }}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                px: { xs: 1, sm: 0 },
                lineHeight: 1.5,
              }}
            >
              This application uses Google Sheets for data storage. Make sure
              you have configured your environment variables correctly.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
