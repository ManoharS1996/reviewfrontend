// Updated Navigation.js
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Button, Box, Menu, MenuItem, Avatar, Typography, Divider } from '@mui/material'
import { Logout } from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
    handleClose()
  }

  if (!isAuthenticated) return null

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <Button 
        component={NavLink} 
        to="/schedule" 
        color="inherit"
        sx={{
          fontWeight: 'bold',
          '&.active': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)'
          }
        }}
      >
        Schedule
      </Button>
      <Button 
        component={NavLink} 
        to="/updates" 
        color="inherit"
        sx={{
          fontWeight: 'bold',
          '&.active': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)'
          }
        }}
      >
        Updates
      </Button>
      <Button 
        component={NavLink} 
        to="/reviews" 
        color="inherit"
        sx={{
          fontWeight: 'bold',
          '&.active': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)'
          }
        }}
      >
        Reviews
      </Button>

      <Box sx={{ ml: 2 }}>
        <Button 
          onClick={handleClick} 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            textTransform: 'none',
            borderRadius: '20px',
            padding: '8px 16px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)'
            }
          }}
        >
          <Avatar sx={{ 
            width: 32, 
            height: 32, 
            bgcolor: 'secondary.main',
            fontWeight: 'bold'
          }}>
            {user?.fullName?.charAt(0) || 'U'}
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {user?.fullName || 'User'}
          </Typography>
        </Button>
        <Menu 
          anchorEl={anchorEl} 
          open={open} 
          onClose={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => navigate('/profile')}>
            <Avatar /> Profile
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <Logout fontSize="small" sx={{ mr: 1 }} /> Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  )
}