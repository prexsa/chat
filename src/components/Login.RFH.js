import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useUserContext } from '../userContext';
import {
  Box,
  Button,
  InputAdornment,
  OutlinedInput,
  IconButton,
  InputLabel,
  FormControl,
  FormHelperText,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Auth from '../services/Auth';

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm({
    shouldFocusError: false,
  });
  const { setUser } = useUserContext();
  const [show, setShow] = useState(false);
  const [usrNameError, setEmailError] = useState({
    hasError: false,
    msg: '',
  });
  const [passwordError, setPasswordError] = useState({
    hasError: false,
    msg: '',
  });

  const handleOnSubmit = async (values) => {
    // console.log('onSubmit', values);
    const resp = await Auth.login(values);
    // console.log('resp: ', resp)
    const { data } = resp;
    console.log('data: ', data);
    if (data.isSuccessful) {
      // console.log("fdjslkf;j: ", response.data.hasOwnProperty("username"))
      localStorage.setItem('accessToken', data.accessToken);
      setUser({ ...data });
      navigate('/chat');
      // navigate('/create-username', { state: { userId: data.userId } });
    } else {
      // setError(response.data.status)
      if (data.errorType === 'email') {
        setEmailError({ hasError: true, msg: data.message });
      } else {
        setPasswordError({ hasError: true, msg: data.message });
      }
    }
    reset({ email: '', password: '' });
  };

  const handleShow = () => setShow(!show);

  const onErrors = (errors) => {
    const { password, email } = errors;
    console.log('errors: ', errors);
    // transfering controls from RHF to material-ui for feedback errors
    if (email) {
      setEmailError({
        hasError: true,
        msg: 'Email is required.',
      });
    }
    if (password) {
      setPasswordError({ hasError: true, msg: 'Password is required.' });
    }
  };

  const onFocusHandler = (e) => {
    // console.log('onFocusHandler: ', e.target.name)
    // reset the error indicators when user is focused
    if (e.target.name === 'email') {
      setEmailError({ hasError: false, msg: '' });
    }
    if (e.target.name === 'password') {
      setPasswordError({ hasError: false, msg: '' });
    }
  };

  return (
    <>
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
            error={usrNameError.hasError}
            name="email"
            onFocus={onFocusHandler}
          >
            <InputLabel
              htmlFor="outlined-adornment-password"
              sx={{ top: '-7px' }}
            >
              Email
            </InputLabel>
            <OutlinedInput
              type="text"
              size="small"
              label="Email"
              {...register('email', { required: true })}
            />
            <FormHelperText id="component-error-text">
              {usrNameError.hasError ? usrNameError.msg : ''}
            </FormHelperText>
          </FormControl>
        </Box>
        <Box sx={{ margin: '20px 0' }}>
          <FormControl
            variant="outlined"
            fullWidth
            error={passwordError.hasError}
            name="password"
            onFocus={onFocusHandler}
          >
            <InputLabel
              htmlFor="outlined-adornment-password"
              sx={{ top: '-7px' }}
            >
              Password
            </InputLabel>
            <OutlinedInput
              type={show ? 'text' : 'password'}
              size="small"
              label="Password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={handleShow} edge="end">
                    {show ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              {...register('password', { required: true })}
            />
            <FormHelperText id="component-error-text">
              {passwordError.hasError ? passwordError.msg : ''}
            </FormHelperText>
          </FormControl>
        </Box>
        <Box sx={{ marginTop: '20px' }}>
          <Button variant="contained" type="submit" fullWidth>
            Login
          </Button>
        </Box>
        <Box sx={{ marginTop: '15px' }}>
          <Link to="/forgot-password">Forgot password?</Link>
        </Box>
        <Box
          sx={{
            fontSize: '14px',
            marginTop: '15px',
          }}
        >
          Don&apos;t have an account? <Link to="/register">Sign up here</Link>
        </Box>
      </Box>
    </>
  );
};

export default Login;
/*
    <NoAuthLayout heading={'Login'} subheading={'Login with your email'}>
    */
/*
    </NoAuthLayout>
    */
