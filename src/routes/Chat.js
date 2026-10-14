import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

/*
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
*/

import Sidebar from '../components/chat/Sidebar';
import MainChat from '../components/chat/MainChat';

export default function Chat() {
  return (
    <Box sx={{ backgroundColor: '#f5f8fe' }}>
      <Grid
        container
        sx={{
          height: '100vh',
          borderRadius: '10px',
          border: '1px solid',
          borderColor: 'divider',
          marginLeft: '15px',
          backgroundColor: '#fafcfe',
        }}
      >
        <Grid
          size={4}
          sx={{
            borderRight: '1px solid',
            borderColor: 'divider',
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
  );
}

// https://recipes.mui.com/chat/edit-WtlmwCYacr7yoct41APT
// https://addons.mozilla.org/en-CA/firefox/addon/web-telegram-online/
// https://www.google.com/search?q=mui+chat+messages+component&oq=mui+chat+messages+c&gs_lcrp=EgZjaHJvbWUqBwgBECEYoAEyBggAEEUYOTIHCAEQIRigATIHCAIQIRigATIHCAMQIRigATIHCAQQIRigATIHCAUQIRirAjIHCAYQIRirAjIHCAcQIRirAjIHCAgQIRifBTIHCAkQIRifBdIBCDk5MDhqMGo3qAIAsAIA&sourceid=chrome&source=chrome.ob&ie=UTF-8
