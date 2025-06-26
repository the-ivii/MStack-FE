import React, { useEffect, useState } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Typography
} from '@mui/material';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1/tenants',
});

const TenantPage = () => {
  const [tenants, setTenants] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', email: '', phone: '', website: '', active: true,
  });

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    const res = await api.get('/');
    setTenants(res.data.data);
  };

  const handleOpen = (tenant = null) => {
    setEditingTenant(tenant);
    setForm(tenant ? { ...tenant } : {
      name: '', description: '', email: '', phone: '', website: '', active: true,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTenant(null);
    setForm({ name: '', description: '', email: '', phone: '', website: '', active: true });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingTenant) {
      await api.put(`/${editingTenant.id}`, form);
    } else {
      await api.post('/', form);
    }
    fetchTenants();
    handleClose();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Tenant Management</Typography>
      <Button variant="contained" onClick={() => handleOpen()} sx={{ mb: 2 }}>Add Tenant</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Website</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tenants.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell>{tenant.name}</TableCell>
                <TableCell>{tenant.description}</TableCell>
                <TableCell>{tenant.email}</TableCell>
                <TableCell>{tenant.phone}</TableCell>
                <TableCell>{tenant.website}</TableCell>
                <TableCell>{tenant.active ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleOpen(tenant)}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingTenant ? 'Edit Tenant' : 'Add Tenant'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="dense" label="Name" name="name" fullWidth value={form.name}
              onChange={handleChange} required
            />
            <TextField
              margin="dense" label="Description" name="description" fullWidth value={form.description}
              onChange={handleChange}
            />
            <TextField
              margin="dense" label="Email" name="email" fullWidth value={form.email}
              onChange={handleChange}
            />
            <TextField
              margin="dense" label="Phone" name="phone" fullWidth value={form.phone}
              onChange={handleChange}
            />
            <TextField
              margin="dense" label="Website" name="website" fullWidth value={form.website}
              onChange={handleChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingTenant ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TenantPage; 