import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Modal } from './Modal';

const rows = [
  { id: 1, filename: 'Snow', type: 'text', size: '35 MB', date: '02-Feb-2025' },
  {
    id: 2,
    filename: 'Lannister',
    type: 'pdf',
    size: '42 MB',
    date: '12-Feb-2025',
  },
  {
    id: 3,
    filename: 'Lannister',
    type: 'pdf',
    size: '45 MB',
    date: '22-Feb-2025',
  },
  {
    id: 4,
    filename: 'Stark',
    type: 'text',
    size: '16 MB',
    date: '22-Feb-2025',
  },
  {
    id: 5,
    filename: 'Targaryen',
    type: 'text',
    size: '2.9 MB',
    date: '02-Mar-2025',
  },
  {
    id: 6,
    filename: 'Melisandre',
    type: 'text',
    size: '150 KB',
    date: '12-Feb-2025',
  },
  {
    id: 7,
    filename: 'Clifford',
    type: 'pdf',
    size: '44 KB',
    date: '22-Feb-2025',
  },
  {
    id: 8,
    filename: 'Frances',
    type: 'text',
    size: '36 MB',
    date: '22-Feb-2025',
  },
  { id: 9, filename: 'Roxie', type: 'pdf', size: '65 KB', date: '30-Feb-2025' },
];

const Headings = {
  color: '#2c84f7',
};

export const ModalFileViewer = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose} title={'Files'}>
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
            {rows.map((row, index) => (
              <TableRow
                key={index}
                onClick={() => console.log('file onclick: ', row)}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': {
                    backgroundColor: 'rgba(25,118,210,0.12)',
                    cursor: 'pointer',
                  },
                }}
              >
                <TableCell component="th" scope="row">
                  <Box>{row.filename}</Box>
                </TableCell>
                <TableCell align="right">{row.type}</TableCell>
                <TableCell align="right">{row.size}</TableCell>
                <TableCell align="right">{row.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Modal>
  );
};

ModalFileViewer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  files: PropTypes.array,
};
