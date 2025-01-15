import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { TextField } from '@mui/material';

export const FormInputEmail = ({ name, control, label }) => {
  return (
    <Controller
      rules={{
        required: `${label} is required`,
        pattern: {
          value:
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          message: 'Please enter a valid email',
        },
      }}
      name={name}
      control={control}
      render={({
        field: { onChange, value, ref },
        fieldState: { error },
        // formState,
      }) => (
        <TextField
          helperText={error ? error.message : null}
          inputRef={ref}
          size="normal"
          error={!!error}
          onChange={onChange}
          value={value}
          fullWidth
          label={label}
          variant="outlined"
        />
      )}
    />
  );
};

FormInputEmail.propTypes = {
  name: PropTypes.string,
  control: PropTypes.object,
  label: PropTypes.string,
};
