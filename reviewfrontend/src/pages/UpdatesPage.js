import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
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
  Box,
  CircularProgress,
  Skeleton,
  Backdrop,
  Avatar
} from '@mui/material';
import { Add, Edit, Delete, CloudUpload } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import api from '../api';

// Custom animated loader component
const PulseLoader = () => (
  <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          repeatDelay: 0.2,
          delay: i * 0.2
        }}
        style={{
          width: 10,
          height: 10,
          backgroundColor: '#1976d2',
          borderRadius: '50%'
        }}
      />
    ))}
  </Box>
);

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  padding: '10px 20px',
  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
  },
}));

const UpdatesPage = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
      setLoading(true);
      const response = await api.get('/updates');
      setUpdates(response.data.data);
    } catch (error) {
      console.error('Failed to fetch updates:', error);
    } finally {
      setTimeout(() => setLoading(false), 800); // Smooth transition
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
      setSubmitting(true);
      if (currentUpdate) {
        await api.put(`/updates/${currentUpdate._id}`, formData);
      } else {
        await api.post('/updates', formData);
      }
      fetchUpdates();
      handleClose();
    } catch (error) {
      console.error('Failed to save update:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setSubmitting(true);
      await api.delete(`/updates/${id}`);
      fetchUpdates();
    } catch (error) {
      console.error('Failed to delete update:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderSkeletonRows = () => {
    return Array(5).fill().map((_, index) => (
      <motion.tr
        key={index}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <TableCell><Skeleton variant="rounded" height={40} /></TableCell>
        <TableCell><Skeleton variant="rounded" height={40} /></TableCell>
        <TableCell><Skeleton variant="rounded" height={40} /></TableCell>
        <TableCell><Skeleton variant="rounded" height={40} /></TableCell>
        <TableCell><Skeleton variant="rounded" width={120} height={40} /></TableCell>
      </motion.tr>
    ));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
        p: 3,
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}>
        <Typography variant="h4" component="h1" sx={{ 
          fontWeight: 'bold', 
          color: 'primary.main',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <CloudUpload fontSize="large" />
          App Updates
        </Typography>
        <StyledButton
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add Update
        </StyledButton>
      </Box>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <TableContainer 
          component={Paper} 
          sx={{ 
            borderRadius: '16px', 
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            overflow: 'hidden',
            position: 'relative',
            minHeight: loading ? '400px' : 'auto'
          }}
        >
          {loading && (
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.7)',
              zIndex: 10
            }}>
              <Box textAlign="center">
                <motion.div
                  animate={{
                    rotate: 360,
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <Avatar 
                    src="/loader-icon.png" 
                    sx={{ width: 80, height: 80, mb: 2 }} 
                  />
                </motion.div>
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  Loading Updates...
                </Typography>
                <PulseLoader />
              </Box>
            </Box>
          )}
          
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>App Name</StyledTableCell>
                <StyledTableCell>Features Added</StyledTableCell>
                <StyledTableCell>Start Date</StyledTableCell>
                <StyledTableCell>End Date</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? renderSkeletonRows() : (
                <AnimatePresence>
                  {updates.map((update) => (
                    <motion.tr
                      key={update._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      hover
                      sx={{ '&:last-child td': { borderBottom: 0 } }}
                    >
                      <TableCell>{update.appName}</TableCell>
                      <TableCell sx={{ maxWidth: 300 }}>{update.featuresAdded}</TableCell>
                      <TableCell>{format(new Date(update.startDate), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{format(new Date(update.endDate), 'MMM dd, yyyy')}</TableCell>
                      <TableCell sx={{ display: 'flex', gap: 1 }}>
                        <StyledButton
                          variant="outlined"
                          color="primary"
                          startIcon={<Edit />}
                          onClick={() => handleOpen(update)}
                          size="small"
                        >
                          Edit
                        </StyledButton>
                        <StyledButton
                          variant="outlined"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() => handleDelete(update._id)}
                          size="small"
                        >
                          Delete
                        </StyledButton>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
              {!loading && updates.length === 0 && (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      gap: 2
                    }}>
                      <CloudUpload sx={{ fontSize: 60, color: 'text.disabled' }} />
                      <Typography variant="h6" color="textSecondary">
                        No updates found
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        Click "Add Update" to create your first update
                      </Typography>
                    </Box>
                  </TableCell>
                </motion.tr>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </motion.div>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        fullWidth 
        maxWidth="sm"
        component={motion.div}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        <DialogTitle sx={{ 
          backgroundColor: 'primary.main', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          py: 2
        }}>
          {currentUpdate ? (
            <>
              <Edit fontSize="medium" /> Edit Update
            </>
          ) : (
            <>
              <Add fontSize="medium" /> Add New Update
            </>
          )}
        </DialogTitle>
        <DialogContent sx={{ py: 4 }}>
          <Box 
            component={motion.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            display="flex" 
            flexDirection="column" 
            gap={3}
          >
            <TextField
              label="App Name"
              name="appName"
              value={formData.appName}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
            />
            <TextField
              label="Features Added"
              name="featuresAdded"
              value={formData.featuresAdded}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              size="small"
            />
            <Box display="flex" gap={2}>
              <TextField
                label="Start Date"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                size="small"
              />
              <TextField
                label="End Date"
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                size="small"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <StyledButton 
            onClick={handleClose} 
            variant="outlined"
            disabled={submitting}
          >
            Cancel
          </StyledButton>
          <StyledButton 
            variant="contained" 
            onClick={handleSubmit}
            disabled={submitting}
            startIcon={submitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : null}
            sx={{
              position: 'relative',
              overflow: 'hidden',
              '&:after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: submitting ? '100%' : '0%',
                height: '100%',
                backgroundColor: 'rgba(255,255,255,0.3)',
                transition: 'width 2s ease',
              }
            }}
          >
            {currentUpdate ? 'Update' : 'Add'}
          </StyledButton>
        </DialogActions>
      </Dialog>

      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0,0,0,0.7)'
        }}
        open={submitting && !open}
      >
        <Box textAlign="center">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <CloudUpload sx={{ fontSize: 80, mb: 2 }} />
          </motion.div>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {currentUpdate ? 'Updating...' : 'Creating...'}
          </Typography>
          <PulseLoader />
        </Box>
      </Backdrop>
    </Container>
  );
};

export default UpdatesPage;