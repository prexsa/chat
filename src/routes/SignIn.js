import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ForumIcon from '@mui/icons-material/Forum';
import SignInForm from '../components/forms/SignInForm';

export default function SignIn() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', // Takes up full viewport height
      }}
    >
      <Card sx={{ width: 450, p: 2 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            <ForumIcon
              sx={{
                color: '#f8f8ff',
                fontSize: '80px',
                padding: '10px',
                borderRadius: '50%',
                background:
                  'linear-gradient(125deg, rgb(99,201,240)5%, rgb(48,118,205) 62%)',
              }}
            />
            <Typography variant="h2" sx={{ color: 'black' }}>
              Chat...
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="h2"
              sx={{
                display: 'inline-block',
                transform: 'scale(1, 1.3)',
                letterSpacing: '1px',
                color: '#3e3f40',
                fontSize: '22px',
                my: '16px',
                fontWeight: 500,
              }}
            >
              Sign in
            </Typography>
            <SignInForm />
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
        </CardContent>
      </Card>
    </Box>
  );
}

// https://mui.com/material-ui/getting-started/templates/sign-in/
// https://github.com/mui/material-ui/blob/v9.4.0/docs/data/material/getting-started/templates/sign-in/SignIn.js
