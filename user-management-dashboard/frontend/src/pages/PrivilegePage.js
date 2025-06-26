import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1/privileges',
});

const PrivilegePage = () => {
  const [privileges, setPrivileges] = useState([]);
  const [page, setPage] = useState(0); // 0-based for MUI
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editingPrivilege, setEditingPrivilege] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, privilege: null });

  useEffect(() => {
    fetchPrivileges();
    // eslint-disable-next-line
  }, [page, rowsPerPage]);

  const fetchPrivileges = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/?page=${page + 1}&limit=${rowsPerPage}`);
      setPrivileges(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      // handle error (optional)
    }
    setLoading(false);
  };

  const handleOpen = (priv = null) => {
    if (priv) {
      setEditingPrivilege(priv);
      setForm({ name: priv.name || '', description: priv.description || '' });
    } else {
      setEditingPrivilege(null);
      setForm({ name: '', description: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingPrivilege(null);
  };

  const handleDeleteClick = (priv) => {
    setDeleteDialog({ open: true, privilege: priv });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, privilege: null });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.privilege) {
      await api.delete(`/${deleteDialog.privilege._id}`);
      fetchPrivileges();
    }
    setDeleteDialog({ open: false, privilege: null });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingPrivilege) {
      await api.put(`/${editingPrivilege._id}`, form);
    } else {
      await api.post('/', form);
    }
    fetchPrivileges();
    handleClose();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Privilege Management</Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={() => handleOpen()}>Add Privilege</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {privileges.map((priv) => (
              <TableRow key={priv._id}>
                <TableCell>{priv.name}</TableCell>
                <TableCell>{priv.description}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleOpen(priv)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleDeleteClick(priv)} sx={{ ml: 1 }}>Delete</Button>
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
        <DialogTitle>{editingPrivilege ? 'Edit Privilege' : 'Add Privilege'}</DialogTitle>
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!form.name}>
            {editingPrivilege ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialog.open} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Privilege</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete privilege "{deleteDialog.privilege?.name}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PrivilegePage; 