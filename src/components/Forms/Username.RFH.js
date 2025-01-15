/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useUserContext } from '../userContext';
import Auth from '../services/Auth';
import NoAuthLayout from './NoAuth.layout';
import {
  Box,
  Button,
  OutlinedInput,
  InputLabel,
  FormControl,
  FormHelperText,
  Typography,
} from '@mui/material';

const Username = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { register, handleSubmit } = useForm();
  const { setUser } = useUserContext();
  const [usernameError, setUsernameError] = useState({
    hasError: false,
    msg: '',
  });

  const handleOnSubmit = async (values) => {
    // console.log('onSubmit: ', values)
    console.log('state: ', state);
    values.userId = state.user.userId;
    const resp = await Auth.addUsername(values);
    if (resp.data.isSuccessful) {
      // console.log('response: ', response.data)
      // localStorage.setItem('accessToken', resp.data.accessToken);
      setUser({ ...resp.data });
      navigate('/chat');
    } else {
      setUsernameError({
        hasError: true,
        msg: resp.data.message,
      });
    }
  };

  const onErrors = (errors) => {
    const { username } = errors;
    setUsernameError({ hasError: true, msg: username.message });
  };

  const onFocusHandler = () => {
    setUsernameError({ hasError: false, msg: '' });
  };

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
            backgroundColor: '#fff',
            // height: '100%',
            width: '500px',
            padding: '35px',
            // borderRadius: '0 7px 7px 0',
            position: 'relative',
            // left: '1px',
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
            Create a username
          </Typography>

          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(handleOnSubmit, onErrors)}
          >
            <Box sx={{ margin: '20px 0' }}>
              <FormControl
                variant="outlined"
                fullWidth
                error={usernameError.hasError}
                name="username"
                onFocus={onFocusHandler}
              >
                <InputLabel
                  htmlFor="outlined-adornment-password"
                  sx={{ top: '-7px' }}
                >
                  Create a username...
                </InputLabel>
                <OutlinedInput
                  type="text"
                  size="small"
                  label="Create username..."
                  {...register('username', { required: 'A username required' })}
                />
                <FormHelperText id="component-error-text">
                  {usernameError.hasError ? usernameError.msg : ''}
                </FormHelperText>
              </FormControl>
            </Box>
            <Box sx={{ marginTop: '20px' }}>
              <Button variant="contained" type="submit" fullWidth>
                Confirm
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Username;
