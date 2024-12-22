"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Button ,Backdrop} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 470,
  bgcolor: 'background.paper',
  border: '2px solid #8a8a8a',
  boxShadow: 13,
  p: 4,
};

const EstaSeguroAccion = ({ open, onClose, texto, handleAceptar }) => {

  const textoRenderizado = () => {
    if (texto != null) {
      return texto;
    } else {
      return "¿Está seguro de realizar esta acción?"
    }
  }

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
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <ErrorOutlineIcon
            sx={{ fontSize: 150, color: '#363581' }} // Cambia el tamaño y color según necesites
          />
        </Box>

        <Box sx={{}}>
          <Typography align='center' id="modal-modal-description" sx={{ fontWeight: 'bold', mt: 2, color: 'black' }}>
            {textoRenderizado()}
          </Typography>
        </Box>

        <Box sx={{ mt: '20px', ml: '10px', mr: '10px', display: 'flex', justifyContent: "space-between" }}>
          <Button variant='outlined' onClick={onClose} sx={{ width: '170px' }}>Cancelar</Button>
          <Button variant='contained' onClick={handleAceptar} sx={{ width: '170px' }}>Aceptar</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EstaSeguroAccion;
