"use client"
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button, TextField } from '@mui/material';
import InputField from '../../componentesGenerales/inputs/InputField';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    minHeight: '450px',
    bgcolor: 'background.paper',
    boxShadow: 13,
    border: 'solid black 2px',
    p: 2,
};

const ModalAnhadirEditar = ({ open, onClose, titulo, values, onSave, editingIndex }) => {

    const [criterio, setCriterio] = useState({
        nombre: '',
        maximo_puntaje: '',
    });
    const [errores, setErrores] = useState({}); // Para rastrear campos incompletos
    const [erroresMensaje, setErroresMensaje] = useState({});


    const mensajesError = {
        nombre: "El nombre del criterio debe contener solo letras, espacios y números, y tener entre 1 y 100 caracteres.",
        maximo_puntaje: "El máximo puntaje debe contener numeros y ser menor a 100",
    };

    const validarNombre = (nombre) => /^[A-Za-záéíóúÁÉÍÓÚñÑ0-9\s]{1,100}$/
    const validadMaximoPuntaje = (maximo_puntaje) => /^[1-9][0-9]?$|^100$/.test(maximo_puntaje);


    useEffect(() => {
        if (editingIndex !== null) {
            setCriterio(values.criteriosSeleccion[editingIndex]);
        } else {
            // Si estamos insertando, limpiamos los campos
            setCriterio({
                nombre: '',
                maximo_puntaje: '',
            });
        }
    }, [values.criteriosSeleccion, editingIndex]);

    const handleInputChange = (event, validator, field) => {
        const { name, value } = event.target;
        setCriterio((prevCriterio) => ({ ...prevCriterio, [name]: value }));

        // Validación en tiempo real
        const nuevosErrores = { ...errores };
        const nuevosErroresMensaje = { ...erroresMensaje };
        if (!validator(value)) {
            nuevosErrores[field] = true;
            nuevosErroresMensaje[field] = mensajesError[field];
        } else {
            delete nuevosErrores[field];
            delete nuevosErroresMensaje[field];
        }
        setErrores(nuevosErrores);
        setErroresMensaje(nuevosErroresMensaje);
    };

    const handleSubmit = async (e) => {
        const formularioValido = await validarFormulario();
        if (formularioValido) {
            onSave(criterio);
            onClose(); // Close the modal after saving
        }

    };

    const validarFormulario = async () => {
        const nuevosErrores = {};
        const nuevosErroresMensaje = {};

        // Validación de puesto
        if (!validarNombre(criterio.nombre)) {
            nuevosErrores.nombre = true;
            nuevosErroresMensaje.nombre = mensajesError.nombre;
        }

        // Validación de archivo
        if (!validadMaximoPuntaje(criterio.maximo_puntaje)) {
            nuevosErrores.maximo_puntaje = true;
            nuevosErroresMensaje.maximo_puntaje = mensajesError.maximo_puntaje;
        }


        setErrores(nuevosErrores);
        setErroresMensaje(nuevosErroresMensaje);

        // Si no hay errores, retorna true
        return Object.keys(nuevosErrores).length === 0;
    };
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h5" gutterBottom>{titulo}</Typography>
                <Box sx={{ backgroundColor: '#5D71BC', color: 'white', p: 1, mb: 2, mx: -2 }}>
                    <Typography align="left" variant="body1" sx={{ ml: 1 }}>
                        Información
                    </Typography>
                </Box>

                <InputField
                    label="Criterio"
                    name={"nombre"}
                    onChange={(e) => handleInputChange(e, validarNombre, 'nombre')}
                    value={criterio.nombre} // Vinculamos el valor con el estado
                    required
                    error={!!errores.nombre}
                    helperText={erroresMensaje.nombre}
                    width="100%"
                    height="30px"

                />

                <InputField
                    label="Puntuación máxima"
                    name={"maximo_puntaje"} // Actualización del nombre
                    value={criterio.maximo_puntaje}
                    onChange={(e) => handleInputChange(e, validadMaximoPuntaje, 'maximo_puntaje')}
                    required
                    error={!!errores.maximo_puntaje}
                    helperText={erroresMensaje.maximo_puntaje}
                    width="50%"
                    height="30px"
                />

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Button variant="outlined" onClick={onClose}>Cancelar</Button>
                    <Button variant="contained" onClick={handleSubmit} sx={{ ml: 2 }}>Guardar</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ModalAnhadirEditar;
