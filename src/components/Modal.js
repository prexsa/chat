import React from 'react';
import PropTypes from 'prop-types';
import { Button, IconButton } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';

//import useMediaQuery from '@mui/material/useMediaQuery';
// import { useTheme } from '@mui/material/styles';

export const Modal = ({ open, onClose, title, children }) => {
  // const theme = useTheme();
  // const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // const widths = ['xs', 'sm', 'md', 'lg', 'xl'];

  /***********************
   *
   * When the fullWidth prop is true, the dialog will adapt based on the maxWidth value.
   *
   ************************/

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth={'lg'}>
      <DialogTitle>{title}</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ height: '1000px' }}>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

Modal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.node,
};
