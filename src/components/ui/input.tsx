import React from 'react';
import {
  TextField,
  TextFieldProps,
  InputAdornment,
  CircularProgress,
} from '@mui/material';

interface InputProps extends Omit<TextFieldProps, 'variant' | 'error'> {
  label?: string;
  error?: string;
  helpText?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helpText,
      icon,
      isLoading,
      type = 'text',
      helperText,
      ...props
    },
    ref
  ) => {
    return (
      <TextField
        ref={ref}
        variant="outlined"
        label={label}
        type={type}
        error={!!error}
        helperText={error || helpText || helperText}
        disabled={isLoading}
        InputProps={{
          startAdornment: icon ? (
            <InputAdornment position="start">{icon}</InputAdornment>
          ) : undefined,
          endAdornment: isLoading ? (
            <InputAdornment position="end">
              <CircularProgress size={20} />
            </InputAdornment>
          ) : undefined,
        }}
        fullWidth
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
