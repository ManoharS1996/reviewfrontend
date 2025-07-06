import React from 'react';
import { NavLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Button, Box } from '@mui/material';

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: 'none',
  color: 'inherit',
  '&.active button': {
    backgroundColor: theme.palette.action.selected,
    fontWeight: 'bold',
  },
}));

const Navigation = () => {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <StyledNavLink to="/schedule">
        <Button color="inherit">Schedule</Button>
      </StyledNavLink>
      <StyledNavLink to="/updates">
        <Button color="inherit">Updates</Button>
      </StyledNavLink>
      <StyledNavLink to="/reviews">
        <Button color="inherit">Reviews</Button>
      </StyledNavLink>
    </Box>
  );
};

export default Navigation;