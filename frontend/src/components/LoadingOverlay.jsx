import React from 'react';
import { CircularProgress } from '@mui/material';

const LoadingOverlay = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <CircularProgress />
    </div>
  );
};

export default LoadingOverlay;