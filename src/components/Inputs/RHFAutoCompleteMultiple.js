import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import {
  Autocomplete,
  Avatar,
  Box,
  TextField,
  // Typography,
  // Chip,
} from '@mui/material';

export const RHFAutoCompleteMultiple = ({
  name,
  control,
  options,
  label,
  handleOnInputChange,
  minChars = 2,
  ...otherProps
}) => {
  const [inputValue, setInputValue] = useState('');
  const [values, setValues] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  // console.log({ inputValue });

  // Only display options if input length is greater than or equal to minChars
  useEffect(() => {
    const filteredOptions =
      inputValue.trim().length >= minChars
        ? filterSelectedOptions(options)
        : [];
    setFilteredOptions(filteredOptions);
  }, [inputValue]);

  const filterSelectedOptions = (options) => {
    // Create set of unique identifiers
    const ids1 = new Set(values.map((obj) => obj._id));
    const ids2 = new Set(options.map((obj) => obj._id));

    // Filter arrays for missing values in opposing arrays
    const missingInValues = values.filter((obj) => !ids2.has(obj._id));
    const missingInOptions = options.filter((obj) => !ids1.has(obj._id));

    const merged = [...missingInValues, ...missingInOptions];

    return merged;
  };

  // console.log({ values });

  return (
    /* Autocomplete Integration for Member Selection */
    <Controller
      name={name}
      control={control}
      rules={{ required: `${label} can't be empty.` }}
      // render={({ field: { onChange, value, ref }, fieldState: { error } }) => {
      render={({ field: { onChange, ref }, fieldState: { error } }) => {
        // console.log({ error });
        return (
          <Autocomplete
            {...otherProps}
            multiple
            options={filteredOptions}
            // value={value}
            value={values} // values selected
            onChange={(_, newValue) => {
              console.log('onChange: ', { newValue });
              // Implement filter to remove already selected
              // updateFilteredOptions(newValue);
              onChange(newValue); // Pass the actual selected value to form state, for RHF
              setValues(newValue);
            }}
            inputValue={inputValue} // raw input text typed into the textbox
            onInputChange={(_, newInputValue) => {
              // console.log('onInputChange: ', { newInputValue });
              handleOnInputChange(newInputValue);
              setInputValue(newInputValue);
            }}
            getOptionLabel={(option) =>
              `${option.firstname} ${option.lastname}` || ''
            }
            // getOptionLabel={(option) => option.name || ''}
            isOptionEqualToValue={(option, value) => {
              // console.log('isOptionEqualToValue: ', { option, value });
              option._id === value?._id;
            }}
            noOptionsText={
              inputValue.trim().length < minChars
                ? `Please type at least ${minChars} characters to search`
                : 'No options found'
            }

            // Render custom list items with avatars
            renderOption={(props, option) => {
              /* explicity telling eslint to ignore 'key' variable that is declared but not used. */
              /* we're using the option.id instead of the key from props as the unique key */
              // console.log('renderOption: ', { option });
              /* eslint-disable-next-line no-unused-vars */
              const { key, ...optionProps } = props;
              return (
                <Box
                  {...optionProps}
                  component="li"
                  // key={key}
                  key={option._id}
                  sx={{ display: 'flex', gap: 1, alignItems: 'center' }}
                >
                  <Avatar sx={{ width: 24, height: 24 }}>
                    {option.firstname[0]}
                  </Avatar>
                  <div>
                    <div>{`${option.firstname} ${option.lastname}`}</div>
                    <div style={{ fontSize: '0.75rem', color: 'gray' }}>
                      {option.email}
                    </div>
                  </div>
                </Box>
              );
            }}

            // Render the container text input field
            renderInput={(params) => (
              <TextField
                {...params}
                inputRef={ref}
                error={!!error}
                helperText={error?.message}
                label={label}
              />
            )}
          />
        );
      }}
    />
  );
};

RHFAutoCompleteMultiple.propTypes = {
  name: PropTypes.string,
  control: PropTypes.object,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string,
      email: PropTypes.string,
    }),
  ),
  label: PropTypes.string,
  minChars: PropTypes.number,
  handleOnInputChange: PropTypes.func,
  key: PropTypes.string, // Will trigger an error if not in proptypes for renderOption
};
