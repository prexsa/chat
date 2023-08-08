import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { useUserContext } from '../userContext';
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

const Username = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { register, handleSubmit } = useForm();
  const { setUser } = useUserContext();
  const [usernameError, setUsernameError] = useState({ hasError: false, msg: '' });

  const handleOnSubmit = async (values) => {
    // console.log('onSubmit: ', values)
    // console.log("state: ", state)
    values.userId = state.user.userId
    const resp = await Auth.addUsername(values)
    if(resp.data.isSuccessful) {
      // console.log('response: ', response.data)
      localStorage.setItem("accessToken", resp.data.accessToken);
      setUser({ ...resp.data });
      navigate('/chat');
    } else {
      setUsernameError({
        hasError: true,
        msg: resp.data.message
      })
    }
  }

  const onErrors = errors => console.error(errors)

  const onFocusHandler = e => {
    setUsernameError({ hasError: false, msg: '' })
  }

  useEffect(() => {
    // console.log('state; ', state)
    if(state.user.accessToken === '') {
      navigate("/");
    }
  }, [state, navigate])

  return (
    <NoAuthLayout heading="Create a username" subheading="Username will identify you on chat channels">
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
              error={usernameError.hasError}
              name="username"
              onFocus={onFocusHandler}
            >
              <InputLabel htmlFor="outlined-adornment-password" sx={{ top: '-7px' }}>Create username...</InputLabel>
              <OutlinedInput
                type="text"
                size="small"
                label="Create username..."
                {...register('username', { 
                  required: 'A username required'
                })}
              />
              <FormHelperText id="component-error-text">{usernameError.hasError ? usernameError.msg : ''}</FormHelperText>
            </FormControl>
          </Box>
          <Box sx={{ marginTop: '20px' }}>
            <Button variant="contained" type="submit" fullWidth>Confirm</Button>
          </Box>
      </Box>
      
    </NoAuthLayout>
  )
}

export default Username;