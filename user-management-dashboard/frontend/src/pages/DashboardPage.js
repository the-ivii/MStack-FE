import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  Domain as DomainIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import axios from 'axios';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    users: { total: 0, active: 0, inactive: 0 },
    tenants: { total: 0, active: 0, inactive: 0 },
    organizations: { total: 0, active: 0, inactive: 0 },
    roles: 0,
    privileges: 0,
    legalEntities: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [userStatusData, setUserStatusData] = useState([]);
  const [organizationData, setOrganizationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [usersRes, tenantsRes, orgsRes, rolesRes, privilegesRes, legalEntitiesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/v1/users?page=1&limit=100'),
        axios.get('http://localhost:5000/api/v1/tenants?page=1&limit=100'),
        axios.get('http://localhost:5000/api/v1/organizations?page=1&limit=100'),
        axios.get('http://localhost:5000/api/v1/roles?page=1&limit=100'),
        axios.get('http://localhost:5000/api/v1/privileges?page=1&limit=100'),
        axios.get('http://localhost:5000/api/v1/legal-entities?page=1&limit=100')
      ]);

      const users = usersRes.data.data;
      const tenants = tenantsRes.data.data;
      const organizations = orgsRes.data.data;
      const roles = rolesRes.data.data;
      const privileges = privilegesRes.data.data;
      const legalEntities = legalEntitiesRes.data.data;

      // Calculate statistics
      const userStats = {
        total: users.length,
        active: users.filter(u => u.active).length,
        inactive: users.filter(u => !u.active).length
      };

      const tenantStats = {
        total: tenants.length,
        active: tenants.filter(t => t.active).length,
        inactive: tenants.filter(t => !t.active).length
      };

      const orgStats = {
        total: organizations.length,
        active: organizations.filter(o => o.active).length,
        inactive: organizations.filter(o => !o.active).length
      };

      setStats({
        users: userStats,
        tenants: tenantStats,
        organizations: orgStats,
        roles: roles.length,
        privileges: privileges.length,
        legalEntities: legalEntities.length
      });

      // Recent users (last 5)
      setRecentUsers(users.slice(0, 5));

      // User status data for pie chart
      setUserStatusData([
        { name: 'Active', value: userStats.active, color: '#00C49F' },
        { name: 'Inactive', value: userStats.inactive, color: '#FF8042' }
      ]);

      // Organization data for bar chart (top 5 by user count)
      const orgUserCounts = organizations.map(org => {
        const userCount = users.filter(u => u.organization?._id === org._id).length;
        return { name: org.name, users: userCount };
      }).sort((a, b) => b.users - a.users).slice(0, 5);

      setOrganizationData(orgUserCounts);

    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Analytics
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats.users.total}
            icon={<PeopleIcon />}
            color="#1976d2"
            subtitle={`${stats.users.active} active, ${stats.users.inactive} inactive`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tenants"
            value={stats.tenants.total}
            icon={<DomainIcon />}
            color="#2e7d32"
            subtitle={`${stats.tenants.active} active, ${stats.tenants.inactive} inactive`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Organizations"
            value={stats.organizations.total}
            icon={<BusinessIcon />}
            color="#ed6c02"
            subtitle={`${stats.organizations.active} active, ${stats.organizations.inactive} inactive`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Roles & Privileges"
            value={`${stats.roles} / ${stats.privileges}`}
            icon={<SecurityIcon />}
            color="#9c27b0"
            subtitle="Roles / Privileges"
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* User Status Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              User Status Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Organizations by User Count */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Top Organizations by User Count
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={organizationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Users */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Users
            </Typography>
            <List>
              {recentUsers.map((user) => (
                <ListItem key={user._id} divider>
                  <ListItemAvatar>
                    <Avatar src={user.avatarUrl}>
                      {user.name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.name}
                    secondary={`${user.email} • ${user.organization?.name || 'No Organization'}`}
                  />
                  <Chip
                    label={user.active ? 'Active' : 'Inactive'}
                    color={user.active ? 'success' : 'default'}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Stats
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Legal Entities
              </Typography>
              <Typography variant="h4">
                {stats.legalEntities}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Active Users %
              </Typography>
              <Typography variant="h4">
                {stats.users.total > 0 ? Math.round((stats.users.active / stats.users.total) * 100) : 0}%
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary">
                System Health
              </Typography>
              <Chip
                label="Good"
                color="success"
                icon={<TrendingUpIcon />}
                sx={{ mt: 1 }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage; 