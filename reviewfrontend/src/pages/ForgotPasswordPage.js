import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, TextField, Button,
  InputAdornment, IconButton, Paper, CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-toastify';

export default function ForgotPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    // TODO: Call your API to reset the password here
    // Simulating success response
    setTimeout(() => {
      toast.success('Password reset successful!');
      navigate('/login');
      setLoading(false);
    }, 1500);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundImage: 'url(https://as1.ftcdn.net/v2/jpg/03/55/60/70/1000_F_355607062_zYMS8jaz4SfoykpWz5oViRVKL32IabTP.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4
    }}>
      <Container maxWidth="sm">
        <Paper elevation={10} sx={{
          p: 4,
          borderRadius: 4,
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)'
        }}>
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" component="h1" sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #1976d2, #2196f3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Reset Password
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Enter your new password below
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleReset}>
            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)'
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)'
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1rem',
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0, #1e88e5)'
                }
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Reset Password'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
