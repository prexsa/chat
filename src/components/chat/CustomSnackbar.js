import React from 'react';
import PropTypes from 'prop-types';
/*import Box from '@mui/material/Box';
import Button from '@mui/material/Button';*/
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

export default function CustomSnackbar({ open, handleClose }) {
  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
      TransitionComponent={SlideTransition}
      autoHideDuration={5000}
      onClose={handleClose}
      message="You have a new request"
      key={'topcenter'}
      action={action}
    />
  );
}

CustomSnackbar.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
};
