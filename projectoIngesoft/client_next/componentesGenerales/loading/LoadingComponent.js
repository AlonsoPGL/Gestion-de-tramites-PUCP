"use client";
import { Box, CircularProgress } from '@mui/material';

export default function LoadingComponent() {
  return (
    <Box 
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%'
      }}
    >
      <CircularProgress size={100} />
    </Box>
  );
}