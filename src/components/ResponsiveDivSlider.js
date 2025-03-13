/* eslint-disable */

import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

const ResponsiveDivSlider = ({
  // divWidth = 350,
  setDivWidth,
  minWidth = 200,
  maxWidth = 500,
}) => {
  const draggerRef = useRef();
  const isResized = useRef(false);
  // const [minWidth, maxWidth] = [defaultMinWidth, defaultMaxWidth];

  // console.log({ divWidth });
  // listener to resize sidebar
  useEffect(() => {
    window.addEventListener('mousemove', (e) => {
      // console.log(e.movementX);
      if (!isResized.current) return;
      setDivWidth((previousWidth) => {
        const newWidth = previousWidth + e.movementX / 2;
        const isWidthInRange = newWidth >= minWidth && newWidth <= maxWidth;

        return isWidthInRange ? newWidth : previousWidth;
      });
    });
  }, [setDivWidth, isResized]);

  useEffect(() => {
    window.addEventListener('mouseup', () => {
      isResized.current = false;
    });
  }, []);

  return (
    <Box
      ref={draggerRef}
      onMouseDown={() => (isResized.current = true)}
      sx={{
        width: '5px',
        height: '100%',
        backgroundColor: '#ededed',
        '&:hover': {
          cursor: 'ew-resize',
          backgroundColor: '#1976d2',
        },
      }}
    ></Box>
  );
};

export default ResponsiveDivSlider;
