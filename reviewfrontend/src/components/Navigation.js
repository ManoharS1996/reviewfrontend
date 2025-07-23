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
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <Button component={NavLink} to="/schedule" color="inherit">
        Schedule
      </Button>
      <Button component={NavLink} to="/updates" color="inherit">
        Updates
      </Button>
      <Button component={NavLink} to="/reviews" color="inherit">
        Reviews
      </Button>

      <Box sx={{ ml: 2 }}>
        <Button onClick={handleClick} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
            {user?.fullName?.charAt(0) || 'U'}
          </Avatar>
          <Typography variant="body2">
            {user?.fullName || 'User'}
          </Typography>
        </Button>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
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