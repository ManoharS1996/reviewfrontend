import React, { useState, useEffect, useCallback } from 'react';
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
  Rating,
  Stack,
  Snackbar,
  Alert,
  CircularProgress,
  Fade
} from '@mui/material';
import { Add, Edit, Delete,  RateReview, RocketLaunch, Stars } from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import api from '../api';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
`;

const AnimatedLoader = () => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    height="50vh"
    flexDirection="column"
    sx={{
      background: 'linear-gradient(135deg, rgba(247,251,255,1) 0%, rgba(232,243,255,1) 100%)',
      borderRadius: 4,
      p: 4,
      boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: -50,
        left: -50,
        width: 100,
        height: 100,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(33,150,243,0.1) 0%, rgba(33,150,243,0) 70%)',
        animation: `${pulseAnimation} 3s infinite ease-in-out`
      }
    }}
  >
    <Box 
      position="relative" 
      display="flex" 
      flexDirection="column" 
      alignItems="center"
      sx={{
        animation: `${floatAnimation} 3s infinite ease-in-out`
      }}
    >
      <RocketLaunch 
        color="primary" 
        sx={{ 
          fontSize: 80,
          mb: 2,
          transform: 'rotate(-45deg)',
          filter: 'drop-shadow(0 5px 5px rgba(33,150,243,0.3))'
        }} 
      />
      <Box position="relative" display="inline-flex">
        <CircularProgress 
          size={100} 
          thickness={2}
          color="primary" 
          sx={{
            position: 'absolute',
            animationDuration: '2000ms',
            '& circle': {
              strokeLinecap: 'round',
              strokeDasharray: '80, 200',
              strokeDashoffset: 0,
            },
          }}
        />
        <CircularProgress 
          size={100} 
          thickness={2}
          color="secondary" 
          sx={{
            animationDuration: '2500ms',
            '& circle': {
              strokeLinecap: 'round',
              strokeDasharray: '120, 200',
              strokeDashoffset: 50,
            },
          }}
        />
      </Box>
      <Stars 
        color="primary" 
        sx={{ 
          position: 'absolute',
          fontSize: 20,
          top: -10,
          right: -15,
          opacity: 0.7,
          animation: `${pulseAnimation} 2s infinite ease-in-out`,
          animationDelay: '0.5s'
        }} 
      />
      <Stars 
        color="secondary" 
        sx={{ 
          position: 'absolute',
          fontSize: 16,
          bottom: -5,
          left: -20,
          opacity: 0.7,
          animation: `${pulseAnimation} 2.5s infinite ease-in-out`,
          animationDelay: '0.8s'
        }} 
      />
    </Box>
    <Typography 
      variant="h5" 
      color="primary" 
      mt={4}
      sx={{
        fontWeight: 'bold',
        textAlign: 'center',
        maxWidth: '80%',
        background: 'linear-gradient(90deg, #2196F3 0%, #21CBF3 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        position: 'relative'
      }}
    >
      Loading Deployment Reviews
      <Box 
        component="span" 
        sx={{
          position: 'absolute',
          bottom: -8,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '40%',
          height: 3,
          background: 'linear-gradient(90deg, #2196F3 0%, #21CBF3 100%)',
          borderRadius: 3
        }}
      />
    </Typography>
    <Typography 
      variant="body2" 
      color="text.secondary" 
      mt={1}
      sx={{ fontStyle: 'italic' }}
    >
      Preparing your space mission data...
    </Typography>
  </Box>
);

const ActionButton = styled(Button)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [formData, setFormData] = useState({
    appName: '',
    feedback: '',
    recommendations: '',
    rating: 3
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/reviews');
      setReviews(response.data.data);
    } catch (error) {
      showSnackbar('Error fetching reviews', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpen = (review = null) => {
    if (review) {
      setCurrentReview(review);
      setFormData({
        appName: review.appName,
        feedback: review.feedback,
        recommendations: review.recommendations,
        rating: review.rating
      });
    } else {
      setCurrentReview(null);
      setFormData({
        appName: '',
        feedback: '',
        recommendations: '',
        rating: 3
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
    
    if (currentReview) {
      setReviews(prev => prev.map(review => 
        review._id === currentReview._id ? { ...review, [name]: value } : review
      ));
    }
  };

  const handleRatingChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      rating: newValue
    }));
    
    if (currentReview) {
      setReviews(prev => prev.map(review => 
        review._id === currentReview._id ? { ...review, rating: newValue } : review
      ));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      if (currentReview) {
        await api.patch(`/reviews/${currentReview._id}`, formData);
        showSnackbar('Review updated successfully');
      } else {
        await api.post('/reviews', formData);
        showSnackbar('Review added successfully');
      }
      await fetchReviews();
      handleClose();
    } catch (error) {
      console.error('Error saving review:', error);
      showSnackbar(error.response?.data?.error || 'Error saving review', 'error');
      if (currentReview) {
        setReviews(prev => prev.map(review => 
          review._id === currentReview._id ? currentReview : review
        ));
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    const reviewToDelete = reviews.find(review => review._id === id);
    try {
      setUpdating(true);
      setReviews(prev => prev.filter(review => review._id !== id));
      await api.delete(`/reviews/${id}`);
      showSnackbar('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      showSnackbar('Error deleting review', 'error');
      if (reviewToDelete) {
        setReviews(prev => [...prev, reviewToDelete].sort((a, b) => a.appName.localeCompare(b.appName)));
      }
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ 
          fontWeight: 'bold', 
          color: 'primary.main',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
        }}>
          Deployment Reviews
        </Typography>
        <ActionButton
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          sx={{ borderRadius: '8px' }}
        >
          Add Review
        </ActionButton>
      </Box>

      {loading ? (
        <AnimatedLoader />
      ) : (
        <Fade in={!loading} timeout={500}>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>App Name</StyledTableCell>
                  <StyledTableCell>Feedback</StyledTableCell>
                  <StyledTableCell>Recommendations</StyledTableCell>
                  <StyledTableCell>Rating</StyledTableCell>
                  <StyledTableCell>Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow 
                    key={review._id}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>{review.appName}</TableCell>
                    <TableCell>{review.feedback}</TableCell>
                    <TableCell>{review.recommendations}</TableCell>
                    <TableCell>
                      <Rating value={review.rating} readOnly />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <ActionButton 
                          color="primary" 
                          onClick={() => handleOpen(review)}
                          startIcon={<Edit />}
                        >
                          Edit
                        </ActionButton>
                        <ActionButton 
                          color="error" 
                          onClick={() => handleDelete(review._id)}
                          startIcon={<Delete />}
                        >
                          Delete
                        </ActionButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Fade>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <RateReview />
          {currentReview ? 'Edit Review' : 'Add Review'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="App Name"
              name="appName"
              value={formData.appName}
              onChange={handleChange}
              margin="normal"
              required
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Feedback"
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
              required
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Recommendations"
              name="recommendations"
              value={formData.recommendations}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={2}
              variant="outlined"
            />
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ mr: 2 }}>Rating:</Typography>
              <Rating
                name="rating"
                value={formData.rating}
                onChange={handleRatingChange}
                size="large"
                max={10}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            color="primary"
            disabled={updating}
          >
            {updating ? (
              <>
                <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                {currentReview ? 'Updating...' : 'Submitting...'}
              </>
            ) : (
              currentReview ? 'Update' : 'Submit'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ReviewsPage;