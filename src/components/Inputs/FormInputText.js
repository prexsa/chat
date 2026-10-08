import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { TextField } from '@mui/material';

export const FormInputText = ({
  name,
  control,
  label,
  size = 'normal',
  variant = 'outlined',
}) => {
  return (
    <Controller
      rules={{ required: `${label} is required` }}
      name={name}
      control={control}
      render={({
        field: { onChange, onBlur, value, ref },
        fieldState: { error },
        // formState,
      }) => (
        <TextField
          helperText={error ? error.message : null}
          inputRef={ref}
          size={size}
          error={!!error}
          onChange={onChange} // send value to hook form
          onBlur={onBlur} // notify when input is touched
          value={value}
          fullWidth
          label={label}
          variant={variant}
          // defaultValue={defaultValue}
        />
      )}
    />
  );
};

FormInputText.propTypes = {
  name: PropTypes.string,
  control: PropTypes.object,
  label: PropTypes.string,
  variant: PropTypes.string,
  size: PropTypes.string,
  // defaultValue: PropTypes.string,
};
