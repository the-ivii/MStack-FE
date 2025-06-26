import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, InputLabel, FormControl, InputAdornment
} from '@mui/material';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1/users',
});

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0); // 0-based for MUI
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', organization: '', tenant: '', active: true
  });
  const [organizations, setOrganizations] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchOrganizations();
    fetchTenants();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/?page=${page + 1}&limit=${rowsPerPage}`);
      setUsers(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      // handle error (optional)
    }
    setLoading(false);
  };

  const fetchOrganizations = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/organizations?page=1&limit=100');
      setOrganizations(res.data.data);
    } catch (err) {}
  };

  const fetchTenants = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/tenants?page=1&limit=100');
      setTenants(res.data.data);
    } catch (err) {}
  };

  const handleOpen = (user = null) => {
    if (user) {
      setEditingUser(user);
      setForm({
        name: user.name || '',
        email: user.email || '',
        password: '', // Do not prefill password
        organization: user.organization?._id || '',
        tenant: user.tenant?._id || '',
        active: user.active
      });
    } else {
      setEditingUser(null);
      setForm({ name: '', email: '', password: '', organization: '', tenant: '', active: true });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingUser(null);
  };

  const handleDeleteClick = (user) => {
    setDeleteDialog({ open: true, user });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, user: null });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.user) {
      await api.delete(`/${deleteDialog.user._id}`);
      fetchUsers();
    }
    setDeleteDialog({ open: false, user: null });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingUser) {
      const updateData = { ...form };
      if (!updateData.password) delete updateData.password;
      await api.put(`/${editingUser._id}`, updateData);
    } else {
      await api.post('/', form);
    }
    fetchUsers();
    handleClose();
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    (user.organization?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (user.tenant?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>User Management</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TextField
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
          sx={{ mr: 2, width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" onClick={() => handleOpen()}>Add User</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Organization</TableCell>
              <TableCell>Tenant</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.organization?.name || ''}</TableCell>
                <TableCell>{user.tenant?.name || ''}</TableCell>
                <TableCell>{user.active ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleOpen(user)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleDeleteClick(user)} sx={{ ml: 1 }}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={e => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingUser ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="dense" label="Name" name="name" fullWidth value={form.name}
              onChange={handleChange} required
            />
            <TextField
              margin="dense" label="Email" name="email" fullWidth value={form.email}
              onChange={handleChange} required
            />
            <TextField
              margin="dense" label="Password" name="password" type="password" fullWidth value={form.password}
              onChange={handleChange} required
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="org-label">Organization</InputLabel>
              <Select
                labelId="org-label"
                name="organization"
                value={form.organization}
                label="Organization"
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>Select an organization</em>
                </MenuItem>
                {organizations.map(o => (
                  <MenuItem key={o._id} value={o._id}>{o.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel id="tenant-label">Tenant</InputLabel>
              <Select
                labelId="tenant-label"
                name="tenant"
                value={form.tenant}
                label="Tenant"
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>Select a tenant</em>
                </MenuItem>
                {tenants.map(t => (
                  <MenuItem key={t._id} value={t._id}>{t.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!form.name || !form.email || (!editingUser && !form.password)}>
            {editingUser ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialog.open} onClose={handleDeleteCancel}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete user "{deleteDialog.user?.name}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserPage; 