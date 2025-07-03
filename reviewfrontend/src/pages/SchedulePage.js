import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import {
  Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Button, Chip, Box, CircularProgress, Snackbar, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select,
  MenuItem, FormControl, InputLabel, IconButton, Tooltip
} from '@mui/material';
import { Add, Edit, Delete, Notifications, AccessTime } from '@mui/icons-material';

// Generate time slots for the entire day (1-hour and 2-hour slots)
const generateTimeSlots = () => {
  const slots = [];
  // 1-hour slots
  for (let hour = 0; hour < 24; hour++) {
    const startHour = hour.toString().padStart(2, '0');
    const endHour = (hour + 1).toString().padStart(2, '0');
    slots.push(`${startHour}:00-${endHour}:00`);
  }
  // 2-hour slots
  for (let hour = 0; hour < 24; hour += 2) {
    const startHour = hour.toString().padStart(2, '0');
    const endHour = (hour + 2).toString().padStart(2, '0');
    slots.push(`${startHour}:00-${endHour}:00`);
  }
  return [...new Set(slots)].sort();
};

const timeSlots = generateTimeSlots();

const statusOptions = ['Scheduled', 'In Progress', 'Completed', 'Failed'];
const statusColors = {
  Scheduled: 'primary',
  'In Progress': 'warning',
  Completed: 'success',
  Failed: 'error'
};

const developerEmails = [
  'manohar142652@gmail.com',
  'manohar.srungaram@nowitservices.com',
  'manojkumar.chandanada@nowitservices.com',
  'sivakumar.erugu@nowitservices.com',
  'kartheek.muppiri@nowitservices.com',
  'sandhya.chattu@nowitservices.com',
  'sriram.k@nowitservices.com',
  'praveen.kournopo@nowitservices.com'
];

const SchedulePage = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [statusDialog, setStatusDialog] = useState({
    open: false,
    scheduleId: null,
    status: '',
    failureReason: ''
  });
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [formData, setFormData] = useState({
    appName: '',
    deploymentDate: format(new Date(), 'yyyy-MM-dd'),
    timeSlot: timeSlots[0],
    status: 'Scheduled',
    developers: ['manohar142652@gmail.com'],
    notes: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:5000/api/schedules');
      setSchedules(data.data);
    } catch (error) {
      showSnackbar('Error loading schedules', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenForm = (schedule = null) => {
    if (schedule) {
      setCurrentSchedule(schedule._id);
      setFormData({
        appName: schedule.appName,
        deploymentDate: format(parseISO(schedule.deploymentDate), 'yyyy-MM-dd'),
        timeSlot: schedule.timeSlot,
        status: schedule.status,
        developers: schedule.developers,
        notes: schedule.notes || ''
      });
    } else {
      setCurrentSchedule(null);
      setFormData({
        appName: '',
        deploymentDate: format(new Date(), 'yyyy-MM-dd'),
        timeSlot: timeSlots[0],
        status: 'Scheduled',
        developers: ['manohar142652@gmail.com'],
        notes: ''
      });
    }
    setOpenForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        scheduledBy: 'frontend-user'
      };

      if (currentSchedule) {
        await axios.patch(
          `http://localhost:5000/api/schedules/${currentSchedule}`,
          data
        );
        showSnackbar('Schedule updated successfully!', 'success');
      } else {
        await axios.post(
          'http://localhost:5000/api/schedules',
          data
        );
        showSnackbar('Schedule created successfully!', 'success');
      }
      fetchSchedules();
      setOpenForm(false);
    } catch (error) {
      showSnackbar('Error saving schedule', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/schedules/${id}`);
      showSnackbar('Schedule deleted successfully!', 'success');
      fetchSchedules();
    } catch (error) {
      showSnackbar('Error deleting schedule', 'error');
    }
  };

  const handleStatusChange = async () => {
    try {
      await axios.patch(
        `http://localhost:5000/api/schedules/${statusDialog.scheduleId}/status`,
        {
          status: statusDialog.status,
          failureReason: statusDialog.status === 'Failed' ? statusDialog.failureReason : undefined
        }
      );
      showSnackbar(`Status updated to ${statusDialog.status}`, 'success');
      fetchSchedules();
      setStatusDialog({ ...statusDialog, open: false });
    } catch (error) {
      showSnackbar('Error updating status', 'error');
    }
  };

  const handleResendNotification = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/schedules/${id}/notify`);
      showSnackbar('Notification resent successfully!', 'success');
    } catch (error) {
      showSnackbar('Error resending notification', 'error');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Deployment Schedule
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpenForm()}
          sx={{ boxShadow: 3 }}
        >
          New Schedule
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>#</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>App Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Deployment Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Time Slot</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Developers</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No schedules found
                  </TableCell>
                </TableRow>
              ) : (
                schedules.map((schedule, index) => (
                  <TableRow key={schedule._id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{schedule.appName}</TableCell>
                    <TableCell>
                      {format(parseISO(schedule.deploymentDate), 'MMM dd, yyyy')}
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                        <AccessTime fontSize="small" sx={{ mr: 0.5 }} />
                        {schedule.timeSlot}
                      </Box>
                    </TableCell>
                    <TableCell>{schedule.timeSlot}</TableCell>
                    <TableCell>
                      <FormControl fullWidth size="small">
                        <Select
                          value={schedule.status}
                          onChange={(e) => {
                            setStatusDialog({
                              open: true,
                              scheduleId: schedule._id,
                              status: e.target.value,
                              failureReason: schedule.failureReason || ''
                            });
                          }}
                          sx={{
                            backgroundColor: `${statusColors[schedule.status]}.light`,
                            color: 'common.white',
                            fontWeight: 'bold',
                            '& .MuiSelect-icon': {
                              color: 'common.white'
                            }
                          }}
                        >
                          {statusOptions.map((status) => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      {schedule.developers.map((dev, i) => (
                        <Chip key={i} label={dev} size="small" sx={{ mr: 1, mb: 1 }} />
                      ))}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Edit />}
                          onClick={() => handleOpenForm(schedule)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() => handleDelete(schedule._id)}
                        >
                          Delete
                        </Button>
                        <Tooltip title="Resend notification">
                          <IconButton
                            color="primary"
                            onClick={() => handleResendNotification(schedule._id)}
                          >
                            <Notifications />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Schedule Form Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
        <DialogTitle>{currentSchedule ? 'Edit Schedule' : 'Create New Schedule'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="App Name"
              name="appName"
              value={formData.appName}
              onChange={(e) => setFormData({...formData, appName: e.target.value})}
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
              onChange={(e) => setFormData({...formData, deploymentDate: e.target.value})}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Time Slot</InputLabel>
              <Select
                name="timeSlot"
                value={formData.timeSlot}
                onChange={(e) => setFormData({...formData, timeSlot: e.target.value})}
                label="Time Slot"
              >
                {timeSlots.map(slot => (
                  <MenuItem key={slot} value={slot}>{slot}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              fullWidth
              multiline
              rows={3}
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Developers</InputLabel>
              <Select
                multiple
                name="developers"
                value={formData.developers}
                onChange={(e) => setFormData({...formData, developers: e.target.value})}
                label="Developers"
                renderValue={(selected) => selected.join(', ')}
              >
                {developerEmails.map((email) => (
                  <MenuItem key={email} value={email}>{email}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            {currentSchedule ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Change Dialog */}
      <Dialog open={statusDialog.open} onClose={() => setStatusDialog({ ...statusDialog, open: false })}>
        <DialogTitle>Update Deployment Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={statusDialog.status}
              onChange={(e) => setStatusDialog({ ...statusDialog, status: e.target.value })}
              label="Status"
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {statusDialog.status === 'Failed' && (
            <TextField
              margin="normal"
              fullWidth
              multiline
              rows={3}
              label="Failure Reason"
              value={statusDialog.failureReason}
              onChange={(e) => setStatusDialog({ ...statusDialog, failureReason: e.target.value })}
              required
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog({ ...statusDialog, open: false })}>Cancel</Button>
          <Button 
            onClick={handleStatusChange} 
            color="primary" 
            variant="contained"
            disabled={statusDialog.status === 'Failed' && !statusDialog.failureReason}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({...snackbar, open: false})}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({...snackbar, open: false})} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SchedulePage;