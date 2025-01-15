import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { TextField } from '@mui/material';

export const FormInputText = ({ name, control, label }) => {
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

FormInputText.propTypes = {
  name: PropTypes.string,
  control: PropTypes.object,
  label: PropTypes.string,
};
