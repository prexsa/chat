import React from 'react';
import { Link } from 'react-router-dom';
import ForgotPasswordForm from '../components/Forms/ForgotPassword.RFH';
import { Box, Typography } from '@mui/material';
import NoAuthLayout from '../components/layout/NoAuth.layout';

const ForgotPassword = () => {
  return (
    <NoAuthLayout>
      <Box sx={{ margin: '40px auto', width: '400px' }}>
        <Typography
          variant="h2"
          sx={{
            display: 'inline-block',
            transform: 'scale(1, 1.3)',
            letterSpacing: '1px',
            color: '#3e3f40',
            fontSize: '22px',
            marginBottom: '16px',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          Trouble logging in?
        </Typography>
        <Typography
          sx={{
            display: 'inline-block',
            color: '#3e3f40',
            fontSize: '16px',
            fontWeight: 500,
          }}
        >
          Enter your email and we will send you a link to your email, to reset
          your password.
        </Typography>
        <ForgotPasswordForm />
        <Box
          sx={{
            fontSize: '14px',
            marginTop: '15px',
          }}
        >
          <Link to="/">Back to login</Link>
        </Box>
      </Box>
    </NoAuthLayout>
  );
};

export default ForgotPassword;
