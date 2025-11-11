import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { SocketContext, FriendContext } from './Main';
// import CustomSnackbar from './CustomSnackbar';

const PendingRequests = () => {
  const { pendingRequests, setPendingRequests } = useContext(FriendContext);
  const { socket } = useContext(SocketContext);

  const [currentPendingRequestCount, setPendingRequestCount] = useState(0);

  const acceptRequestHandler = (requesterId) => {
    socket.connect();
    socket.emit('accept_request', requesterId);
    // setPendingRequests();
  };

  const denyRequestHandler = (requesterId) => {
    socket.connect();
    socket.emit('deny_request', requesterId, () => {
      setPendingRequests((prevState) => {
        return prevState.filter((prev) => prev.userId !== requesterId);
      });
    });
  };

  useEffect(() => {
    if (
      pendingRequests.length > 0
      // pendingRequests.length === currentPendingRequestCount
    ) {
      if (pendingRequests.length === currentPendingRequestCount) return;
      if (pendingRequests.length > currentPendingRequestCount) {
        // displayPendingBtn();
        // setPendingRequestCount(pendingRequests.length);
      }
    }
    if (pendingRequests.length === 0) {
      setPendingRequestCount(0);
    }
  }, [pendingRequests]);

  // const handleCloseSnackbar = () => setOpenSnackbar(false);

  // console.log('pending: ', pendingRequests);
  return (
    <Box>
      <Box
        sx={{
          width: '550px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
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
                alignItems: 'center',
                width: '100%',
                margin: '10px',
                // backgroundColor: '#F5F5F5',
                borderBottom: '1px solid #E8E9EB',
                // borderRadius: '5px',
                padding: '15px 10px',
              }}
              key={index}
            >
              <Typography variant="subtitle1" sx={{ display: 'flex' }}>
                <Box sx={{ color: 'blue', fontWeight: 500 }}>
                  {pending.fullname}&nbsp;
                </Box>
                wants to connect
              </Typography>
              <Box sx={{ display: 'flex', columnGap: '10px' }}>
                <Button
                  variant="contained"
                  onClick={() => acceptRequestHandler(pending.userId)}
                >
                  Accept
                </Button>
                <Button
                  variant="outlined"
                  //color="error"
                  sx={{ backgroundColor: 'white' }}
                  onClick={() => denyRequestHandler(pending.userId)}
                >
                  Reject
                </Button>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default PendingRequests;
