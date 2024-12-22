import React from 'react';
import { Modal, Box, Typography, Button ,Backdrop} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const style = {
  position: 'absolute',
  top: '0.1%',
  left: '50%',
  transform: 'translate(-50%, 0)',
  width: 500,
  bgcolor: 'background.paper',
  borderRadius: '25px',
  boxShadow: '24', // Quitar sombra para eliminar el borde negro
  border: 'none', // Asegúrate de que no haya borde
  outline: 'none', // Eliminar cualquier contorno
};

const headerStyle = {
  backgroundColor: '#363581',
  height: '33px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderTopLeftRadius: '25px',
  borderTopRightRadius: '25px',
};

const contentStyle = {
  mt: 3,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

export default function ModalSuperior({ open, handleClose, title, onConfirm }) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
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
        <Box sx={headerStyle}>
          <WarningAmberIcon sx={{ color: 'white', marginRight: '8px' }} />
        </Box>
        <Box sx={contentStyle}>
          <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>
            {title}
          </Typography>
          <Box sx={{ mt: '25px', ml: '10px', mr: '10px', mb: '30px', display: 'flex', justifyContent: "space-between" }}>
            <Button variant='outlined' onClick={handleClose} sx={{ width: '150px',mr: '40px' }}>Cancelar</Button>
            <Button variant='contained' onClick={onConfirm} sx={{ width: '150px' }}>Aceptar</Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
