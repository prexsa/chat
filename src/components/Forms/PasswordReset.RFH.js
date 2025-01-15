import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';
// import { FaEyeSlash } from "react-icons/fa";
import { useForm } from 'react-hook-form';
import Auth from '../../services/Auth';
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

const PasswordReset = ({ formConfirmation }) => {
  const navigate = useNavigate();
  const [queryParameters] = useSearchParams();
  const userId = queryParameters.get('userId');
  const { register, handleSubmit, watch } = useForm({ mode: 'onChange' });

  const [dupError, setDupError] = useState({ hasError: false, msg: '' });
  const [show, setShow] = useState(false);
  const [showDup, setShowDup] = useState(false);

  const handleOnSubmit = async (values) => {
    const resp = await Auth.updatePassword({ ...values, userId });
    // console.log({ resp })
    const {
      data: { isSuccessful },
    } = resp;
    if (isSuccessful) {
      // reset({ password: '', duplicate: '' })
      formConfirmation(true);
      setTimeout(() => {
        navigate('/');
      }, 4000);
    }
  };

  const handleShow = () => setShow(!show);
  const handleShowDup = () => setShowDup(!showDup);

  const onBlurHandler = () => {
    // console.log('onBlurHandler: ', e.target.name)
    if (watch('password') === watch('duplicate')) {
      setDupError({ hasError: false, msg: '' });
    }
    if (watch('password') !== watch('duplicate')) {
      setDupError({ hasError: true, msg: "Passwords don't match!" });
    }
  };

  const onErrors = (errors) => console.log({ errors });
  // console.log({ userId, expireTime })

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
          // error={passwordError.hasError}
          name="password"
          // onFocus={onFocusHandler}
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
          {/*<FormHelperText id="component-error-text">
                {passwordError.hasError ? passwordError.msg : ""}
              </FormHelperText>*/}
        </FormControl>
      </Box>
      <Box sx={{ margin: '20px 0' }}>
        <FormControl
          variant="outlined"
          fullWidth
          error={dupError.hasError}
          name="duplicate"
          // onFocus={onFocusHandler}
          onBlur={onBlurHandler}
        >
          <InputLabel
            htmlFor="outlined-adornment-password"
            sx={{ top: '-7px' }}
          >
            Re-enter Password
          </InputLabel>
          <OutlinedInput
            type={showDup ? 'text' : 'password'}
            size="small"
            label="Re-enter Password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleShowDup} edge="end">
                  {show ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            {...register('duplicate', { required: true })}
          />
          <FormHelperText id="component-error-text">
            {dupError.hasError ? dupError.msg : ''}
          </FormHelperText>
        </FormControl>
        <Box sx={{ marginTop: '20px' }}>
          <Button
            variant="contained"
            type="submit"
            fullWidth
            disabled={
              !(
                watch('password') !== '' &&
                watch('duplicate') !== '' &&
                watch('password') === watch('duplicate')
              )
            }
          >
            Login
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

PasswordReset.propTypes = {
  formConfirmation: PropTypes.func,
};

export default PasswordReset;
