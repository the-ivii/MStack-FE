import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Typography, Button, Stack, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UserList from './components/UserList';
import TenantPage from './pages/TenantPage';
import OrganizationPage from './pages/OrganizationPage';
import UserPage from './pages/UserPage';
import RolePage from './pages/RolePage';
import PrivilegePage from './pages/PrivilegePage';
import LegalEntityPage from './pages/LegalEntityPage';
import { AuthProvider } from './context/AuthContext';
import theme from './theme';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const themeHook = useTheme();
  const isMobile = useMediaQuery(themeHook.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Users', path: '/users' },
    { label: 'Tenants', path: '/tenants' },
    { label: 'Organizations', path: '/organizations' },
    { label: 'Roles', path: '/roles' },
    { label: 'Privileges', path: '/privileges' },
    { label: 'Legal Entities', path: '/legal-entities' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <List>
        {navigationItems.map((item) => (
          <ListItem 
            button 
            key={item.path} 
            onClick={() => handleNavigation(item.path)}
            sx={{
              borderRadius: 1,
              mx: 1,
              mb: 0.5,
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'white',
              },
            }}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="primary"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              color: 'text.primary',
              fontWeight: 700,
            }}
          >
            User Management Dashboard
          </Typography>
          {!isMobile && (
            <Stack direction="row" spacing={1}>
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  variant="outlined"
                  size="small"
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 250,
              backgroundColor: 'background.paper',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
        {children}
      </Box>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <DashboardLayout>
                  <DashboardPage />
                </DashboardLayout>
              </PrivateRoute>
            } />
            <Route path="/users" element={
              <PrivateRoute>
                <DashboardLayout>
                  <UserPage />
                </DashboardLayout>
              </PrivateRoute>
            } />
            <Route path="/tenants" element={
              <PrivateRoute>
                <DashboardLayout>
                  <TenantPage />
                </DashboardLayout>
              </PrivateRoute>
            } />
            <Route path="/organizations" element={
              <PrivateRoute>
                <DashboardLayout>
                  <OrganizationPage />
                </DashboardLayout>
              </PrivateRoute>
            } />
            <Route path="/roles" element={
              <PrivateRoute>
                <DashboardLayout>
                  <RolePage />
                </DashboardLayout>
              </PrivateRoute>
            } />
            <Route path="/privileges" element={
              <PrivateRoute>
                <DashboardLayout>
                  <PrivilegePage />
                </DashboardLayout>
              </PrivateRoute>
            } />
            <Route path="/legal-entities" element={
              <PrivateRoute>
                <DashboardLayout>
                  <LegalEntityPage />
                </DashboardLayout>
              </PrivateRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
