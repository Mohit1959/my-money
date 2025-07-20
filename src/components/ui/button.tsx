import React from 'react';
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from '@mui/material';
import { CircularProgress } from '@mui/material';

interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'size'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const getMuiVariant = (
      variant: string
    ): 'contained' | 'outlined' | 'text' => {
      switch (variant) {
        case 'primary':
        case 'danger':
          return 'contained';
        case 'outline':
          return 'outlined';
        case 'ghost':
        case 'secondary':
        default:
          return 'text';
      }
    };

    const getMuiColor = (
      variant: string
    ): 'primary' | 'secondary' | 'error' | 'neutral' => {
      switch (variant) {
        case 'primary':
          return 'primary';
        case 'danger':
          return 'error';
        case 'secondary':
          return 'secondary';
        default:
          return 'neutral';
      }
    };

    const getMuiSize = (size: string): 'small' | 'medium' | 'large' => {
      switch (size) {
        case 'sm':
          return 'small';
        case 'lg':
          return 'large';
        default:
          return 'medium';
      }
    };

    return (
      <MuiButton
        variant={getMuiVariant(variant)}
        color={getMuiColor(variant)}
        size={getMuiSize(size)}
        disabled={disabled || isLoading}
        ref={ref}
        startIcon={isLoading ? <CircularProgress size={16} /> : undefined}
        {...props}
      >
        {children}
      </MuiButton>
    );
  }
);

Button.displayName = 'Button';

export { Button };
