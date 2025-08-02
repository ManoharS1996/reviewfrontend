// Updated Layout.js
import { Outlet } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material'
import Navigation from './Navigation'

export default function Layout() {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <AppBar position="sticky" sx={{ 
        background: 'rgba(25, 118, 210, 0.95)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ 
            flexGrow: 1,
            fontWeight: 'bold',
            letterSpacing: '0.5px'
          }}>
            Deployment Scheduler
          </Typography>
          <Navigation />
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ 
          my: 4,
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)'
        }}>
          <Outlet />
        </Box>
      </Container>
    </Box>
  )
}