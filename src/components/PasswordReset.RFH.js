import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
// import { FaEyeSlash } from "react-icons/fa";
import { useForm } from 'react-hook-form';
import Auth from '../services/Auth';
import NoAuthLayout from './NoAuth.layout';
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

const PasswordReset = () => {
  const navigate = useNavigate();
  const [queryParameters] = useSearchParams();
  const userId = queryParameters.get('userId');
  const expireTime = queryParameters.get('expireTime');
  const [isTimeExpired, setIsTimeExpired] = useState(false);
  const [isUpdateSuccessful, setIsUpdateSuccessful] = useState(false);
  const { register, handleSubmit, watch } = useForm({ mode: 'onChange' });
  /*const [passwordError, setPasswordError] = useState({
    hasError: false,
    msg: "",
  });*/
  const [dupError, setDupError] = useState({ hasError: false, msg: '' });
  const [show, setShow] = useState(false);
  const [showDup, setShowDup] = useState(false);

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

  const handleOnSubmit = async (values) => {
    const resp = await Auth.updatePassword({ ...values, userId });
    // console.log({ resp })
    const {
      data: { isSuccessful },
    } = resp;
    if (isSuccessful) {
      // reset({ password: '', duplicate: '' })
      setIsUpdateSuccessful(true);
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
      <NoAuthLayout
        heading="Password Reset"
        subheading="Lets update your password"
      >
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

/*
<form className="form-cntr" onSubmit={handleSubmit(handleOnSubmit, onErrors)}>
  <div className="form-field floating-label-cntr">
    <input
      className="floating-input" 
      id="password"
      type="text" 
      name="password" 
      placeholder="New password"
      {...register("password", { required: true, minLength: 5 })} 
    />
    <label className="floating-label" htmlFor="username">Password</label>
  </div>
  <small className={`text-danger error-feedback-sm`}>
    {errors?.password?.type === "required" && ("This field is required")}
    {errors?.password?.type === "minLength" && ("Password cannot be less than 5 characters.")}
  </small>
  <div className="form-field floating-label-cntr">
    <input
      className="floating-input" 
      id="password"
      type="text" 
      name="duplicate" 
      placeholder="Re-enter password"
      {...register("duplicate", { required: true })} 
    />
    <label className="floating-label" htmlFor="username">Re-enter Password</label>
  </div>
  // errors will return when field valiation fails 
  // here we watch both password and duplicate fields and if not matched, triggers validation
  <small className={`text-danger error-feedback-sm`}>
    {watch("duplicate") !== watch("password") && getValues("duplicate") ? ("Passwords do not match") : null}
  </small>
  <div className="form-field marginTop20">
    <button 
      type="submit" 
      disabled={!(watch("password") !== '' && watch("duplicate") !== '' && watch("password") === watch("duplicate"))} 
      className="btn btn-primary btn-sm">Submit</button>
  </div>
</form>
*/
