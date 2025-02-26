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
        field,
        fieldState,
        // formState,
      }) => (
        <TextField
          {...field}
          helperText={fieldState.error ? fieldState.error.message : null}
          inputRef={field.ref}
          size="normal"
          error={!!fieldState.error}
          onChange={field.onChange}
          value={field.value}
          fullWidth
          label={label}
          variant="outlined"
          sx={{ margin: '16px 0 8px 0' }}
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
