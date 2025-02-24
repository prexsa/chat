import React, { useState, useEffect, useContext } from 'react';
// import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { SocketContext, FriendContext } from '../chat/Main';
import { Autocomplete, TextField } from '@mui/material';

const AddToGroupForm = () => {
  const { socket } = useContext(SocketContext);
  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm();
  // const { clearErrors, setError } = useFormContext();
  const { selectedRoom, searchOptions, setSearchOptions } =
    useContext(FriendContext);
  const [inputValue, setInputValue] = useState('');

  const formSubmitHandler = (data) => {
    console.log('data: ', data);
  };

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
    <Autocomplete
      {...register('searches')}
      multiple={true}
      freeSolo
      /*onChange={(_, data) => {
        onChange(data);
      }}*/
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => {
        // clearErrors();
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
      isOptionEqualToValue={(option, value) => option.userId === value.userId}
      renderInput={(params) => (
        <TextField
          helperText={errors ? errors.message : null}
          error={!!errors}
          label={'Username or email'}
          margin="normal"
          variant="outlined"
        />
      )}
    />
  );
};

export default AddToGroupForm;

// https://stackoverflow.com/questions/76018085/how-can-i-clear-the-selected-value-of-a-material-ui-autocomplete-component-after
