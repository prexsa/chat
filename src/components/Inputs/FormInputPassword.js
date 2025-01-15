import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export const FormInputPassword = ({ name, control, label }) => {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(!show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  /*
  minLength: {
      value: 8,
      message: 'Password must have at least 8 characters',
    },
  */

  return (
    <Controller
      rules={{ required: `${label} is required` }}
      name={name}
      control={control}
      render={({
        field: { onChange, value, ref },
        fieldState: { error },
        // formState,
      }) => (
        <FormControl sx={{ width: '100%' }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={show ? 'text' : 'password'}
            inputRef={ref}
            size="normal"
            error={!!error}
            onChange={onChange}
            value={value}
            fullWidth
            label={label}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleShow}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {show ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            // label="Password"
          />
          <FormHelperText sx={{ color: '#d32f2f' }}>
            {error ? error.message : null}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};

FormInputPassword.propTypes = {
  name: PropTypes.string,
  control: PropTypes.object,
  label: PropTypes.string,
};
