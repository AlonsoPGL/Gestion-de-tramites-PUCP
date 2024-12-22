import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography,Backdrop } from '@mui/material';

const VerObservacionModal = ({ observacion = "", open, onClose }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            slots={{
                backdrop: Backdrop  // Define Backdrop aquí con la nueva propiedad 'slots.backdrop'
            }}
            slotProps={{
                backdrop: {
                    sx: { backgroundColor: 'rgba(0, 0, 0, 0.1)' } // Ajusta la opacidad del fondo
                }
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalStyle}>
                <Box>
                    <Typography variant="h5">Observaciones del postulante</Typography>
                </Box>
                <Box sx={{ mt: '10px', mb: '10px', backgroundColor: '' }}>
                    <TextField
                        multiline
                        disabled
                        rows={7} // Número de filas visibles
                        variant="outlined"
                        fullWidth // Ancho completo
                        inputProps={{ maxLength: 1000 }} // Limita a 1000 caracteres
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px', // Personaliza el borde si es necesario
                            }
                        }}
                        value={observacion}
                    />
                </Box>
                <Box>
                    <Button variant="outlined" onClick={onClose}>Atrás</Button>
                </Box>
            </Box>
        </Modal>
    );
};

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '1px solid #8a8a8a',
    boxShadow: 10,
    p: 4,
};

export default VerObservacionModal;
