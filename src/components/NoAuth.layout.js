import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

const NoAuthLayout = ({ heading, subheading, children }) => {
  return (
    <Box
      sx={{
        margin: 'auto',
        padding: '25px 35px',
        height: 'fit-content',
        width: '400px',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        background: '#ffffff',
        borderRadius: '3px',
        boxShadow: 'rgb(0 0 0 / 10%) 0px 0px 10px',
        boxSizing: 'border-box',
        border: '1px solid #d3d3d3',
      }}
    >
      <Box
        sx={{
          color: 'text.primary',
          fontSize: 34,
          fontWeight: 'medium',
          margin: '10px 0 0',
        }}
      >
        {heading}
      </Box>
      <Box sx={{ color: '#696969' }}>{subheading}</Box>
      {children}
    </Box>
  );
};

NoAuthLayout.propTypes = {
  heading: PropTypes.string,
  subheading: PropTypes.string,
  children: PropTypes.element,
};

export default NoAuthLayout;
