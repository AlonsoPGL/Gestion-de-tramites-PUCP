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
import { useHorarioxCurso } from '@/app/HorarioxCursoContext';

const rowsPerPage = 5;

const TablaCurso = ({ horariosxCurso, eliminarHorarioxCurso }) => {
     const {setHorarioxCurso } = useHorarioxCurso();
    const [modalOpen, setModalOpen] = useState(false);
    const [horarioAEliminar, setHorarioAEliminar] = useState(null);
    const [page, setPage] = useState(1);

    const router = useRouter();

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const horariosPaginados = Array.isArray(horariosxCurso)
        ? horariosxCurso.slice((page - 1) * rowsPerPage, page * rowsPerPage)
        : [];

    const editarHorario = (horario) => {
        console.log("Preparando horario para edición:", horario);
        setHorarioxCurso({
            id: horario.idHorario,
            codigo: horario.codigo,
            cantAlumnos: horario.cantAlumnos,
            tipoHorario: horario.tipoHorario,
            visible : horario.visible,
        });

        router.push('/directorCarrera/planDeEstudios/gestionCurso/nuevoHorarioxCurso?mode=edit');
    };

    const listarHorarios = (horario) => {
        router.push(`/directorCarrera/cursos/gestionCurso/listarHorarios/${horario.id}`);
    };

    const handleOpenModal = async (horario) => {
        setHorarioAEliminar(horario);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setHorarioAEliminar(null);
    };

    const confirmEliminarHorario = async () => {
        try {
            if (horarioAEliminar) {
                await eliminarHorarioxCurso(horarioAEliminar.idHorario);
                handleCloseModal();
            }
        } catch (error) {
            console.error("Error al eliminar horario:", error);
        }
    };

    return (
        <>
            <TableContainer component={Paper} sx={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', overflow: 'auto' }}>
                <Table sx={{ borderCollapse: 'collapse' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell align='center' sx={{ backgroundColor: '#363581', color: 'white' }}>Codigo</TableCell>
                            <TableCell align='center' sx={{ backgroundColor: '#363581', color: 'white' }}>Tipo</TableCell>
                            <TableCell align='center' sx={{ backgroundColor: '#363581', color: 'white' }}>Nro de Alumnos</TableCell>
                            <TableCell align='center' sx={{ backgroundColor: '#363581', color: 'white' }}>Visible</TableCell> 
                            <TableCell align='center' sx={{ backgroundColor: '#363581', color: 'white' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {horariosPaginados.map((horario) => (
                            <TableRow key={horario.idHorario} sx={{ backgroundColor: '#F8F9FA' }}>
                                <TableCell align='center'>{horario.codigo}</TableCell>
                                <TableCell align='center'>{horario.tipoHorario}</TableCell>
                                <TableCell align='center'>{horario.cantAlumnos}</TableCell> 
                                <TableCell align='center'>{horario.visible ? 'Sí' : 'No'}</TableCell>
                                <TableCell align='center'>
                                    <EditIcon
                                        sx={{ 
                                            fontSize: 25, 
                                            cursor: 'pointer', 
                                            marginRight: '10px', 
                                            color: '#363581'
                                        }}
                                        onClick={() => editarHorario(horario)}
                                    />
                                    <DeleteIcon
                                        sx={{ 
                                            fontSize: 25, 
                                            cursor: 'pointer', 
                                            marginRight: '10px', 
                                            color: '#363581'
                                        }}
                                        onClick={() => handleOpenModal(horario)}
                                    /> 
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box display="flex" justifyContent="end" mt={2}>
                <Pagination
                    count={Math.ceil(horariosxCurso.length / rowsPerPage)}
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
                texto="¿Está seguro de eliminar el horario?"
                handleAceptar={async () => {
                    await confirmEliminarHorario();
                    setModalOpen(false);
                }}
            />
        </>
    );
};

export default TablaCurso;