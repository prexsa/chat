import { useContext, useEffect, useState, useCallback } from "react";
import { SocketContext, MessagesContext } from "./Main";
import { IconButton } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";

// https://socket.io/how-to/upload-a-file
/*
  Might be a better idea load file via "http post" request instead
*/

const FileUpload = ({ userId, from, isGroup, picture, handleSetPicture }) => {
  const { socket } = useContext(SocketContext);
  const { setMessages } = useContext(MessagesContext);
  // const [file, setFile] = useState(null);

  const handleFileUpload = useCallback((file) => {
    // console.log('picture: ', picture)
    console.log("file; ", file);
    /*return;*/
    // if (file === null) return;
    const fileObj = {
      to: userId,
      from: from,
      fileName: file.name,
      file: file,
      isGroup,
    };
    console.log("fileObj: ", file);
    // return;
    socket.emit("upload_file", fileObj, (resp) => {
      console.log("file upload cb: ", { resp });
      const { message } = resp;
      // console.log('msg; ', message)
      setMessages((prevMsg) => {
        return [...prevMsg, message];
      });
      // handleSetPicture(null);
      // setFile(null);
      // reset the file input field
      // resetField("file");
    });
  }, []);

  /*useEffect(() => {
    console.log("handleFileUploa ", file);
    handleFileUpload();
  }, [picture, handleFileUpload]);*/

  const onChangeUpload = (e) => {
    console.log("e: ", e.target.files[0]);
    const file = e.target.files[0];
    // handleSetPicture(URL.createObjectURL(file));
    handleFileUpload(file);
    // setFile(file);
    // setPicture(URL.createObjectURL(e.target.files[0]))
  };

  return (
    <label htmlFor="upload">
      <input
        style={{ display: "none" }}
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

export default FileUpload;
