"use client"
import React, { useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Table, TableBody, Paper, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import InputField from '../../componentesGenerales/inputs/InputField';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    minHeight: '500px',
    bgcolor: 'background.paper',
    boxShadow: 13,
    border: 'solid black 2px',
    p: 2,
};

const ModalAnhadirEditar = ({ open, onClose, titulo, onSave }) => {
    const [filtro, setFiltro] = useState({
        nombre: '',
        codigo: '',
        facultad: '', // Nuevo filtro
    });
    const [errores, setErrores] = useState({});
    const [erroresMensaje, setErroresMensaje] = useState({});
    const [resultados, setResultados] = useState([]);

    const mensajesError = {
        nombre: "El nombre debe contener solo letras y espacios, y tener entre 1 y 100 caracteres.",
        codigo: "El código debe ser un texto válido.",
        facultad: "El nombre de la facultad debe contener solo letras y espacios, y tener entre 1 y 100 caracteres.",
    };

    const validarNombre = (nombre) => /^[A-Za-z0-9áéíóúÁÉÍÓÚñÑ\s]{0,100}$/.test(nombre);
    const validarCodigo = (codigo) => /^[A-Za-z0-9-]{0,20}$/.test(codigo);
    const validarFacultad = (facultad) => /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]{0,100}$/.test(facultad);

    const handleInputChange = (event, validator, field) => {
        const { name, value } = event.target;
        setFiltro((prevFiltro) => ({ ...prevFiltro, [name]: value }));

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

    const buscarCursos = async () => {
        try {
            const { nombre, codigo, facultad } = filtro;
            const response = await axios.get('http://localhost:8080/institucion/curso/buscarCursoNombreCodigoFacultad', { params: { nombre, codigo, facultad } });
            setResultados(response.data);
        } catch (error) {
            console.error('Error al buscar cursos:', error);
            setResultados([]);
        }
    };

    const seleccionarCurso = (curso) => {
        onSave(curso);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h5" gutterBottom>{titulo}</Typography>
                <Box sx={{ backgroundColor: '#5D71BC', color: 'white', p: 1, mb: 2, mx: -2 }}>
                    <Typography align="left" variant="body1" sx={{ ml: 1 }}>
                        Buscar curso
                    </Typography>
                </Box>

                <InputField
                    label="Nombre"
                    name="nombre"
                    value={filtro.nombre}
                    onChange={(e) => handleInputChange(e, validarNombre, 'nombre')}
                    required
                    error={!!errores.nombre}
                    helperText={erroresMensaje.nombre}
                    width="100%"
                    height="30px"
                />

                <InputField
                    label="Código"
                    name="codigo"
                    value={filtro.codigo}
                    onChange={(e) => handleInputChange(e, validarCodigo, 'codigo')}
                    required
                    error={!!errores.codigo}
                    helperText={erroresMensaje.codigo}
                    width="50%"
                    height="30px"
                />

                <InputField
                    label="Facultad"
                    name="facultad"
                    value={filtro.facultad}
                    onChange={(e) => handleInputChange(e, validarFacultad, 'facultad')}
                    required
                    error={!!errores.facultad}
                    helperText={erroresMensaje.facultad}
                    width="100%"
                    height="30px"
                />

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <button style={{ padding: '8px 16px', backgroundColor: '#5D71BC', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={buscarCursos}>
                        Buscar
                    </button>
                </Box>

                {resultados.length > 0 && (
                  <TableContainer component={Paper} sx={{ borderRadius: 2, maxHeight: '265px', overflow: 'auto', '&::-webkit-scrollbar': { width: '20px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#5D71BC', borderRadius: '10px' }, '&::-webkit-scrollbar-track': { background: '#e0e0e0', borderRadius: '10px' } }}>
                    <Table sx={{ mt: 3 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Código</TableCell>
                                <TableCell>Facultad</TableCell>
                                <TableCell>Acción</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {resultados.map((curso) => (
                                <TableRow key={curso.idCurso} hover onClick={() => seleccionarCurso(curso)}>
                                    <TableCell>{curso.nombre}</TableCell>
                                    <TableCell>{curso.codigo}</TableCell>
                                    <TableCell>{curso.especialidad.facultad.nombre}</TableCell>
                                    <TableCell>
                                        <button style={{ padding: '4px 8px', backgroundColor: '#5D71BC', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                            Seleccionar
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                  </TableContainer>
                )}
            </Box>
        </Modal>
    );
};

export default ModalAnhadirEditar;
