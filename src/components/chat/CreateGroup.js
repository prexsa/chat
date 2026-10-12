import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import CreateGroupName from '../forms/CreateGroupName.RFH';
import AddToGroup from '../forms/AddToGroup.RFH';

const CreateGroup = () => {
  const [isDisabled, setIsDisabled] = useState(true);
  /*
  const handleClickOpen = () => setShow(true);
  const handleClose = () => {
    // methods.reset();
    setShow(false);
  };
  */

  const handleDisableToggle = () => setIsDisabled(false);

  const handleResetToggle = () => setIsDisabled(true);

  return (
    <div>
      <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
        Create a group and add members
      </Typography>
      <Box sx={{ width: '600px' }}>
        <CreateGroupName
          disableToggle={handleDisableToggle}
          resetToggle={handleResetToggle}
        />
      </Box>
      <Box sx={{ width: '600px' }}>
        <AddToGroup isDisabled={isDisabled} />
      </Box>
    </div>
  );
};

export default CreateGroup;
