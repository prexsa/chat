import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useUserContext } from '../../context/userContext';
import { Box, Button } from '@mui/material';
import Auth from '../../services/Auth';
import { FormInputText } from '../Inputs/FormInputText';
import { FormInputPassword } from '../Inputs/FormInputPassword';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useUserContext();
  const { handleSubmit, reset, control, setError } = useForm({
    defaultValues: { email: '', password: '' },
  });

  const handleOnSubmit = async (values) => {
    // console.log('onSubmit', values);
    const resp = await Auth.login(values);
    // console.log('resp: ', resp)
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
      onSubmit={handleSubmit(handleOnSubmit)}
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
  );
};

export default Login;
