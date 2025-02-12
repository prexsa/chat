import React, { useState, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { useForm, FormProvider } from 'react-hook-form';
import { SocketContext } from '../chat/Main';
import CustomTabPanel from '../chat/CustomTabPanel';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Box, Button, Tabs, Tab, Typography, Tooltip } from '@mui/material';
import SearchAutoComplete from '../Inputs/SearchAutoComplete';
import { FormInputEmail } from '../Inputs/FormInputEmail';
import PulsatingDiv from '../animation/PulsatingDiv';
import SlideLeft from '../animation/SlideLeft';
import { Modal } from '../chat/Modal';

const AddFriendForm = ({ roomList }) => {
  const { socket } = useContext(SocketContext);
  const searchRef = useRef(null);
  const [show, setShow] = useState(false);
  const [tabPanel, setTabPanel] = useState(0);
  /*const { handleSubmit, control, reset, clearErrors } = useForm({
    defaultValues: { search: null },
  });*/
  // const { handleSubmit, control } = useForm();
  const methods = useForm();

  const handleClose = () => setShow(false);

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
    // forwardRef is used to clear child component after submit
    searchRef.current.clearState();
  };

  return (
    <div>
      <Box sx={{ display: 'flex' }}>
        <Tooltip title="Add to chat">
          <AddIcon
            sx={{
              color: '#ffffff',
              backgroundColor: '#1976d2',
              marginLeft: 1,
              border: '1px solid #1976d2',
              borderRadius: '50%',
              fontSize: '40px',
              boxShadow:
                'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
              '&:hover': {
                cursor: 'pointer',
                boxShadow: '2px 2px 12px -2px rgba(0,0,0,0.75);',
              },
            }}
            onClick={() => setShow(true)}
          />
        </Tooltip>
        {roomList.length <= 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <SlideLeft>
              <ArrowBackIosNewIcon />
            </SlideLeft>
            <PulsatingDiv>
              <Typography variant="subtitle2" sx={{ textWrap: 'nowrap' }}>
                Click here to add
              </Typography>
            </PulsatingDiv>
          </Box>
        )}
      </Box>
      <Modal
        open={show}
        onClose={handleClose}
        title={'Add people you know to your chat'}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabPanel} onChange={(e, index) => setTabPanel(index)}>
            <Tab label="Search" aria-controls="tab-panel-search" />
            <Tab label="Email" aria-controls="tab-panel-email" />
          </Tabs>
        </Box>
        <CustomTabPanel value={tabPanel} index={0}>
          <Typography variant="subtitle1">
            Search for family or friends you may know
          </Typography>
          <FormProvider {...methods}>
            <Box
              component={'form'}
              onSubmit={methods.handleSubmit(handleOnSubmit)}
            >
              <SearchAutoComplete
                ref={searchRef}
                control={methods.control}
                name={'search'}
                isMultiple={false}
              />
              <Button variant="contained" type="submit" fullWidth>
                Send Request
              </Button>
            </Box>
          </FormProvider>
        </CustomTabPanel>
        <CustomTabPanel value={tabPanel} index={1}>
          <Typography variant="subtitle1">
            Email a family or friend, and add them to your chat
          </Typography>
          <FormInputEmail />
        </CustomTabPanel>
      </Modal>
    </div>
  );
};

AddFriendForm.propTypes = {
  roomList: PropTypes.array,
};

export default AddFriendForm;

/*
#f0f2f6
#e8ecf3
#3b87f0
*/
