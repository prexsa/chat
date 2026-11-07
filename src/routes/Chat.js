import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Sidebar from '../components/chat/Sidebar';
import MainChat from '../components/chat/MainChat';
import CustomDrawer from '../components/Drawer';

export default function Chat() {
  return (
    <Box sx={{ backgroundColor: '#f5f8fe', display: 'flex' }}>
      <Box sx={{ textAlign: 'left', p: 1 }}>
        <CustomDrawer />
      </Box>
      <Box sx={{ flexGrow: 2 }}>
        <Grid
          container
          sx={{
            height: '100vh',
            borderRadius: '10px',
            border: '1px solid',
            borderColor: 'Boxider',
            marginLeft: '15px',
            backgroundColor: '#fafcfe',
          }}
        >
          <Grid
            size={4}
            sx={{
              borderRight: '1px solid',
              borderColor: 'Boxider',
              position: 'relative',
            }}
          >
            <Sidebar />
          </Grid>
          <Grid size={8}>
            <MainChat />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
