import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TextField, Button, Container, Box, Typography, Link } from '@mui/material';
import { toast } from 'react-toastify';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await register(
        formData.fullName,
        formData.username,
        formData.password
      );
      
      if (result.success) {
        toast.success('Registration successful!');
        navigate('/');
      } else {
        toast.error(result.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>Register</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
          <Typography>
            Already have an account? <Link href="/login">Login</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}