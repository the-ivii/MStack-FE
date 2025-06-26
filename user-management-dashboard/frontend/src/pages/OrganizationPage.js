import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, InputLabel, FormControl, InputAdornment
} from '@mui/material';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1/organizations',
});

const OrganizationPage = () => {
  const [organizations, setOrganizations] = useState([]);
  const [page, setPage] = useState(0); // 0-based for MUI
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', email: '', phone: '', website: '', active: true, tenant: ''
  });
  const [tenants, setTenants] = useState([]);
  const [editingOrg, setEditingOrg] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, org: null });
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchOrganizations();
    // eslint-disable-next-line
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/?page=${page + 1}&limit=${rowsPerPage}`);
      setOrganizations(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      // handle error (optional)
    }
    setLoading(false);
  };

  const fetchTenants = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/tenants?page=1&limit=100');
      setTenants(res.data.data);
    } catch (err) {}
  };

  const handleOpen = (org = null) => {
    if (org) {
      setEditingOrg(org);
      setForm({
        name: org.name || '',
        description: org.description || '',
        email: org.email || '',
        phone: org.phone || '',
        website: org.website || '',
        active: org.active,
        tenant: org.tenant?._id || ''
      });
    } else {
      setEditingOrg(null);
      setForm({ name: '', description: '', email: '', phone: '', website: '', active: true, tenant: '' });
    }
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setEditingOrg(null);
  };

  const handleDeleteClick = (org) => {
    setDeleteDialog({ open: true, org });
  };
  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, org: null });
  };
  const handleDeleteConfirm = async () => {
    if (deleteDialog.org) {
      await api.delete(`/${deleteDialog.org._id}`);
      fetchOrganizations();
    }
    setDeleteDialog({ open: false, org: null });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('handleChange:', name, value);
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingOrg) {
      await api.put(`/${editingOrg._id}`, form);
    } else {
      await api.post('/', form);
    }
    fetchOrganizations();
    handleClose();
  };

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(search.toLowerCase()) ||
    (org.description || '').toLowerCase().includes(search.toLowerCase()) ||
    (org.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (org.phone || '').toLowerCase().includes(search.toLowerCase())
  );

  console.log('Tenants:', tenants);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Organization Management</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TextField
          placeholder="Search organizations..."
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
        <Button variant="contained" onClick={() => handleOpen()}>Add Organization</Button>
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
              <TableCell>Tenant</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrganizations.map((org) => (
              <TableRow key={org._id}>
                <TableCell>{org.name}</TableCell>
                <TableCell>{org.description}</TableCell>
                <TableCell>{org.email}</TableCell>
                <TableCell>{org.phone}</TableCell>
                <TableCell>{org.website}</TableCell>
                <TableCell>{org.active ? 'Yes' : 'No'}</TableCell>
                <TableCell>{org.tenant?.name || ''}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleOpen(org)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleDeleteClick(org)} sx={{ ml: 1 }}>Delete</Button>
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
        <DialogTitle>{editingOrg ? 'Edit Organization' : 'Add Organization'}</DialogTitle>
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
            <FormControl fullWidth margin="dense">
              <InputLabel id="tenant-label">Tenant</InputLabel>
              <Select
                labelId="tenant-label"
                name="tenant"
                value={form.tenant || ''}
                label="Tenant"
                onChange={handleChange}
                required
                disabled={tenants.length === 0}
              >
                <MenuItem value="">
                  <em>Select a tenant</em>
                </MenuItem>
                {tenants.map(t => (
                  <MenuItem key={t._id} value={String(t._id)}>{t.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!form.tenant || !form.name}>
            {editingOrg ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialog.open} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Organization</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete organization "{deleteDialog.org?.name}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrganizationPage; 