'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Button as CustomButton } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useFinancialYear } from '@/hooks/use-financial-year';

const Header: React.FC = () => {
  const { logout } = useAuth();
  const { selectedFinancialYear, availableYears, switchFinancialYear } =
    useFinancialYear();
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
    <Box>
      <List>
        {navigation.map(item => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              component={Link}
              href={item.href}
              selected={item.current}
              onClick={handleDrawerToggle}
            >
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
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
          <Toolbar sx={{ justifyContent: 'space-between', height: 64 }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                {navigation.map(item => (
                  <Button
                    key={item.name}
                    component={Link}
                    href={item.href}
                    variant={item.current ? 'contained' : 'text'}
                    color={item.current ? 'primary' : 'inherit'}
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Financial Year Selector */}
              <FormControl size="small" sx={{ minWidth: 120 }}>
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

              {/* Logout Button */}
              <CustomButton variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </CustomButton>

              {/* Mobile menu button */}
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ ml: 1 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
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
            width: 240,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
