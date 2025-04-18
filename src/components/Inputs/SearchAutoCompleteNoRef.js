import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import { SocketContext, FriendContext } from '../chat/Main';
import { Autocomplete, TextField } from '@mui/material';
// import Socket from '../../services/Socket';

const SearchAutoCompleteNoRef = ({ name, label, isMultiple }) => {
  const { socket } = useContext(SocketContext);
  // selectedRoom, setSearchOptions
  const { selectedRoom, searchOptions, setSearchOptions } =
    useContext(FriendContext);
  const methods = useFormContext();
  const { clearErrors, setError, control } = methods;
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (inputValue === '') return;
    if (inputValue.length > 0) {
      // Socket.populateSearchOptions(inputValue);
      // fetchHandler(socket, inputValue);

      socket.connect();

      socket.emit('search_users_db', inputValue, ({ errorMsg, resp }) => {
        if (errorMsg) console.log('errorMsg: ', errorMsg);

        const mates = selectedRoom.mates;
        // console.log({ resp, mates });
        const filterOutExistedMates = resp.filter(
          (n) =>
            !mates.some(
              (mate) => mate.userId === n.userId && mate.label === n.fullname,
            ),
        );
        // console.log('filterOutExistedMates: ', filterOutExistedMates);
        setSearchOptions(filterOutExistedMates);
      });
    }
    return () => {
      socket.off('search_users_db');
    };
  }, [inputValue, socket]);

  // console.log({ formState, control });
  return (
    <Controller
      rules={{ required: 'Field is empty' }}
      control={control}
      name={name}
      // defaultValue=""
      render={({ field, fieldState }) => (
        <Autocomplete
          {...field}
          multiple={isMultiple}
          // freeSolo
          onChange={(_, newValue) => {
            // console.log('data: ', data);
            return field.onChange(newValue);
          }}
          // inputValue={inputValue}
          onInputChange={(_, newInputValue) => {
            clearErrors();
            if (newInputValue.trim().length > 0 && searchOptions.length <= 0) {
              setError(name, {
                type: 'custom',
                message: 'Person is not listed in our records',
              });
            }
            setInputValue(newInputValue);
          }}
          // format is [{ label: '', id: ''}]
          options={searchOptions}
          /*
          renderOption={(option, index) => {
            console.log('option: ', option);
            return <span key={option.userId}>{option.label}</span>;
          }}
          */
          // getOptionLabel={(item) => (item.label ? item.label : '')}
          isOptionEqualToValue={(option, value) =>
            option.userId === value.userId
          }
          renderInput={(params) => (
            <TextField
              helperText={fieldState.error ? fieldState.error.message : null}
              error={!!fieldState.error}
              {...params}
              label={label}
              margin="normal"
              variant="outlined"
            />
          )}
        />
      )}
    />
  );
};

SearchAutoCompleteNoRef.propTypes = {
  name: PropTypes.string,
  control: PropTypes.object,
  label: PropTypes.string,
  reset: PropTypes.func,
  isMultiple: PropTypes.boolean,
};

SearchAutoCompleteNoRef.displayName = 'SearchAutoCompleteNoRef';

export default SearchAutoCompleteNoRef;

// https://refine.dev/blog/material-ui-autocomplete-component/#the-useautocomplete-hook
// https://codesandbox.io/p/sandbox/clever-surf-8dmo7?file=%2Fsrc%2FForm%2FComponents%2FUsers.js%3A27%2C22
// https://codesandbox.io/p/sandbox/elastic-leavitt-pwgdex?file=%2Fsrc%2FApp.js

// https://codesandbox.io/p/sandbox/react-hook-form-v6-controller-qsd8r?file=%2Fsrc%2FMuiAutoComplete.js
