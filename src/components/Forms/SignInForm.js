import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { FormInputText } from '../Inputs/FormInputText';
import { FormInputPassword } from '../Inputs/FormInputPassword';
// import { useUserContext } from '../../context/userContext';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/SocketContext';
import Auth from '../../services/Auth';

const LoginForm = () => {
  const { login, token } = useAuth();
  const { connectSocket } = useChat();
  const navigate = useNavigate();
  // const { setUser } = useUserContext();
  const { handleSubmit, control, reset, setError } = useForm({
    defaultValues: { email: '', password: '' },
  });

  // User is already authenticated, redirect to chat page
  useEffect(() => {
    if (token) {
      navigate('/chat', { replace: true });
    }
  }, [token]);

  const onSubmit = async (values) => {
    console.log('onSubmit', values);
    const resp = await Auth.login(values);
    console.log('resp: ', resp);
    const { data } = resp;
    // console.log('data: ', data);
    if (data.isSuccessful) {
      reset({ email: '', password: '' });

      // Pass token to AuthContext
      login(data.accessToken);

      // Connect to the socket
      connectSocket(data.accessToken);

      // setUser({ ...data });
      navigate('/chat', { replace: true });
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
      <Box sx={{ marginTop: '40px' }}>
        <Button variant="contained" type="submit" fullWidth>
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default LoginForm;
