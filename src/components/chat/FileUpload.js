import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { SocketContext, MessagesContext } from './Main';
import { IconButton } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';

// https://socket.io/how-to/upload-a-file
/*
  Might be a better idea load file via "http post" request instead
*/

const FileUpload = ({ roomId, from, isGroup }) => {
  const { socket } = useContext(SocketContext);
  const { setMessages } = useContext(MessagesContext);

  const handleFileUpload = (file) => {
    // console.log("file; ", file);
    const fileObj = {
      roomId: roomId,
      from: from,
      fileName: file.name,
      file: file,
      isGroup,
    };
    // console.log("fileObj: ", file);
    socket.emit('upload_file', fileObj, (resp) => {
      console.log('file upload cb: ', { resp });
      const { message } = resp;
      // console.log('msg; ', message)
      setMessages((prevMsg) => {
        return [...prevMsg, message];
      });
    });
  };

  const onChangeUpload = (e) => {
    console.log('e: ', e.target.files[0]);
    const file = e.target.files[0];
    // handleSetPicture(URL.createObjectURL(file));
    handleFileUpload(file);
    // setFile(file);
    // setPicture(URL.createObjectURL(e.target.files[0]))
  };

  return (
    <label htmlFor="upload">
      <input
        style={{ display: 'none' }}
        type="file"
        accept="image/png, image/jpeg"
        name="upload_file"
        id="upload"
        onChange={onChangeUpload}
      />
      {/*<Button color='secondary' variant="contained" component="span">
                  Upload btn
                </Button>*/}
      <IconButton color="primary" variant="contained" component="span">
        <AttachFileIcon />
      </IconButton>
    </label>
  );
};

FileUpload.propTypes = {
  roomId: PropTypes.string,
  from: PropTypes.string,
  isGroup: PropTypes.bool,
};

export default FileUpload;
