import React, { useState } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';

const BuscarAlumnoModal = ({ open, handleClose, onSeleccionar }) => {
    const [codigoAlumno, setCodigoAlumno] = useState('');
    const [datosAlumno, setDatosAlumno] = useState(null);

    const buscarAlumno = async () => {
        // Llamada al backend para buscar al alumno por código
        const response = await fetch(`/rrhh/alumno/buscar?codigo=${codigoAlumno}`);
        const data = await response.json();
        setDatosAlumno(data);
    };

    const handleSeleccionar = () => {
        onSeleccionar(datosAlumno);
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ ...modalStyle }}>
                <h2>Buscar Alumno</h2>
                <TextField
                    label="Código de Alumno"
                    value={codigoAlumno}
                    onChange={(e) => setCodigoAlumno(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" onClick={buscarAlumno}>Buscar</Button>

                {datosAlumno && (
                    <div>
                        <p><strong>Nombre:</strong> {datosAlumno.nombre}</p>
                        <p><strong>Correo Electrónico:</strong> {datosAlumno.email}</p>
                        <Button variant="contained" color="primary" onClick={handleSeleccionar}>Seleccionar</Button>
                        <Button variant="outlined" onClick={handleClose}>Cancelar</Button>
                    </div>
                )}
            </Box>
        </Modal>
    );
};

const modalStyle = {
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

export default BuscarAlumnoModal;
