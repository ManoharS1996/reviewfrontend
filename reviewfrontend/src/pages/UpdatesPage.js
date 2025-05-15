import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
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
    endDate: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/updates');
      setUpdates(response.data);
    } catch (error) {
      console.error('Error fetching updates:', error);
    }
  };

  const handleOpen = (update = null) => {
    if (update) {
      setCurrentUpdate(update._id);
      setFormData({
        appName: update.appName,
        featuresAdded: update.featuresAdded,
        startDate: format(parseISO(update.startDate), 'yyyy-MM-dd'),
        endDate: format(parseISO(update.endDate), 'yyyy-MM-dd')
      });
    } else {
      setCurrentUpdate(null);
      setFormData({
        appName: '',
        featuresAdded: '',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd')
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentUpdate) {
        await axios.patch(`http://localhost:5000/api/updates/${currentUpdate}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/updates', formData);
      }
      fetchUpdates();
      handleClose();
    } catch (error) {
      console.error('Error saving update:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/updates/${id}`);
      fetchUpdates();
    } catch (error) {
      console.error('Error deleting update:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Developer Updates
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add Update
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>S.No</StyledTableCell>
              <StyledTableCell>App Name</StyledTableCell>
              <StyledTableCell>Features Added</StyledTableCell>
              <StyledTableCell>Start Date</StyledTableCell>
              <StyledTableCell>End Date</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {updates.map((update, index) => (
              <TableRow key={update._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{update.appName}</TableCell>
                <TableCell>{update.featuresAdded}</TableCell>
                <TableCell>{format(parseISO(update.startDate), 'MMM dd, yyyy')}</TableCell>
                <TableCell>{format(parseISO(update.endDate), 'MMM dd, yyyy')}</TableCell>
                <TableCell>
                  <Button 
                    size="small" 
                    color="primary"
                    startIcon={<Edit />}
                    onClick={() => handleOpen(update)}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => handleDelete(update._id)}
                    sx={{ ml: 1 }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentUpdate ? 'Edit Update' : 'Add New Update'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="App Name"
              name="appName"
              value={formData.appName}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              multiline
              rows={3}
              label="Features Added"
              name="featuresAdded"
              value={formData.featuresAdded}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Start Date"
              type="date"
              name="startDate"
              InputLabelProps={{ shrink: true }}
              value={formData.startDate}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="End Date"
              type="date"
              name="endDate"
              InputLabelProps={{ shrink: true }}
              value={formData.endDate}
              onChange={handleChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            {currentUpdate ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UpdatesPage;