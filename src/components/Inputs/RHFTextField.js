import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { TextField } from '@mui/material';

export const RHFTextField = ({ name, control, ...otherProps }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...otherProps}
          fullWidth
          value={field.value ?? ''} // Prevents MUI controlled vs uncontrolled warnings
          error={!!error}
          helperText={error ? error.message : otherProps.helperText}
        />
      )}
    />
  );
};

RHFTextField.propTypes = {
  name: PropTypes.string,
  control: PropTypes.object,
};
