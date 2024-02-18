import { styled } from '@mui/material';
import { keyframes } from '@emotion/react';

const slideLeft = keyframes`
  0% {
    transform: translateX(0)
  }
  25%{
    transform: translateX(6px)
  }

  100% {
    transform: translateX(0)
  }
`;

const SlideLeft = styled('div')({
  color: 'rgba(25, 118, 210, 1)',
  padding: '5px',
  animation: `${slideLeft} 2s infinite`,
  // position: 'relative',
});

export default SlideLeft;
