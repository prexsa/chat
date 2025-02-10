import React from 'react';
import { Box, Typography } from '@mui/material';
import ForumIcon from '@mui/icons-material/Forum';
import LoginForm from '../components/Login';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const Login = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));

  // if screen is mobile dimensions
  if (matches) {
    return (
      <Box
        sx={{
          backgroundColor: '#fff',
          height: '100%',
          padding: '35px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ForumIcon
            sx={{
              color: '#0d6efd',
              fontSize: '50px',
              // border: '2px solid #0d6efd',
              padding: '5px',
              borderRadius: '50%',
            }}
          />
          <Typography variant="h2" sx={{ color: '#0d6efd', fontSize: '26px' }}>
            Chat...
          </Typography>
        </Box>
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
          Login
        </Typography>
        <LoginForm />
      </Box>
    );
  }
  // views for desktop
  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            // border: '1px solid #fff',
            height: '700px',
            width: '1000px',
            borderRadius: '10px',
            background:
              'linear-gradient(125deg, rgb(99,201,240)5%, rgb(48,118,205) 62%)',
            boxShadow: 'rgba(149, 157, 165, 0.2) 18px 18px 24px;',
          }}
        >
          <Box sx={{ margin: '0 auto' }}>
            <ForumIcon
              sx={{
                color: '#f8f8ff',
                fontSize: '100px',
                // border: '2px solid #f8f8ff',
                padding: '10px',
                borderRadius: '50%',
              }}
            />
            <Typography variant="h2" sx={{ color: '#fff' }}>
              Chat...
            </Typography>
            <Typography variant="h4" sx={{ fontSize: '20px', color: '#fff' }}>
              Stay connected with family and friends
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: '#fff',
              height: '100%',
              width: '45%',
              padding: '35px',
              borderRadius: '0 7px 7px 0',
              position: 'relative',
              left: '1px',
            }}
          >
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
              Login
            </Typography>
            <LoginForm />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
