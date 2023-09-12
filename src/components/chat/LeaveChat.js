import { useContext, useState } from "react";
import { useUserContext } from "../../userContext";
import { FriendContext, SocketContext } from "./Main";
import CloseIcon from "@mui/icons-material/Close";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MoreVertIcon from '@mui/icons-material/MoreVert';

import {
  Box,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const LeaveChat = ({ isGroup }) => {
  const { user } = useUserContext();
  const { channel, setFriendList, setChannel } = useContext(FriendContext);
  const { socket } = useContext(SocketContext);
  const [show, setShow] = useState(false);

  const leaveChat = () => {
    // check if channel is a group
    /*if(channel.owner === user.userId) {
      console.log('matched')
      return;
    }*/
    socket.connect();
    socket.emit(
      "leave_chat",
      {
        userId: user.userId,
        channelId: channel?.userId || channel?.roomId,
        isGroup,
      },
      ({ roomId, isGroup }) => {
        setFriendList((prevFriends) => {
          return [...prevFriends].filter((friend) => friend.userId !== roomId);
        });
        handleClose();
        setChannel({ userId: "" });
      },
    );
  };

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
// sx={{ marginLeft: "auto" }}
  return (
    <Box>
      <IconButton onClick={handleShow} size="sm">
        <MoreVertIcon />
      </IconButton>

      <Dialog
        open={show}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={"xs"}
      >
        <DialogTitle>Leave Chat</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <div className="leave-icon-container">
            <Button
              size="small"
              onClick={leaveChat}
              color="error"
              fullWidth
              startIcon={<ExitToAppIcon />}
            >
              Leave
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default LeaveChat;
/*
<div className="message-chanel-actions">
  <div className="leave-icon-container">
  {
    // remove option for owner to leave their own group
    channel.isGroup &&
    <span data-text="Leave chat" className="tooltip-text bottom left">
      <ExitToAppIcon className="leave-icon" onClick={handleLeaveGroup} />
    </span>
  }
    <span data-text="Delete" className="tooltip-text bottom left">
      <CloseIcon className="leave-icon" onClick={handleRemoveChannel} />
    </span>
  </div>
</div>
*/
