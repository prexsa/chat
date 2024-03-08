import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Auth from '../services/Auth';
import NoAuthLayout from './NoAuth.layout';
import { Box, Button } from '@mui/material';
import { FormInputEmail } from './form-component/FormInputEmail';

function ForgotPassword() {
  const navigate = useNavigate();
  const { handleSubmit, control, setError } = useForm({
    defaultValues: { email: '' },
  });

  const [success, setSuccess] = useState({ isSuccessful: false, msg: '' });

  const handleOnSubmit = async (values) => {
    console.log({ values });
    // const value = values.username
    // const keyType =  isEmailValid(value) ? 'email' : 'username'
    const keyType = 'username';
    const value = values.email;

    const payload = {
      keyType,
      value,
    };
    // console.log(payload)
    const resp = await Auth.userExist(payload);
    // console.log({ resp })
    const { data } = resp;
    // console.log("data: ", data)
    if (data.isSuccessful) {
      setSuccess({ isSuccessful: data.isSuccessful, msg: data.message });
      resetForm();
    } else {
      setError('email', { type: 'custom', message: data.message });
    }
  };

  const resetForm = () => {
    // setSuccess({ isSuccessful: false, msg: "" })
    setTimeout(() => {
      navigate('/');
    }, 5000);
  };

  const onErrors = (errors) => console.log({ errors });

  if (success.isSuccessful) {
    return (
      <NoAuthLayout heading="Success" subheading={success.msg}>
        <Box
          sx={{
            fontSize: '14px',
            marginTop: '15px',
          }}
        >
          <Link to="/">Back to login</Link>
        </Box>
      </NoAuthLayout>
    );
  }

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(handleOnSubmit, onErrors)}
    >
      <Box sx={{ margin: '20px 0' }}>
        <FormInputEmail name={'email'} control={control} label={'Email'} />
        <Box sx={{ marginTop: '20px' }}>
          <Button variant="contained" type="submit" fullWidth>
            Send link
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default ForgotPassword;
