import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import UserList from './components/UserList';
import TenantPage from './pages/TenantPage';
import OrganizationPage from './pages/OrganizationPage';
import UserPage from './pages/UserPage';
import RolePage from './pages/RolePage';
import PrivilegePage from './pages/PrivilegePage';
import LegalEntityPage from './pages/LegalEntityPage';
import { Box, Typography, Button, Stack } from '@mui/material';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <Typography variant="h4" sx={{ flexGrow: 1 }} gutterBottom>
          User Management Dashboard
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/users')}>Users</Button>
        <Button variant="outlined" onClick={() => navigate('/tenants')}>Tenants</Button>
        <Button variant="outlined" onClick={() => navigate('/organizations')}>Organizations</Button>
        <Button variant="outlined" onClick={() => navigate('/roles')}>Roles</Button>
        <Button variant="outlined" onClick={() => navigate('/privileges')}>Privileges</Button>
        <Button variant="outlined" onClick={() => navigate('/legal-entities')}>Legal Entities</Button>
      </Stack>
      {children}
    </Box>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <UserList />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/tenants"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <TenantPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/organizations"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <OrganizationPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <UserPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/roles"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <RolePage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/privileges"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <PrivilegePage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/legal-entities"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <LegalEntityPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
