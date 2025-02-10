import React from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';
import LoginForm from './Forms/Login.RFH';

const Login = () => {
  return (
    <Box>
      <LoginForm />
      <Box sx={{ marginTop: '15px' }}>
        <Link to="/forgot-password">Forgot password?</Link>
      </Box>
      <Box
        sx={{
          fontSize: '14px',
          marginTop: '15px',
        }}
      >
        Don&apos;t have an account? <Link to="/signup">Sign up here</Link>
      </Box>
    </Box>
  );
};

export default Login;
