import React, { useState, useContext } from 'react';
// import { useForm } from 'react-hook-form';
// FriendContext,
import { SocketContext } from './Main';
// import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CustomTabPanel from './CustomTabPanel';
import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  Button,
  // OutlinedInput,
  // InputLabel,
  // FormControl,
  // FormHelperText,
  Tabs,
  Tab,
  Typography,
  Tooltip,
} from '@mui/material';

import SearchAutoComplete from './Forms/SearchAutoComplete';
import Email from './Forms/Email';

function AddFriend() {
  // const { setFriendList } = useContext(FriendContext);
  const { socket } = useContext(SocketContext);
  const [show, setShow] = useState(false);
  const [tabPanel, setTabPanel] = useState(0);

  const handleClose = () => setShow(false);

  // const onErrors = (errors) => console.error(errors);

  return (
    <div>
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

      <Dialog open={show} onClose={handleClose}>
        <DialogTitle sx={{ textAlign: 'center', textTransform: 'capitalize' }}>
          Add people you know to your chat
        </DialogTitle>

        <DialogContent>
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
            <SearchAutoComplete socket={socket} />
          </CustomTabPanel>
          <CustomTabPanel value={tabPanel} index={1}>
            <Typography variant="subtitle1">
              Email a family or friend, and add them to your chat
            </Typography>
            <Email />
          </CustomTabPanel>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddFriend;

/*
#f0f2f6
#e8ecf3
#3b87f0
*/
