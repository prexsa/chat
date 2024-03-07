import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useUserContext } from '../../userContext';

import {
  Box,
  Button,
  OutlinedInput,
  InputLabel,
  FormControl,
  FormHelperText,
} from '@mui/material';
import Auth from '../../services/Auth';

export default function Email() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: null,
    },
  });
  const { user } = useUserContext();
  const [showResp, setShowResp] = useState(false);
  const [isError, setIsError] = useState(false);
  const [respMessage, setRespMessage] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setShowResp(false);
      setRespMessage('');
      setIsError(false);
    }, 4000);
  }, [showResp]);

  const formSubmitHandler = async (data) => {
    const { fname, lname, userId } = user;
    // console.log('user: ', user);
    const body = { userId, email: data.email, fname, lname };
    const resp = await Auth.sendEmail(body);

    if (resp.data.isSuccessful) {
      reset({ email: '' });
    } else {
      setIsError(true);
    }
    setShowResp(true);
    setRespMessage(resp.data.message);
  };

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(formSubmitHandler)}
    >
      <Box sx={{ color: `${isError ? 'red' : 'green'}`, textAlign: 'center' }}>
        {respMessage}
      </Box>
      <Box sx={{ margin: '20px 0', width: '400px' }}>
        <FormControl
          variant="outlined"
          fullWidth
          error={errors?.email}
          name="email"
          // onFocus={onFocusHandler}
        >
          <InputLabel
            htmlFor="outlined-adornment-password"
            sx={{ top: '-7px' }}
          >
            Email
          </InputLabel>
          <OutlinedInput
            type="email"
            size="small"
            label="email"
            {...register('email', {
              pattern: {
                value:
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: 'Please enter a valid email',
              },
            })}
          />
          <FormHelperText sx={{ color: 'red' }}>
            {errors?.email ? errors?.email.message : ''}
          </FormHelperText>
        </FormControl>
      </Box>
      <Box sx={{ marginTop: '20px' }}>
        <Button variant="contained" type="submit" fullWidth>
          Send
        </Button>
      </Box>
    </Box>
  );
}
