import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import api from '../api';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
}));

const UpdatesPage = () => {
  const [updates, setUpdates] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentUpdate, setCurrentUpdate] = useState(null);
  const [formData, setFormData] = useState({
    appName: '',
    featuresAdded: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const response = await api.get('/updates');
      setUpdates(response.data.data);
    } catch (error) {
      console.error('Failed to fetch updates:', error);
    }
  };

  const handleOpen = (update = null) => {
    setCurrentUpdate(update);
    if (update) {
      setFormData({
        appName: update.appName,
        featuresAdded: update.featuresAdded,
        startDate: update.startDate,
        endDate: update.endDate,
      });
    } else {
      setFormData({
        appName: '',
        featuresAdded: '',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd'),
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentUpdate(null);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (currentUpdate) {
        await api.put(`/updates/${currentUpdate._id}`, formData);
      } else {
        await api.post('/updates', formData);
      }
      fetchUpdates();
      handleClose();
    } catch (error) {
      console.error('Failed to save update:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/updates/${id}`);
      fetchUpdates();
    } catch (error) {
      console.error('Failed to delete update:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          App Updates
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          sx={{ borderRadius: '8px' }}
        >
          Add Update
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <StyledTableCell>App Name</StyledTableCell>
              <StyledTableCell>Features Added</StyledTableCell>
              <StyledTableCell>Start Date</StyledTableCell>
              <StyledTableCell>End Date</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {updates.map((update) => (
              <TableRow key={update._id} hover>
                <TableCell>{update.appName}</TableCell>
                <TableCell>{update.featuresAdded}</TableCell>
                <TableCell>{format(new Date(update.startDate), 'yyyy-MM-dd')}</TableCell>
                <TableCell>{format(new Date(update.endDate), 'yyyy-MM-dd')}</TableCell>
                <TableCell>
                  <Button
                    startIcon={<Edit />}
                    onClick={() => handleOpen(update)}
                    sx={{ marginRight: 1, borderRadius: '8px' }}
                  >
                    Edit
                  </Button>
                  <Button
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => handleDelete(update._id)}
                    sx={{ borderRadius: '8px' }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ backgroundColor: '#1976d2', color: 'white' }}>
          {currentUpdate ? 'Edit Update' : 'Add Update'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="App Name"
              name="appName"
              value={formData.appName}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Features Added"
              name="featuresAdded"
              value={formData.featuresAdded}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Start Date"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ borderRadius: '8px' }}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            sx={{ borderRadius: '8px' }}
          >
            {currentUpdate ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UpdatesPage;