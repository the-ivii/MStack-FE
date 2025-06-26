import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, InputLabel, FormControl, InputAdornment
} from '@mui/material';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1/legal-entities',
});

const LegalEntityPage = () => {
  const [entities, setEntities] = useState([]);
  const [page, setPage] = useState(0); // 0-based for MUI
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', type: '', organization: '', tenant: '', active: true });
  const [editingEntity, setEditingEntity] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, entity: null });
  const [organizations, setOrganizations] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchEntities();
    // eslint-disable-next-line
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchOrganizations();
    fetchTenants();
  }, []);

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

  const fetchEntities = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/?page=${page + 1}&limit=${rowsPerPage}`);
      setEntities(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      // handle error (optional)
    }
    setLoading(false);
  };

  const handleOpen = (entity = null) => {
    if (entity) {
      setEditingEntity(entity);
      setForm({
        name: entity.name || '',
        description: entity.description || '',
        type: entity.type || '',
        organization: entity.organization?._id || '',
        tenant: entity.tenant?._id || '',
        active: entity.active
      });
    } else {
      setEditingEntity(null);
      setForm({ name: '', description: '', type: '', organization: '', tenant: '', active: true });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingEntity(null);
  };

  const handleDeleteClick = (entity) => {
    setDeleteDialog({ open: true, entity });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, entity: null });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.entity) {
      await api.delete(`/${deleteDialog.entity._id}`);
      fetchEntities();
    }
    setDeleteDialog({ open: false, entity: null });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingEntity) {
      await api.put(`/${editingEntity._id}`, form);
    } else {
      await api.post('/', form);
    }
    fetchEntities();
    handleClose();
  };

  const filteredEntities = entities.filter(entity =>
    entity.name.toLowerCase().includes(search.toLowerCase()) ||
    (entity.description || '').toLowerCase().includes(search.toLowerCase()) ||
    (entity.type || '').toLowerCase().includes(search.toLowerCase()) ||
    (entity.organization?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (entity.tenant?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Legal Entity Management</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TextField
          placeholder="Search legal entities..."
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
        <Button variant="contained" onClick={() => handleOpen()}>Add Legal Entity</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Organization</TableCell>
              <TableCell>Tenant</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEntities.map((entity) => (
              <TableRow key={entity._id}>
                <TableCell>{entity.name}</TableCell>
                <TableCell>{entity.description}</TableCell>
                <TableCell>{entity.type}</TableCell>
                <TableCell>{entity.organization?.name || ''}</TableCell>
                <TableCell>{entity.tenant?.name || ''}</TableCell>
                <TableCell>{entity.active ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleOpen(entity)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleDeleteClick(entity)} sx={{ ml: 1 }}>Delete</Button>
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
        <DialogTitle>{editingEntity ? 'Edit Legal Entity' : 'Add Legal Entity'}</DialogTitle>
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
              margin="dense" label="Type" name="type" fullWidth value={form.type}
              onChange={handleChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="org-label">Organization</InputLabel>
              <Select
                labelId="org-label"
                name="organization"
                value={form.organization}
                label="Organization"
                onChange={handleChange}
                required
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
          <Button onClick={handleSubmit} variant="contained" disabled={!form.name || !form.organization}>
            {editingEntity ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialog.open} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Legal Entity</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete legal entity "{deleteDialog.entity?.name}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LegalEntityPage; 