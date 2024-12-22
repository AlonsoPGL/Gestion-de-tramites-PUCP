"use client";
import React, { useRef, useEffect, useState } from 'react';
import {
    Box, Typography, Button, TextField, Snackbar,
    FormControlLabel, Switch
} from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import { useRouter, useSearchParams } from 'next/navigation';
import InputField from 'componentesGenerales/inputs/InputField';
import EstaSeguroAccion from 'componentesGenerales/modales/EstaSeguroAccion';
import { useCursoxPlanDeEstudio } from '@/app/CursoxPlanDeEstudioContext';
import { usePersona } from '@/app/PersonaContext';
import axios from 'axios';
import es from 'dayjs/locale/es';

function NuevoCurso() {
    const { cursoxPlanDeEstudio, setCursoxPlanDeEstudio } = useCursoxPlanDeEstudio();
    const { persona } = usePersona();
    const [ciclo, setCiclo] = useState("");
    const [codigo, setCodigo] = useState("");
    const [nombre, setNombre] = useState("");
    const [creditos, setCreditos] = useState("");
    const [esElectivo, setEsElectivo] = useState(false);

    const [tieneLaboratorio, setTieneLaboratorio] = useState(false);
    const [tienePractica, setTienePractica] = useState(false);
    const [tieneClase, setTieneClase] = useState(false);
    const [tieneExamen, setTieneExamen] = useState(false);


    const [modalOpen, setModalOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [errores, setErrores] = useState({});
    const [erroresMensaje, setErroresMensaje] = useState({});

    const mode = searchParams.get('mode');
    const isEditMode = mode === 'edit' && cursoxPlanDeEstudio;

    useEffect(() => {
        const inicializarFormulario = async () => {
            try {
                const mode = searchParams.get('mode');
                const isEditMode = mode === 'edit';

                if (isEditMode && cursoxPlanDeEstudio) {
                    console.log("Inicializando modo edición:", cursoxPlanDeEstudio);

                    // Convertir valores a string para los inputs
                    setCiclo(cursoxPlanDeEstudio.ciclo?.toString() || "");
                    setCodigo(cursoxPlanDeEstudio.curso?.codigo || "");
                    setNombre(cursoxPlanDeEstudio.curso?.nombre || "");
                    setCreditos(cursoxPlanDeEstudio.curso?.creditos?.toString() || "");
                    setEsElectivo(Boolean(cursoxPlanDeEstudio.esElectivo));

                    setTieneLaboratorio(Boolean(cursoxPlanDeEstudio.curso?.tieneLaboratorio));
                    setTienePractica(Boolean(cursoxPlanDeEstudio.curso?.tienePractica));
                    setTieneClase(Boolean(cursoxPlanDeEstudio.curso?.tieneClase));
                    setTieneExamen(Boolean(cursoxPlanDeEstudio.curso?.tieneExamen));
                } else {
                    console.log("Inicializando modo creación");
                    limpiarFormulario();
                }
            } catch (error) {
                console.error("Error al inicializar formulario:", error);
                setSnackbarMessage("Error al cargar los datos del curso");
                setSnackbarOpen(true);
            }
        };

        inicializarFormulario();
    }, [cursoxPlanDeEstudio, searchParams]);

    const limpiarFormulario = () => {
        setCiclo("");
        setCodigo("");
        setNombre("");
        setCreditos("");
        setEsElectivo(false);
        // Reset new attributes
        setTieneLaboratorio(false);
        setTienePractica(false);
        setTieneClase(false);
        setTieneExamen(false);
        setErrores({});
        setErroresMensaje({});
    };

    const validarCaracteresEspeciales = (texto) => {
        const regex = /^[a-zA-Z0-9\s]*$/;
        return regex.test(texto);
    };

    const validarNombreCaracteresEspeciales = (texto) => {
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,]*$/;
        return regex.test(texto);
    };

    const verificarCursoEnBD = async (codigo) => {
        try {
            const response = await axios.get(`http://localhost:8080/institucion/curso/existePorCodigo?codigo=${codigo}`);
            return response.data;
        } catch (error) {
            console.error("Error al verificar el curso en la BD:", error);
            return false;
        }
    };
    const obtenerEspecialidadPorIdCoordinador = async (idCoordinador) => {
        try {
            const response = await axios.get(`http://localhost:8080/institucion/especialidad/buscarPorCoordinador?idCoordinador=${idCoordinador}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener la especialidad por coordinador:", error);
            snackbarMessage("Error al obtener la especialidad por coordinador");
            snackbarOpen(true);
            return null;
        }
    };
    const obtenerPlanDeEstudioPorIdEspecialidad = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/institucion/planDeEstudio/obtenerPorEspecialidad/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener el plan de estudios por especialidad:", error);
            return null;
        }
    };
    const validateFields = async () => {
        let isValid = true;
        const newErrors = {};

        // Validar campos vacíos
        if (!nombre || !codigo || !ciclo || !creditos) {
            setSnackbarMessage("Todos los campos obligatorios deben ser completados.");
            setSnackbarOpen(true);
            isValid = false;
        }

        // Validar ciclo
        if (ciclo && (isNaN(ciclo) || ciclo < 1 || ciclo > 10)) {
            newErrors.ciclo = true;
            setErroresMensaje(prev => ({
                ...prev,
                ciclo: 'El ciclo debe ser un número entre 1 y 10'
            }));
            isValid = false;
        }

        // Validar créditos
        if (creditos && (isNaN(creditos) || parseFloat(creditos) < 0 || parseFloat(creditos) > 6)) {
            newErrors.creditos = true;
            setErroresMensaje(prev => ({
                ...prev,
                creditos: 'Los créditos deben ser un número entre 0 y 6'
            }));
            isValid = false;
        }


        // Validar código único
        if (codigo) {
            const codigoExiste = await verificarCursoEnBD(codigo);
            if (codigoExiste && (!cursoxPlanDeEstudio || cursoxPlanDeEstudio.curso?.codigo !== codigo)) {
                newErrors.codigo = true;
                setErroresMensaje(prev => ({
                    ...prev,
                    codigo: 'El código ya está en uso'
                }));
                isValid = false;
            }
        }

        setErrores(newErrors);
        return isValid;
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleClickInsertarCurso = async () => {
        try {
            // Verificar que tenemos el ID de la persona
            if (!persona || !persona.id) {
                setSnackbarMessage("Error: No se pudo obtener la información del usuario");
                setSnackbarOpen(true);
                return;
            }

            // Obtener especialidad con manejo de errores
            const especialidad = await obtenerEspecialidadPorIdCoordinador(persona.id);
            if (!especialidad) {
                setSnackbarMessage("Error: No se pudo obtener la especialidad");
                setSnackbarOpen(true);
                return;
            }

            // Obtener plan de estudio con manejo de errores
            const planDeEstudio = await obtenerPlanDeEstudioPorIdEspecialidad(especialidad.id);
            if (!planDeEstudio) {
                setSnackbarMessage("Error: No se pudo obtener el plan de estudio");
                setSnackbarOpen(true);
                return;
            }

            // Preparar los datos del curso
            const cursoData = {
                ciclo: parseInt(ciclo),
                curso: {
                    idCurso: cursoxPlanDeEstudio?.curso?.idCurso,
                    codigo: codigo,
                    nombre: nombre,
                    creditos: parseFloat(creditos),
                    especialidad: {
                        id: especialidad.id,
                        nombre: especialidad.nombre,
                    },
                    tieneLaboratorio: tieneLaboratorio,
                    tienePractica: tienePractica,
                    tieneClase: tieneClase,
                    tieneExamen: tieneExamen
                },
                esElectivo: esElectivo,
                planDeEstudio: {
                    idPlanDeEstudio: planDeEstudio.idPlanDeEstudio
                }
            };
            
            // Determinar el endpoint y método
            const isEditMode = searchParams.get('mode') === 'edit';
            const endpoint = isEditMode && cursoxPlanDeEstudio
                ? `http://localhost:8080/institucion/planDeEstudioXCurso/actualizar/${cursoxPlanDeEstudio.id}`
                : `http://localhost:8080/institucion/planDeEstudioXCurso/insertar`;

            const method = isEditMode ? 'put' : 'post';

            // Realizar la petición
            console.log("!Datos del curso el cual sera editado actualizado:", cursoData);
            await axios[method](endpoint, cursoData);

            // Redireccionar después de éxito
            router.push('/directorCarrera/planDeEstudios/gestionPlanDeEstudio/listadoCursoxPlanDeEstudio');
        } catch (error) {
            console.error("Error detallado:", error);
            setSnackbarMessage(error.response?.data?.message || "Error al guardar el curso");
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

    const handleChangeCodigo = async (e) => {
        const inputValue = e.target.value;

        if (!validarCaracteresEspeciales(inputValue)) {
            setErrores(prev => ({
                ...prev,
                codigo: true
            }));
            setErroresMensaje(prev => ({
                ...prev,
                codigo: 'No se permiten caracteres especiales'
            }));
            return;
        }

        setCodigo(inputValue);

        if (inputValue.length === 0 || inputValue.length > 10) {
            setErrores(prev => ({
                ...prev,
                codigo: true
            }));
            setErroresMensaje(prev => ({
                ...prev,
                codigo: 'El campo no puede estar vacío y debe ser menor a 10 caracteres'
            }));
        } else {
            const existe = await verificarCursoEnBD(inputValue);
            if (existe && (!cursoxPlanDeEstudio || cursoxPlanDeEstudio.curso?.codigo !== inputValue)) {
                setErrores(prev => ({
                    ...prev,
                    codigo: true
                }));
                setErroresMensaje(prev => ({
                    ...prev,
                    codigo: 'El código ya está en uso'
                }));
            } else {
                setErrores(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.codigo;
                    return newErrors;
                });
                setErroresMensaje(prev => {
                    const newMessages = { ...prev };
                    delete newMessages.codigo;
                    return newMessages;
                });
            }
        }
    };

    const handleChangeNombre = (e) => {
        const inputValue = e.target.value;

        if (!validarNombreCaracteresEspeciales(inputValue)) {
            setErrores(prev => ({
                ...prev,
                nombre: true
            }));
            setErroresMensaje(prev => ({
                ...prev,
                nombre: 'No se permiten caracteres especiales'
            }));
            return;
        }

        setNombre(inputValue);

        if (inputValue.length === 0 || inputValue.length > 100) {
            setErrores(prev => ({
                ...prev,
                nombre: true
            }));
            setErroresMensaje(prev => ({
                ...prev,
                nombre: 'El campo no puede estar vacío y debe ser menor a 100 caracteres'
            }));
        } else {
            setErrores(prev => {
                const newErrors = { ...prev };
                delete newErrors.nombre;
                return newErrors;
            });
            setErroresMensaje(prev => {
                const newMessages = { ...prev };
                delete newMessages.nombre;
                return newMessages;
            });
        }
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
                        {isEditMode ? 'Editar Curso' : 'Registrar Nuevo Curso'}
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
                        label="Ciclo"
                        value={ciclo}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (!isNaN(value) && value >= 0 && value <= 10) {
                                setCiclo(value);
                            }
                        }}
                        required
                        error={errores.ciclo}
                        helperText={errores.ciclo ? erroresMensaje.ciclo : ""}
                        type="number"
                        inputProps={{ min: 1, max: 10, style: { height: '40px' } }}
                        sx={{ marginBottom: 2 }}
                    />

                    <InputField
                        label="Código"
                        value={codigo}
                        onChange={handleChangeCodigo}
                        required
                        error={errores.codigo}
                        helperText={errores.codigo ? erroresMensaje.codigo : ""}
                        sx={{ marginBottom: 2 }}
                        inputProps={{ style: { height: '40px' } }}
                    />

                    <InputField
                        label="Nombre"
                        value={nombre}
                        onChange={handleChangeNombre}
                        required
                        error={errores.nombre}
                        helperText={errores.nombre ? erroresMensaje.nombre : ""}
                        sx={{ marginBottom: 2 }}
                        inputProps={{ style: { height: '40px' } }}
                    />

                    <InputField
                        label="Créditos"
                        value={creditos}
                        onChange={(e) => {
                            const value = e.target.value;
                            // Permitir valores decimales entre 0 y 6
                            if (/^\d*(\.\d{0,2})?$/.test(value) && parseFloat(value) >= 0 && parseFloat(value) <= 6) {
                                setCreditos(value); // Actualiza el estado con el valor del crédito
                            }
                        }}
                        required
                        error={errores.creditos}
                        helperText={errores.creditos ? erroresMensaje.creditos : ""}
                        type="number"
                        inputProps={{ min: 0, max: 6, style: { height: '40px' } }}
                        sx={{ marginBottom: 2 }}
                    />

                    {/* New switches for additional attributes */}
                    <Box sx={{ mt: 2 }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={tieneClase}
                                    onChange={(e) => setTieneClase(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Tiene Clase"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={tieneLaboratorio}
                                    onChange={(e) => setTieneLaboratorio(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Tiene Laboratorio"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={tienePractica}
                                    onChange={(e) => setTienePractica(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Tiene Práctica"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={tieneExamen}
                                    onChange={(e) => setTieneExamen(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Tiene Examen"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={esElectivo}
                                    onChange={(e) => setEsElectivo(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Es Electivo"
                        />
                    </Box>

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
                texto={`¿Está seguro de ${isEditMode ? "editar" : "guardar"} el curso?`}
                handleAceptar={async () => {
                    await handleClickInsertarCurso();
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

export default NuevoCurso;