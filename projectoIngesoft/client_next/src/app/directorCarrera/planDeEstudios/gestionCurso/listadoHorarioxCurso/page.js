"use client";
import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, InputAdornment } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import Link from 'next/link';
import { useHorarioxCurso } from '@/app/HorarioxCursoContext';
import { usePersona } from '@/app/PersonaContext';
import { useCursoxPlanDeEstudio } from '@/app/CursoxPlanDeEstudioContext';
import Papa from 'papaparse';
import axios from 'axios';
import ModalSuperior from 'componentesGenerales/modales/ModalSuperior';
import TablaCurso from 'componentesDirectorDeCarrera/curso/TablaCurso';
import UploadFileIcon from '@mui/icons-material/UploadFile';
export default function GestionCurso() {
    // const { persona,setPer } = usePersona();
    const { cursoxPlanDeEstudio, setCursoxPlanDeEstudio } = useCursoxPlanDeEstudio();
    const { horarioxCurso, setHorarioxCurso } = useHorarioxCurso();
    const [cursoDelDirector, setEspecialidadDelDirector] = useState(null);
    const fileInputRef = useRef(null);
    const [confirmacionOpen, setConfirmacionOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [horarios, setHorarios] = useState([]);
    const [filteredHorarios, setFilteredHorarios] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState("");
    const [hasSpecialty, setHasSpecialty] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
   

    // useEffect(() => {
    //     cargarHorarios();
    // }, [cursoxPlanDeEstudio]);
    useEffect(() => {
        const initializeCurso = async () => {
            try {
                setIsLoading(true);
                const savedCurso = localStorage.getItem('cursoxPlanDeEstudio');
                if (savedCurso) {
                    const parsedCurso = JSON.parse(savedCurso);
                    await setCursoxPlanDeEstudio(parsedCurso);
                    
                    // Cargar horarios inmediatamente si tenemos el curso
                    if (parsedCurso?.curso?.idCurso) {
                        await cargarHorarios(parsedCurso.curso.idCurso);
                    }
                } else {
                    setError("No se ha seleccionado un curso. Por favor, seleccione un curso primero.");
                }
            } catch (error) {
                console.error("Error al inicializar el curso:", error);
                setError("Error al cargar la información del curso");
            } finally {
                setIsLoading(false);
            }
        };

        initializeCurso();
    }, []);
 
 

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

 

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.csv')) {
            setError('Por favor, sube un archivo CSV válido');
            return;
        }

        setSelectedFile(file);
        setConfirmacionOpen(true);
    };

    const confirmarSubidaCSV = async () => {
        if (!selectedFile) {
            setError('No se ha seleccionado ningún archivo');
            setConfirmacionOpen(false);
            return;
        }

        Papa.parse(selectedFile, {
            header: true,
            complete: async (results) => {
                const nuevosHorarios = results.data
                    .filter(row => row.codigo && row.nombre)
                    .map(row => ({
                        ciclo: row.ciclo,
                        horarioxCurso: {
                            codigo: row.codigo,
                            nombre: row.nombre,
                            creditos: row.creditos, 
                        },
                        esElectivo: row.esElectivo === 'true'
                    }));

                if (nuevosHorarios.length > 0) {
                    try {
                        await axios.post('http://localhost:8080/planestudios/insertarCSV', nuevosHorarios);
                        await cargarHorarios();
                        setError('');
                    } catch (error) {
                        console.error('Error al realizar la solicitud:', error.message);
                        setError('Error al subir los horarios');
                    }
                } else {
                    setError('No se encontraron horarios válidos en el archivo');
                }
                setConfirmacionOpen(false);
                setSelectedFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
            error: (error) => {
                console.error('Error al analizar el archivo:', error);
                setError('Error al leer el archivo CSV');
                setConfirmacionOpen(false);
            }
        });
    };

 

 
    
        // Efecto para recuperar y establecer el curso del localStorage
        useEffect(() => {
            const initializeCurso = async () => {
                try {
                    setIsLoading(true);
                    const savedCurso = localStorage.getItem('cursoxPlanDeEstudio');
                    if (savedCurso) {
                        const parsedCurso = JSON.parse(savedCurso);
                        await setCursoxPlanDeEstudio(parsedCurso);
                        
                        // Cargar horarios inmediatamente si tenemos el curso
                        if (parsedCurso?.curso?.idCurso) {
                            await cargarHorarios(parsedCurso.curso.idCurso);
                        }
                    } else {
                        setError("No se ha seleccionado un curso. Por favor, seleccione un curso primero.");
                    }
                } catch (error) {
                    console.error("Error al inicializar el curso:", error);
                    setError("Error al cargar la información del curso");
                } finally {
                    setIsLoading(false);
                }
            };
    
            initializeCurso();
        }, []);
    
        const cargarHorarios = async (idCurso) => {
            try {
                setError('');
                const response = await axios.get(
                    `http://localhost:8080/institucion/horario/listarHorariosActivosPorCurso/${idCurso}`
                );
                if (response?.data) {
                    setHorarios(response.data);
                    setFilteredHorarios(response.data);
                }
            } catch (error) {
                console.error("Error al cargar los horarios:", error);
                setError("Ocurrió un error al cargar los horarios");
            }
        };
    
        const handleSearch = (event) => {
            const busqueda = event.target.value.toLowerCase();
            setSearchTerm(busqueda);
    
            const resultadosFiltrados = horarios.filter((horarioxCurso) =>
                horarioxCurso.horarioxCurso.nombre?.toLowerCase().includes(busqueda) ||
                horarioxCurso.horarioxCurso.codigo?.toLowerCase().includes(busqueda)
            );
            setFilteredHorarios(resultadosFiltrados);
        };
    
        const limpiarHorario = () => {
            setHorarioxCurso(null);
        };
    
        const eliminarHorarioxCurso = async (id) => {
            try {
                await axios.delete(`http://localhost:8080/institucion/horario/eliminar/${id}`);
                if (cursoxPlanDeEstudio?.curso?.idCurso) {
                    await cargarHorarios(cursoxPlanDeEstudio.curso.idCurso);
                }
            } catch (error) {
                console.error("Error al eliminar el horarioxCurso:", error);
                setError('Error al eliminar el horarioxCurso');
            }
        };
    
    if (isLoading) {
        return (
            <Box sx={{ 
                backgroundColor: 'white', 
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Typography>Cargando...</Typography>
            </Box>
        );
    }
    return (
        <Box sx={{ backgroundColor: 'white', height: '100vh' }}>
            <Box sx={{
                marginLeft: '220px',
                height: '100vh',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <Typography variant="h4" sx={{ mb: '20px', color: '#191D23' }}>
                    Horarios del Curso: {cursoxPlanDeEstudio?.curso?.nombre}
                </Typography>

                {error && (
                    <Box sx={{
                        mb: 2,
                        p: 2,
                        bgcolor: '#ffebee',
                        color: '#c62828',
                        borderRadius: 1,
                        border: '1px solid #ef9a9a'
                    }}>
                        {error}
                    </Box>
                )}


                <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
                        <Box sx={{ flexGrow: 1, mr: 2 }}>
                            <TextField
                                placeholder="Buscar..."
                                variant="outlined"
                                fullWidth
                                value={searchTerm}
                                onChange={handleSearch}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                style={{ width: '100%', marginBottom: '20px' }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        height: '40px',
                                        minWidth: '150px',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }
                                }}
                            />
                        </Box>

                        <Button
                            component={Link}
                            href="./nuevoHorarioxCurso"
                            variant="contained"
                            color="primary"
                            onClick={limpiarHorario}
                            sx={{ ml: 2, display: 'flex', alignItems: 'center', height: '40px', backgroundColor: '#363581' }}
                        >
                            Añadir
                            <AddCircleOutlineIcon sx={{ ml: 1, color: 'white', width: '20px', height: '20px' }} />
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ ml: 2, display: 'flex', alignItems: 'center', height: '40px', backgroundColor: '#363581' }}
                        >
                            Subir
                            <UploadFileIcon sx={{ ml: 1, color: 'white', width: '20px', height: '20px' }} />
                        </Button>

                    </Box>

                    <TablaCurso
                        horariosxCurso={filteredHorarios}
                        eliminarHorarioxCurso={eliminarHorarioxCurso}
                    />

                    <ModalSuperior
                        open={confirmacionOpen}
                        handleClose={() => {
                            setConfirmacionOpen(false);
                            setSelectedFile(null);
                            if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                            }
                        }}
                        title="¿Está seguro de insertar el CSV de horarios?"
                        onConfirm={confirmarSubidaCSV}
                    />
                </>

            </Box>
        </Box>
    );
}