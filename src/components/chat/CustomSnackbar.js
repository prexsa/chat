import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
/*
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
*/

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

/**
 * severity props: 'success', 'info', 'warning', 'error'
 * colors can be overridened with 'color' attribute
 * variant props: 'filled', 'outlined'
 */

export default function CustomSnackbar({
  open,
  handleClose,
  message,
  severity = 'success',
  variant = 'filled',
}) {
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
      key={'topcenter'}
      action={action}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant={variant}
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

CustomSnackbar.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  message: PropTypes.string,
  severity: PropTypes.string,
  variant: PropTypes.string,
};
