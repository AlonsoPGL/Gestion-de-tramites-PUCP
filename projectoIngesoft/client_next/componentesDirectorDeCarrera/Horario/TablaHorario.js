import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Box, Pagination
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useRouter } from 'next/navigation';
import EstaSeguroAccion from 'componentesGenerales/modales/EstaSeguroAccion';
import { useAlumnoxHorario } from '@/app/AlumnoxHorarioContext';

const rowsPerPage = 5;

const TablaHorario = ({ alumnosxHorario, eliminarAlumnoxHorario }) => {
     const {setAlumnoxHorario } = useAlumnoxHorario();
    const [modalOpen, setModalOpen] = useState(false);
    const [alumnoAEliminar, setAlumnoAEliminar] = useState(null);
    const [page, setPage] = useState(1);

    const router = useRouter();

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const alumnosPaginados = Array.isArray(alumnosxHorario)
        ? alumnosxHorario.slice((page - 1) * rowsPerPage, page * rowsPerPage)
        : [];

    const editarAlumno = (alumno) => {
        console.log("Preparando alumno para edición:", alumno);
        setAlumnoxHorario({
            id: alumno.idAlumno,
            codigo: alumno.codigo,
            cantAlumnos: alumno.cantAlumnos,
            TipoHorario: alumno.TipoHorario,
            visible : alumno.visible,
        });

        router.push('/directorCarrera/planDeEstudios/gestionHorario/nuevoAlumnoxHorario?mode=edit');
    };

    const listarAlumnos = (alumno) => {
        router.push(`/directorCarrera/horarios/gestionHorario/listarAlumnos/${alumno.id}`);
    };

    const handleOpenModal = async (alumno) => {
        setAlumnoAEliminar(alumno);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setAlumnoAEliminar(null);
    };

    const confirmEliminarAlumno = async () => {
        try {
            if (alumnoAEliminar) {
                await eliminarAlumnoxHorario(alumnoAEliminar.idAlumno);
                handleCloseModal();
            }
        } catch (error) {
            console.error("Error al eliminar alumno:", error);
        }
    };

    return (
        <>
            <TableContainer component={Paper} sx={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', overflow: 'auto' }}>
                <Table sx={{ borderCollapse: 'collapse' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell align='center' sx={{ backgroundColor: '#363581', color: 'white' }}>Codigo</TableCell>
                            <TableCell align='center' sx={{ backgroundColor: '#363581', color: 'white' }}>Nro de Alumnos</TableCell>
                            <TableCell align='center' sx={{ backgroundColor: '#363581', color: 'white' }}>Visible</TableCell> 
                            <TableCell align='center' sx={{ backgroundColor: '#363581', color: 'white' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {alumnosPaginados.map((alumno) => (
                            <TableRow key={alumno.idAlumno} sx={{ backgroundColor: '#F8F9FA' }}>
                                <TableCell align='center'>{alumno.codigo}</TableCell>
                                <TableCell align='center'>{alumno.cantAlumnos}</TableCell> 
                                <TableCell align='center'>{alumno.visible ? 'Sí' : 'No'}</TableCell>
                                <TableCell align='center'>
                                    <EditIcon
                                        sx={{ 
                                            fontSize: 25, 
                                            horarior: 'pointer', 
                                            marginRight: '10px', 
                                            color: '#363581'
                                        }}
                                        onClick={() => editarAlumno(alumno)}
                                    />
                                    <DeleteIcon
                                        sx={{ 
                                            fontSize: 25, 
                                            horarior: 'pointer', 
                                            marginRight: '10px', 
                                            color: '#363581'
                                        }}
                                        onClick={() => handleOpenModal(alumno)}
                                    /> 
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box display="flex" justifyContent="end" mt={2}>
                <Pagination
                    count={Math.ceil(alumnosxHorario.length / rowsPerPage)}
                    page={page}
                    onChange={handleChangePage}
                    size='large'
                    color='primary'
                    sx={{
                        '& .Mui-selected': {
                            color: '#fafafa',
                            backgroundColor: '#363581',
                        },
                    }}
                />
            </Box>

            <EstaSeguroAccion
                open={modalOpen}
                onClose={handleCloseModal}
                texto="¿Está seguro de eliminar el alumno?"
                handleAceptar={async () => {
                    await confirmEliminarAlumno();
                    setModalOpen(false);
                }}
            />
        </>
    );
};

export default TablaHorario;