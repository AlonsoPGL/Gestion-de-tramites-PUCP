"use client";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import React, { useRef, useEffect, useState } from 'react';
import {
    Box, Typography, Button, TextField, InputAdornment, Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import Link from 'next/link';
import { useCursoxPlanDeEstudio } from '@/app/CursoxPlanDeEstudioContext';
import { usePersona } from '@/app/PersonaContext';
import Papa from 'papaparse';
import axios from 'axios';
import ModalSuperior from 'componentesGenerales/modales/ModalSuperior';
import TablaPlanEstudios from 'componentesDirectorDeCarrera/planDeEstudio/TablaPlanEstudios';
const ModalErrores = ({ open, handleClose, errores }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        const texto = errores.join('\n');
        navigator.clipboard.writeText(texto);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                Errores encontrados en el CSV
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={copyToClipboard}
                        startIcon={<ContentCopyIcon />}
                    >
                        {copied ? 'Copiado!' : 'Copiar todos los errores'}
                    </Button>
                </Box>
                <List>
                    {errores.map((error, index) => (
                        <ListItem key={index}>
                            <ListItemIcon>
                                <ErrorOutlineIcon color="error" />
                            </ListItemIcon>
                            <ListItemText primary={error} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default function GestionPlanEstudios() {
    const { persona } = usePersona();
    const { cursoxPlanDeEstudio, setCursoxPlanDeEstudio } = useCursoxPlanDeEstudio();
    const [especialidadDelDirector, setEspecialidadDelDirector] = useState(null);
    const fileInputRef = useRef(null);
    const [confirmacionOpen, setConfirmacionOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [cursos, setCursos] = useState([]);
    const [filteredCursos, setFilteredCursos] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState("");
    const [hasSpecialty, setHasSpecialty] = useState(false);
    const [erroresServidor, setErroresServidor] = useState([]);
    const [modalErroresOpen, setModalErroresOpen] = useState(false);
    
    const descargarPlantilla = () => {
        // Datos de ejemplo para la plantilla
        const templateData = [
            {
                ciclo: "1",
                codigo_curso: "DEV101",
                nombre_curso: "Desarrollo de Software I",
                creditos: "4.0",
                esElectivo: "Si",
                tiene_laboratorio: "Si",
                tiene_practica: "Si",
                tiene_clase: "Si",
                tiene_examen: "Si",
                codigo_seccion: "INF" 
            },
            {
                ciclo: "2",
                codigo_curso: "DEV102",
                nombre_curso: "Desarrollo de Software II",
                creditos: "4.5",
                esElectivo: "No",
                tiene_laboratorio: "Si",
                tiene_practica: "Si",
                tiene_clase: "Si",
                tiene_examen: "Si",
                codigo_seccion: "INF" 
            },
            {
                ciclo: "",
                codigo_curso: "Formato: texto",
                nombre_curso: "Formato: texto",
                creditos: "Formato: decimal (ej: 4.0)",
                esElectivo: "Formato: Si/No",
                tiene_laboratorio: "Formato: Si/No",
                tiene_practica: "Formato: Si/No",
                tiene_clase: "Formato: Si/No",
                tiene_examen: "Formato: Si/No",
                codigo_seccion: "Formato: texto"
            }
        
        ];

        // Definir headers
        const headers = [
            "ciclo",
            "codigo_curso",
            "nombre_curso",
            "creditos",
            "esElectivo",
            "tiene_laboratorio",
            "tiene_practica",
            "tiene_clase",
            "tiene_examen",
            "codigo_seccion"
        ];

        // Convertir a CSV usando punto y coma como separador
        const csvContent = [
            headers.join(";"),
            ...templateData.map(row =>
                headers.map(header => row[header]).join(";")
            )
        ].join("\n");

        // Agregar BOM para correcta visualización de caracteres especiales
        const BOM = "\uFEFF";
        const blob = new Blob([BOM + csvContent], {
            type: "text/csv;charset=utf-8;"
        });

        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);

        link.setAttribute("href", url);
        link.setAttribute("download", "PlantillaCursos.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    const obtenerEspecialidadPorIdCoordinador = async (idCoordinador) => {
        try {
            const response = await axios.get(`http://localhost:8080/institucion/especialidad/buscarPorCoordinador?idCoordinador=${idCoordinador}`);
            if (response.data) {
                setHasSpecialty(true);
                return response.data;
            }
            setHasSpecialty(false);
            setError("El director de carrera a cargo no tiene una especialidad asignada. Por favor, comuniquese con el administrador para que le asigne a su especialidad");
            return null;
        } catch (error) {
            if (error.response?.status === 404) {
                setHasSpecialty(false);
                setError("El director de carrera a cargo no tiene una especialidad asignada. Por favor, comuniquese con el administrador para que le asigne a su especialidad");
                return null;
            }
            console.error("Error inesperado:", error);
            setError("Error inesperado al buscar especialidad");
            return null;
        }
    };
    const obtenerPlanDeEstudioPorIdEspecialidad = async (id) => {
        try {
            console.log(`Obteniendo el plan de estudios para la especialidad con id ${id}`);

            if (!id || id <= 0) {
                console.warn(`ID de especialidad inválido: ${id}`);
                return null; // Devuelve null si el ID no es válido
            }

            const response = await axios.get(`http://localhost:8080/institucion/planDeEstudio/obtenerPorEspecialidad/${id}`);
            return response.data; // Devuelve los datos si la solicitud es exitosa
        } catch (error) {
            // Manejo de errores HTTP específicos
            if (error.response) {
                const { status } = error.response;
                console.error(`Error HTTP (${status}) al obtener el plan de estudios para la especialidad con id ${id}`);

                if (status === 404) {
                    console.warn("No se encontró el plan de estudios para el ID proporcionado.");
                    return null; // Devuelve null si no se encuentra el recurso
                }
                if (status === 400) {
                    console.warn("Solicitud inválida al buscar el plan de estudios. Verifique los parámetros.");
                    return null;
                }
            } else {
                // Error de red u otro tipo de error
                console.error("Error inesperado:", error.message);
            }

            return null; // Devuelve null en caso de error
        }
    };

    useEffect(() => {
        const initializeData = async () => {
            const especialidad = await obtenerEspecialidadPorIdCoordinador(persona.id);
            if (especialidad?.id) {
                await cargarCursos();
            }
        };

        initializeData();
    }, [persona.id]);

    const cargarCursos = async () => {
        try {
            console.log("Iniciando la carga de cursos...");

            const especialidadDelCoordinador = await obtenerEspecialidadPorIdCoordinador(persona.id);
            if (!especialidadDelCoordinador || !especialidadDelCoordinador.id) {
                console.warn("El coordinador no tiene asignada una especialidad. Verifique los datos.");
                setError("Debe asignar este Director de Carrera a una especialidad para continuar.");
                return;
            }

            const planEstudio = await obtenerPlanDeEstudioPorIdEspecialidad(especialidadDelCoordinador.id);
            if (!planEstudio || !planEstudio.idPlanDeEstudio) {
                console.warn("No se encontró un plan de estudios para la especialidad proporcionada.");
                setError("No se encontró un plan de estudios para la especialidad asignada.");
                return;
            }

            const response = await axios.get(`http://localhost:8080/institucion/planDeEstudioXCurso/listar/${planEstudio.idPlanDeEstudio}`);
            if (!response.data || !response.data.content) {
                console.warn("No se encontraron cursos asociados al plan de estudios.");
                setError("No se encontraron cursos para el plan de estudios.");
                return;
            }

            setCursos(response.data.content);
            setFilteredCursos(response.data.content);

        } catch (error) {
            console.error("Error al cargar los cursos:", error.message);
            setError("Ocurrió un error al cargar los cursos. Intente nuevamente más tarde.");
        }
    };

    const handleSearch = (event) => {
        const busqueda = event.target.value.toLowerCase();
        setSearchTerm(busqueda);

        const resultadosFiltrados = cursos.filter((cursoxPlanDeEstudio) =>
            cursoxPlanDeEstudio.cursoxPlanDeEstudio.nombre?.toLowerCase().includes(busqueda) ||
            cursoxPlanDeEstudio.cursoxPlanDeEstudio.codigo?.toLowerCase().includes(busqueda)
        );
        setFilteredCursos(resultadosFiltrados);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const limpiarCurso = () => {
        setCursoxPlanDeEstudio({
            ciclo: '',
            cursoxPlanDeEstudio: {
                codigo: '',
                nombre: '',
                creditos: '',
            },
            esElectivo: false
        });
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

        const especialidadActual = await obtenerEspecialidadPorIdCoordinador(persona.id);
        const planEstudioActual = await obtenerPlanDeEstudioPorIdEspecialidad(especialidadActual.id);

        Papa.parse(selectedFile, {
            header: true,
            complete: async (results) => {
                const nuevosCursos = results.data
                    .filter(row => row.codigo_curso && row.nombre_curso)
                    .map(row => ({
                        ciclo: parseInt(row.ciclo),
                        curso: {
                            codigo: row.codigo_curso,
                            nombre: row.nombre_curso,
                            creditos: parseFloat(row.creditos),
                            especialidad: {
                                id: especialidadActual.id,
                                nombre: especialidadActual.nombre,
                            },
                            tiene_laboratorio : row.tiene_laboratorio.toLowerCase() === 'si',
                            tiene_practica : row.tiene_practica.toLowerCase() === 'si',
                            tiene_clase : row.tiene_clase.toLowerCase() === 'si',
                            tiene_examen : row.tiene_examen.toLowerCase() === 'si',
                            seccion : {
                                id: row.seccion_id,
                                codigo: row.codigo_seccion,
                            }
                        },
                        esElectivo: row.esElectivo.toLowerCase() === 'si',
                        planDeEstudio: {
                            idPlanDeEstudio: planEstudioActual.idPlanDeEstudio
                        }
                    }));
                if(nuevosCursos.length < 0) {
                    setError('No se encontraron cursos válidos en el archivo');
                    setConfirmacionOpen(false);
                    
                    return;
                }
                if (nuevosCursos.length > 0) {
                    try { 
                        console.log('Enviando cursos a la API:', nuevosCursos);
                        const response = await axios.post('http://localhost:8080/institucion/planDeEstudioXCurso/insertarCSV', nuevosCursos);
                        console.log('Respuesta de la API:', response.data);
                        if (response.data.errores && response.data.errores.length > 0) {
                            setErroresServidor(response.data.errores);
                            setModalErroresOpen(true);
                        } else {
                            setError('');
                            await cargarCursos();
                        }
                    } catch (error) {
                        console.error('Error al realizar la solicitud:', error.message);
                        setError('Error al subir los cursos');
                    }
                } else {
                    setError('No se encontraron cursos válidos en el archivo');
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

    const eliminarCursoxPlanDeEstudio = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/planestudios/eliminar/${id}`);
            await cargarCursos();
        } catch (error) {
            console.error("Error al eliminar el cursoxPlanDeEstudio:", error);
            setError('Error al eliminar el cursoxPlanDeEstudio');
        }
    };

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
                    Plan de Estudios de la Especialidad {especialidadDelDirector?.nombre}
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

                {hasSpecialty ? (
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

                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                accept=".csv"
                            />

                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ ml: 2, display: 'flex', alignItems: 'center', height: '40px', backgroundColor: '#363581' }}
                                onClick={handleUploadClick}
                            >
                                Subir
                                <CloudUploadIcon sx={{ ml: 1, color: 'white', width: '20px', height: '20px' }} />
                            </Button>

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={descargarPlantilla}
                                sx={{
                                    ml: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: '40px',
                                    backgroundColor: '#363581',
                                    '&:hover': {
                                        backgroundColor: '#2a2a6d'
                                    }
                                }}
                            >
                                Plantilla
                                <DownloadIcon
                                    sx={{
                                        ml: 1,
                                        color: 'white',
                                        width: '20px',
                                        height: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                />
                            </Button>

                            <Button
                                component={Link}
                                href="./nuevoCursoxPlanDeEstudio"
                                variant="contained"
                                color="primary"
                                onClick={limpiarCurso}
                                sx={{ ml: 2, display: 'flex', alignItems: 'center', height: '40px', backgroundColor: '#363581' }}
                            >
                                Añadir
                                <AddCircleOutlineIcon sx={{ ml: 1, color: 'white', width: '20px', height: '20px' }} />
                            </Button>
                        </Box>

                        <TablaPlanEstudios
                            cursosxPlanDeEstudio={filteredCursos}

                            eliminarCursoxPlanDeEstudio={eliminarCursoxPlanDeEstudio}
                        />

                        <ModalErrores
                            open={modalErroresOpen}
                            handleClose={() => setModalErroresOpen(false)}
                            errores={erroresServidor}
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
                            title="¿Está seguro de insertar el CSV de cursos?"
                            onConfirm={confirmarSubidaCSV}
                        />
                    </>
                ) : null}
            </Box>
        </Box>
    );
}