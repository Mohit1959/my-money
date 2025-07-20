import React from 'react';
import {
  Card as MuiCard,
  CardProps as MuiCardProps,
  CardHeader as MuiCardHeader,
  CardHeaderProps as MuiCardHeaderProps,
  CardContent as MuiCardContent,
  CardContentProps as MuiCardContentProps,
  CardActions as MuiCardActions,
  CardActionsProps as MuiCardActionsProps,
} from '@mui/material';

interface CardProps extends MuiCardProps {
  children: React.ReactNode;
}

interface CardHeaderProps extends MuiCardHeaderProps {
  children: React.ReactNode;
}

interface CardContentProps extends MuiCardContentProps {
  children: React.ReactNode;
}

interface CardFooterProps extends MuiCardActionsProps {
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => (
    <MuiCard ref={ref} {...props}>
      {children}
    </MuiCard>
  )
);

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, ...props }, ref) => (
    <MuiCardHeader ref={ref} {...props}>
      {children}
    </MuiCardHeader>
  )
);

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, ...props }, ref) => (
    <MuiCardContent ref={ref} {...props}>
      {children}
    </MuiCardContent>
  )
);

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, ...props }, ref) => (
    <MuiCardActions
      ref={ref}
      sx={{
        borderTop: '1px solid',
        borderColor: 'grey.200',
        backgroundColor: 'grey.50',
        padding: 2,
      }}
      {...props}
    >
      {children}
    </MuiCardActions>
  )
);

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardContent, CardFooter };
