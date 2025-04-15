import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { SocketContext, FriendContext } from './chat/Main';
import { Box } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Modal } from './Modal';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
// import { Button } from 'bootstrap';

const Headings = {
  color: '#2c84f7',
};

const parseDate = (str) => {
  return new Date(str);
};

export const formatDate = (strDate) => {
  const date = parseDate(strDate);
  let day = date.getDate();
  if (day < 10) {
    day = '0' + day;
  }
  let month = date.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  let year = date.getFullYear();
  return day + '.' + month + '.' + year;
};

const formatTime = (strDate) => {
  const date = parseDate(strDate);
  const hours = date.getHours() + 1; // hours variables is 0 - 23
  const minutes = date.getMinutes() + 1;
  const seconds = date.getSeconds() + 1;
  return hours + 'H:' + minutes + 'M:' + seconds + 'S';
};

/**
 *
 * 1 KB (kilobyte) is roughly 1,024 bytes.
 * 1 MB (megabyte) is roughly 1,024 kilobytes.
 * 1 GB (gigabyte) is roughly 1,024 megabytes.
 *
 */
export const formatSize = (str) => {
  const kb = 1024;
  const mb = kb * kb;
  const gb = mb * mb;
  // console.log({ kb, mb, gb });
  if (str !== undefined) {
    const num = Number(str);
    if (num < kb) {
      return Math.round(num / kb);
    } else if (num > kb && num < mb) {
      return (num / kb).toFixed(2) + ' KB';
    } else if (num > mb && num < gb) {
      return (num / mb).toFixed(2) + ' MB';
    } else if (num > gb) {
      return (num / gb).toFixed(2) + ' GB';
    }
    return (Number(str) / 1024).toFixed(1);
  }
};

export const ModalFileViewer = ({
  open,
  onClose,
  files,
  fileIndex,
  updateParentFileState,
  // isMultiple = true,
}) => {
  const { socket } = useContext(SocketContext);
  const { selectedRoom, setSelectedRoom } = useContext(FriendContext);
  const [selected, setSelected] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    // close modal if files don't exist
    if (files.length === 0) onClose();
  }, [files]);

  useEffect(() => {
    if (files.length > 0 && fileIndex !== null) {
      handleFileSelect(files[fileIndex]);
    }
  }, [fileIndex, files]);

  const handleOnModalClose = () => {
    handleClearComponentState();
    onClose();
  };

  const handleClearComponentState = () => {
    setSelected('');
    // setFileName('');
    setFile(null);
  };

  const handleFileSelect = (file) => {
    setFile(file);
    setSelected(file.cloudinaryUrl);
    // setFileName(file.name);
  };

  const removeFileFromChat = (fileId) => {
    setSelectedRoom((prevState) => {
      // console.log('prevState: ', prevState);
      const filteredFiles = prevState.uploadFiles.filter(
        (file) => file._id !== fileId,
      );
      prevState.uploadFiles = filteredFiles;
      return prevState;
    });

    // update component state
    updateParentFileState(fileId);
    handleClearComponentState();
  };

  const handleDeleteFile = () => {
    if (file === null) return;
    // const fileId = file._id;
    socket.connect();
    socket.emit(
      'delete_file',
      { fileId: file._id, roomId: selectedRoom.roomId },
      (file) => {
        // console.log('cb file: ', file);
        removeFileFromChat(file._id);
      },
    );
  };

  return (
    <Modal
      open={open}
      onClose={handleOnModalClose}
      title={file === null ? 'Files' : file.name}
    >
      {selected !== '' ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              // border: '1px solid blue',
              width: '100%',
              my: 1,
            }}
          >
            <IconButton aria-label="back" onClick={handleClearComponentState}>
              <ArrowBackIcon />
            </IconButton>

            <Box sx={{ margin: '0 auto' }}>
              <IconButton
                aria-label="delete"
                onClick={handleDeleteFile}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
          <Box
            sx={{
              margin: '0 auto',
              height: 'inherit',
            }}
          >
            <object
              className="pdf"
              data={selected}
              width="1024"
              height="900"
              // style={{ aspectRatio: 1 / 1, objectFit: 'contain' }}
            ></object>
          </Box>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={Headings}>Name</TableCell>
                <TableCell sx={Headings} align="right">
                  Type
                </TableCell>
                <TableCell sx={Headings} align="right">
                  Size
                </TableCell>
                <TableCell sx={Headings} align="right">
                  Date Modified
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {files.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': {
                      backgroundColor: 'rgba(25,118,210,0.12)',
                      cursor: 'pointer',
                    },
                  }}
                >
                  <TableCell component="th" scope="row">
                    <Box
                      onClick={() => handleFileSelect(row)}
                      sx={{
                        '&: hover': {
                          color: 'blue',
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {row.name}
                    </Box>
                  </TableCell>
                  <TableCell align="right">{row.type}</TableCell>
                  <TableCell align="right">{formatSize(row.size)}</TableCell>
                  <TableCell align="right">
                    {formatDate(row.createdAt) +
                      ' ' +
                      formatTime(row.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Modal>
  );
};

ModalFileViewer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  files: PropTypes.array,
  fileIndex: PropTypes.number,
  updateParentFileState: PropTypes.func,
  // isMultiple: PropTypes.bool,
};
