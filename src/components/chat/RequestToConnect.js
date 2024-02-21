/* eslint-disable */
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { SocketContext, FriendContext } from './Main';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const RequestToConnect = () => {
  const { pendingRequests } = useContext(FriendContext);
  const { socket } = useContext(SocketContext);
  const [show, setShow] = useState(false);
  const [showBtn, setShowBtn] = useState(false);

  const handleClose = () => setShow(false);

  const acceptRequestHandler = (requesterId) => {
    socket.connect();
    socket.emit('accept_request', requesterId);
    // setPendingRequests();
  };

  const denyRequestHandler = (requesterId) => {
    socket.connect();
    socket.emit('deny_request', requesterId);
  };

  const displayPendingBtn = useCallback(() => {
    setShowBtn(true);
  });

  useEffect(() => {
    if (pendingRequests.length > 0) {
      displayPendingBtn();
    }
  }, [pendingRequests, displayPendingBtn]);

  // console.log('pending: ', pendingRequests);
  return (
    <Box>
      {showBtn ? (
        <Button onClick={() => setShow(true)}>Request to connect</Button>
      ) : null}
      <Dialog open={show} onClose={handleClose}>
        <DialogTitle sx={{ textAlign: 'center', textTransform: 'capitalize' }}>
          Are you ready to connect?
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              width: '550px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              my: 5,
            }}
          >
            {pendingRequests.map((pending, index) => {
              // console.log('pending: ', pending);
              return (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    columnGap: '10px',
                    justifyContent: 'space-between',
                    width: '100%',
                    margin: '10px',
                  }}
                  key={index}
                >
                  <Typography variant="subtitle1">
                    {pending.fullname} wants to connect
                  </Typography>
                  <Box sx={{ display: 'flex', columnGap: '10px' }}>
                    <Button
                      variant="contained"
                      onClick={() => acceptRequestHandler(pending.userId)}
                    >
                      Yes
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => denyRequestHandler(pending.userId)}
                    >
                      No
                    </Button>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RequestToConnect;
