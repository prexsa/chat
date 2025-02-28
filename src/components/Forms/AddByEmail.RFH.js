import React, { useContext } from 'react';
// import PropTypes from 'prop-types';
import { useUserContext } from '../../context/userContext';
import { useForm, FormProvider } from 'react-hook-form';
import { SocketContext } from '../chat/Main';
import { Box, Button } from '@mui/material';
import { FormInputEmail } from '../Inputs/FormInputEmail';

const AddByEmailForm = () => {
  const { socket } = useContext(SocketContext);
  const { user } = useUserContext();
  // const searchRef = useRef(null);
  /*const { handleSubmit, control, reset, clearErrors } = useForm({
    defaultValues: { search: null },
  });*/
  // const { handleSubmit, control } = useForm();
  const methods = useForm({ defaultValues: { email: '' } });

  // const onErrors = (errors) => console.error(errors);
  const handleOnSubmit = (data) => {
    // console.log('handleOnSubmit: ', data.email);
    // if (data.email === null) return;
    // console.log('User: ', user);
    const userDetails = {
      fname: user.fname,
      lname: user.lname,
      userId: user.userId,
    };
    socket.emit(
      'send_request_by_email',
      {
        email: data.email,
        senderDetails: userDetails,
      },
      ({ message }) => console.log('cb send_request_by_email: ', message),
    );
    methods.reset();
  };

  return (
    <FormProvider {...methods}>
      <Box component={'form'} onSubmit={methods.handleSubmit(handleOnSubmit)}>
        <FormInputEmail
          name="email"
          control={methods.control}
          label={'Email'}
        />
        <Button variant="contained" type="submit" fullWidth>
          Send Request
        </Button>
      </Box>
    </FormProvider>
  );
};

export default AddByEmailForm;
