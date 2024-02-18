import { styled } from '@mui/material';
import { keyframes } from '@emotion/react';

const pulsating = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(25, 118, 210, 0);
  }
  
  100% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
  }
`;

const PulsatingBox = styled('div')({
  color: '#ffffff',
  padding: '5px',
  transform: `scale(1)`,
  animation: `${pulsating} 2s infinite`,
  background: `rgba(25, 118, 210, 1)`,
  boxShadow: `0 0 0 0 rgba(25, 118, 210, 1)`,
});

export default PulsatingBox;
