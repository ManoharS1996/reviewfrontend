import React, { useState, useEffect, useCallback } from 'react';
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
  Box,
  IconButton,
  Popover,
  Grid,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  Checkbox,
  ListItemText
} from '@mui/material';
import { Add, Edit, Delete, AccessTime, Schedule } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const statusColors = {
  Scheduled: 'primary',
  'In Progress': 'warning',
  Completed: 'success',
  Failed: 'error'
};

const developerOptions = [
  'Kartheek M',
  'Sandhya C',
  'Sivakumar E',
  'Praveen Kumar K',
  'Manojkumar C'
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
}));

const generateTimeSlots = (interval) => {
  const slots = [];
  for (let hour = 0; hour < 24; hour += interval) {
    const startHour = hour % 12 || 12;
    const endHour = (hour + interval) % 12 || 12;
    const periodStart = hour < 12 ? 'AM' : 'PM';
    const periodEnd = (hour + interval) < 12 ? 'AM' : 'PM';

    slots.push(`${startHour}:00 ${periodStart} - ${endHour}:00 ${periodEnd}`);
  }
  return slots;
};

const oneHourSlots = generateTimeSlots(1);
const twoHourSlots = generateTimeSlots(2);

const SchedulePage = () => {
  const [schedules, setSchedules] = useState([]);
  const [open, setOpen] = useState(false);
  const [timeAnchorEl, setTimeAnchorEl] = useState(null);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [timeSlotTab, setTimeSlotTab] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const [formData, setFormData] = useState({
    appName: '',
    deploymentDate: format(new Date(), 'yyyy-MM-dd'),
    timings: '',
    status: 'Scheduled',
    notes: '',
    developers: []
  });

  const fetchSchedules = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/schedules');
      setSchedules(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      showSnackbar('Error fetching schedules.', 'error');
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpen = (schedule = null) => {
    if (schedule) {
      setCurrentSchedule(schedule._id);
      setFormData({
        appName: schedule.appName,
        deploymentDate: format(parseISO(schedule.deploymentDate), 'yyyy-MM-dd'),
        timings: schedule.timings,
        status: schedule.status,
        notes: schedule.notes,
        developers: schedule.notificationDetails?.recipients || []
      });
    } else {
      setCurrentSchedule(null);
      setFormData({
        appName: '',
        deploymentDate: format(new Date(), 'yyyy-MM-dd'),
        timings: '',
        status: 'Scheduled',
        notes: '',
        developers: []
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleTimeClick = (event) => setTimeAnchorEl(event.currentTarget);

  const handleTimeClose = () => setTimeAnchorEl(null);

  const handleTabChange = (event, newValue) => setTimeSlotTab(newValue);

  const selectTimeSlot = (time) => {
    setFormData({ ...formData, timings: time });
    handleTimeClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeveloperChange = (event) => {
    const { value } = event.target;
    setFormData({ ...formData, developers: typeof value === 'string' ? value.split(',') : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentSchedule) {
        await axios.patch(
          `http://localhost:5000/api/schedules/${currentSchedule}`,
          formData
        );
        showSnackbar('Schedule updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/schedules', formData);
        showSnackbar('Schedule added successfully!');
      }
      fetchSchedules();
      handleClose();
    } catch (error) {
      console.error('Error saving schedule:', error);
      showSnackbar('Error saving schedule.', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/schedules/${id}`);
      fetchSchedules();
      showSnackbar('Schedule deleted successfully!');
    } catch (error) {
      console.error('Error deleting schedule:', error);
      showSnackbar('Error deleting schedule.', 'error');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
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
              <StyledTableCell>Developers</StyledTableCell>
              <StyledTableCell>Notes</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.map((schedule, index) => (
              <TableRow key={schedule._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{schedule.appName}</TableCell>
                <TableCell>
                  {format(parseISO(schedule.deploymentDate), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>{schedule.timings}</TableCell>
                <TableCell>
                  <Chip
                    label={schedule.status}
                    color={statusColors[schedule.status] || 'default'}
                  />
                </TableCell>
                <TableCell>
                  {schedule.notificationDetails?.recipients?.join(', ') || 'None'}
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

      {/* Dialog Form */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
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
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Timings"
                name="timings"
                value={formData.timings}
                onChange={handleChange}
              />
              <IconButton onClick={handleTimeClick} sx={{ ml: 1, mt: 2 }} color="primary">
                <Schedule />
              </IconButton>
            </Box>
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
              {['Scheduled', 'In Progress', 'Completed', 'Failed'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <FormControl fullWidth margin="normal">
              <InputLabel id="developers-label">Developers</InputLabel>
              <Select
                labelId="developers-label"
                id="developers"
                multiple
                value={formData.developers}
                onChange={handleDeveloperChange}
                input={<OutlinedInput label="Developers" />}
                renderValue={(selected) => selected.join(', ')}
              >
                {developerOptions.map((developer) => (
                  <MenuItem key={developer} value={developer}>
                    <Checkbox checked={formData.developers.indexOf(developer) > -1} />
                    <ListItemText primary={developer} />
                  </MenuItem>
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

      {/* Time Slot Popover */}
      <Popover
        open={Boolean(timeAnchorEl)}
        anchorEl={timeAnchorEl}
        onClose={handleTimeClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        sx={{ maxHeight: '60vh' }}
      >
        <Box sx={{ p: 2, width: 400 }}>
          <Typography variant="h6" gutterBottom>
            Select Time Slot
          </Typography>
          <Tabs value={timeSlotTab} onChange={handleTabChange} centered>
            <Tab label="1-hour slots" />
            <Tab label="2-hour slots" />
          </Tabs>
          <Box sx={{ maxHeight: '50vh', overflow: 'auto', mt: 2 }}>
            <Grid container spacing={1}>
              {(timeSlotTab === 0 ? oneHourSlots : twoHourSlots).map((time) => (
                <Grid item xs={6} key={time}>
                  <Button
                    fullWidth
                    variant={formData.timings === time ? 'contained' : 'outlined'}
                    onClick={() => selectTimeSlot(time)}
                    sx={{ py: 1.5 }}
                  >
                    {time}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Popover>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SchedulePage;