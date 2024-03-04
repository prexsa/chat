import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { SocketContext, FriendContext } from './../Main';
import { Box, Autocomplete, TextField, Button } from '@mui/material';

export default function CustomAutoComplete({ formSubmitHandler }) {
  const { handleSubmit, control } = useForm({
    defaultValues: { search: null },
  });
  const { socket } = useContext(SocketContext);
  const { selectedRoom, searchOptions, setSearchOptions } =
    useContext(FriendContext);
  const [showResp, setShowResp] = useState(false);
  const [isError, setIsError] = useState(false);
  const [respMessage, setRespMessage] = useState('');
  const [inputValue, setInputValue] = useState('');
  /*
  const fetchHandler = useCallback((socket, inputValue) => {
    socket.connect();

    socket.emit('search_users_db', inputValue, ({ errorMsg, resp }) => {
      console.log({ errorMsg, resp });
      // setOptions([{ label: 'Bankai', id: 1 }]);
    });
  });*/

  useEffect(() => {
    setTimeout(() => {
      setShowResp(false);
      setRespMessage('');
      setIsError(false);
    }, 4000);
  }, [showResp]);

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
    <Box component="form" onSubmit={handleSubmit(formSubmitHandler)}>
      <Box sx={{ color: `${isError ? 'red' : 'green'}`, textAlign: 'center' }}>
        {respMessage}
      </Box>
      <Box sx={{ width: '400px' }}>
        <Controller
          render={({ field: { onChange } }) => (
            <Autocomplete
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
              getOptionLabel={(item) => (item.label ? item.label : '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="User Name"
                  margin="normal"
                  variant="outlined"
                />
              )}
            />
          )}
          control={control}
          name="search"
          defaultValue=""
        />
      </Box>
      <Box sx={{ marginTop: '20px' }}>
        <Button variant="contained" type="submit" fullWidth>
          Add
        </Button>
      </Box>
    </Box>
  );
}

CustomAutoComplete.propTypes = {
  formSubmitHandler: PropTypes.func,
};

// https://refine.dev/blog/material-ui-autocomplete-component/#the-useautocomplete-hook
// https://codesandbox.io/p/sandbox/clever-surf-8dmo7?file=%2Fsrc%2FForm%2FComponents%2FUsers.js%3A27%2C22
// https://codesandbox.io/p/sandbox/elastic-leavitt-pwgdex?file=%2Fsrc%2FApp.js
