"use client";
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { Snackbar, Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useRouter } from 'next/navigation';
import InputField from '../../../../../componentesGenerales/inputs/InputField';
import EstaSeguroAccion from '../../../../../componentesGenerales/modales/EstaSeguroAccion';
import { useDepartamento } from '../../../DepartamentoContext';
import CircularProgress from '@mui/material/CircularProgress';



const ModalSeleccionJefe = ({ open, onClose, onSelect }) => {
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
      <DialogTitle>Seleccionar Jefe de Departamento</DialogTitle>
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
            <CircularProgress size={20} sx={{ color: '#363581' }} />
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
                  <TableRow key={profesor.codigo} hover>
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
              sx={{ mx: 1 }}
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
              sx={{ mx: 1 }}
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

 

 
// Componente Principal
 const NuevoDepartamento = () => {
  const { departamento: departamentoEditar } = useDepartamento();
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefonoContacto, setTelefonoContacto] = useState("");
  const [correoContacto, setCorreoContacto] = useState("");
  const [direccionWeb, setDireccionWeb] = useState("");
  const [jefeDepartamento, setJefeDepartamento] = useState(null);
  const [modalJefeOpen, setModalJefeOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const [isDireccionWebTouched, setIsDireccionWebTouched] = useState(false);


 
const [errores, setErrores] = useState({});
const [erroresMensaje, setErroresMensaje] = useState({});
const [errorJefe, setErrorJefe] = useState(false);
const [errorJefeMessage, setErrorJefeMessage] = useState('');
  useEffect(() => {
    if (departamentoEditar) {
      setCodigo(departamentoEditar?.codigo);
      setNombre(departamentoEditar?.nombre);
      setTelefonoContacto(departamentoEditar?.telefonoContacto);
      setCorreoContacto(departamentoEditar?.correoContacto);
      setDireccionWeb(departamentoEditar?.direccionWeb);
      setJefeDepartamento(departamentoEditar?.jefeDepartamento);
      // Formatear y establecer el jefe del departamento
      if (departamentoEditar.jefe) {
        const jefe = departamentoEditar.jefe;
        setJefeDepartamento({
          id: jefe.id,
          nombres: jefe.nombre,
          apellidos: `${jefe.apellidoPaterno || ''} ${jefe.apellidoMaterno || ''}`.trim(),
          correo: jefe.email
        });
      } else {
        setJefeDepartamento(null);
      }
    } else {
      // Limpiar todos los campos si no hay departamento para editar
      setCodigo("");
      setNombre("");
      setTelefonoContacto("");
      setCorreoContacto("");
      setDireccionWeb("");
      setJefeDepartamento(null);
    }
  }, [departamentoEditar]);

  const [isGuardarDisabled, setIsGuardarDisabled] = useState(true);
  
  useEffect(() => {
    const hasErrors =
      !codigo.trim() ||
      !nombre.trim() ||
      !jefeDepartamento ||
      !/^[0-9]{9}$/.test(telefonoContacto) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoContacto) ||
      !/^https?:\/\/.*/.test(direccionWeb);
    
    setIsGuardarDisabled(hasErrors);
  }, [codigo, nombre, jefeDepartamento, telefonoContacto, correoContacto, direccionWeb]);

  const validateFields = () => {
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nombre || !codigo || !telefonoContacto || !correoContacto || !jefeDepartamento) {
      setSnackbarMessage("Todos los campos obligatorios deben ser completados.");
      setSnackbarOpen(true);
      return false;
    }

    if (!emailRegex.test(correoContacto)) {
      setSnackbarMessage("El correo debe tener un formato válido (ej. ejemplo@dominio.com).");
      setSnackbarOpen(true);
      return false;
    }

    if (direccionWeb) {
      if (!/^https?:\/\/.*/.test(direccionWeb)) {
        setSnackbarMessage("La dirección web debe tener un formato válido (https:// o http://).");
        setSnackbarOpen(true);
        return false;
      }
    }

    return true;
  };
// Agregar estas funciones de validación
const validarCaracteresEspeciales = (texto) => {
  const regex = /^[a-zA-Z0-9\s]*$/;
  return regex.test(texto);
};

const validarNombreCaracteresEspeciales = (texto) => {
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,]*$/;
  return regex.test(texto);
};

// Agregar estas funciones de verificación
const verificarDepartamentoEnBD = async (codigo) => {
  try {
    const response = await axios.get(`http://localhost:8080/institucion/departamento/existePorCodigo/${codigo}`);
    return response.data;
  } catch (error) {
    console.error("Error al verificar el departamento en la BD:", error);
    return false;
  }
};

const verificarJefeDepartamento = async (id) => {
  try {
    const response = await axios.get(`http://localhost:8080/institucion/departamento/existePorIdJefe/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al verificar el jefe de departamento:", error);
    return false;
  }
};
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleClickInsertarDepartamento = async (e) => {
    try {
      console.log("Jefe de departamento:", jefeDepartamento);
      if(jefeDepartamento!=null){
        console.log("Jefe de departamento:", jefeDepartamento.id);
      }
      const departamento = {
        codigo: codigo,
        nombre: nombre,
        telefonoContacto: telefonoContacto,
        correoContacto: correoContacto,
        direccionWeb: direccionWeb,
        jefe: jefeDepartamento ? {
          id: jefeDepartamento.id
        } : null,
        activo: true,
        tipo: 'DEPARTAMENTO', 
      };

      console.log(departamento);
      const endpoint = departamentoEditar
        ? `http://localhost:8080/institucion/departamento/actualizar/${departamentoEditar.id}`
        : `http://localhost:8080/institucion/departamento/insertar`;
      const method = departamentoEditar ? 'put' : 'post';
      const response = await axios[method](endpoint, departamento);

      console.log("Departamento guardado:", response.data);
      router.push('/administrador/gestionDepartamento/listadoDepartamentos');
    } catch (error) {
      console.error("Error al guardar departamento:", error);
    }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    const isValid = await validateFields();
    if (isValid) {
      setModalOpen(true);
    }
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
    if (inputValue.length > 0) {
      const existe = await verificarDepartamentoEnBD(inputValue);
      if (existe && (!departamentoEditar || departamentoEditar.codigo !== inputValue)) {
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
  const [errorCorreo,setErrorCorreo]=useState(false);
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

  const handleSelectJefe = async (profesor) => {
    try {
      const estaAsignado = await verificarJefeDepartamento(profesor.id);
      
      if (estaAsignado && (!departamentoEditar || departamentoEditar.jefe?.id !== profesor.id)) {
        setErrorJefe(true);
        setErrorJefeMessage('Este profesor ya es jefe de otro departamento');
        setSnackbarMessage('Este profesor ya es jefe de otro departamento');
        setSnackbarOpen(true);
        return;
      }
      
      setErrorJefe(false);
      setErrorJefeMessage('');
      setJefeDepartamento(profesor);
    } catch (error) {
      console.error("Error al verificar el jefe de departamento:", error);
      setSnackbarMessage("Error al verificar el jefe de departamento");
      setSnackbarOpen(true);
    }
  };
  const [errorDireccion,setErrorDireccion]=useState(false);
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
      <Box
        sx={{
          marginLeft: '220px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{  padding: '20px', textAlign: 'left' }}>
          <Typography variant="h4" sx={{ mb: '50px', color: '#191D23' }}>
            {departamentoEditar ? "Editar departamento" : "Registrar nuevo departamento"}
          </Typography>
        </Box>

        <Box
          sx={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #D9D9D9',
            borderRadius: 2,
            padding: 4,
            boxShadow: 2,
            width: '100%',
            maxWidth: 700,
          }}
        >
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
  error={errorNombre || errores.nombre}
  helperText={errores.nombre ? erroresMensaje.nombre : (errorNombre ? 'El campo no puede estar vacío y debe ser menor a 100 caracteres' : "")}
  sx={{ marginBottom: 2 }}
  inputProps={{ style: { height: '40px' } }}
/>
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
          <Typography sx={{ 
              marginRight: 0.5, 
              lineHeight: '40px',}}>
              Jefe de Departamento 
            </Typography>
            <Typography sx={{
              color: 'red', 
              marginRight: 2, 
              lineHeight: '40px', }}// Alinea verticalmente con el TextField
            >
              *
            </Typography>
            <TextField
              value={jefeDepartamento ? `${jefeDepartamento.nombres} ${jefeDepartamento.apellidos}`.trim() : ''}
              required
              variant="outlined"
              sx={{
                flex: 1,
                width: '100%',
                height: '40px', // Cambia la altura a 50px
                input: {
                  height: '40px',  // Aplica el mismo tamaño al input directamente
                },
                '& .MuiInputBase-root': {
                  height: '40px', // Aplica altura al TextField
                },
              }}
            />
            <Button
              onClick={() => setModalJefeOpen(true)}
              sx={{
                height: '40px',
                minWidth: '100px',
                display: 'flex',
                ml: 'auto', 
                alignItems: 'center', // Centra contenido dentro del botón
                justifyContent: 'center', // Centra contenido horizontalmente dentro del botón
              }}
              variant="contained"
            >
              Buscar
            </Button>
          </Box>
          <InputField
            label="Teléfono de Contacto"
            value={telefonoContacto}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 9) {
                setTelefonoContacto(value);
              }
              if(value.length==0){
                setErrorTelefono(true);
              }else{
                setErrorTelefono(false);
              }
            }}
            required
            error={errorTelefono}
            helperText={errorTelefono?"El campo no puede estar vacio":""}
            sx={{ marginBottom: 2 }}
            maxLength={9}
            type="tel"
            pattern="[0-9]{9}"
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', style: { height: '40px' } }}
          />
          <InputField
            label="Correo de Contacto"
            value={correoContacto}
            onChange={(e) => {handleChangeCorreo(e)}}
            required
            error={errorCorreo}
            helperText={errorCorreo?"El campo no puede estar vacio y debe ser un correo válido":""}
            type="email"
            sx={{ marginBottom: 2 }}
            inputProps={{ style: { height: '40px' } }}
          />

<InputField
  label="Dirección Web"
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

      <ModalSeleccionJefe
        open={modalJefeOpen}
        onClose={() => setModalJefeOpen(false)}
        onSelect={handleSelectJefe}
      />

      <EstaSeguroAccion
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        texto={`¿Está seguro de ${departamentoEditar ? "editar" : "guardar"} el departamento?`}
        handleAceptar={async () => {
          await handleClickInsertarDepartamento();
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

export default NuevoDepartamento;