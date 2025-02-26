import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Box, Tabs, Tab, Typography, Tooltip } from '@mui/material';
import CustomTabPanel from './chat/CustomTabPanel';
import PulsatingDiv from './animation/PulsatingDiv';
import SlideLeft from './animation/SlideLeft';
import { Modal } from './Modal';

import AddByNameForm from './Forms/AddByName.RFH';
import AddByEmailForm from './Forms/AddByEmail.RFH';

const AddFriendForm = ({ roomList }) => {
  const [show, setShow] = useState(false);
  const [tabPanel, setTabPanel] = useState(0);

  const handleClose = () => setShow(false);

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
        <Box sx={{ width: '450px' }}>
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
            <AddByNameForm />
          </CustomTabPanel>
          <CustomTabPanel value={tabPanel} index={1}>
            <Typography variant="subtitle1">
              Email a family or friend, and add them to your chat
            </Typography>
            <AddByEmailForm />
          </CustomTabPanel>
        </Box>
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
