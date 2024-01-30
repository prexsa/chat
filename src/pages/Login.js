import React from 'react';
import { Box, Typography } from '@mui/material';
import ForumIcon from '@mui/icons-material/Forum';
import LoginForm from '../components/Login.RFH';

const Login = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        border: '1px solid blue',
        height: '100%',
        background:
          'linear-gradient(125deg, rgb(99,201,240)5%, rgb(48,118,205) 62%)',
      }}
    >
      <Box
        sx={{
          margin: 'auto',
          padding: '25px 35px',
          height: 'fit-content',
          width: '400px',
          position: 'fixed',
          top: 0,
          bottom: 700,
          left: 0,
          right: 0,
        }}
      >
        <ForumIcon
          sx={{
            color: 'lightblue',
            fontSize: '100px',
            border: '2px solid lightblue',
            padding: '10px',
            borderRadius: '50%',
          }}
        />
        <Typography variant="h2" sx={{ color: '#fff' }}>
          Chat...
        </Typography>
        <Typography variant="h4" sx={{ fontSize: '20px', color: '#fff' }}>
          Stay connected with friends and family
        </Typography>
      </Box>
      <LoginForm />
    </Box>
  );
};

export default Login;
