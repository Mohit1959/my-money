'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Button as CustomButton } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useFinancialYear } from '@/hooks/use-financial-year';

const Header: React.FC = () => {
  const { logout } = useAuth();
  const { selectedFinancialYear, availableYears, switchFinancialYear } =
    useFinancialYear();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const navigation = [
    { name: 'Dashboard', href: '/', current: pathname === '/' },
    { name: 'Ledger', href: '/ledger', current: pathname === '/ledger' },
    { name: 'Cashbook', href: '/cashbook', current: pathname === '/cashbook' },
    {
      name: 'Investments',
      href: '/investments',
      current: pathname === '/investments',
    },
    { name: 'Net Worth', href: '/networth', current: pathname === '/networth' },
    {
      name: 'Balance Sheet',
      href: '/balancesheet',
      current: pathname === '/balancesheet',
    },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box
      sx={{
        width: 280,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Drawer Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'grey.200' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                textDecoration: 'none',
              }}
            >
              MoMoney
            </Typography>
          </Link>
          <IconButton onClick={handleDrawerToggle} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Financial Year Selector in Drawer */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'grey.200' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Financial Year
        </Typography>
        <FormControl fullWidth size="small">
          <Select
            value={selectedFinancialYear}
            onChange={e => switchFinancialYear(e.target.value)}
            sx={{ height: 40 }}
          >
            {availableYears.map(year => (
              <MenuItem key={year} value={year}>
                FY {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ pt: 1 }}>
          {navigation.map(item => (
            <ListItem key={item.name} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={item.current}
                onClick={handleDrawerToggle}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.50',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.100',
                    },
                  },
                }}
              >
                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{
                    fontWeight: item.current ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Logout Button in Drawer */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'grey.200' }}>
        <CustomButton
          variant="outline"
          fullWidth
          onClick={handleLogout}
          sx={{ height: 40 }}
        >
          Logout
        </CustomButton>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: 'white',
          borderBottom: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            sx={{
              justifyContent: 'space-between',
              height: { xs: 56, md: 64 },
              px: { xs: 1, sm: 2 },
            }}
          >
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Link href="/" style={{ textDecoration: 'none' }}>
                <Typography
                  variant={isSmallMobile ? 'body1' : 'h6'}
                  sx={{
                    fontWeight: 700,
                    color: 'primary.main',
                    textDecoration: 'none',
                  }}
                >
                  MoMoney
                </Typography>
              </Link>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {navigation.map(item => (
                  <Button
                    key={item.name}
                    component={Link}
                    href={item.href}
                    variant={item.current ? 'contained' : 'text'}
                    color={item.current ? 'primary' : 'inherit'}
                    size="small"
                    sx={{
                      textTransform: 'none',
                      backgroundColor: item.current
                        ? 'primary.100'
                        : 'transparent',
                      color: item.current ? 'primary.700' : 'text.secondary',
                      '&:hover': {
                        backgroundColor: item.current
                          ? 'primary.200'
                          : 'grey.50',
                      },
                    }}
                  >
                    {item.name}
                  </Button>
                ))}
              </Box>
            )}

            {/* Right side controls */}
            <Stack direction="row" spacing={1} alignItems="center">
              {/* Financial Year Selector - Hidden on very small screens */}
              {!isSmallMobile && (
                <FormControl
                  size="small"
                  sx={{ minWidth: { xs: 100, sm: 120 } }}
                >
                  <Select
                    value={selectedFinancialYear}
                    onChange={e => switchFinancialYear(e.target.value)}
                    sx={{ height: 36 }}
                  >
                    {availableYears.map(year => (
                      <MenuItem key={year} value={year}>
                        FY {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {/* Logout Button - Hidden on mobile (shown in drawer) */}
              {!isMobile && (
                <CustomButton
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  sx={{ height: 36 }}
                >
                  Logout
                </CustomButton>
              )}

              {/* Mobile menu button */}
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{
                    ml: 1,
                    color: 'text.primary',
                  }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
