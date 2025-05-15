import React from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { AppBar, Toolbar, Typography, Container, CssBaseline, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: 'inherit',
}));

const Layout = ({ children }) => {
  return (
    <>
      <CssBaseline />
      <StyledAppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <StyledLink to="/">Deployment Review App</StyledLink>
          </Typography>
          <Navigation />
        </Toolbar>
      </StyledAppBar>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Outlet />
          {children}
        </Box>
      </Container>
    </>
  );
};

export default Layout;