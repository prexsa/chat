import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Auth from '../services/Auth';
import { Box, Button } from '@mui/material';
import { FormInputEmail } from './form-component/FormInputEmail';
import { FormInputText } from './form-component/FormInputText';
import { FormInputPassword } from './form-component/FormInputPassword';

const Signup = () => {
  const navigate = useNavigate();
  const [queryParameters] = useSearchParams();
  const userId = queryParameters.get('userId');
  const { handleSubmit, control, reset, setError } = useForm({
    defaultValues: { email: '', fname: '', lname: '', password: '' },
  });

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
      setError('email', { type: 'custom', message: resp.data.message });
    }
  };

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(handleOnSubmit)}
    >
      <Box sx={{ margin: '20px 0' }}>
        <FormInputEmail name={'email'} control={control} label={'Email'} />
      </Box>
      <Box sx={{ margin: '20px 0' }}>
        <FormInputText name={'fname'} control={control} label={'First name'} />
      </Box>
      <Box sx={{ margin: '20px 0' }}>
        <FormInputText name={'lname'} control={control} label={'Last name'} />
      </Box>
      <Box sx={{ margin: '20px 0' }}>
        <FormInputPassword
          name="password"
          control={control}
          label={'Password'}
        />
      </Box>
      <Box sx={{ marginTop: '20px' }}>
        <Button variant="contained" type="submit" fullWidth>
          Register
        </Button>
        <Button variant="text" type="reset" onClick={() => reset()} fullWidth>
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default Signup;
