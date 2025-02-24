/* eslint-disable */
import React, {
  useState,
  useEffect,
  useContext,
  useImperativeHandle,
  forwardRef,
} from 'react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import { SocketContext, FriendContext } from '../chat/Main';
import { Autocomplete, TextField } from '@mui/material';

// import useAutocomplete from '@mui/material/useAutocomplete';

const SearchAutoComplete = forwardRef(
  ({ name, control, label, isMultiple }, ref) => {
    const { socket } = useContext(SocketContext);
    const methods = useFormContext();
    // console.log('methods; ', methods);
    const { clearErrors, setError } = methods;
    // console.log('methods: ', methods);
    // console.log('useAutocomplete ', useAutocomplete);
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

    useImperativeHandle(ref, () => {
      return {
        clearState: () => {
          setInputValue('');
        },
        resetFields: () => {
          console.log('getValues ', methods.getValues('members'));

          methods.reset();

          // resetFieldRef.current('members');
        },
      };
    }, []);

    useEffect(() => {
      // console.log('inputValue: ', inputValue);
    }, [inputValue]);

    // console.log({ formState, control });
    return (
      <Controller
        rules={{ required: 'Field is empty' }}
        control={control}
        name={name}
        // defaultValue=""
        render={({ field: { onChange }, fieldState: { error } }) => (
          <Autocomplete
            multiple={isMultiple}
            // freeSolo
            onChange={(_, data) => {
              // console.log('data: ', data);
              onChange(data);
            }}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => {
              clearErrors();
              if (
                newInputValue.trim().length > 0 &&
                searchOptions.length <= 0
              ) {
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
  },
);

SearchAutoComplete.propTypes = {
  name: PropTypes.string,
  control: PropTypes.object,
  label: PropTypes.string,
  reset: PropTypes.func,
  isMultiple: PropTypes.boolean,
};

SearchAutoComplete.displayName = 'SearchAutoComplete';

export default SearchAutoComplete;

// https://refine.dev/blog/material-ui-autocomplete-component/#the-useautocomplete-hook
// https://codesandbox.io/p/sandbox/clever-surf-8dmo7?file=%2Fsrc%2FForm%2FComponents%2FUsers.js%3A27%2C22
// https://codesandbox.io/p/sandbox/elastic-leavitt-pwgdex?file=%2Fsrc%2FApp.js

// https://codesandbox.io/p/sandbox/react-hook-form-v6-controller-qsd8r?file=%2Fsrc%2FMuiAutoComplete.js
