"use client";
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { Snackbar, Box, Typography, InputAdornment, Button, IconButton, Pagination, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, CircularProgress } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useRouter, useSearchParams } from 'next/navigation';
import InputField from '../../../../../componentesGenerales/inputs/InputField'; // Importa el componente

import EstaSeguroAccion from '../../../../../componentesGenerales/modales/EstaSeguroAccion';
import { useFacultad } from '../../../FacultadContext' // Importa el contexto de zDepartamento
const ModalSeleccionSecretarioAcademico = ({ open, onClose, onSelect }) => {
  const [profesores, setProfesores] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [highlightText, setHighlightText] = useState('');
  const searchTimeoutRef = useRef(null);
  const abortController = useRef(null);

  useEffect(() => {
    if (open) {
      resetearBusqueda();
      cargarProfesores();
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


  useEffect(() => {
    if (open) {
      resetearBusqueda();
      cargarProfesores();
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

  const resetearBusqueda = () => {
    setPage(0);
    setProfesores([]);
    setHighlightText('');
    setSearchMessage('');
    if (abortController.current) {
      abortController.current.abort();
    }
  };


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
      cargarProfesores();
    }
  }, [filtro]);

  useEffect(() => {
    if (!filtro) {
      cargarProfesores();
    }
  }, [page]);
  const buscarEnTodasLasPaginas = async (startPage) => {
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();

    setLoading(true);
    let currentPage = startPage;
    const searchTerm = filtro.toLowerCase();

    try {
      const response = await axios.get(
        `http://localhost:8080/rrhh/persona/listar?page=${currentPage}&size=6`,
        { signal: abortController.current.signal }
      );

      if (!response.data?.content) {
        setProfesores([]);
        setSearchMessage('No se encontraron resultados');
        setPage(0);
        setLoading(false);
        return;
      }

      setTotalPages(response.data.totalPages);

      const filteredResults = response.data.content.filter(profesor => {
        const nombreCompleto = `${profesor.nombre} ${profesor.apellidoPaterno} ${profesor.apellidoMaterno}`.toLowerCase();
        const codigo = profesor.codigo?.toString().toLowerCase() || '';
        const email = profesor.email?.toLowerCase() || '';

        return nombreCompleto.includes(searchTerm) ||
          codigo.includes(searchTerm) ||
          email.includes(searchTerm);
      });

      if (filteredResults.length > 0) {
        setProfesores(filteredResults);
        setHighlightText(searchTerm);
        setSearchMessage('');
        setPage(currentPage);
      } else {
        if (currentPage < response.data.totalPages - 1) {
          setSearchMessage(`Buscando en la página ${currentPage + 2}...`);
          buscarEnTodasLasPaginas(currentPage + 1);
        } else {
          // Si llegamos aquí, hemos revisado todas las páginas sin resultados
          setProfesores([]);
          setHighlightText('');
          setSearchMessage('No se encontraron resultados');
          setPage(0); // Volvemos a la primera página
          setLoading(false);
        }
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error('Error en la búsqueda:', error);
        setSearchMessage('Error al realizar la búsqueda');
        setProfesores([]);
        setPage(0);
      }
    } finally {
      if (currentPage === totalPages - 1) {
        setLoading(false);
      }
    }
  };
  const buscarPersonas = async () => {
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();

    setLoading(true);
    setSearchMessage('Buscando...');
    const searchTerm = filtro.toLowerCase();

    try {
      const response = await axios.get(
        `http://localhost:8080/rrhh/persona/listar?page=${page}&size=6&search=${encodeURIComponent(searchTerm)}`,
        { signal: abortController.current.signal }
      );

      if (response.data?.content) {
        const results = response.data.content.filter(profesor => {
          const nombreCompleto = `${profesor.nombre} ${profesor.apellidoPaterno} ${profesor.apellidoMaterno}`.toLowerCase();
          const codigo = profesor.codigo?.toString().toLowerCase() || '';
          const email = profesor.email?.toLowerCase() || '';

          return nombreCompleto.includes(searchTerm) ||
            codigo.includes(searchTerm) ||
            email.includes(searchTerm);
        });

        setProfesores(results);
        setTotalPages(response.data.totalPages);
        setHighlightText(searchTerm);
        setSearchMessage(results.length === 0 ? 'No se encontraron resultados' : '');
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error('Error en la búsqueda:', error);
        setSearchMessage('Error al realizar la búsqueda');
        setProfesores([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const cargarProfesores = async () => {
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();

    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/rrhh/persona/listar?page=${page}&size=6`,
        { signal: abortController.current.signal }
      );

      if (response.data?.content) {
        setProfesores(response.data.content);
        setTotalPages(response.data.totalPages);
        setSearchMessage('');
      } else {
        setProfesores([]);
        setSearchMessage('No se encontraron resultados');
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error('Error al cargar personas:', error);
        setSearchMessage('Error al cargar la lista de personas');
        setProfesores([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const highlightMatch = (text, searchTerm) => {
    if (!searchTerm || !text) return text;

    const parts = text.toString().split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ?
        <span key={index} style={{ backgroundColor: '#fff59d' }}>{part}</span> : part
    );
  };

  const formatearNombreCompleto = (profesor) => {
    const nombreCompleto = `${profesor.nombre || ''} ${profesor.apellidoPaterno || ''}`;
    const inicialMaterno = profesor.apellidoMaterno ? ` ${profesor.apellidoMaterno.charAt(0)}.` : '';
    return `${nombreCompleto}${inicialMaterno}`;
  };

  const handleSelect = (profesor) => {
    onSelect({
      id: profesor.id,
      nombres: profesor.nombre,
      apellidos: `${profesor.apellidoPaterno} ${profesor.apellidoMaterno}`,
      correo: profesor.email
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Seleccionar SecretarioAcademico de Facultad</DialogTitle>
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
          <Box sx={{
            textAlign: 'center',
            py: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1
          }}>
            <CircularProgress size={20} sx={{ color: '#7E57C2' }} />
            <Typography>{searchMessage || 'Cargando...'}</Typography>
          </Box>
        )}

        {!loading && searchMessage && (
          <Box sx={{ textAlign: 'center', py: 2, color: 'error.main' }}>
            <Typography>{searchMessage}</Typography>
          </Box>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#363581' }}>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    color: 'white',
                    '&:first-of-type': {
                      borderTopLeftRadius: '4px',
                    },
                  }}
                >
                  Código
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>
                  Nombre
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>
                  Correo Electrónico
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    color: 'white',
                    '&:last-child': {
                      borderTopRightRadius: '4px',
                    },
                  }}
                  align="center"
                >
                  Acción
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {profesores.length > 0 ? (
                profesores.map((profesor) => (
                  <TableRow key={profesor.id} hover>
                    <TableCell>
                      {highlightMatch(profesor.codigo, highlightText)}
                    </TableCell>
                    <TableCell>
                      {highlightMatch(formatearNombreCompleto(profesor), highlightText)}
                    </TableCell>
                    <TableCell>
                      {highlightMatch(profesor.email, highlightText)}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleSelect(profesor)}
                        sx={{
                          minWidth: '100px',
                        }}
                      >
                        Seleccionar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    {loading ? '' : 'No se encontraron personas'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {profesores.length > 0 && (

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              disabled={page === 0 || loading}
              onClick={() => setPage(prev => prev - 1)}
              sx={{
                minWidth: '100px',
              }}
              variant="contained"
            >
              Anterior
            </Button>
            <Typography sx={{ mx: 2, alignSelf: 'center' }}>
              Página {page + 1} de {totalPages}
            </Typography>
            <Button
              disabled={page >= totalPages - 1 || loading}
              onClick={() => setPage(prev => prev + 1)}
              sx={{
                minWidth: '100px',
              }}
              variant="contained"
            >
              Siguiente
            </Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' onClick={onClose}>
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function NuevaFacultad() {
  const { facultad: facultadEditar } = useFacultad();
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [telefonoContacto, setTelefonoContacto] = useState("");
  const [correoContacto, setCorreoContacto] = useState("");
  const [direccionWeb, setDireccionWeb] = useState("");
  const [secretarioAcademico, setSecretarioAcademico] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSecretarioAcademicoOpen, setModalSecretarioAcademicoOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  // !ERRORES Y MENSAJES DE ERRORES
  const [errores, setErrores] = useState({});
  const [erroresMensaje, setErroresMensaje] = useState({});
  const [errorSecretario, setErrorSecretario] = useState(false);
  const [errorSecretarioMessage, setErrorSecretarioMessage] = useState('');
  const mode = searchParams.get('mode');
  const isEditMode = mode !== 'add' && !!facultadEditar;

  useEffect(() => {
    if (isEditMode && facultadEditar) {
      setCodigo(facultadEditar?.codigo);
      setNombre(facultadEditar?.nombre);
      setTelefonoContacto(facultadEditar?.telefonoContacto);
      setCorreoContacto(facultadEditar?.correoContacto);
      setDireccionWeb(facultadEditar?.direccionWeb);

      // Configurar el secretario académico si existe
      if (facultadEditar.secretarioAcademico) {
        const secretarioData = facultadEditar.secretarioAcademico;
        setSecretarioAcademico({
          id: secretarioData.id,
          nombres: secretarioData.nombre,
          apellidos: `${secretarioData.apellidoPaterno || ''} ${secretarioData.apellidoMaterno || ''}`.trim(),
          correo: secretarioData.email
        });
      }
    } else {
      limpiarFormulario();
    }
  }, [isEditMode, facultadEditar]);

  const limpiarFormulario = () => {
    setCodigo("");
    setNombre("");
    setTelefonoContacto("");
    setCorreoContacto("");
    setDireccionWeb("");
    setSecretarioAcademico(null);
    setErrores({});
    setErroresMensaje({});
  };
 
  const mensajesError = {
    codigo: "La facultad ya existe.",
  };
  const validarCaracteresEspeciales = (texto) => {
    // Solo permite letras, números y espacios
    const regex = /^[a-zA-Z0-9\s]*$/;
    return regex.test(texto);
  };
  const validarNombreCaracteresEspeciales = (texto) => {
    // Solo permite letras, números, espacios y algunos caracteres especiales comunes
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,]*$/;
    return regex.test(texto);
  };
  const verificarFacultadEnBD = async (codigo) => {
    try {
      const response = await axios.get(`http://localhost:8080/institucion/facultad/existePorCodigo/${codigo}`);
      return response.data;
    } catch (error) {
      console.error("Error al verificar la facultad en la BD:", error);
      return false;
    }
  };
  const verificarFacultadSecretarioAcademico = async (id) => {
    try {
      console.log("Verificando secretario académico:", id);
      const response = await axios.get(`http://localhost:8080/institucion/facultad/existePorSecretarioAcademico/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al verificar la facultad en la BD:", error);
      return false;
    }
  };
  // Modifica la función validateFields para no mostrar el Snackbar para el código
  const validateFields = async () => {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let isValid = true;
      const newErrors = {};

      // Validar campos vacíos
      if (!nombre || !codigo || !telefonoContacto || !correoContacto || !secretarioAcademico) {
        setSnackbarMessage("Todos los campos obligatorios deben ser completados.");
        setSnackbarOpen(true);
        isValid = false;
      }

      // Validar formato de correo
      if (!emailRegex.test(correoContacto)) {
        setSnackbarMessage("El correo debe tener un formato válido (ej. ejemplo@dominio.com).");
        setSnackbarOpen(true);
        isValid = false;
      }

      // Validar URL
      if (direccionWeb) {
        const webRegex = /^https:\/\/([\w\-]+(\.[\w\-]+)+)(\/[^\s]*)?$/;
        if (!webRegex.test(direccionWeb)) {
          setSnackbarMessage("La dirección web debe comenzar con https:// y tener un formato válido");
          setSnackbarOpen(true);
          isValid = false;
        }
      }
  

      // Validar código único - ahora muestra el error en el campo
      if (codigo) {
        const codigoExiste = await verificarFacultadEnBD(codigo);
        if (codigoExiste && (!facultadEditar || facultadEditar.codigo !== codigo)) {
          setErrorCodigo(true);
          setErrores(prev => ({
            ...prev,
            codigo: true
          }));
          setErroresMensaje(prev => ({
            ...prev,
            codigo: 'El código ya está en uso'
          }));
          isValid = false;
        }
      }

      // Validar secretario académico
      if (secretarioAcademico) {
        const secretarioAsignado = await verificarFacultadSecretarioAcademico(secretarioAcademico.id);
        if (secretarioAsignado && (!facultadEditar || facultadEditar.secretarioAcademico?.id !== secretarioAcademico.id)) {
          setSnackbarMessage("El secretario académico ya está asignado a otra facultad.");
          setSnackbarOpen(true);
          setErrorSecretario(true);
          isValid = false;
        }
      }

      // Validar caracteres especiales
      if (!validarCaracteresEspeciales(codigo)) {
        setErrorCodigo(true);
        setErrores(prev => ({
          ...prev,
          codigo: true
        }));
        setErroresMensaje(prev => ({
          ...prev,
          codigo: 'No se permiten caracteres especiales'
        }));
        isValid = false;
      }

      if (!validarNombreCaracteresEspeciales(nombre)) {
        setErrorNombre(true);
        setErrores(prev => ({
          ...prev,
          nombre: true
        }));
        setErroresMensaje(prev => ({
          ...prev,
          nombre: 'No se permiten caracteres especiales'
        }));
        isValid = false;
      }

      return isValid;
    } catch (error) {
      console.error("Error en la validación:", error);
      setSnackbarMessage("Error al validar los campos");
      setSnackbarOpen(true);
      return false;
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleClickInsertarFacultad = async () => {
    try {
      const facultad = {
        nombre: nombre,
        codigo: codigo,
        telefonoContacto: telefonoContacto,
        correoContacto: correoContacto,
        tipo: 'FACULTAD',
        direccionWeb: direccionWeb.startsWith('http') ? direccionWeb : `https://${direccionWeb}`,
        secretarioAcademico: secretarioAcademico ? { id: secretarioAcademico.id } : null,
        activo: true
      };

      console.log(facultad);
      const endpoint = facultadEditar
        ? `http://localhost:8080/institucion/facultad/actualizar/${facultadEditar.id}`
        : `http://localhost:8080/institucion/facultad/insertar`;
      const method = facultadEditar ? 'put' : 'post';
      const response = await axios[method](endpoint, facultad);

      console.log("Facultad guardada:", response.data);
      router.push('/administrador/gestionFacultad/listadoFacultades');
    } catch (error) {
      console.error("Error al guardar facultad:", error);
      setSnackbarMessage("No se encontró el rol 'SECRETARIO ACADEMICO' en el sistema. Por favor, contacte con el administrador.");
      setSnackbarOpen(true);
    }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    const isValid = await validateFields();
    if (isValid) {
      setModalOpen(true);
    }
  };

  const handleSelectSecretarioAcademico = async (profesor) => {
    try {
      // Verificar si el secretario académico ya está asignado a otra facultad
      const estaAsignado = await verificarFacultadSecretarioAcademico(profesor.id);

      if (estaAsignado && (!facultadEditar || facultadEditar.secretarioAcademico?.id !== profesor.id)) {
        setErrorSecretario(true);
        setErrorSecretarioMessage('Este secretario académico ya está asignado a otra facultad');
        setSnackbarMessage('Este secretario académico ya está asignado a otra facultad');
        setSnackbarOpen(true);
        return;
      }

      setErrorSecretario(false);
      setErrorSecretarioMessage('');
      setSecretarioAcademico(profesor);
    } catch (error) {
      console.error("Error al verificar el secretario académico:", error);
      setSnackbarMessage("Error al verificar el secretario académico");
      setSnackbarOpen(true);
    }
  };

  const handleChange = (setter, field) => async (event) => {
    const value = event.target.value;
    setter(value);

    const nuevosErrores = { ...errores };
    const nuevosErroresMensaje = { ...erroresMensaje };

    if (field === 'codigo') {
      if (value.length === 0 || value.length > 10) {
        nuevosErrores[field] = true;
        nuevosErroresMensaje[field] = 'El campo no puede estar vacío y debe ser menor a 10 caracteres';
      } else {
        const existe = await verificarFacultadEnBD(value);
        if (existe && (!facultadEditar || facultadEditar.codigo !== value)) {
          nuevosErrores[field] = true;
          nuevosErroresMensaje[field] = mensajesError[field];
        } else {
          delete nuevosErrores[field];
          delete nuevosErroresMensaje[field];
        }
      }
    }

    setErrores(nuevosErrores);
    setErroresMensaje(nuevosErroresMensaje);
  };

  const [errorCodigo, setErrorCodigo] = useState(false);

  const handleChangeCodigo = async (e) => {
    const inputValue = e.target.value;

    if (!validarCaracteresEspeciales(inputValue)) {
      setErrorCodigo(true);
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

    // Primero validamos longitud
    if (inputValue.length === 0 || inputValue.length > 10) {
      setErrorCodigo(true);
      setErrores(prev => ({
        ...prev,
        codigo: true
      }));
      setErroresMensaje(prev => ({
        ...prev,
        codigo: 'El campo no puede estar vacío y debe ser menor a 10 caracteres'
      }));
    } else {
      // Si la longitud es correcta, verificamos si existe
      if (inputValue.length > 0) {
        const existe = await verificarFacultadEnBD(inputValue);
        if (existe && (!facultadEditar || facultadEditar.codigo !== inputValue)) {
          setErrorCodigo(true);
          setErrores(prev => ({
            ...prev,
            codigo: true
          }));
          setErroresMensaje(prev => ({
            ...prev,
            codigo: 'El código ya está en uso'
          }));
        } else {
          setErrorCodigo(false);
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
    }
  };

  const [errorNombre, setErrorNombre] = useState(false);

  const handleChangeNombre = (e) => {
    const inputValue = e.target.value;

    if (!validarNombreCaracteresEspeciales(inputValue)) {
      setErrorNombre(true);
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
      setErrorNombre(true);
      setErrores(prev => ({
        ...prev,
        nombre: true
      }));
      setErroresMensaje(prev => ({
        ...prev,
        nombre: 'El campo no puede estar vacío y debe ser menor a 100 caracteres'
      }));
    } else {
      setErrorNombre(false);
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

  const [errorTelefono, setErrorTelefono] = useState(false);

  const [errorCorreo, setErrorCorreo] = useState(false);
  const handleChangeCorreo = (e) => {
    const inputValue = e.target.value;
    setCorreoContacto(inputValue); // Actualiza el estado del nombre

    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(inputValue)) {
      setErrorCorreo(true);
    } else {
      setErrorCorreo(false);
    }
  };

  const [errorDireccion, setErrorDireccion] = useState(false);
  const handleChangeDireccion = (e) => {
    let inputValue = e.target.value;
    
    // Si el usuario no ha ingresado el protocolo, agregamos https://
    if (inputValue && !inputValue.match(/^https?:\/\//)) {
      inputValue = `https://${inputValue}`;
    }
    
    setDireccionWeb(inputValue);
  
    // Validación para URL completa
    const webRegex = /^https:\/\/([\w\-]+(\.[\w\-]+)+)(\/[^\s]*)?$/;
    if (!webRegex.test(inputValue)) {
      setErrorDireccion(true);
      setErrores(prev => ({
        ...prev,
        direccionWeb: true
      }));
      setErroresMensaje(prev => ({
        ...prev,
        direccionWeb: 'La dirección web debe comenzar con https:// y tener un formato válido'
      }));
    } else {
      setErrorDireccion(false);
      setErrores(prev => {
        const newErrors = { ...prev };
        delete newErrors.direccionWeb;
        return newErrors;
      });
      setErroresMensaje(prev => {
        const newMessages = { ...prev };
        delete newMessages.direccionWeb;
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
          <Typography variant="h4" sx={{ mb: '50px', color: '#191D23', whiteSpace: 'nowrap' }}>
            {isEditMode ? 'Editar Facultad' : 'Registrar Nueva Facultad'}
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
            onChange={(e) => handleChangeCodigo(e)}
            required
            error={errorCodigo || errores.codigo}
            helperText={errores.codigo ? erroresMensaje.codigo : (errorCodigo ? 'El campo no puede estar vacío y debe ser menor a 10 caracteres' : "")}
            sx={{ marginBottom: 2 }}
            inputProps={{ style: { height: '40px' } }}
          />

          <InputField
            label="Nombre"
            value={nombre}
            onChange={(e) => handleChangeNombre(e)}
            required
            error={errorNombre} // Controla si se muestra el mensaje de error
            helperText={errorNombre ? 'El campo no puede estar vacío y debe ser menor a 100 caracteres' : ""}
            sx={{ marginBottom: 2 }}
            inputProps={{ style: { height: '40px' } }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <Typography sx={{ marginRight: 0.5, lineHeight: '40px' }}>
              Secretario Académico
            </Typography>
            <Typography sx={{ color: 'red', marginRight: 2, lineHeight: '40px' }}>*</Typography>
            <TextField
              value={secretarioAcademico ? `${secretarioAcademico.nombres} ${secretarioAcademico.apellidos}`.trim() : ''}
              required
              variant="outlined"
              sx={{
                flex: 1,
                width: '100%',
                height: '40px',
                input: { height: '40px' },
                '& .MuiInputBase-root': { height: '40px' },
              }}
            />
            <Button
              onClick={() => setModalSecretarioAcademicoOpen(true)}
              sx={{
                height: '40px',
                minWidth: '100px',
                display: 'flex',
                ml: 'auto',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              variant="contained"
            >
              Buscar
            </Button>
          </Box>

          <InputField
            label="Teléfono de contacto"
            value={telefonoContacto}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 9) {
                setTelefonoContacto(value);
              }
              if (value.length == 0) {
                setErrorTelefono(true);
              } else {
                setErrorTelefono(false);
              }
            }}
            required
            error={errorTelefono}
            helperText={errorTelefono ? "El campo no puede estar vacio" : ""}
            sx={{ marginBottom: 2 }}
            maxLength={9}
            type="tel"
            pattern="[0-9]{9}"
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', style: { height: '40px' } }}
          />

          <InputField
            label="Correo de contacto"
            value={correoContacto}
            onChange={(e) => { handleChangeCorreo(e) }}
            required
            error={errorCorreo}
            helperText={errorCorreo ? "El campo no puede estar vacio y debe ser un correo válido" : ""}
            type="email"
            sx={{ marginBottom: 2 }}
            inputProps={{ style: { height: '40px' } }}
          />

          <InputField
            label="Dirección Web*"
            value={direccionWeb}
            onChange={(e) => handleChangeDireccion(e)}
            error={errorDireccion}
            helperText={errorDireccion ? "La dirección web debe comenzar con https:// y tener un formato válido" : ""}
            placeholder="https://ejemplo.com"
            type="url"
            sx={{ marginBottom: 2 }}
            inputProps={{
              style: { height: '40px' },
              pattern: "https://.*"
            }}
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

      <ModalSeleccionSecretarioAcademico
        open={modalSecretarioAcademicoOpen}
        onClose={() => setModalSecretarioAcademicoOpen(false)}
        onSelect={handleSelectSecretarioAcademico}
      />

      <EstaSeguroAccion
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        texto={`¿Está seguro de ${isEditMode ? "editar" : "guardar"} la facultad?`}
        handleAceptar={async () => {
          await handleClickInsertarFacultad();
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

export default NuevaFacultad;


