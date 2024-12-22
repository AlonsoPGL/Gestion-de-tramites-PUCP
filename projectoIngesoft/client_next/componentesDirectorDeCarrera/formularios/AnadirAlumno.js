import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const AnadirAlumno = ({ onAñadir }) => {
    const [codigo, setCodigo] = useState('');
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');

    const handleAñadir = () => {
        const nuevoAlumno = {
            codigo,
            nombre,
            email,
        };
        onAñadir(nuevoAlumno);
    };

    return (
        <Box>
            <h2>Añadir Alumno en Riesgo</h2>
            <TextField
                label="Código de Alumno"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Nombre Completo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleAñadir}>Añadir</Button>
        </Box>
    );
};

export default AnadirAlumno;
