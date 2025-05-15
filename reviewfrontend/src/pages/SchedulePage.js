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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Box
} from '@mui/material';
import { Add, Edit, Delete, AccessTime } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const statusColors = {
  'Scheduled': 'primary',
  'In Progress': 'warning',
  'Completed': 'success'
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
}));

const sampleData = [
  {
    appName: 'Inventory App',
    deploymentDate: format(new Date(), 'yyyy-MM-dd'),
    timings: '10:00 AM - 11:00 AM',
    status: 'Scheduled',
    notes: 'Initial deployment for testing'
  },
  {
    appName: 'Sales Portal',
    deploymentDate: format(new Date(), 'yyyy-MM-dd'),
    timings: '02:00 PM - 03:30 PM',
    status: 'In Progress',
    notes: 'Includes new reports and fixes'
  }
];

const SchedulePage = () => {
  const [schedules, setSchedules] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [formData, setFormData] = useState({
    appName: '',
    deploymentDate: format(new Date(), 'yyyy-MM-dd'),
    timings: '',
    status: 'Scheduled',
    notes: ''
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/schedules');
      if (response.data.length === 0) {
        // Load sample data if backend is empty
        for (let item of sampleData) {
          await axios.post('http://localhost:5000/api/schedules', item);
        }
        const newResponse = await axios.get('http://localhost:5000/api/schedules');
        setSchedules(newResponse.data);
      } else {
        setSchedules(response.data);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const handleOpen = (schedule = null) => {
    if (schedule) {
      setCurrentSchedule(schedule._id);
      setFormData({
        appName: schedule.appName,
        deploymentDate: format(parseISO(schedule.deploymentDate), 'yyyy-MM-dd'),
        timings: schedule.timings,
        status: schedule.status,
        notes: schedule.notes
      });
    } else {
      setCurrentSchedule(null);
      setFormData({
        appName: '',
        deploymentDate: format(new Date(), 'yyyy-MM-dd'),
        timings: '',
        status: 'Scheduled',
        notes: ''
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
      if (currentSchedule) {
        await axios.patch(`http://localhost:5000/api/schedules/${currentSchedule}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/schedules', formData);
      }
      fetchSchedules();
      handleClose();
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/schedules/${id}`);
      fetchSchedules();
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Deployment Schedule
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add Schedule
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>S.No</StyledTableCell>
              <StyledTableCell>App Name</StyledTableCell>
              <StyledTableCell>Deployment Date</StyledTableCell>
              <StyledTableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTime sx={{ mr: 1 }} />
                  Timings
                </Box>
              </StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Notes</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.map((schedule, index) => (
              <TableRow key={schedule._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{schedule.appName}</TableCell>
                <TableCell>{format(parseISO(schedule.deploymentDate), 'MMM dd, yyyy')}</TableCell>
                <TableCell>{schedule.timings}</TableCell>
                <TableCell>
                  <Chip
                    label={schedule.status}
                    color={statusColors[schedule.status] || 'default'}
                  />
                </TableCell>
                <TableCell>{schedule.notes}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    color="primary"
                    startIcon={<Edit />}
                    onClick={() => handleOpen(schedule)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => handleDelete(schedule._id)}
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
        <DialogTitle>{currentSchedule ? 'Edit Schedule' : 'Add New Schedule'}</DialogTitle>
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
              label="Deployment Date"
              type="date"
              name="deploymentDate"
              InputLabelProps={{ shrink: true }}
              value={formData.deploymentDate}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Timings"
              name="timings"
              value={formData.timings}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              {['Scheduled', 'In Progress', 'Completed'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="normal"
              fullWidth
              multiline
              rows={3}
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            {currentSchedule ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SchedulePage;
