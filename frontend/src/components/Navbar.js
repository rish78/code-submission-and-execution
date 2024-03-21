import * as React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          Submit Code
        </Button>
        <Button color="inherit" component={Link} to="/submissions">
          View Submissions
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
