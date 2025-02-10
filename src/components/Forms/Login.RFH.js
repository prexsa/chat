import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { FormInputText } from '../Inputs/FormInputText';
import { FormInputPassword } from '../Inputs/FormInputPassword';
import { useUserContext } from '../../context/userContext';
import Auth from '../../services/Auth';

const LoginForm = () => {
  const navigate = useNavigate();
  const { setUser } = useUserContext();
  const { handleSubmit, control, reset, setError } = useForm({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values) => {
    console.log('onSubmit', values);
    const resp = await Auth.login(values);
    console.log('resp: ', resp);
    const { data } = resp;
    // console.log('data: ', data);
    if (data.isSuccessful) {
      reset({ email: '', password: '' });
      localStorage.setItem('accessToken', data.accessToken);
      setUser({ ...data });
      navigate('/chat');
      // navigate('/create-username', { state: { userId: data.userId } });
    } else {
      if (resp.data.errorType === 'email') {
        setError('email', { type: 'custom', message: resp.data.message });
      }
      if (resp.data.errorType === 'password') {
        setError('password', { type: 'custom', message: resp.data.message });
      }
    }
  };
  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box sx={{ marginTop: '20px' }}>
        <FormInputText name="email" control={control} label={'Email'} />
      </Box>
      <Box sx={{ marginTop: '25px' }}>
        <FormInputPassword
          FormInputPassword
          name="password"
          control={control}
          label={'Password'}
        />
      </Box>
      <Box sx={{ marginTop: '20px' }}>
        <Button variant="contained" type="submit" fullWidth>
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default LoginForm;
