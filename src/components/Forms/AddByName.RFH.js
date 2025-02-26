import React, { useContext } from 'react';
// import PropTypes from 'prop-types';
import { useForm, FormProvider } from 'react-hook-form';
import { SocketContext } from '../chat/Main';
import { Box, Button } from '@mui/material';
import SearchAutoCompleteNoRef from '../Inputs/SearchAutoCompleteNoRef';

const AddByNameForm = () => {
  const { socket } = useContext(SocketContext);
  // const searchRef = useRef(null);
  /*const { handleSubmit, control, reset, clearErrors } = useForm({
    defaultValues: { search: null },
  });*/
  // const { handleSubmit, control } = useForm();
  const methods = useForm({ defaultValues: { search: '' } });

  // const onErrors = (errors) => console.error(errors);
  const handleOnSubmit = (data) => {
    console.log('handleOnSubmit: ', data.search);
    if (data.search === null) return;

    // when autocomplete is multiple
    // socket.emit('send_request', JSON.stringify(data.search));

    socket.emit('send_request', {
      email: data.search.email,
      username: data.search.label,
      userId: data.search.userId,
    });
    methods.reset();
    // forwardRef is used to clear child component after submit
    // searchRef.current.clearState();
  };

  return (
    <FormProvider {...methods}>
      <Box component={'form'} onSubmit={methods.handleSubmit(handleOnSubmit)}>
        <SearchAutoCompleteNoRef
          // control={methods.control}
          name={'search'}
          label={'Name'}
          isMultiple={false}
        />
        <Button variant="contained" type="submit" fullWidth>
          Send Request
        </Button>
      </Box>
    </FormProvider>
  );
};

export default AddByNameForm;
