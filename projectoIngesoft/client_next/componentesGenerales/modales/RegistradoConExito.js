"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Icono de MUI
import { Backdrop } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #8a8a8a',
  boxShadow: 24,
  p: 4,
};

const RegistradoConExito = ({ open, onClose ,texto }) => {

  const textoRenderizado = () =>{
    if(texto!=null){
        return texto;
    }else{
        return "Registrado con exito"
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{border:'2px solid #ff4081'}}
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
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CheckCircleOutlineIcon 
            sx={{ fontSize: 150, color: '#363581' }} // Cambia el tamaño y color según necesites
          />
        </Box>

        <Box sx={{ backgroundColor: '#363581' }}>
          <Typography border={1} align='center' id="modal-modal-description" sx={{ mt: 2, color: 'white' }}>
            {textoRenderizado()}
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default RegistradoConExito;
