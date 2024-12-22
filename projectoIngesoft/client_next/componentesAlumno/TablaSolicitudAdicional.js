"use client"; 

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Pagination, Box, Button, Typography } from '@mui/material';

const cursos = [
    { codigo: '1INF22', nombre: 'Matemáticas', creditos: 4, horarioActual: '0681', nuevoHorario: '0691' },
    { codigo: '1IND22', nombre: 'Física', creditos: 3, horarioActual: '0682', nuevoHorario: '0692' },
    { codigo: '1GEO22', nombre: 'Química', creditos: 4, horarioActual: '0611', nuevoHorario: '0621' },
    { codigo: '1ELE22', nombre: 'Biología', creditos: 3, horarioActual: '0651', nuevoHorario: '0661' },
    { codigo: '1ELE12', nombre: 'Historia', creditos: 4, horarioActual: '0681', nuevoHorario: '0693' },
    // Agrega más cursos si es necesario
];

const rowsPerPage = 5; // Define la cantidad de filas por página

const SolicitudModificacionHorario = () => {
    const [page, setPage] = useState(1); // Página actual
    const [seleccionados, setSeleccionados] = useState({}); // Cursos seleccionados

    // Cambia la página actual
    const handleChangePage = (event, value) => {
        setPage(value);
    };

    // Filtra los cursos a mostrar según la página actual
    const cursosPaginados = cursos.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    // Maneja la selección de cursos
    const handleSelect = (codigo) => {
        setSeleccionados((prev) => ({
            ...prev,
            [codigo]: !prev[codigo], // Alterna el estado de selección
        }));
    };

    // Envía la solicitud
    const handleSubmit = () => {
        const cursosSeleccionados = cursos.filter((curso) => seleccionados[curso.codigo]);
        if (cursosSeleccionados.length === 0) {
            alert('Por favor selecciona al menos un curso para modificar su horario.');
            return;
        }
        console.log('Solicitud enviada con los siguientes cursos:', cursosSeleccionados);
        alert('Solicitud enviada correctamente.');
    };

    return (
        <Box>
            {/* Título de la pantalla */}
            <Typography variant="h5" mb={3}>
                Solicitud de Modificación de Horario
            </Typography>

            {/* Tabla con los cursos */}
            <TableContainer component={Paper} sx={{ borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', overflow: 'auto' }}>
                <Table sx={{ minWidth: 650 }} aria-label="tabla de modificación de horario">
                    <TableHead sx={{ backgroundColor: '#363581' }}>
                        <TableRow>
                            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Código</TableCell>
                            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
                            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Créditos</TableCell>
                            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Horario Actual</TableCell>
                            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Nuevo Horario</TableCell>
                            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Seleccionar</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cursosPaginados.map((curso) => (
                            <TableRow key={curso.codigo}>
                                <TableCell align="center">{curso.codigo}</TableCell>
                                <TableCell align="center">{curso.nombre}</TableCell>
                                <TableCell align="center">{curso.creditos}</TableCell>
                                <TableCell align="center">{curso.horarioActual}</TableCell>
                                <TableCell align="center">{curso.nuevoHorario}</TableCell>
                                <TableCell align="center">
                                    <Checkbox
                                        checked={!!seleccionados[curso.codigo]}
                                        onChange={() => handleSelect(curso.codigo)}
                                        color="primary"
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Paginador debajo de la tabla */}
            <Box display="flex" justifyContent="end" mt={2}>
                <Pagination
                    count={Math.ceil(cursos.length / rowsPerPage)} // Número total de páginas
                    page={page}                                   // Página actual
                    onChange={handleChangePage}                   // Manejador de cambio de página
                    size="large"
                    color="primary"
                />
            </Box>

            {/* Botón para enviar la solicitud */}
            <Box display="flex" justifyContent="center" mt={3}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Enviar Solicitud
                </Button>
            </Box>
        </Box>
    );
};

export default SolicitudModificacionHorario;
