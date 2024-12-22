import React from 'react';
import { Modal, Box, Typography, Button, Fade, Backdrop } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const style = {
    border: '2px solid #8a8a8a',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24, // 13 
    p: 4,
    textAlign: 'center',
}

function ModalEliminar({ open, onClose, onConfirm }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        
        <Box sx={style}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <ErrorOutlineIcon
                sx={{ fontSize: 150, color: '#363581' }} // Cambia el tamaño y color según necesites
            />
            </Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            ¿Estás seguro de eliminar a este alumno en riesgo?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 3 }}>
            <Button variant="outlined" onClick={onClose} fullWidth>
              Cancelar
            </Button>
            <Button variant="contained" onClick={onConfirm} color="error" fullWidth>
              Eliminar
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}

export default ModalEliminar;