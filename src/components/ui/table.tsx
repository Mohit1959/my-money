import React from 'react';
import {
  Table as MuiTable,
  TableProps as MuiTableProps,
  TableHead as MuiTableHead,
  TableHeadProps as MuiTableHeadProps,
  TableBody as MuiTableBody,
  TableBodyProps as MuiTableBodyProps,
  TableRow as MuiTableRow,
  TableRowProps as MuiTableRowProps,
  TableCell as MuiTableCell,
  TableCellProps as MuiTableCellProps,
  TableContainer,
  Paper,
} from '@mui/material';

interface TableProps extends MuiTableProps {
  children: React.ReactNode;
}

interface TableHeaderProps extends MuiTableHeadProps {
  children: React.ReactNode;
}

interface TableBodyProps extends MuiTableBodyProps {
  children: React.ReactNode;
}

interface TableRowProps extends MuiTableRowProps {
  children: React.ReactNode;
}

interface TableHeadProps extends MuiTableCellProps {
  children: React.ReactNode;
}

interface TableCellProps extends MuiTableCellProps {
  children: React.ReactNode;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ children, ...props }, ref) => (
    <TableContainer component={Paper} sx={{ boxShadow: 1, borderRadius: 2 }}>
      <MuiTable ref={ref} {...props}>
        {children}
      </MuiTable>
    </TableContainer>
  )
);

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ children, ...props }, ref) => (
    <MuiTableHead ref={ref} sx={{ backgroundColor: 'grey.50' }} {...props}>
      {children}
    </MuiTableHead>
  )
);

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ children, ...props }, ref) => (
    <MuiTableBody ref={ref} sx={{ backgroundColor: 'white' }} {...props}>
      {children}
    </MuiTableBody>
  )
);

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ children, ...props }, ref) => (
    <MuiTableRow
      ref={ref}
      sx={{
        '&:hover': {
          backgroundColor: 'grey.50',
        },
      }}
      {...props}
    >
      {children}
    </MuiTableRow>
  )
);

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ children, ...props }, ref) => (
    <MuiTableCell
      ref={ref}
      sx={{
        px: 3,
        py: 1.5,
        textAlign: 'left',
        fontSize: '0.75rem',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: 'text.secondary',
      }}
      {...props}
    >
      {children}
    </MuiTableCell>
  )
);

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ children, ...props }, ref) => (
    <MuiTableCell
      ref={ref}
      sx={{
        px: 3,
        py: 2,
        whiteSpace: 'nowrap',
        fontSize: '0.875rem',
        color: 'text.primary',
      }}
      {...props}
    >
      {children}
    </MuiTableCell>
  )
);

Table.displayName = 'Table';
TableHeader.displayName = 'TableHeader';
TableBody.displayName = 'TableBody';
TableRow.displayName = 'TableRow';
TableHead.displayName = 'TableHead';
TableCell.displayName = 'TableCell';

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
