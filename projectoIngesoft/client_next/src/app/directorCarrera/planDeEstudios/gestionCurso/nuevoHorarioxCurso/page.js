"use client";
import React, { useRef, useEffect, useState } from 'react';
import {
    Box, Typography, Button, TextField, Snackbar,
    FormControlLabel, Switch, Modal, Table,
    TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton,
    InputAdornment, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, InputLabel,
    Select, MenuItem,FormControl
} from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter, useSearchParams } from 'next/navigation';
import InputField from 'componentesGenerales/inputs/InputField';
import EstaSeguroAccion from 'componentesGenerales/modales/EstaSeguroAccion';
import { useHorarioxCurso } from '@/app/HorarioxCursoContext';
import { usePersona } from '@/app/PersonaContext';
import axios from 'axios';
import Papa from 'papaparse';

const ModalSeleccionAlumno = ({ open, onClose, onSelect }) => {
    const [alumnos, setAlumnos] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchMessage, setSearchMessage] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [highlightText, setHighlightText] = useState('');
    const searchTimeoutRef = useRef(null);
    const abortController = useRef(null);

    // !1. Effect para manejar la apertura del modal
    useEffect(() => {
        if (open) {
            resetearBusqueda();
            cargarAlumnos();
        }
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
            if (abortController.current) {
                abortController.current.abort();
            }
        };
    }, [open]);

    // !2. Effect para manejar el filtrado
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (filtro.length > 0) {
            searchTimeoutRef.current = setTimeout(() => {
                resetearBusqueda();
                buscarEnTodasLasPaginas(0);
            }, 300);
        } else {
            setHighlightText('');
            cargarAlumnos();
        }
    }, [filtro]);

    // !3. Effect para la paginación
    useEffect(() => {
        if (!filtro) {
            cargarAlumnos();
        }
    }, [page]);

    // !4. Función para resetear la búsqueda
    const resetearBusqueda = () => {
        setPage(0);
        setAlumnos([]);
        setHighlightText('');
        setSearchMessage('');
        if (abortController.current) {
            abortController.current.abort();
        }
    };

    // !5. Función para cargar alumnos
    const cargarAlumnos = async () => {
        if (abortController.current) {
            abortController.current.abort();
        }
        abortController.current = new AbortController();

        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:8080/rrhh/alumno/listar?page=${page}&size=6`,
                { signal: abortController.current.signal }
            );

            if (response.data?.content) {
                setAlumnos(response.data.content);
                setTotalPages(response.data.totalPages);
                setSearchMessage('');
            } else {
                setAlumnos([]);
                setSearchMessage('No se encontraron alumnos');
            }
        } catch (error) {
            if (!axios.isCancel(error)) {
                console.error('Error al cargar alumnos:', error);
                setSearchMessage('Error al cargar la lista de alumnos');
                setAlumnos([]);
            }
        } finally {
            setLoading(false);
        }
    };

    // !6. Función para buscar en todas las páginas
    const buscarEnTodasLasPaginas = async (startPage) => {
        if (abortController.current) {
            abortController.current.abort();
        }
        abortController.current = new AbortController();

        setLoading(true);
        const searchTerm = filtro.toLowerCase();

        try {
            const response = await axios.get(
                `http://localhost:8080/rrhh/alumno/buscar?termino=${encodeURIComponent(searchTerm)}&page=${startPage}&size=6`,
                { signal: abortController.current.signal }
            );

            if (!response.data?.content) {
                setAlumnos([]);
                setSearchMessage('No se encontraron resultados');
                setPage(0);
                setLoading(false);
                return;
            }

            setTotalPages(response.data.totalPages);
            setAlumnos(response.data.content);
            setHighlightText(searchTerm);
            setSearchMessage('');
            setPage(startPage);

        } catch (error) {
            if (!axios.isCancel(error)) {
                console.error('Error en la búsqueda:', error);
                setSearchMessage('Error al realizar la búsqueda');
                setAlumnos([]);
                setPage(0);
            }
        } finally {
            setLoading(false);
        }
    };

    // !7. Función para resaltar coincidencias
    const highlightMatch = (text, searchTerm) => {
        if (!searchTerm || !text) return text;
        const parts = text.toString().split(new RegExp(`(${searchTerm})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === searchTerm.toLowerCase() ?
                <span key={index} style={{ backgroundColor: '#fff59d' }}>{part}</span> : part
        );
    };

    // !8. Función para formatear nombre completo
    const formatearNombreCompleto = (alumno) => {
        return `${alumno.nombre || ''} ${alumno.apellidoPaterno || ''} ${alumno.apellidoMaterno || ''}`.trim();
    };

    // !9. Función para manejar la selección
    const handleSelect = (alumno) => {
        onSelect({
            id: alumno.id,
            codigo: alumno.codigo,
            nombre: formatearNombreCompleto(alumno),
            correo: alumno.email
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Seleccionar Alumno</DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 2, mt: 1 }}>
                    <TextField
                        fullWidth
                        label="Buscar"
                        variant="outlined"
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        size="small"
                        placeholder="Buscar por código, nombre o correo..."
                    />
                </Box>

                {loading && (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                        <CircularProgress size={20} />
                        <Typography>{searchMessage || 'Cargando...'}</Typography>
                    </Box>
                )}

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Código</TableCell>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Correo</TableCell>
                                <TableCell align="center">Acción</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {alumnos.map((alumno) => (
                                <TableRow key={alumno.id}>
                                    <TableCell>{highlightMatch(alumno.codigo, highlightText)}</TableCell>
                                    <TableCell>{highlightMatch(formatearNombreCompleto(alumno), highlightText)}</TableCell>
                                    <TableCell>{highlightMatch(alumno.email, highlightText)}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => handleSelect(alumno)}
                                        >
                                            Seleccionar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {alumnos.length > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button
                            disabled={page === 0 || loading}
                            onClick={() => setPage(prev => prev - 1)}
                        >
                            Anterior
                        </Button>
                        <Typography sx={{ mx: 2, alignSelf: 'center' }}>
                            Página {page + 1} de {totalPages}
                        </Typography>
                        <Button
                            disabled={page >= totalPages - 1 || loading}
                            onClick={() => setPage(prev => prev + 1)}
                        >
                            Siguiente
                        </Button>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
            </DialogActions>
        </Dialog>
    );
};



function NuevoHorario() {
    const { horarioxCurso, setHorarioxCurso } = useHorarioxCurso();
    const { persona } = usePersona();
    const [codigo, setCodigo] = useState("");
    const [nroAlumnos, setNroAlumnos] = useState("");
    const [visible, setVisible] = useState(false);
    const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
    const [tipoHorario, setTipoHorario] = useState('CLASE');
    const [modalOpen, setModalOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [errores, setErrores] = useState({});
    const [erroresMensaje, setErroresMensaje] = useState({});

    const mode = searchParams.get('mode');
    const isEditMode = mode === 'edit' && horarioxCurso;




    const [searchQuery, setSearchQuery] = useState("");
    const [students, setStudents] = useState([]);
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
    const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
    const [availableStudents, setAvailableStudents] = useState([]);
    const fileInputRef = useRef(null);


    // Nuevo estado para el modal de confirmación
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [studentToAdd, setStudentToAdd] = useState(null);

    // Primero, agrega estos estados para manejar la carga masiva
    const [csvStudents, setCsvStudents] = useState([]);
    const [showCsvConfirmModal, setShowCsvConfirmModal] = useState(false);
    // nuevo estado para manejar los estudiantes filtrados
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(5);
    const [searchTimeout, setSearchTimeout] = useState(null);
    const handleSearch = (value) => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        setSearchQuery(value);
        const timeoutId = setTimeout(() => {
            if (!value.trim()) {
                setFilteredStudents([]);
            } else {
                const searchTerm = value.toLowerCase().trim();
                const filtered = students.filter(student =>
                    student.codigo.toLowerCase().includes(searchTerm) ||
                    student.nombre.toLowerCase().includes(searchTerm) ||
                    (student.correo && student.correo.toLowerCase().includes(searchTerm))
                );
                setFilteredStudents(filtered);
            }
        }, 300); // 300ms debounce

        setSearchTimeout(timeoutId);
    };
    const cargarAlumnosDelHorario = async (horarioId) => {
        try {
            const response = await axios.get(`http://localhost:8080/rrhh/alumno/horario/${horarioId}/activos`);
            const alumnosFormateados = response.data.alumnos.map(alumno => ({
                id: alumno.id,
                codigo: alumno.codigo.toString(),
                nombre: `${alumno.nombre} ${alumno.apellidoPaterno} ${alumno.apellidoMaterno}`,
                correo: alumno.email || '-'
            }));
            setStudents(alumnosFormateados);
        } catch (error) {
            console.error("Error al cargar alumnos:", error);
            setSnackbarMessage("Error al cargar la lista de alumnos");
            setSnackbarOpen(true);
        }
    };
    // Función para descargar plantilla
    const descargarPlantillaAlumnos = () => {
        // Datos de ejemplo y formato
        const templateData = [
            {
                codigo: "20200001",
                nombres: "Juan Carlos",
                apellidos: "Pérez García",
                correo: "juan.perez@universidad.edu.pe"
            },
            {
                codigo: "20200002",
                nombres: "María Ana",
                apellidos: "García López",
                correo: "maria.garcia@universidad.edu.pe"
            },
            {
                codigo: "20200003",
                nombres: "Luis Alberto",
                apellidos: "Rodríguez Martínez",
                correo: "luis.rodriguez@universidad.edu.pe"
            },
            {
                codigo: "INSTRUCCIONES",
                nombres: "Ingrese solo nombres",
                apellidos: "Ingrese apellidos completos",
                correo: "correo@universidad.edu.pe"
            },
            {
                codigo: "FORMATO",
                nombres: "Solo texto",
                apellidos: "Solo texto",
                correo: "Correo institucional válido"
            },
            {
                codigo: "IMPORTANTE",
                nombres: "Campo obligatorio",
                apellidos: "Campo obligatorio",
                correo: "Campo obligatorio"
            }
        ];

        // Encabezados con nombres descriptivos
        const headers = {
            codigo: "Código (8 dígitos)",
            nombres: "Nombres",
            apellidos: "Apellidos",
            correo: "Correo Electrónico"
        };

        // Crear contenido CSV
        const csvContent = [
            Object.values(headers).join(";"),
            ...templateData.map(row =>
                Object.keys(headers).map(header => row[header]).join(";")
            )
        ].join("\n");

        // Agregar BOM para correcta codificación de caracteres especiales
        const BOM = "\uFEFF";
        const blob = new Blob([BOM + csvContent], {
            type: "text/csv;charset=utf-8;"
        });

        // Crear y simular clic en enlace de descarga
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        const fecha = new Date().toISOString().split('T')[0];
        link.setAttribute("download", `Plantilla_Alumnos_${fecha}.csv`);
        document.body.appendChild(link);
        link.click();

        // Limpieza
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    const handleOpenStudentModal = async () => {
        try {
            setIsStudentModalOpen(true);
            // !1. Llamar al endpoint para obtener alumnos
            const response = await axios.get('http://localhost:8080/rrhh/persona/listarfiltrado?tipoPersona=ALUMNO');

            // !2. Formatear los datos recibidos
            const alumnosFormateados = response.data.content.map(alumno => ({
                id: alumno.id,
                codigo: alumno.codigo?.toString() || '',
                nombre: `${alumno.nombre || ''} ${alumno.apellidoPaterno || ''} ${alumno.apellidoMaterno || ''}`.trim(),
                correo: alumno.email || '-'
            }));

            // !3. Actualizar el estado
            setAvailableStudents(alumnosFormateados);
        } catch (error) {
            console.error("Error al cargar alumnos:", error);
            setSnackbarMessage("Error al cargar la lista de alumnos disponibles");
            setSnackbarOpen(true);
            setAvailableStudents([]); // Limpiar la lista en caso de error
        }
    };

    const handleAddStudent = (student) => {
        const isDuplicate = students.some(s => s.id === student.id);
        if (isDuplicate) {
            setSnackbarMessage("Este alumno ya está registrado en el horario");
            setSnackbarOpen(true);
            return;
        }

        setStudentToAdd(student);
        setConfirmModalOpen(true);
        setFilteredStudents([]); // Limpiar filtro
        setSearchQuery(''); // Limpiar búsqueda
    };
    const buscar_Por_Codigo = async (codigo) => {
        try {
            const response = await axios.get(`http://localhost:8080/rrhh/alumno/codigo/${codigo}`);
            if (response.data) {
                return response.data;
            }
            return null;
        } catch (error) {
            console.error("Error al buscar alumno por código:", error);
            setSnackbarMessage("Error al buscar el alumno");
            setSnackbarOpen(true);
            return null;
        }
    };
    const handleSingleStudentAdd = async (studentData) => {
        if (!horarioxCurso?.id) {
            setSnackbarMessage("Error: ID de horario no válido");
            setSnackbarOpen(true);
            return;
        }

        try {
            // Verificar existencia del alumno
            const alumnoExistente = await buscar_Por_Codigo(studentData.codigo);
            if (!alumnoExistente) {
                throw new Error(`No se encontró el alumno con código ${studentData.codigo}`);
            }
            console.log('Alumno existente:', alumnoExistente);

            // Crear objeto alumno con el formato requerido
            const alumnoVerificado = {
                id: alumnoExistente.id,
                codigo: parseInt(studentData.codigo.trim(), 10) // Convertir a número
            };
            console.log('Alumno verificado:', alumnoVerificado);
            // Crear y enviar DTO
            const agregarAlumnoDTO = {

                idHorario: horarioxCurso.id,

                alumnos: [alumnoVerificado] // Enviamos como array de un solo elemento
            };
            console.log('DTO a enviar:', agregarAlumnoDTO);
            const uploadResponse = await fetch("http://localhost:8080/institucion/horario/agregar-alumnos", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(agregarAlumnoDTO)
            });

            if (!uploadResponse.ok) {
                throw new Error(`Error al agregar alumno: ${uploadResponse.statusText}`);
            }

            const horarioActualizado = await uploadResponse.json();
            console.log('Horario actualizado:', horarioActualizado);

            setSnackbarMessage("Alumno agregado exitosamente");
            setSnackbarOpen(true);
            await cargarAlumnosDelHorario(horarioxCurso.id);

            // Limpiar el formulario o cerrar el modal según sea necesario
            setStudentToAdd(null);
            setIsStudentModalOpen(false);
            //Limpiar el modal de confirmacion
            setConfirmModalOpen(false);

        } catch (error) {
            console.error('Error al procesar el alumno:', error);
            setSnackbarMessage(error.message || 'Error al procesar el alumno');
            setSnackbarOpen(true);
        }
    };
    const confirmAddStudent = async () => {
        if (studentToAdd) {
            await handleSingleStudentAdd(studentToAdd);
        }
    };
    // Modal de confirmación para agregar alumno
    const ConfirmAddStudentModal = () => (
        <EstaSeguroAccion
            open={confirmModalOpen}
            onClose={() => setConfirmModalOpen(false)}
            texto="¿Está seguro de agregar este alumno al horario?"
            handleAceptar={confirmAddStudent}
        />
    );

    const handleRemoveStudent = (studentId) => {
        setStudents(prev => prev.filter(student => student.id !== studentId));
        setFilteredStudents([]); // Limpiar filtro
        setSearchQuery(''); // Limpiar búsqueda
    };
    const handleCsvUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const text = e.target.result;
                const idHorario = horarioxCurso?.id;

                if (!idHorario) {
                    setSnackbarMessage("Error: ID de horario no válido");
                    setSnackbarOpen(true);
                    return;
                }

                console.log('Cargando CSV:', text);
                console.log('ID de horario:', idHorario);
                //La especialidad de la persona
                if (persona) {
                    console.log(persona.especialidad);
                }
                Papa.parse(text, {
                    header: true,
                    delimiter: ";",
                    skipEmptyLines: 'greedy',
                    transformHeader: (header) => {
                        const headerMap = {
                            "Código (8 dígitos)": "codigo",
                            "Nombres": "nombres",
                            "Apellidos": "apellidos",
                            "Correo Electrónico": "correo"
                        };
                        return headerMap[header] || header.toLowerCase();
                    },
                    complete: async (results) => {
                        if (results.errors.length > 0) {
                            console.error('Errores en el CSV:', results.errors);
                            setSnackbarMessage("Error al procesar el archivo CSV");
                            setSnackbarOpen(true);
                            return;
                        }

                        try {
                            // !1. Filtrar y validar datos iniciales
                            const alumnosValidos = results.data
                                .filter(row => {
                                    const codigoStr = row.codigo?.toString().trim();
                                    return codigoStr &&
                                        !['INSTRUCCIONES', 'FORMATO', 'IMPORTANTE'].includes(codigoStr) &&
                                        row.nombres?.trim() &&
                                        row.apellidos?.trim();
                                });

                            if (alumnosValidos.length === 0) {
                                setSnackbarMessage('No se encontraron datos válidos en el CSV');
                                setSnackbarOpen(true);
                                return;
                            }

                            // !2. Verificar existencia de cada alumno
                            const alumnosVerificados = [];
                            const alumnosNoEncontrados = [];

                            for (const row of alumnosValidos) {
                                try {
                                    const response = await fetch(`http://localhost:8080/rrhh/alumno/codigo/${row.codigo}`);
                                    if (response.ok) {
                                        const alumnoExistente = await response.json();
                                        // !3. Crear objeto alumno con el ID correcto
                                        alumnosVerificados.push({
                                            id: alumnoExistente.id,
                                            nombre: row.nombres.trim(),
                                            apellidoPaterno: row.apellidos.split(' ')[0] || '',
                                            apellidoMaterno: row.apellidos.split(' ').slice(1).join(' ') || '',
                                            correo: row.correo?.trim() || '',
                                            telefono: '',
                                            direccion: '',
                                            codigo: parseInt(row.codigo.trim(), 10)
                                        });
                                    } else {
                                        alumnosNoEncontrados.push(row.codigo);
                                    }
                                } catch (error) {
                                    console.error('Error al verificar alumno:', row.codigo, error);
                                    alumnosNoEncontrados.push(row.codigo);
                                }
                            }

                            // !4. Mostrar resumen de la verificación
                            if (alumnosNoEncontrados.length > 0) {
                                console.warn('Alumnos no encontrados:', alumnosNoEncontrados);
                                setSnackbarMessage(`Advertencia: ${alumnosNoEncontrados.length} alumnos no fueron encontrados en el sistema`);
                                setSnackbarOpen(true);
                            }

                            if (alumnosVerificados.length === 0) {
                                setSnackbarMessage('No se encontraron alumnos válidos para agregar');
                                setSnackbarOpen(true);
                                return;
                            }

                            // !5. Crear y enviar DTO solo con alumnos verificados
                            const agregarAlumnosDTO = {
                                idHorario: Number(idHorario),
                                alumnos: alumnosVerificados
                            };

                            const response = await fetch("http://localhost:8080/institucion/horario/agregar-alumnos", {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(agregarAlumnosDTO)
                            });

                            if (!response.ok) {
                                throw new Error(`Error al cargar alumnos: ${response.statusText}`);
                            }

                            const horarioActualizado = await response.json();
                            console.log('Horario actualizado:', horarioActualizado);

                            setSnackbarMessage(`Se agregaron ${alumnosVerificados.length} alumnos exitosamente`);
                            setSnackbarOpen(true);
                            await cargarAlumnosDelHorario(idHorario);

                            if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                            }
                        } catch (error) {
                            console.error('Error al procesar los alumnos:', error);
                            setSnackbarMessage(error.message || 'Error al procesar los alumnos');
                            setSnackbarOpen(true);
                        }
                    },
                    error: (error) => {
                        console.error('Error al procesar el CSV:', error);
                        setSnackbarMessage('Error al leer el archivo CSV');
                        setSnackbarOpen(true);
                    }
                });
            };
            reader.readAsText(file);
        }
    };

    const StudentModal = () => (
        <>
            <Modal
                open={isStudentModalOpen}
                onClose={() => setIsStudentModalOpen(false)}
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    width: 600,
                    maxHeight: '80vh',
                    overflow: 'auto',
                    borderRadius: 2,
                }}>
                    <Typography variant="h6" mb={2}>Agregar Alumnos</Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" sx={{ width: '50px', fontWeight: 'bold' }}>#</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Código</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acción</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {availableStudents.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">
                                            No hay alumnos disponibles
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    availableStudents.map((student, index) => (
                                        <TableRow key={student.id}
                                            sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}
                                        >
                                            <TableCell align="center">
                                                {(index + 1).toString().padStart(2, '0')}
                                            </TableCell>
                                            <TableCell>{student.codigo}</TableCell>
                                            <TableCell>{student.nombre}</TableCell>
                                            <TableCell align="center">
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => handleAddStudent(student)}
                                                    sx={{ minWidth: '100px' }}
                                                >
                                                    Agregar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Modal>
            <EstaSeguroAccion
                open={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                texto="¿Está seguro de agregar este alumno al horario?"
                handleAceptar={confirmAddStudent}
            />
        </>
    );
    // Función para confirmar la carga masiva
    const handleConfirmCsvUpload = () => {
        setStudents(prevStudents => [...prevStudents, ...csvStudents]);
        setShowCsvConfirmModal(false);
        setCsvStudents([]);
        setSnackbarMessage(`Se agregaron ${csvStudents.length} estudiantes exitosamente`);
        setSnackbarOpen(true);
    };

    // Agrega el modal de confirmación para la carga masiva
    const CsvConfirmModal = () => (
        <EstaSeguroAccion
            open={showCsvConfirmModal}
            onClose={() => {
                setShowCsvConfirmModal(false);
                setCsvStudents([]);
            }}
            texto={`¿Está seguro de agregar ${csvStudents.length} estudiantes al horario?`}
            handleAceptar={handleConfirmCsvUpload}
        />
    );
    useEffect(() => {
        const inicializarFormulario = async () => {
            try {
                const mode = searchParams.get('mode');
                const isEditMode = mode === 'edit';

                // Recuperar el curso del localStorage
                const savedCurso = localStorage.getItem('cursoxPlanDeEstudio');
                if (savedCurso) {
                    const cursoData = JSON.parse(savedCurso);
                    setCursoSeleccionado(cursoData.curso);
                }

                if (isEditMode && horarioxCurso) {
                    console.log("Inicializando modo edición:", horarioxCurso);
                    setCodigo(horarioxCurso.codigo || "");
                    setNroAlumnos(horarioxCurso.cantAlumnos?.toString() || "");
                    setVisible(Boolean(horarioxCurso.visible));
                    setTipoHorario(horarioxCurso.tipoHorario || "CLASE");
                    // Cargar alumnos si hay un ID de horario
                    if (horarioxCurso.id) {
                        await cargarAlumnosDelHorario(horarioxCurso.id);
                    }
                } else {
                    console.log("Inicializando modo creación");
                    limpiarFormulario();
                }
            } catch (error) {
                console.error("Error al inicializar formulario:", error);
                setSnackbarMessage("Error al cargar los datos del horario");
                setSnackbarOpen(true);
            }
        };

        inicializarFormulario();
    }, [horarioxCurso, searchParams]);

    const limpiarFormulario = () => {
        setCodigo("");
        setNroAlumnos("");
        setVisible(false);
        setErrores({});
        setErroresMensaje({});
        setTipoHorario("CLASE");
        setStudents([]);
        setFilteredStudents([]);
        setSearchQuery("");
        setPage(0);
    };

    const validateFields = async () => {
        let isValid = true;
        const newErrors = {};

        // Validar campos vacíos
        if (!nroAlumnos) {
            setSnackbarMessage("El número de alumnos es obligatorio.");
            setSnackbarOpen(true);
            isValid = false;
        }

        // Validar número de alumnos
        if (nroAlumnos && (isNaN(nroAlumnos) || parseInt(nroAlumnos) < 0)) {
            newErrors.nroAlumnos = true;
            setErroresMensaje(prev => ({
                ...prev,
                nroAlumnos: 'El número de alumnos debe ser un número positivo'
            }));
            isValid = false;
        }

        setErrores(newErrors);
        return isValid;
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleClickInsertarActualizarHorario = async () => {
        try {
            if (!cursoSeleccionado?.idCurso) {
                setSnackbarMessage("Error: No se ha seleccionado un curso");
                setSnackbarOpen(true);
                return;
            }

            const horarioData = {
                codigo: codigo,
                cantAlumnos: parseInt(nroAlumnos),
                visible: visible,
                tipoHorario: tipoHorario,
                curso: {
                    idCurso: cursoSeleccionado.idCurso
                }
            };

            if (isEditMode) {
                // Modo edición
                if (!horarioxCurso?.id) {
                    setSnackbarMessage("Error: No se pudo obtener el ID del horario");
                    setSnackbarOpen(true);
                    return;
                }
                horarioData.idHorario = horarioxCurso.id;
                await axios.put(`http://localhost:8080/institucion/horario/actualizar/${horarioxCurso.id}`, horarioData);
            } else {
                // Modo inserción
                await axios.post('http://localhost:8080/institucion/horario/insertar', horarioData);
            }

            router.push('/directorCarrera/planDeEstudios/gestionCurso/listadoHorarioxCurso');
        } catch (error) {
            console.error("Error detallado:", error);
            const action = isEditMode ? "actualizar" : "insertar";
            setSnackbarMessage(error.response?.data?.message || `Error al ${action} el horario`);
            setSnackbarOpen(true);
        }
    };

    const handleGuardar = async (e) => {
        e.preventDefault();
        try {
            const isValid = await validateFields();
            if (isValid) {
                setModalOpen(true);
            }
        } catch (error) {
            console.error("Error en validación:", error);
            setSnackbarMessage("Error al validar los campos");
            setSnackbarOpen(true);
        }
    };
    // Componente de sección de alumnos modificado
    const StudentsSection = () => {
        if (!isEditMode) {
            return null; // No mostrar nada en modo creación
        }

        return (
            <Box sx={{
                marginLeft: '220px',
                marginTop: '20px',
                padding: '20px',
            }}>
                <Typography variant="h5" sx={{ mb: 3 }}>Gestión de Alumnos</Typography>

                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 3,
                    alignItems: 'center'
                }}>
                    <TextField
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Buscar por código, nombre o correo..."
                        size="small"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ flexGrow: 1 }}
                    />
                    <Button
                        variant="contained"
                        startIcon={<PersonAddIcon />}
                        onClick={handleOpenStudentModal}
                    >
                        Agregar Alumno
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<UploadFileIcon />}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Carga Masiva
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={descargarPlantillaAlumnos}
                    >
                        Descargar Plantilla
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        hidden
                        accept=".csv"
                        onChange={handleCsvUpload}
                    />
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{ width: '50px', fontWeight: 'bold' }}>#</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Código</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Correo</TableCell>
                                {/*<TableCell align="center" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>*/}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(searchQuery.trim() ? filteredStudents : students).length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        {searchQuery.trim() ? 'No se encontraron resultados' : 'No hay alumnos registrados'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                (searchQuery.trim() ? filteredStudents : students)
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((student, index) => (
                                        <TableRow key={student.id}
                                            sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}
                                        >
                                            <TableCell align="center" sx={{ width: '50px' }}>
                                                {(page * rowsPerPage + index + 1).toString().padStart(2, '0')}
                                            </TableCell>
                                            <TableCell>{student.codigo}</TableCell>
                                            <TableCell>{student.nombre}</TableCell>
                                            <TableCell>{student.correo || '-'}</TableCell>
                                            {/*<TableCell align="center">
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleRemoveStudent(student.id)}
                                                    size="small"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>*/}
                                        </TableRow>
                                    ))
                            )}
                        </TableBody>
                    </Table>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        p: 2
                    }}>
                        <Button
                            disabled={page === 0}
                            onClick={() => setPage(prev => prev - 1)}
                        >
                            Anterior
                        </Button>
                        <Typography sx={{ mx: 2, alignSelf: 'center' }}>
                            Página {page + 1} de {Math.ceil((searchQuery.trim() ? filteredStudents.length : students.length) / rowsPerPage)}
                        </Typography>
                        <Button
                            disabled={
                                page >= Math.ceil((searchQuery.trim() ? filteredStudents.length : students.length) / rowsPerPage) - 1
                            }
                            onClick={() => setPage(prev => prev + 1)}
                        >
                            Siguiente
                        </Button>
                    </Box>
                </TableContainer>
            </Box>
        );
    };
    return (
        <Box sx={{ backgroundColor: 'white', minHeight: '100vh', paddingBottom: '10px' }}>
            <Box sx={{
                marginLeft: '220px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <Box sx={{ padding: '20px', textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ mb: '50px', color: '#191D23' }}>
                        {isEditMode ? 'Editar Horario' : 'Registrar Nuevo Horario'}
                    </Typography>
                </Box>

                <Box sx={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid #D9D9D9',
                    borderRadius: 2,
                    padding: 4,
                    boxShadow: 2,
                    width: '100%',
                    maxWidth: 700,
                }}>
                    <InputField
                        label="Código"
                        value={codigo}
                        disabled={isEditMode}
                        sx={{ marginBottom: 2 }}
                        inputProps={{ style: { height: '40px' } }}
                    />
                    <FormControl fullWidth sx={{ marginBottom: 2 }}>
                        <InputLabel id="tipo-horario-label">Tipo de Horario</InputLabel>
                        <Select
                            labelId="tipo-horario-label"
                            id="tipo-horario"
                            value={tipoHorario}
                            label="Tipo de Horario"
                            onChange={(e) => setTipoHorario(e.target.value)}
                            sx={{ height: '40px' }}
                        >
                            <MenuItem value="LABORATORIO">Laboratorio</MenuItem>
                            <MenuItem value="CLASE">Clase</MenuItem>
                            <MenuItem value="EXAMEN">Examen</MenuItem>
                            <MenuItem value="PRACTICA">Práctica</MenuItem>
                        </Select>
                    </FormControl>
                    <InputField
                        label="Número de Alumnos"
                        value={nroAlumnos}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (!isNaN(value) && parseInt(value) >= 0) {
                                setNroAlumnos(value);
                            }
                        }}
                        required
                        error={errores.nroAlumnos}
                        helperText={errores.nroAlumnos ? erroresMensaje.nroAlumnos : ""}
                        type="number"
                        inputProps={{ min: 0, style: { height: '40px' } }}
                        sx={{ marginBottom: 2 }}
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={visible}
                                onChange={(e) => setVisible(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Visible"
                    />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Button
                        variant='outlined'
                        onClick={() => router.back()}
                        sx={{ width: '170px', marginRight: '20px' }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant='contained'
                        onClick={handleGuardar}
                        sx={{ width: '170px' }}
                    >
                        Guardar
                    </Button>
                </Box>
            </Box>

            <EstaSeguroAccion
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                texto="¿Está seguro de editar el horario?"
                handleAceptar={async () => {
                    await handleClickInsertarActualizarHorario();
                    setModalOpen(false);
                }}
            />

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={handleCloseSnackbar}
                    severity="warning"
                >
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
            {/* Sección de estudiantes */}
            <StudentsSection />

            {/* Modals */}
            <StudentModal />
            <CsvConfirmModal />
            <EstaSeguroAccion
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                texto="¿Está seguro de editar el horario?"
                handleAceptar={async () => {
                    await handleClickInsertarActualizarHorario();
                    setModalOpen(false);
                }}
            />

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={handleCloseSnackbar}
                    severity="warning"
                >
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </Box>
    );
}

export default NuevoHorario;