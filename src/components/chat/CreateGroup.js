import React, { useState } from 'react';
import GroupIcon from '@mui/icons-material/Group';
import { Button, Typography } from '@mui/material';
import CreateGroupForm from '../Forms/CreateGroup.RFH';
import { Modal } from '../Modal';

const CreateGroup = () => {
  const [show, setShow] = useState(false);

  const handleClickOpen = () => setShow(true);
  const handleClose = () => {
    // methods.reset();
    setShow(false);
  };

  return (
    <div>
      <Button
        size="small"
        onClick={handleClickOpen}
        fullWidth
        startIcon={<GroupIcon />}
      >
        Create group
      </Button>
      <Modal open={show} onClose={handleClose} title={'Create Group'}>
        <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
          Create a group and add members
        </Typography>
        <CreateGroupForm />
      </Modal>
    </div>
  );
};

export default CreateGroup;
