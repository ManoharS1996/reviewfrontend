import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  Container,
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Link,
  Divider,
  CircularProgress
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { toast } from 'react-toastify'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const result = await login(username, password)
    
    if (result.success) {
      toast.success('Login successful!')
      navigate('/')
    } else {
      toast.error(result.message || 'Login failed')
    }
    
    setLoading(false)
  }

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', p: 4, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>Login</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
          <Divider sx={{ my: 3 }} />
          <Typography>
            Don't have an account? <Link href="/register">Register</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}