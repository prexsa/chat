import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import { RHFAutoCompleteMultiple } from '../Inputs/RHFAutoCompleteMultiple';
import { useChat } from '../../context/SocketContext';

/*

const MOCK_USERS = [
  {
    id: '1',
    name: 'Monica Bellucci',
    email: 'monica@example.com',
    avatarUrl: 'https://mui.com',
  },
  {
    id: '2',
    name: 'Ryan Gosling',
    email: 'ryan@example.com',
    avatarUrl: 'https://mui.com',
  },
  {
    id: '3',
    name: 'Colin Farrell',
    email: 'colin@example.com',
    avatarUrl: 'https://mui.com',
  },
  {
    id: '4',
    name: 'Scarlett Johansson',
    email: 'scarlett@example.com',
    avatarUrl: 'https://mui.com',
  },
  {
    id: '5',
    name: 'Alice Smith',
    avatar: 'https://mui.com',
    email: 'alice@example.com',
  },
  {
    id: '6',
    name: 'Bob Jones',
    avatar: 'https://mui.com',
    email: 'bob@example.com',
  },
  {
    id: '7',
    name: 'Charlie Brown',
    avatar: 'https://mui.com',
    email: 'charlie@example.com',
  },
  {
    id: '8',
    name: 'Diana Prince',
    avatar: 'https://mui.com',
    email: 'diana@example.com',
  },
];
*/

export default function AddMember({ open, onClose }) {
  const { sendRequest, users, searchForUsers } = useChat();
  const defaultValues = { members: [] };
  const { handleSubmit, control, reset } = useForm({
    defaultValues,
  });

  // const onErrors = (errors) => console.error(errors);
  const onSubmit = (data) => {
    console.log('handleOnSubmit: ', data.members);
    sendRequest(data.members);
    reset(defaultValues);
    // onClose();
  };

  // 4. Reset form state cleanly upon closing
  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="xs">
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        Add member/s to chat
        <IconButton onClick={handleClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Wrapping DialogContent in a form handles native form validation & Enter-key submission */}
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent dividers>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              pt: 1,
              // width: '450px',
              height: '200px',
            }}
          >
            <RHFAutoCompleteMultiple
              name="members"
              control={control}
              options={users}
              handleOnInputChange={searchForUsers}
              label="Search"
              placeholder="Search..."
              autoFocus
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

AddMember.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
