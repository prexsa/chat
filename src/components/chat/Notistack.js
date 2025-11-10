import React, { useCallback, Fragment } from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { useSnackbar } from 'notistack';

const CustomNotistack = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleClick = useCallback(
    (button) => () => {
      enqueueSnackbar(button.message, { variant: button.variant });
    },
    [enqueueSnackbar],
  );

  return <div></div>;
};

export default CustomNotistack;
