import React from 'react';
import {
  CircularProgress,
  Skeleton,
  Card,
  CardContent,
  Box,
  Container,
  Grid,
} from '@mui/material';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

interface LoadingSkeletonProps {
  lines?: number;
  variant?: 'text' | 'rectangular' | 'circular';
}

interface LoadingCardProps {
  variant?: 'text' | 'rectangular' | 'circular';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
}) => {
  const sizes = {
    sm: 16,
    md: 24,
    lg: 32,
  };

  return <CircularProgress size={sizes[size]} color={color} />;
};

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  lines = 3,
  variant = 'text',
}) => {
  return (
    <Box>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant={variant}
          width={`${100 - index * 10}%`}
          height={16}
          sx={{ mb: 1 }}
        />
      ))}
    </Box>
  );
};

export const LoadingCard: React.FC<LoadingCardProps> = ({
  variant = 'text',
}) => {
  return (
    <Card>
      <CardContent>
        <Skeleton variant={variant} width="25%" height={16} sx={{ mb: 2 }} />
        <Skeleton variant={variant} width="50%" height={32} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Skeleton variant={variant} width="100%" height={12} />
          <Skeleton variant={variant} width="75%" height={12} />
          <Skeleton variant={variant} width="50%" height={12} />
        </Box>
      </CardContent>
    </Card>
  );
};

export const LoadingPage: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Header */}
        <Skeleton variant="text" width="25%" height={32} />

        {/* Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 3,
          }}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <LoadingCard key={index} />
          ))}
        </Box>

        {/* Large content area */}
        <Card>
          <CardContent>
            <Skeleton variant="text" width="33%" height={24} sx={{ mb: 3 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {Array.from({ length: 8 }).map((_, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2 }}>
                  <Skeleton variant="text" width="25%" height={16} />
                  <Skeleton variant="text" width="25%" height={16} />
                  <Skeleton variant="text" width="25%" height={16} />
                  <Skeleton variant="text" width="25%" height={16} />
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default LoadingSpinner;
