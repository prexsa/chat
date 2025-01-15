import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import NoAuthLayout from '../components/layout/NoAuth.layout';
import { Box, Typography } from '@mui/material';
import PassworResetForm from '../components/Forms/PasswordReset.RFH';

const PasswordReset = () => {
  const navigate = useNavigate();
  const [queryParameters] = useSearchParams();
  // const userId = queryParameters.get('userId');
  const expireTime = queryParameters.get('expireTime');
  const [isTimeExpired, setIsTimeExpired] = useState(false);
  const [isUpdateSuccessful, setIsUpdateSuccessful] = useState(false);

  const handleFormConfirmation = (isSuccessful) =>
    setIsUpdateSuccessful(isSuccessful);

  const checkExpireTime = useCallback(
    (time) => {
      // check if time to reset password has expired
      // if expired redirect user to forgot password link
      const currentTime = new Date().getTime();
      // console.log({ currentTime, expireTime: Number(time) })
      if (currentTime > Number(time)) {
        setIsTimeExpired(true);
        setTimeout(() => {
          navigate('/forgot-password');
        }, 4000);
      }
    },
    [navigate],
  );

  useEffect(() => {
    // console.log('hel')
    checkExpireTime(expireTime);
  }, [expireTime, checkExpireTime]);

  if (isTimeExpired) {
    return (
      <NoAuthLayout>
        <small className={`text-danger error-feedback-sm`}>
          Time has expired for password reset, redirecting...
        </small>
        <div className="link-container">
          <Link to="/">Back to login</Link>
        </div>
      </NoAuthLayout>
    );
  } else if (isUpdateSuccessful) {
    return (
      <NoAuthLayout>
        <small className={`text-success error-feedback-sm`}>
          Password has been updated, redirecting to login screen.
        </small>
        <div className="link-container">
          <Link to="/">Back to login</Link>
        </div>
      </NoAuthLayout>
    );
  } else {
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
            Password Reset
          </Typography>
          <Typography
            sx={{
              display: 'inline-block',
              color: '#3e3f40',
              fontSize: '16px',
              fontWeight: 500,
            }}
          >
            Lets update your password
          </Typography>
          <PassworResetForm formConfirmation={handleFormConfirmation} />
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
  }
};

export default PasswordReset;
