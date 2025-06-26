import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, InputLabel, FormControl, Checkbox, ListItemText
} from '@mui/material';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1/roles',
});

const RolePage = () => {
  const [roles, setRoles] = useState([]);
  const [page, setPage] = useState(0); // 0-based for MUI
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', privileges: [] });
  const [editingRole, setEditingRole] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, role: null });
  const [privileges, setPrivileges] = useState([]);

  useEffect(() => {
    fetchRoles();
    // eslint-disable-next-line
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchPrivileges();
  }, []);

  const fetchPrivileges = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/privileges?page=1&limit=100');
      setPrivileges(res.data.data);
    } catch (err) {}
  };

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/?page=${page + 1}&limit=${rowsPerPage}`);
      setRoles(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      // handle error (optional)
    }
    setLoading(false);
  };

  const handleOpen = (role = null) => {
    if (role) {
      setEditingRole(role);
      setForm({
        name: role.name || '',
        description: role.description || '',
        privileges: (role.privileges || []).map(p => p._id || p)
      });
    } else {
      setEditingRole(null);
      setForm({ name: '', description: '', privileges: [] });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingRole(null);
  };

  const handleDeleteClick = (role) => {
    setDeleteDialog({ open: true, role });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, role: null });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.role) {
      await api.delete(`/${deleteDialog.role._id}`);
      fetchRoles();
    }
    setDeleteDialog({ open: false, role: null });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handlePrivilegesChange = (e) => {
    setForm(f => ({ ...f, privileges: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingRole) {
      await api.put(`/${editingRole._id}`, form);
    } else {
      await api.post('/', form);
    }
    fetchRoles();
    handleClose();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Role Management</Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={() => handleOpen()}>Add Role</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Privileges</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role._id}>
                <TableCell>{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>{(role.privileges || []).map(p => p.name).join(', ')}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleOpen(role)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleDeleteClick(role)} sx={{ ml: 1 }}>Delete</Button>
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
        <DialogTitle>{editingRole ? 'Edit Role' : 'Add Role'}</DialogTitle>
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
            <FormControl fullWidth margin="dense">
              <InputLabel id="priv-label">Privileges</InputLabel>
              <Select
                labelId="priv-label"
                name="privileges"
                multiple
                value={form.privileges}
                onChange={handlePrivilegesChange}
                renderValue={selected =>
                  privileges.filter(p => selected.includes(p._id)).map(p => p.name).join(', ')
                }
              >
                {privileges.map(p => (
                  <MenuItem key={p._id} value={p._id}>
                    <Checkbox checked={form.privileges.indexOf(p._id) > -1} />
                    <ListItemText primary={p.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!form.name}>
            {editingRole ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialog.open} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Role</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete role "{deleteDialog.role?.name}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RolePage; 