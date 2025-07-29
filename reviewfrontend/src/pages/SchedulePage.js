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
  Tooltip,
  Menu,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Zoom
} from '@mui/material';
import { Add, Edit, Delete, Notifications, AccessTime } from '@mui/icons-material';
import { styled, keyframes } from '@mui/system';
import api from '../api';

// Custom animations
const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
`;

const floating = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

const gradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled components
const PulseButton = styled(Button)({
  animation: `${pulse} 2s infinite`,
});

const FloatingBox = styled(Box)({
  animation: `${floating} 3s ease-in-out infinite`,
});

const AnimatedGradientBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
  backgroundSize: '400% 400%',
  animation: `${gradient} 15s ease infinite`,
  borderRadius: '16px',
  padding: '2rem',
  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
}));

const GlowCircularProgress = styled(CircularProgress)(({ theme }) => ({
  '& circle': {
    strokeLinecap: 'round',
    stroke: theme.palette.primary.main,
    filter: 'drop-shadow(0 0 8px rgba(25, 118, 210, 0.6))',
  },
}));

const GradientLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  background: 'linear-gradient(to right, #1976d2, #4facfe)',
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
    background: 'linear-gradient(to right, #4facfe, #00f2fe)',
    animation: `${gradient} 3s ease infinite`,
  },
}));

// Time slot configuration
const timeSlotGroups = {
  '1-hour': [
    { value: '00:00-01:00', label: '00:00-01:00', emoji: '🕛' },
    { value: '01:00-02:00', label: '01:00-02:00', emoji: '🕐' },
    { value: '02:00-03:00', label: '02:00-03:00', emoji: '🕑' },
    { value: '03:00-04:00', label: '03:00-04:00', emoji: '🕒' },
    { value: '04:00-05:00', label: '04:00-05:00', emoji: '🕓' },
    { value: '05:00-06:00', label: '05:00-06:00', emoji: '🕔' },
    { value: '06:00-07:00', label: '06:00-07:00', emoji: '🕕' },
    { value: '07:00-08:00', label: '07:00-08:00', emoji: '🕖' },
    { value: '08:00-09:00', label: '08:00-09:00', emoji: '🕗' },
    { value: '09:00-10:00', label: '09:00-10:00', emoji: '🕘' },
    { value: '10:00-11:00', label: '10:00-11:00', emoji: '🕙' },
    { value: '11:00-12:00', label: '11:00-12:00', emoji: '🕚' },
    { value: '12:00-13:00', label: '12:00-13:00', emoji: '🕛' },
    { value: '13:00-14:00', label: '13:00-14:00', emoji: '🕐' },
    { value: '14:00-15:00', label: '14:00-15:00', emoji: '🕑' },
    { value: '15:00-16:00', label: '15:00-16:00', emoji: '🕒' },
    { value: '16:00-17:00', label: '16:00-17:00', emoji: '🕓' },
    { value: '17:00-18:00', label: '17:00-18:00', emoji: '🕔' },
    { value: '18:00-19:00', label: '18:00-19:00', emoji: '🕕' },
    { value: '19:00-20:00', label: '19:00-20:00', emoji: '🕖' },
    { value: '20:00-21:00', label: '20:00-21:00', emoji: '🕗' },
    { value: '21:00-22:00', label: '21:00-22:00', emoji: '🕘' },
    { value: '22:00-23:00', label: '22:00-23:00', emoji: '🕙' },
    { value: '23:00-00:00', label: '23:00-00:00', emoji: '🕚' }
  ],
  '2-hour': [
    { value: '00:00-02:00', label: '00:00-02:00', emoji: '🕛' },
    { value: '02:00-04:00', label: '02:00-04:00', emoji: '🕑' },
    { value: '04:00-06:00', label: '04:00-06:00', emoji: '🕓' },
    { value: '06:00-08:00', label: '06:00-08:00', emoji: '🕕' },
    { value: '08:00-10:00', label: '08:00-10:00', emoji: '🕗' },
    { value: '10:00-12:00', label: '10:00-12:00', emoji: '🕙' },
    { value: '12:00-14:00', label: '12:00-14:00', emoji: '🕛' },
    { value: '14:00-16:00', label: '14:00-16:00', emoji: '🕑' },
    { value: '16:00-18:00', label: '16:00-18:00', emoji: '🕓' },
    { value: '18:00-20:00', label: '18:00-20:00', emoji: '🕕' },
    { value: '20:00-22:00', label: '20:00-22:00', emoji: '🕗' },
    { value: '22:00-00:00', label: '22:00-00:00', emoji: '🕙' }
  ]
};

const statusOptions = ['Scheduled', 'In Progress', 'Completed', 'Failed'];
const statusColors = {
  Scheduled: 'primary',
  'In Progress': 'warning',
  Completed: 'success',
  Failed: 'error'
};

const developerEmails = [
  'manojkumar.chandanada@nowitservices.com',
  'manohar.srungaram@nowitservices.com',
  'sandhya.chattu@nowitservices.com',
  'kartheek.muppiri@nowitservices.com',
  'sivakumar.erugu@nowitservices.com',
  'sriram.k@nowitservices.com',
  'praveen.kournopo@nowitservices.com',
  'manumanoharmega@gmail.com'
];

const SchedulePage = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
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
    timeSlot: timeSlotGroups['1-hour'][0].value,
    status: 'Scheduled',
    developers: [],
    notes: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [timeSlotMenu, setTimeSlotMenu] = useState({
    anchorEl: null,
    selectedGroup: '1-hour'
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
        timeSlot: timeSlotGroups['1-hour'][0].value,
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
      setUpdating(true);
      const data = {
        ...formData,
        deploymentDate: new Date(formData.deploymentDate).toISOString()
      };

      if (currentSchedule) {
        await api.patch(`/schedules/${currentSchedule}`, data);
        showSnackbar('Schedule updated successfully! Notifications sent to developers.', 'success');
      } else {
        await api.post('/schedules', data);
        showSnackbar('Schedule created successfully! Notifications sent to developers.', 'success');
      }
      await fetchSchedules();
      setOpenForm(false);
    } catch (error) {
      showSnackbar(error.response?.data?.error || 'Error saving schedule', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setUpdating(true);
      await api.delete(`/schedules/${id}`);
      showSnackbar('Schedule deleted successfully!', 'success');
      await fetchSchedules();
    } catch (error) {
      showSnackbar('Error deleting schedule', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleOpenStatusDialog = (scheduleId, status) => {
    const schedule = schedules.find(s => s._id === scheduleId);
    setStatusDialog({
      open: true,
      scheduleId,
      status,
      failureReason: schedule?.failureReason || ''
    });
  };

  const handleCloseStatusDialog = () => {
    setStatusDialog(prev => ({ ...prev, open: false }));
  };

  const handleStatusChange = async () => {
    try {
      setUpdating(true);
      const response = await api.patch(
        `/schedules/${statusDialog.scheduleId}`,
        {
          status: statusDialog.status,
          failureReason: statusDialog.status === 'Failed' ? statusDialog.failureReason : undefined
        }
      );
      
      if (response.data.success) {
        showSnackbar(`Status updated to ${statusDialog.status} and notifications sent to developers`, 'success');
        await fetchSchedules();
        setStatusDialog(prev => ({ ...prev, open: false }));
      } else {
        showSnackbar('Failed to update status', 'error');
      }
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error updating status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleResendNotification = async (id) => {
    try {
      setUpdating(true);
      const response = await api.post(`/schedules/${id}/notify`, {});
      if (response.data.success) {
        showSnackbar('Notification resent successfully to all developers!', 'success');
      } else {
        showSnackbar('Failed to resend notification', 'error');
      }
    } catch (error) {
      showSnackbar('Error resending notification', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleTimeSlotMenuOpen = (event) => {
    setTimeSlotMenu({ anchorEl: event.currentTarget, selectedGroup: '1-hour' });
  };

  const handleTimeSlotMenuClose = () => {
    setTimeSlotMenu(prev => ({ ...prev, anchorEl: null }));
  };

  const handleTimeSlotGroupSelect = (group) => {
    setTimeSlotMenu(prev => ({ ...prev, selectedGroup: group }));
  };

  const handleTimeSlotSelect = (value) => {
    setFormData(prev => ({ ...prev, timeSlot: value }));
    handleTimeSlotMenuClose();
  };

  const getEmojiForTimeSlot = (timeSlot) => {
    const allSlots = [...timeSlotGroups['1-hour'], ...timeSlotGroups['2-hour']];
    const slot = allSlots.find(s => s.value === timeSlot);
    return slot ? slot.emoji : '🕒';
  };

  const LoadingAnimation = () => (
    <FloatingBox
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        width: '100%',
      }}
    >
      <AnimatedGradientBox
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '80%',
          maxWidth: '500px',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '120px',
            height: '120px',
            mb: 3,
          }}
        >
          <GlowCircularProgress
            size={120}
            thickness={2}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: 'bold',
                color: 'white',
                textShadow: '0 0 10px rgba(255,255,255,0.5)',
              }}
            >
              {Math.floor((schedules.length / 10) * 100)}%
            </Typography>
          </Box>
        </Box>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
          Loading Deployment Schedules
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Fetching the latest deployment information...
        </Typography>
        <GradientLinearProgress sx={{ width: '100%', height: '8px' }} />
        <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
          {schedules.length} schedules loaded
        </Typography>
      </AnimatedGradientBox>
    </FloatingBox>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Deployment Schedule
        </Typography>
        <PulseButton
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpenForm()}
          sx={{ borderRadius: '8px' }}
          disabled={updating || loading}
        >
          {updating ? <CircularProgress size={24} color="inherit" /> : 'New Schedule'}
        </PulseButton>
      </Box>

      {loading ? (
        <LoadingAnimation />
      ) : (
        <Zoom in={!loading} timeout={500}>
          <TableContainer 
            component={Paper} 
            sx={{ 
              borderRadius: '12px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              position: 'relative'
            }}
          >
            {updating && (
              <LinearProgress 
                sx={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 6,
                  zIndex: 1
                }} 
              />
            )}
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>App Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Deployment Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '150px' }}>Time Slot</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Developers</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
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
                      <TableCell>{schedule.appName}</TableCell>
                      <TableCell>
                        {format(parseISO(schedule.deploymentDate), 'MMM dd, yyyy')}
                        <Box sx={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                          <AccessTime fontSize="small" sx={{ mr: 0.5 }} />
                          {schedule.timeSlot}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ width: '150px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body1" sx={{ mr: 1, fontSize: '1.2rem', minWidth: '24px' }}>
                            {getEmojiForTimeSlot(schedule.timeSlot)}
                          </Typography>
                          <Typography variant="body2" noWrap>
                            {schedule.timeSlot}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <FormControl fullWidth size="small">
                          <Select
                            value={schedule.status}
                            onChange={(e) => handleOpenStatusDialog(schedule._id, e.target.value)}
                            sx={{
                              backgroundColor: `${statusColors[schedule.status]}.light`,
                              color: 'white',
                              borderRadius: '8px',
                              '& .MuiSelect-select': {
                                padding: '8px 16px'
                              }
                            }}
                            disabled={updating}
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
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {schedule.developers.map((dev, i) => (
                            <Chip 
                              key={i} 
                              label={dev} 
                              size="small" 
                              sx={{ 
                                backgroundColor: '#e3f2fd',
                                color: '#1976d2',
                                maxWidth: '150px',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden'
                              }} 
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Edit />}
                            onClick={() => handleOpenForm(schedule)}
                            sx={{ borderRadius: '8px' }}
                            disabled={updating}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<Delete />}
                            onClick={() => handleDelete(schedule._id)}
                            sx={{ borderRadius: '8px' }}
                            disabled={updating}
                          >
                            Delete
                          </Button>
                          <Tooltip title="Resend notification to all developers">
                            <IconButton
                              color="primary"
                              onClick={() => handleResendNotification(schedule._id)}
                              sx={{ 
                                backgroundColor: '#e3f2fd',
                                '&:hover': {
                                  backgroundColor: '#bbdefb'
                                }
                              }}
                              disabled={updating}
                            >
                              {updating ? <CircularProgress size={24} /> : <Notifications />}
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
        </Zoom>
      )}

      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="sm">
        <DialogTitle sx={{ backgroundColor: '#1976d2', color: 'white' }}>
          {currentSchedule ? 'Edit Schedule' : 'Create New Schedule'}
        </DialogTitle>
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
              sx={{ mb: 2 }}
              disabled={updating}
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
              sx={{ mb: 2 }}
              disabled={updating}
            />
            <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
              <InputLabel>Time Slot</InputLabel>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  fullWidth
                  value={formData.timeSlot}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <IconButton 
                        onClick={handleTimeSlotMenuOpen}
                        sx={{ mr: 1 }}
                        disabled={updating}
                      >
                        <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                          {getEmojiForTimeSlot(formData.timeSlot)}
                        </Typography>
                      </IconButton>
                    )
                  }}
                  disabled={updating}
                />
              </Box>
              <Menu
                anchorEl={timeSlotMenu.anchorEl}
                open={Boolean(timeSlotMenu.anchorEl)}
                onClose={handleTimeSlotMenuClose}
                MenuListProps={{
                  'aria-labelledby': 'time-slot-menu',
                }}
              >
                <Box sx={{ display: 'flex', borderBottom: '5px solid #eee' }}>
                  <Button 
                    onClick={() => handleTimeSlotGroupSelect('1-hour')}
                    sx={{ 
                      flex: 1, 
                      fontWeight: timeSlotMenu.selectedGroup === '1-hour' ? 'bold' : 'normal',
                      color: timeSlotMenu.selectedGroup === '1-hour' ? '#1976d2' : 'inherit'
                    }}
                  >
                    1-hour slots
                  </Button>
                  <Button 
                    onClick={() => handleTimeSlotGroupSelect('2-hour')}
                    sx={{ 
                      flex: 1, 
                      fontWeight: timeSlotMenu.selectedGroup === '2-hour' ? 'bold' : 'normal',
                      color: timeSlotMenu.selectedGroup === '2-hour' ? '#1976d2' : 'inherit'
                    }}
                  >
                    2-hour slots
                  </Button>
                </Box>
                {timeSlotGroups[timeSlotMenu.selectedGroup].map((slot) => (
                  <MenuItem 
                    key={slot.value} 
                    onClick={() => handleTimeSlotSelect(slot.value)}
                    selected={formData.timeSlot === slot.value}
                    disabled={updating}
                  >
                    <ListItemIcon>
                      <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                        {slot.emoji}
                      </Typography>
                    </ListItemIcon>
                    <ListItemText primary={slot.label} />
                  </MenuItem>
                ))}
              </Menu>
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
              sx={{ mb: 2 }}
              disabled={updating}
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
                disabled={updating}
              >
                {developerEmails.map((email) => (
                  <MenuItem key={email} value={email}>{email}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseForm} 
            sx={{ borderRadius: '8px' }}
            disabled={updating}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            color="primary" 
            variant="contained"
            disabled={updating}
            sx={{ borderRadius: '8px' }}
          >
            {updating ? (
              <>
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                {currentSchedule ? 'Updating...' : 'Creating...'}
              </>
            ) : currentSchedule ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={statusDialog.open} onClose={handleCloseStatusDialog}>
        <DialogTitle sx={{ backgroundColor: '#1976d2', color: 'white' }}>
          Update Deployment Status
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={statusDialog.status}
              onChange={(e) => setStatusDialog(prev => ({ ...prev, status: e.target.value }))}
              label="Status"
              disabled={updating}
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
              disabled={updating}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseStatusDialog} 
            sx={{ borderRadius: '8px' }}
            disabled={updating}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleStatusChange} 
            color="primary" 
            variant="contained"
            disabled={updating || (statusDialog.status === 'Failed' && !statusDialog.failureReason)}
            sx={{ borderRadius: '8px' }}
          >
            {updating ? (
              <>
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                Updating...
              </>
            ) : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%', borderRadius: '8px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SchedulePage;