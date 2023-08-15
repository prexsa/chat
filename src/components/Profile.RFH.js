import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useUserContext } from '../userContext';
import Auth from '../services/Auth';
import { 
  Box, 
  Button, 
  InputAdornment, 
  OutlinedInput, 
  IconButton, 
  FormControl, 
  FormHelperText 
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Profile = ({ editProfile }) => {
  const { user: { userId }, setUser } = useUserContext();
  const { register, handleSubmit, setValue, getValues, reset, formState: { dirtyFields } } = useForm({ mode: 'onChange' });
  const [profile, setProfile] = useState({
    username: '',
    firstname: '',
    lastname: '',
    password: '',
    email: ''
  })
  const [errors, setErrors] = useState({
    username: { hasError: false, msg: '' },
    firstname: { hasError: false, msg: '' },
    lastname: { hasError: false, msg: '' },
    password: { hasError: false, msg: '' },
    email: { hasError: false, msg: '' },
  })
// console.log('hello there')
  const formatErrorStr = (str) => {
    let newStr = '';
    if(str === 'lastname') {
      newStr = 'Last name';
    } else if(str === 'firstname') {
      newStr = 'First name';
    } else {
      newStr = str.charAt(0).toUpperCase() + str.slice(1);
    }
    return newStr;
  }

  const mapProfileDataToForm = useCallback((data) => {
    // console.log('data: ', data)
    // map user profile to form
    Object.entries(data).map(([key, val]) => setValue(key, val));
    // filter missing values for form error feedback
    const missingValues = Object.keys(profile).filter(key => !Object.keys(data).includes(key));
    // console.log('missingValues: ', missingValues)
    const errorKeys = missingValues.reduce((acc, cv) => ({ 
      ...acc, [cv] : {
        hasError: true,
        msg: `${formatErrorStr(cv)} is required!`
      } 
    }), {})
    // console.log('errorKeys: ', errorKeys)
    setErrors(e => ({ ...e, ...errorKeys }))
  }, [profile, setValue]) 
  // console.log('errors: ', errors)

  useEffect(() => {
      mapProfileDataToForm(profile)
  }, [profile, mapProfileDataToForm])

  useEffect(() => {
    async function getProfile() {
      const resp = await Auth.getUserProfile(userId);
      // console.log('profile: ', resp.data)
      setProfile(prevState => ({ ...prevState, ...resp.data}));
    }
    getProfile();
  }, [userId]);
  
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(!show);

  const handleOnSubmit = async (values) => {
    console.log('value: ', values)
    // check updated form values with default values
    const dirtyKeys = Object.keys(dirtyFields);
    // console.log('dirtyKeys; ', dirtyKeys)
    if(dirtyKeys.length <= 0) return;
    // update fields that are dirty
    // verify that values are new
    const valuesToUpdate = dirtyKeys.reduce((acc, cv) => {
      // compare dirty key/values to profile values for differences
      if(values[cv] !== profile[cv] || profile[cv] === undefined) {
        // console.log(cv, values[cv], profile[cv], acc )
        return { ...acc, [cv]: values[cv] }
      }
      return { ...acc }
    }, {})
    // console.log('valuesToUpdate: ', valuesToUpdate)
    const payload = { ...valuesToUpdate, userId }
    const resp = await Auth.updateUserProfile(payload);
    // if accessToken is part of the resp, update localStorage.
    if(Object.keys(resp.data).includes('accessToken')) {
      localStorage.setItem("accessToken", resp.data.accessToken);
    }
    // update profile state
    setProfile(prevState => ({ ...prevState, ...values }))
    // check if the user changed their username
    console.log('boolean: ', Object.keys(values).includes('username'))
    if(Object.keys(values).includes('username')) {
      setUser(prevState => ({ ...prevState, username: values.username }))
    }
  }
  const onFocusHandler = (e) => {
    console.log('onFocusHandler: ', e.target.name, 'value: ', getValues(e.target.name))
  }

  const onBlurHandler = (e) => {
    // if(getValues(e.target.name)) return;
    // console.log('onBlurHandler: ', e.target.name, 'value: ', getValues(e.target.name))
    // console.log(profile[e.target.name])
    // if user clear value from a field, set errors
    if(getValues(e.target.name) === "") {
      setErrors({ ...errors, [e.target.name]: {
        hasError: true, 
        msg: `${formatErrorStr(e.target.name)} is required!` 
        } 
      })
    }
  }

  const restoreFormValues = () => {
    reset();
    Object.entries(profile).map(([key, val]) => setValue(key, val));
    const resetFields = Object.keys(profile).reduce((acc, cv) => ({ ...acc, [cv]: { hasError: false, msg: ''}}), {});
    // console.log('resetFields: ', resetFields)
    setErrors(e => ({ ...e, ...resetFields }))
  }

  // console.log('errors; after ', errors)

  const onErrors = errors => {
    console.error(errors);
    const errorKeys = Object.keys(errors).reduce((acc, cv) => ({ ...acc, [cv]: { hasError: true, msg: `${formatErrorStr(cv)} is required!` }}), {})
    setErrors(e => ({ ...e, ...errorKeys }));
  }

  const inputBorderColor = !editProfile ? 'transparent' : '"rgba(0, 0, 0, 0.23)"';

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(handleOnSubmit, onErrors)}
    >
      <Box sx={{ margin: '20px 0', display: 'flex', alignItems: 'baseline', columnGap: '10px' }}>
        <Box sx={{ width: '100px'}}>Username:</Box>
        <FormControl 
          // variant="outlined" 
          fullWidth 
          error={errors.username.hasError}
          name="username"
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
        >
        {
          !editProfile ? <Box>{ profile?.username === undefined ? <Box sx={{ color: 'darkgrey' }}>missing...</Box> : profile.username}</Box>
          :
          <>
            <OutlinedInput
              type="text"
              size="small"
              sx={{
                "& .MuiOutlinedInput-notchedOutline": { borderColor: inputBorderColor },
              }}
              // disabled
              // label="Password"
              {...register('username', { required: true })}
            />
            <FormHelperText id="component-error-text">{errors.username.hasError ? errors.username.msg : ''}</FormHelperText>
          </>
        }
        </FormControl>
      </Box>
      <Box sx={{ margin: '20px 0', display: 'flex', alignItems: 'baseline', columnGap: '10px' }}>
        <Box sx={{ width: '100px'}}>First Name:</Box>
        <FormControl 
          variant="outlined" 
          fullWidth 
          error={errors.firstname.hasError}
          name="firstname"
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
        >
        {
          !editProfile ? <Box>{ profile?.firstname === undefined ? <Box sx={{ color: 'darkgrey' }}>missing...</Box> : profile.firstname}</Box>
          :
          <>
            <OutlinedInput
              type="text"
              size="small"
              // label="Password"
              {...register('firstname', { required: true })}
            />
            <FormHelperText id="component-error-text">{errors.firstname.hasError ? errors.firstname.msg : ''}</FormHelperText>
          </>
        }
        </FormControl>
      </Box>
      <Box sx={{ margin: '20px 0', display: 'flex', alignItems: 'baseline', columnGap: '10px' }}>
        <Box sx={{ width: '100px'}}>Last Name:</Box>
        <FormControl 
          variant="outlined" 
          fullWidth 
          error={errors.lastname.hasError}
          name="lastname"
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
        >
        {
          !editProfile ? <Box>{profile?.lastname === undefined ? <Box sx={{ color: 'darkgrey' }}>missing...</Box> : profile.lastname}</Box>
          :
          <>
            <OutlinedInput
              type="text"
              size="small"
              // label="Password"
              {...register('lastname', { required: true })}
            />
            <FormHelperText id="component-error-text">{errors.lastname.hasError ? errors.lastname.msg : ''}</FormHelperText>
          </>
        }
        </FormControl>
      </Box>
      <Box sx={{ margin: '20px 0', display: 'flex', alignItems: 'baseline', columnGap: '10px' }}>
        <Box sx={{ width: '100px'}}>Password:</Box>
        <FormControl 
          variant="outlined" 
          fullWidth 
          error={errors.password.hasError}
          name="password"
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
        >
        {
          !editProfile ? <Box>{profile?.password === undefined ? <Box sx={{ color: 'darkgrey' }}>missing...</Box> : profile.password}</Box>
          :
          <>
            <OutlinedInput
              type={show ? "text" : "password"}
              size="small"
              // label="Password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleShow}
                    edge="end"
                  >
                    {show ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              {...register('password', { required: true })}
            />
            <FormHelperText id="component-error-text">{errors.password.hasError ? errors.password.msg : ''}</FormHelperText>
          </>
        }
        </FormControl>
      </Box>
      <Box sx={{ margin: '20px 0', display: 'flex', alignItems: 'baseline', columnGap: '10px' }}>
        <Box sx={{ width: '100px'}}>Email:</Box>
        <FormControl 
          variant="outlined" 
          fullWidth 
          error={errors.email.hasError}
          name="email"
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
        >
        {
          !editProfile ? <Box>{ profile?.email === undefined ? <Box sx={{ color: 'darkgrey' }}>missing...</Box> : profile.email}</Box>
          :
          <>
            <OutlinedInput
              type="text"
              size="small"
              // label="Password"
              {...register('email', { required: true })}
            />
            <FormHelperText id="component-error-text">{errors.email.hasError ? errors.email.msg : ''}</FormHelperText>
          </>
        }
        </FormControl>
      </Box>
      {
        !editProfile ? null :
        <Box sx={{ marginTop: '20px', marginLeft: '100px' }}>
          <Button  variant="contained" type="submit">
            Update
          </Button>
          <Button variant="text" onClick={restoreFormValues}>
            Reset
          </Button>
        </Box>
      }
    </Box>
  )
}

export default Profile;

// https://smartdevpreneur.com/override-textfield-border-color-in-material-ui/