import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Modal } from './Modal';
// import { Button } from 'bootstrap';

const Headings = {
  color: '#2c84f7',
};

const formatDate = (date) => {
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

const formatTime = (date) => {
  const hours = date.getHours() + 1; // hours variables is 0 - 23
  const minutes = date.getMinutes() + 1;
  const seconds = date.getSeconds() + 1;
  return hours + 'H:' + minutes + 'M:' + seconds + 'S';
};

const parseDate = (str) => {
  const date = new Date(str);
  return formatDate(date) + ' ' + formatTime(date);
};

/**
 *
 * 1 KB (kilobyte) is roughly 1,024 bytes.
 * 1 MB (megabyte) is roughly 1,024 kilobytes.
 * 1 GB (gigabyte) is roughly 1,024 megabytes.
 *
 */
const formatSize = (str) => {
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

export const ModalFileViewer = ({ open, onClose, files }) => {
  const [selected, setSelected] = useState('');

  const handleOnModalClose = () => {
    setSelected('');
    onClose();
  };

  return (
    <Modal open={open} onClose={handleOnModalClose} title={'Files'}>
      {selected !== '' ? (
        <Box
          className="testing"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Button onClick={() => setSelected('')}>back</Button>
          <Box sx={{ margin: '0 auto' }}>
            <object
              className="pdf"
              data={selected}
              width="1000"
              height="1000"
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
                  onClick={() => setSelected(row.cloudinaryUrl)}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': {
                      backgroundColor: 'rgba(25,118,210,0.12)',
                      cursor: 'pointer',
                    },
                  }}
                >
                  <TableCell component="th" scope="row">
                    <Box>{row.name}</Box>
                  </TableCell>
                  <TableCell align="right">{row.type}</TableCell>
                  <TableCell align="right">{formatSize(row.size)}</TableCell>
                  <TableCell align="right">
                    {parseDate(row.createdAt)}
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
};
