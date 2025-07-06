import React, { useState, useEffect, useCallback } from 'react';
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
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip
} from '@mui/material';
import { Add, Edit, Delete, Notifications, AccessTime } from '@mui/icons-material';
import api from '../api';

const timeSlots = [
  '00:00-01:00', '01:00-02:00', '02:00-03:00', '03:00-04:00', 
  '04:00-05:00', '05:00-06:00', '06:00-07:00', '07:00-08:00',
  '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
  '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00',
  '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00',
  '20:00-21:00', '21:00-22:00', '22:00-23:00', '23:00-00:00',
  '00:00-02:00', '02:00-04:00', '04:00-06:00', '06:00-08:00',
  '08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00',
  '16:00-18:00', '18:00-20:00', '20:00-22:00', '22:00-00:00'
];

const statusOptions = ['Scheduled', 'In Progress', 'Completed', 'Failed'];
const statusColors = {
  Scheduled: 'primary',
  'In Progress': 'warning',
  Completed: 'success',
  Failed: 'error'
};

const developerEmails = [
  'manojkumar.chandanada@nowitservices.com',
  'sivakumar.erugu@nowitservices.com',
  'kartheek.muppiri@nowitservices.com',
  'sandhya.chattu@nowitservices.com',
  'sriram.k@nowitservices.com',
  'praveen.kournopo@nowitservices.com',
  'manohar.srungaram@nowitservices.com'
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
    developers: [],
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
      const { data } = await api.get('/schedules');
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

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
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
        developers: [],
        notes: ''
      });
    }
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        timings: formData.timeSlot
      };

      if (currentSchedule) {
        await api.patch(`/schedules/${currentSchedule}`, data);
        showSnackbar('Schedule updated successfully!', 'success');
      } else {
        await api.post('/schedules', data);
        showSnackbar('Schedule created successfully!', 'success');
      }
      fetchSchedules();
      setOpenForm(false);
    } catch (error) {
      showSnackbar(error.response?.data?.error || 'Error saving schedule', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/schedules/${id}`);
      showSnackbar('Schedule deleted successfully!', 'success');
      fetchSchedules();
    } catch (error) {
      showSnackbar('Error deleting schedule', 'error');
    }
  };

  const handleOpenStatusDialog = (scheduleId, status) => {
    setStatusDialog({
      open: true,
      scheduleId,
      status,
      failureReason: ''
    });
  };

  const handleCloseStatusDialog = () => {
    setStatusDialog(prev => ({ ...prev, open: false }));
  };

  const handleStatusChange = async () => {
    try {
      await api.patch(
        `/schedules/${statusDialog.scheduleId}`,
        {
          status: statusDialog.status,
          failureReason: statusDialog.status === 'Failed' ? statusDialog.failureReason : undefined
        }
      );
      showSnackbar(`Status updated to ${statusDialog.status}`, 'success');
      fetchSchedules();
      setStatusDialog(prev => ({ ...prev, open: false }));
    } catch (error) {
      showSnackbar('Error updating status', 'error');
    }
  };

  const handleResendNotification = async (id) => {
    try {
      await api.post(`/schedules/${id}/notify`, {});
      showSnackbar('Notification resent successfully!', 'success');
    } catch (error) {
      showSnackbar('Error resending notification', 'error');
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
          onClick={() => handleOpenForm()}
        >
          New Schedule
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>App Name</TableCell>
                <TableCell>Deployment Date</TableCell>
                <TableCell>Time Slot</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Developers</TableCell>
                <TableCell>Actions</TableCell>
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
                  <TableRow key={schedule._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{schedule.appName}</TableCell>
                    <TableCell>
                      {format(parseISO(schedule.deploymentDate), 'MMM dd, yyyy')}
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTime fontSize="small" sx={{ mr: 0.5 }} />
                        {schedule.timeSlot}
                      </Box>
                    </TableCell>
                    <TableCell>{schedule.timeSlot}</TableCell>
                    <TableCell>
                      <FormControl fullWidth size="small">
                        <Select
                          value={schedule.status}
                          onChange={(e) => handleOpenStatusDialog(schedule._id, e.target.value)}
                        >
                          {statusOptions.map((status) => (
                            <MenuItem 
                              key={status} 
                              value={status}
                              sx={{ backgroundColor: `${statusColors[status]}.light`, color: 'white' }}
                            >
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
      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="sm">
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
              onChange={handleFormChange}
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
              onChange={handleFormChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Time Slot</InputLabel>
              <Select
                name="timeSlot"
                value={formData.timeSlot}
                onChange={handleFormChange}
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
              onChange={handleFormChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Developers</InputLabel>
              <Select
                multiple
                name="developers"
                value={formData.developers}
                onChange={handleFormChange}
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
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            {currentSchedule ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Change Dialog */}
      <Dialog open={statusDialog.open} onClose={handleCloseStatusDialog}>
        <DialogTitle>Update Deployment Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={statusDialog.status}
              onChange={(e) => setStatusDialog(prev => ({ ...prev, status: e.target.value }))}
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
              onChange={(e) => setStatusDialog(prev => ({ ...prev, failureReason: e.target.value }))}
              required
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog}>Cancel</Button>
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
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SchedulePage;