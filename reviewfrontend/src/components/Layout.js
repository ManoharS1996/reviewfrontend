import { Outlet } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material'
import Navigation from './Navigation'

export default function Layout() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Deployment Scheduled
          </Typography>
          <Navigation />
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Outlet />
        </Box>
      </Container>
    </>
  )
}