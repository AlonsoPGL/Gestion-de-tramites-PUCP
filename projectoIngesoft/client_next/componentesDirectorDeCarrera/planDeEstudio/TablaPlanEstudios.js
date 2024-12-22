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
import { useCursoxPlanDeEstudio } from '@/app/CursoxPlanDeEstudioContext';
import { set } from 'date-fns';

const rowsPerPage = 5;

const TablaPlanEstudios = ({ cursosxPlanDeEstudio, eliminarCursoxPlanDeEstudio }) => {
    const { setCursoxPlanDeEstudio } = useCursoxPlanDeEstudio();
    const [modalOpen, setModalOpen] = useState(false);
    const [cursoAEliminar, setCursoAEliminar] = useState(null);
    const [page, setPage] = useState(1);

    const router = useRouter();

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const cursosPaginados = Array.isArray(cursosxPlanDeEstudio)
        ? cursosxPlanDeEstudio.slice((page - 1) * rowsPerPage, page * rowsPerPage)
        : [];

    const editarCurso = (curso) => {
        console.log("Preparando curso para edición:", curso);
        setCursoxPlanDeEstudio({
            id: curso.id,
            ciclo: curso.ciclo,
            curso: {
                idCurso: curso.curso?.idCurso || null,
                codigo: curso.curso?.codigo || '',
                nombre: curso.curso?.nombre || '',
                creditos: curso.curso?.creditos || 0,
                especialidad: curso.curso?.especialidad,
                tieneLaboratorio:  curso.tieneLaboratorio?  true : false,
                tienePractica: curso.tienePractica? true : false,
                tieneTeoria: curso.tieneTeoria? true : false,
                tieneExamen: curso.tieneExamen? true : false,
            },
            esElectivo: curso.esElectivo,
            planDeEstudio: curso.planDeEstudio
        }); 
        router.push('/directorCarrera/planDeEstudios/gestionPlanDeEstudio/nuevoCursoxPlanDeEstudio?mode=edit');
    };

    const listarHorarios = (curso) => {
        console.log("Listando horarios del curso:", curso);
        setCursoxPlanDeEstudio({
            id: curso.id,
            ciclo: curso.ciclo,
            curso: {
                idCurso: curso.curso?.idCurso || null,
                codigo: curso.curso?.codigo || '',
                nombre: curso.curso?.nombre || '',
                creditos: curso.curso?.creditos || 0,
                especialidad: curso.curso?.especialidad,
                tieneLaboratorio:  curso.tieneLaboratorio?  true : false,
                tienePractica: curso.tienePractica? true : false,
                tieneTeoria: curso.tieneTeoria? true : false,
                tieneExamen: curso.tieneExamen? true : false,
            },
            esElectivo: curso.esElectivo,
            planDeEstudio: curso.planDeEstudio
        }); 
    // Guardar en localStorage
    localStorage.setItem('cursoxPlanDeEstudio', JSON.stringify({
        id: curso.id,
        ciclo: curso.ciclo,
        curso: {
            idCurso: curso.curso?.idCurso || null,
            codigo: curso.curso?.codigo || '',
            nombre: curso.curso?.nombre || '',
            creditos: curso.curso?.creditos || 0,
            especialidad: curso.curso?.especialidad
        },
        esElectivo: curso.esElectivo,
        planDeEstudio: curso.planDeEstudio
    }));
        router.push(`/directorCarrera/planDeEstudios/gestionCurso/listadoHorarioxCurso`);
    };

    const handleOpenModal = async (curso) => {
        setCursoAEliminar(curso);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setCursoAEliminar(null);
    };

    const confirmEliminarCurso = async () => {
        try {
            if (cursoAEliminar) {
                await eliminarCursoxPlanDeEstudio(cursoAEliminar.id);
                handleCloseModal();
            }
        } catch (error) {
            console.error("Error al eliminar curso:", error);
        }
    };

    return (
        <>
            <TableContainer component={Paper} sx={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', overflow: 'auto' }}>
                <Table sx={{ borderCollapse: 'collapse' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell align='center' sx={{ backgroundColor: '#363581', color: 'white' }}>Ciclo</TableCell>
                            <TableCell align='center' sx={{ backgroundColor: '#363581', color: 'white' }}>Código</TableCell>
                            <TableCell align='center' sx={{ backgroundColor: '#363581', color: 'white' }}>Nombre</TableCell>
                            <TableCell align='center' sx={{ backgroundColor: '#363581', color: 'white' }}>Créditos</TableCell>
                            <TableCell align='center' sx={{ backgroundColor: '#363581', color: 'white' }}>Electivo</TableCell>
                            <TableCell align='center' sx={{ backgroundColor: '#363581', color: 'white' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {cursosPaginados.map((curso) => (
                            <TableRow key={curso.id} sx={{ backgroundColor: '#F8F9FA' }}>
                                <TableCell align='center'>{curso.ciclo}</TableCell>
                                <TableCell align='center'>{curso.curso.codigo}</TableCell>
                                <TableCell align='center'>{curso.curso.nombre}</TableCell>
                                <TableCell align='center'>{curso.curso.creditos}</TableCell>
                                <TableCell align='center'>{curso.esElectivo ? 'Sí' : 'No'}</TableCell>
                                <TableCell align='center'>
                                    <EditIcon
                                        sx={{ 
                                            fontSize: 25, 
                                            cursor: 'pointer', 
                                            marginRight: '10px', 
                                            color: '#363581'
                                        }}
                                        onClick={() => editarCurso(curso)}
                                    />
                                    <DeleteIcon
                                        sx={{ 
                                            fontSize: 25, 
                                            cursor: 'pointer', 
                                            marginRight: '10px', 
                                            color: '#363581'
                                        }}
                                        onClick={() => handleOpenModal(curso)}
                                    />
                                    <CalendarMonthIcon
                                        sx={{ 
                                            fontSize: 25, 
                                            cursor: 'pointer',
                                            color: '#363581'
                                        }}
                                        onClick={() => listarHorarios(curso)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box display="flex" justifyContent="end" mt={2}>
                <Pagination
                    count={Math.ceil(cursosxPlanDeEstudio.length / rowsPerPage)}
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
                texto="¿Está seguro de eliminar el curso?"
                handleAceptar={async () => {
                    await confirmEliminarCurso();
                    setModalOpen(false);
                }}
            />
        </>
    );
};

export default TablaPlanEstudios;