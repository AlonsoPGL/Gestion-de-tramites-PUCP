"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Backdrop } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const RegistradoConExito = ({ open, onClose ,texto}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      slots={{
        backdrop: Backdrop  // Define Backdrop aquí con la nueva propiedad 'slots.backdrop'
      }}
      slotProps={{
          backdrop: {
              sx: { backgroundColor: 'rgba(0, 0, 0, 0.1)' } // Ajusta la opacidad del fondo
          }
      }}
    >
      <Box sx={style}>
        <Box sx={{display:'flex', justifyContent: 'center'}}>
            <CheckCircleOutlineIcon></CheckCircleOutlineIcon>
        </Box>

        <Box sx={{backgroundColor:'#363581'}}>
            <Typography border={1} align='center' id="modal-modal-description" sx={{ mt: 2, color:'white' }}>
                {texto}
            </Typography>
        </Box>
        
      </Box>
    </Modal>
  );
};

export default RegistradoConExito;