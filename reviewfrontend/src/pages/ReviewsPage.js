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
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Deployment Reviews
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          sx={{ borderRadius: '8px' }}
        >
          Add Review
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
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
                <TableRow key={review._id}>
                  <TableCell>{review.appName}</TableCell>
                  <TableCell>{review.feedback}</TableCell>
                  <TableCell>{review.recommendations}</TableCell>
                  <TableCell>
                    <Rating value={review.rating} readOnly />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button color="primary" onClick={() => handleOpen(review)}>
                        <Edit />
                      </Button>
                      <Button color="error" onClick={() => handleDelete(review._id)}>
                        <Delete />
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{currentReview ? 'Edit Review' : 'Add Review'}</DialogTitle>
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
            />
            <Box sx={{ mt: 2 }}>
              <Typography gutterBottom>Rating</Typography>
              <Rating
                name="rating"
                value={formData.rating}
                onChange={handleRatingChange}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {currentReview ? 'Update' : 'Submit'}
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
