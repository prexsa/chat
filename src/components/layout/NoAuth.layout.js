import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const NoAuthLayout = ({ children }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));

  if (matches) {
    return (
      <Box
        sx={{
          margin: 'auto',
          background: '#ffffff',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        margin: 'auto',
        height: 'fit-content',
        width: '600px',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        background: '#ffffff',
        borderRadius: '3px',
        boxShadow: 'rgb(0 0 0 / 10%) 0px 0px 10px',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </Box>
  );
};

NoAuthLayout.propTypes = {
  children: PropTypes.element,
};

export default NoAuthLayout;
