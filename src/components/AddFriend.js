import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import CustomTabPanel from './chat/CustomTabPanel';
import AddByNameForm from './Forms/AddByName.RFH';
import AddByEmailForm from './Forms/AddByEmail.RFH';

const AddFriendForm = () => {
  const [tabPanel, setTabPanel] = useState(0);

  return (
    <div>
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
    </div>
  );
};

/*
AddFriendForm.propTypes = {
  roomList: PropTypes.array,
};
*/

export default AddFriendForm;

/*
#f0f2f6
#e8ecf3
#3b87f0
*/
