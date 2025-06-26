import React, { useEffect, useState } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Typography, InputAdornment, TablePagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
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
  const [deleteDialog, setDeleteDialog] = useState({ open: false, tenant: null });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0); // 0-based for MUI
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchTenants();
    // eslint-disable-next-line
  }, [page, rowsPerPage]);

  const fetchTenants = async () => {
    const res = await api.get(`/?page=${page + 1}&limit=${rowsPerPage}`);
    setTenants(res.data.data);
    setTotal(res.data.total);
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

  const handleDeleteClick = (tenant) => {
    setDeleteDialog({ open: true, tenant });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.tenant) {
      await api.delete(`/${deleteDialog.tenant.id}`);
      fetchTenants();
    }
    setDeleteDialog({ open: false, tenant: null });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, tenant: null });
  };

  // Filter tenants by search
  const filteredTenants = tenants.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase()) ||
    t.phone.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Tenant Management</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TextField
          placeholder="Search tenants..."
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
        <Button variant="contained" onClick={() => handleOpen()}>Add Tenant</Button>
      </Box>
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
            {filteredTenants.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell>{tenant.name}</TableCell>
                <TableCell>{tenant.description}</TableCell>
                <TableCell>{tenant.email}</TableCell>
                <TableCell>{tenant.phone}</TableCell>
                <TableCell>{tenant.website}</TableCell>
                <TableCell>{tenant.active ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleOpen(tenant)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleDeleteClick(tenant)} sx={{ ml: 1 }}>Delete</Button>
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

      <Dialog open={deleteDialog.open} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Tenant</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete tenant "{deleteDialog.tenant?.name}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TenantPage; 