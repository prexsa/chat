import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import DehazeOutlinedIcon from '@mui/icons-material/DehazeOutlined';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import LogoutIcon from '@mui/icons-material/Logout';

import { useAuth } from '../context/AuthContext';

export default function CustomDrawer() {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => setOpen(newOpen);

  const handleLogout = () => {
    // Add your sign-out logic here (e.g., clear tokens, redirect)
    console.log('Logging out...');
    logout();
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      {/* Logout Section */}
      <List sx={{ mt: 'auto' }}>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <React.Fragment>
      <IconButton onClick={toggleDrawer(true)}>
        <DehazeOutlinedIcon color="primary" sx={{ fontSize: 20 }} />
      </IconButton>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </React.Fragment>
  );
}
