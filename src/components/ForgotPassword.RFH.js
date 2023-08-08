import { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useForm } from 'react-hook-form';
import Auth from '../services/Auth';
import NoAuthLayout from './NoAuth.layout';
import { 
  Box, 
  Button, 
  OutlinedInput, 
  InputLabel, 
  FormControl, 
  FormHelperText 
} from '@mui/material';

/* Check if string is email */
function isEmailValid(str) {
  // Regular expression to check if string is email
  const regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;

  return regexExp.test(str);
}

function ForgotPassword() {
  const navigate = useNavigate();
  const { register, watch, handleSubmit } = useForm();
  const [emailError, setEmailError] = useState({ hasError: false, msg: '' })
  const [success, setSuccess] = useState({ isSuccessful: false, msg: "" })

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      // console.log({ value, name, type })
      if(value.username !== "") {
        // setBtnDisabled(false)
      } else {
        // setBtnDisabled(true)
      }
    })
    return () => subscription.unsubscribe();
  }, [watch])

  const handleOnSubmit = async (values) => {
    console.log({ values })
    // const value = values.username
    // const keyType =  isEmailValid(value) ? 'email' : 'username'
    const keyType = 'username';
    const value = values.email

    const payload = {
      keyType,
      value 
    }
    // console.log(payload)
    const resp = await Auth.userExist(payload)
    // console.log({ resp })
    const { data } = resp;
    // console.log("data: ", data)
    if(data.isSuccessful) {
      setSuccess({ isSuccessful: data.isSuccessful, msg: data.message });
      resetForm();
    } else {
      setEmailError({ hasError: !data.isSuccessful, msg: data.message });
    }
  }

  const resetForm = () => {
    // setSuccess({ isSuccessful: false, msg: "" })
    setTimeout(() => {
      navigate('/')
    }, 5000) 
  }

  const onErrors = errors => console.log({ errors })

  const onFocusHandler = e => {
    setEmailError({ hasError: false, msg: "" })
  }

  if(success.isSuccessful) {
    return (
      <NoAuthLayout 
        heading="Success" 
        subheading={success.msg}
      >
        <Box
          sx={{
            fontSize: '14px',
            marginTop: '15px'
          }}
        >
          <Link to="/">Back to login</Link>
        </Box>
      </NoAuthLayout>
    )
  }

  return (
    <NoAuthLayout 
      heading="Trouble logging in?" 
      subheading="Enter your email and we will send you a link to your email, to get back into your account."
    >
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(handleOnSubmit, onErrors)}
      >
        <Box sx={{ margin: '20px 0'}}>
          <FormControl 
            variant="outlined" 
            fullWidth 
            error={emailError.hasError}
            name="email"
            onFocus={onFocusHandler}
          >
            <InputLabel htmlFor="outlined-adornment-password" sx={{ top: '-7px' }}>Enter your email...</InputLabel>
            <OutlinedInput
              type="text"
              size="small"
              label="Enter your email..."
              {...register('email', { required: true })}
            />
            <FormHelperText id="component-error-text">{emailError.hasError ? emailError.msg : ''}</FormHelperText>
          </FormControl>
          <Box sx={{ marginTop: '20px' }}>
            <Button variant="contained" type="submit" fullWidth>Send link</Button>
          </Box>
        </Box>
        <Box
          sx={{
            fontSize: '14px',
            marginTop: '15px'
          }}
        >
          <Link to="/">Back to login</Link>
        </Box>
      </Box>
    </NoAuthLayout>
  )
}

export default ForgotPassword;

// https://medium.com/@TusharKanjariya/input-floating-labels-using-only-pure-css-80d5f99831e3