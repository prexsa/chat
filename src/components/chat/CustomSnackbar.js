import React from 'react';
import PropTypes from 'prop-types';
/*import Box from '@mui/material/Box';
import Button from '@mui/material/Button';*/
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

export default function CustomSnackbar({ open, handleClose }) {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
      TransitionComponent={SlideTransition}
      autoHideDuration={5000}
      onClose={handleClose}
      message="You have a new request"
      key={'topcenter'}
    />
  );
}

CustomSnackbar.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
};
