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
  CircularProgress
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import api from '../api';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
}));

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
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
      setCurrentReview(review._id);
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
  };

  const handleRatingChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      rating: newValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentReview) {
        await api.patch(`/reviews/${currentReview}`, formData);
        showSnackbar('Review updated successfully');
      } else {
        await api.post('/reviews', formData);
        showSnackbar('Review added successfully');
      }
      fetchReviews();
      handleClose();
    } catch (error) {
      console.error('Error saving review:', error);
      showSnackbar(error.response?.data?.error || 'Error saving review', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/reviews/${id}`);
      fetchReviews();
      showSnackbar('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      showSnackbar('Error deleting review', 'error');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Deployment Reviews
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add Review
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
                <StyledTableCell>#</StyledTableCell>
                <StyledTableCell>App Name</StyledTableCell>
                <StyledTableCell>Feedback</StyledTableCell>
                <StyledTableCell>Rating</StyledTableCell>
                <StyledTableCell>Recommendations</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No reviews found
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map((review, index) => (
                  <TableRow key={review._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{review.appName}</TableCell>
                    <TableCell>{review.feedback}</TableCell>
                    <TableCell>
                      <Rating value={review.rating} readOnly />
                    </TableCell>
                    <TableCell>{review.recommendations || '-'}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        color="primary"
                        startIcon={<Edit />}
                        onClick={() => handleOpen(review)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleDelete(review._id)}
                        sx={{ ml: 1 }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>{currentReview ? 'Edit Review' : 'Add New Review'}</DialogTitle>
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
              rows={4}
              label="Feedback"
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
            />
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 2 }}>
              <Typography component="legend">Rating</Typography>
              <Rating
                name="rating"
                value={formData.rating}
                onChange={handleRatingChange}
              />
            </Stack>
            <TextField
              margin="normal"
              fullWidth
              multiline
              rows={3}
              label="Recommendations (Optional)"
              name="recommendations"
              value={formData.recommendations}
              onChange={handleChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            {currentReview ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ReviewsPage;