import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { SocketContext, FriendContext } from '../chat/Main';
import { Autocomplete, TextField } from '@mui/material';
// Button
export const SearchAutoComplete = ({ name, control, label }) => {
  const { socket } = useContext(SocketContext);
  const { selectedRoom, searchOptions, setSearchOptions } =
    useContext(FriendContext);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (inputValue === '') return;
    if (inputValue.length > 0) {
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
  }, [inputValue, socket, setSearchOptions]);

  return (
    <Controller
      rules={{ required: 'Missing members. Add at least one member' }}
      control={control}
      name={name}
      defaultValue=""
      render={({ field: { onChange }, fieldState: { error } }) => (
        <Autocomplete
          multiple
          freeSolo
          onChange={(event, item) => {
            onChange(item);
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
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
              helperText={error ? error.message : null}
              error={!!error}
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

SearchAutoComplete.propTypes = {
  name: PropTypes.string,
  control: PropTypes.object,
  label: PropTypes.string,
  reset: PropTypes.func,
};

// https://refine.dev/blog/material-ui-autocomplete-component/#the-useautocomplete-hook
// https://codesandbox.io/p/sandbox/clever-surf-8dmo7?file=%2Fsrc%2FForm%2FComponents%2FUsers.js%3A27%2C22
// https://codesandbox.io/p/sandbox/elastic-leavitt-pwgdex?file=%2Fsrc%2FApp.js
