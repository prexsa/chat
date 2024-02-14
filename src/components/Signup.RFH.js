import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Auth from '../services/Auth';
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

const Signup = () => {
  const navigate = useNavigate();
  const [queryParameters] = useSearchParams();
  const userId = queryParameters.get('userId');
  const { register, handleSubmit } = useForm({ shouldFocusError: false });
  const [show, setShow] = useState(false);
  const [emailError, setEmailError] = useState({ hasError: false, msg: '' });
  const [passwordError, setPasswordError] = useState({
    hasError: false,
    msg: '',
  });
  const [fnameError, setFnameError] = useState({ hasError: false, msg: '' });
  const [lnameError, setLnameError] = useState({ hasError: false, msg: '' });

  const handleShow = () => setShow(!show);

  const handleOnSubmit = async (values) => {
    // console.log('onSubmit: ', values)
    /**
     * if user was sent an email link to sign up with Chats
     * this is the 'userId' of the sender
     */
    values['userId'] = userId ? userId : '';
    const resp = await Auth.signup(values);
    console.log('response: ', resp.data);
    if (resp.data.isSuccessful) {
      // localStorage.setItem('accessToken', resp.data.accessToken);
      // setUser(resp.data);
      navigate('/create-username', { state: { user: resp.data } });
    } else {
      setEmailError({ hasError: true, msg: resp.data.message });
    }
  };

  const onErrors = (errors) => {
    // console.log('errors: ', errors)
    const { email, password, fname, lname } = errors;

    if (email) {
      setEmailError({ hasError: true, msg: email.message });
    }
    if (password) {
      setPasswordError({ hasError: true, msg: password.message });
    }
    if (fname) {
      setFnameError({ hasError: true, msg: fname.message });
    }
    if (lname) {
      setLnameError({ hasError: true, msg: lname.message });
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
    if (e.target.name === 'fname') {
      setFnameError({ hasError: false, msg: '' });
    }
    if (e.target.name === 'lname') {
      setLnameError({ hasError: false, msg: '' });
    }
  };

  const resetHandler = () => {
    setEmailError({ hasError: false, msg: '' });
    setLnameError({ hasError: false, msg: '' });
    setPasswordError({ hasError: false, msg: '' });
    setFnameError({ hasError: false, msg: '' });
  };

  return (
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
          error={emailError.hasError}
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
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value:
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: 'Please enter a valid email',
              },
            })}
          />
          <FormHelperText id="component-error-text">
            {emailError.hasError ? emailError.msg : ''}
          </FormHelperText>
        </FormControl>
      </Box>
      <Box sx={{ margin: '20px 0' }}>
        <FormControl
          variant="outlined"
          fullWidth
          error={fnameError.hasError}
          name="fname"
          onFocus={onFocusHandler}
        >
          <InputLabel
            htmlFor="outlined-adornment-password"
            sx={{ top: '-7px' }}
          >
            First name
          </InputLabel>
          <OutlinedInput
            type="text"
            size="small"
            label="First name"
            {...register('fname', { required: 'First name is required' })}
          />
          <FormHelperText id="component-error-text">
            {fnameError.hasError ? fnameError.msg : ''}
          </FormHelperText>
        </FormControl>
      </Box>
      <Box sx={{ margin: '20px 0' }}>
        <FormControl
          variant="outlined"
          fullWidth
          error={lnameError.hasError}
          name="lname"
          onFocus={onFocusHandler}
        >
          <InputLabel
            htmlFor="outlined-adornment-password"
            sx={{ top: '-7px' }}
          >
            Last name
          </InputLabel>
          <OutlinedInput
            type="text"
            size="small"
            label="Last name"
            {...register('lname', { required: 'Last name is required' })}
          />
          <FormHelperText id="component-error-text">
            {lnameError.hasError ? lnameError.msg : ''}
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
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must have at least 8 characters',
              },
            })}
          />
          <FormHelperText id="component-error-text">
            {passwordError.hasError ? passwordError.msg : ''}
          </FormHelperText>
        </FormControl>
      </Box>
      <Box sx={{ marginTop: '20px' }}>
        <Button variant="contained" type="submit" fullWidth>
          Register
        </Button>
        <Button variant="text" type="reset" onClick={resetHandler} fullWidth>
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default Signup;
