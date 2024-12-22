"use client";
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { Snackbar, Box, Typography, InputAdornment, Button, IconButton, Pagination, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, CircularProgress } from '@mui/material';
import Alert from '@mui/material/Alert';
import SearchIcon from '@mui/icons-material/Search';  // Asegúrate de importar el ícono de búsqueda

import { useRouter } from 'next/navigation';
import InputField from '../../../../../componentesGenerales/inputs/InputField'; // Importa el componente
import EstaSeguroAccion from '../../../../../componentesGenerales/modales/EstaSeguroAccion';
import { useEspecialidad } from '../../../EspecialidadContext'; // Importa el contexto de Especialidad


const ModalSeleccionCoordinador = ({ open, onClose, onSelect }) => {
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
      <DialogTitle>Seleccionar Director de Carrera</DialogTitle>
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

const ModalSeleccionAsistendeDeCarrera = ({ open, onClose, onSelect }) => {
  const [asistentes, setAsistenteDeCarrera] = useState([]);
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
      cargarAsistentes();
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
      cargarAsistentes();
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
    setAsistenteDeCarrera([]);
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
      cargarAsistentes();
    }
  }, [filtro]);

  useEffect(() => {
    if (!filtro) {
      cargarAsistentes();
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
        setAsistenteDeCarrera([]);
        setSearchMessage('No se encontraron resultados');
        setPage(0);
        setLoading(false);
        return;
      }

      setTotalPages(response.data.totalPages);

      const filteredResults = response.data.content.filter(asistente => {
        const nombreCompleto = `${asistente.nombre} ${asistente.apellidoPaterno} ${asistente.apellidoMaterno}`.toLowerCase();
        const codigo = asistente.codigo?.toString().toLowerCase() || '';
        const email = asistente.email?.toLowerCase() || '';

        return nombreCompleto.includes(searchTerm) ||
          codigo.includes(searchTerm) ||
          email.includes(searchTerm);
      });

      if (filteredResults.length > 0) {
        setAsistenteDeCarrera(filteredResults);
        setHighlightText(searchTerm);
        setSearchMessage('');
        setPage(currentPage);
      } else {
        if (currentPage < response.data.totalPages - 1) {
          setSearchMessage(`Buscando en la página ${currentPage + 2}...`);
          buscarEnTodasLasPaginas(currentPage + 1);
        } else {
          // Si llegamos aquí, hemos revisado todas las páginas sin resultados
          setAsistenteDeCarrera([]);
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
        setAsistenteDeCarrera([]);
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
        const results = response.data.content.filter(asistente => {
          const nombreCompleto = `${asistente.nombre} ${asistente.apellidoPaterno} ${asistente.apellidoMaterno}`.toLowerCase();
          const codigo = asistente.codigo?.toString().toLowerCase() || '';
          const email = asistente.email?.toLowerCase() || '';

          return nombreCompleto.includes(searchTerm) ||
            codigo.includes(searchTerm) ||
            email.includes(searchTerm);
        });

        setAsistenteDeCarrera(results);
        setTotalPages(response.data.totalPages);
        setHighlightText(searchTerm);
        setSearchMessage(results.length === 0 ? 'No se encontraron resultados' : '');
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error('Error en la búsqueda:', error);
        setSearchMessage('Error al realizar la búsqueda');
        setAsistenteDeCarrera([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const cargarAsistentes = async () => {
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
        setAsistenteDeCarrera(response.data.content);
        setTotalPages(response.data.totalPages);
        setSearchMessage('');
      } else {
        setAsistenteDeCarrera([]);
        setSearchMessage('No se encontraron resultados');
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error('Error al cargar personas:', error);
        setSearchMessage('Error al cargar la lista de personas');
        setAsistenteDeCarrera([]);
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

  const formatearNombreCompleto = (asistente) => {
    const nombreCompleto = `${asistente.nombre || ''} ${asistente.apellidoPaterno || ''}`;
    const inicialMaterno = asistente.apellidoMaterno ? ` ${asistente.apellidoMaterno.charAt(0)}.` : '';
    return `${nombreCompleto}${inicialMaterno}`;
  };

  const handleSelect = (asistente) => {
    onSelect({
      id: asistente.id,
      nombres: asistente.nombre,
      apellidos: `${asistente.apellidoPaterno} ${asistente.apellidoMaterno}`,
      correo: asistente.email
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Seleccionar Asistente de Carrera</DialogTitle>
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
              {asistentes.length > 0 ? (
                asistentes.map((asistente) => (
                  <TableRow key={asistente.codigo} hover>
                    <TableCell>
                      {highlightMatch(asistente.codigo, highlightText)}
                    </TableCell>
                    <TableCell>
                      {highlightMatch(formatearNombreCompleto(asistente), highlightText)}
                    </TableCell>
                    <TableCell>
                      {highlightMatch(asistente.email, highlightText)}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleSelect(asistente)}
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

        {asistentes.length > 0 && (

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

// ModalSeleccionFacultad.js
const ModalSeleccionFacultad = ({ open, onClose, onSelect }) => {
  const [facultads, setFacultads] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [highlightText, setHighlightText] = useState('');
  const searchTimeoutRef = useRef(null);
  const abortController = useRef(null);
  const [errores, setErrores] = useState({});
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
        `http://localhost:8080/institucion/facultad/listar_indexado?page=${currentPage}&size=6`,
        { signal: abortController.current.signal }
      );

      if (!response.data?.content) {
        setFacultads([]);
        setSearchMessage('No se encontraron resultados');
        setPage(0);
        setLoading(false);
        return;
      }

      setTotalPages(response.data.totalPages);

      const filteredResults = response.data.content.filter(facultad => {
        const nombre = facultad.nombre?.toLowerCase() || '';
        const codigo = facultad.codigo?.toString().toLowerCase() || '';
        const correo = facultad.correoContacto?.toLowerCase() || '';

        return nombre.includes(searchTerm) ||
          codigo.includes(searchTerm) ||
          correo.includes(searchTerm);
      });

      if (filteredResults.length > 0) {
        setFacultads(filteredResults);
        setHighlightText(searchTerm);
        setSearchMessage('');
        setPage(currentPage);
      } else {
        if (currentPage < response.data.totalPages - 1) {
          setSearchMessage(`Buscando en la página ${currentPage + 2}...`);
          buscarEnTodasLasPaginas(currentPage + 1);
        } else {
          setFacultads([]);
          setHighlightText('');
          setSearchMessage('No se encontraron resultados');
          setPage(0);
          setLoading(false);
        }
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error('Error en la búsqueda:', error);
        setSearchMessage('Error al realizar la búsqueda');
        setFacultads([]);
        setPage(0);
      }
    } finally {
      if (currentPage === totalPages - 1) {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    if (open) {
      resetearBusqueda();
      cargarFacultads();
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
    setFacultads([]);
    setHighlightText('');
    setSearchMessage('');
    if (abortController.current) {
      abortController.current.abort();
    }
  };

  useEffect(() => {
    if (!filtro) {
      cargarFacultads();
    }
  }, [page]);

  const cargarFacultads = async () => {
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();

    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/institucion/facultad/listar_indexado?page=${page}&size=6`,
        { signal: abortController.current.signal }
      );

      if (response.data?.content) {
        setFacultads(response.data.content);
        setTotalPages(response.data.totalPages);
        setSearchMessage('');
      } else {
        setFacultads([]);
        setSearchMessage('No se encontraron resultados');
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error('Error al cargar facultads:', error);
        setSearchMessage('Error al cargar la lista de facultads');
        setFacultads([]);
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

  const handleSelect = (facultad) => {
    onSelect({
      id: facultad.id,
      codigo: facultad.codigo,
      nombre: facultad.nombre,
      correoContacto: facultad.correoContacto
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Seleccionar Facultad</DialogTitle>
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
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#363581' }}>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Código</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Correo</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }} align="center">Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {facultads.map((facultad) => (
                <TableRow key={facultad.id} hover>
                  <TableCell>{highlightMatch(facultad.codigo, highlightText)}</TableCell>
                  <TableCell>{highlightMatch(facultad.nombre, highlightText)}</TableCell>
                  <TableCell>{highlightMatch(facultad.correoContacto, highlightText)}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleSelect(facultad)}
                      sx={{
                        minWidth: '100px',
                      }}
                    >
                      Seleccionar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Paginación */}
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
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' onClick={onClose}>
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function NuevoEspecialidad() {
  const { especialidad: especialidadEditar } = useEspecialidad();
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefonoContacto, setTelefonoContacto] = useState("");
  const [correoContacto, setCorreoContacto] = useState("");
  const [direccionWeb, setDireccionWeb] = useState("");
  const [coordinador, setCoordinador] = useState(null);
  const [asistenteDeCarrera, setAsistenteDeCarrera] = useState(null);
  const [facultad, setFacultad] = useState(null);

  // Estados para los modales
  const [modalCoordinadorOpen, setModalCoordinadorOpen] = useState(false);
  const [modalAsistendeDeCarreraOpen, setModalAsistendeDeCarreraOpen] = useState(false);
  const [modalFacultadOpen, setModalFacultadOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Estado para el Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const router = useRouter();


  const [errores, setErrores] = useState({});
  const [erroresMensaje, setErroresMensaje] = useState({});
  const [errorCodigo, setErrorCodigo] = useState(false);
  const [errorNombre, setErrorNombre] = useState(false);
  const [errorCoordinador, setErrorCoordinador] = useState(false);
  const [errorCoordinadorMessage, setErrorCoordinadorMessage] = useState('');
  const [errorAsistente, setErrorAsistente] = useState(false);
  const [errorAsistenteMessage, setErrorAsistenteMessage] = useState('');
  const validarCaracteresEspeciales = (texto) => {
    const regex = /^[a-zA-Z0-9\s]*$/;
    return regex.test(texto);
  };

  const validarNombreCaracteresEspeciales = (texto) => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,]*$/;
    return regex.test(texto);
  };

  // Funciones de verificación
  const verificarEspecialidadEnBD = async (codigo) => {
    try {
      const response = await axios.get(`http://localhost:8080/institucion/especialidad/existe/${codigo}`);
      return response.data;
    } catch (error) {
      console.error("Error al verificar la especialidad en la BD:", error);
      return false;
    }
  };

  const verificarCoordinadorEspecialidad = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/institucion/especialidad/existePorCoordinador/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al verificar el coordinador:", error);
      return false;
    }
  };

  const verificarAsistenteEspecialidad = async (id) => {
    console.log("id", id);
    try {
      const response = await axios.get(`http://localhost:8080/institucion/especialidad/existePorAsistenteDeCarrera/${id}`);
      console.log("response", response);
      return response.data;
    } catch (error) {
      console.error("Error al verificar el asistente:", error);
      return false;
    }
  };

  useEffect(() => {
    if (especialidadEditar) {
      setCodigo(especialidadEditar?.codigo);
      setNombre(especialidadEditar?.nombre);
      setTelefonoContacto(especialidadEditar?.telefonoContacto);
      setCorreoContacto(especialidadEditar?.correoContacto);
      setDireccionWeb(especialidadEditar?.direccionWeb);
      setAsistenteDeCarrera(especialidadEditar?.asistenteDeCarrera);
      // Configurar el coordinador si existe
      if (especialidadEditar.coordinador) {
        const coordinadorData = especialidadEditar.coordinador;
        setCoordinador({
          id: coordinadorData.id,
          nombres: coordinadorData.nombre,
          apellidos: `${coordinadorData.apellidoPaterno || ''} ${coordinadorData.apellidoMaterno || ''}`.trim(),
          correo: coordinadorData.email
        });
      }

      // Configurar el asistente si existe
      if (especialidadEditar.asistenteDeCarrera) {
        const asistenteDeCarreraData = especialidadEditar.asistenteDeCarrera;
        setAsistenteDeCarrera({
          id: asistenteDeCarreraData.id,
          nombres: asistenteDeCarreraData.nombre,
          apellidos: `${asistenteDeCarreraData.apellidoPaterno || ''} ${asistenteDeCarreraData.apellidoMaterno || ''}`.trim(),
          correo: asistenteDeCarreraData.email
        });
      }

      // Configurar el facultad si existe
      if (especialidadEditar.facultad) {
        const deptoData = especialidadEditar.facultad;
        setFacultad({
          id: deptoData.id,
          codigo: deptoData.codigo,
          nombre: deptoData.nombre,
          correoContacto: deptoData.correoContacto
        });
      }
    } else {
      limpiarFormulario();
    }
  }, [especialidadEditar]);

  const limpiarFormulario = () => {
    setCodigo("");
    setNombre("");
    setTelefonoContacto("");
    setCorreoContacto("");
    setDireccionWeb("");
    setCoordinador(null);
    setAsistenteDeCarrera(null);
    setFacultad(null);
    setErrores({});
    setErroresMensaje({});
  };
  const mensajesError = {
    codigo: "La especialidad ya existe.",
    // ... otros mensajes de error ...
  };

  const validateFields = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nombre || !codigo || !telefonoContacto || !correoContacto || !coordinador || !facultad || !asistenteDeCarrera) {
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

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleClickInsertarEspecialidad = async () => {
    try {
      const especialidad = {
        codigo: codigo,
        nombre: nombre,
        telefonoContacto: telefonoContacto,
        correoContacto: correoContacto,
        direccionWeb: direccionWeb,
        coordinador: coordinador ? { id: coordinador.id } : null,
        facultad: facultad ? { id: facultad.id } : null,
        asistenteDeCarrera: asistenteDeCarrera ? { id: asistenteDeCarrera.id } : null,
        activo: true,
        tipo: 'ESPECIALIDAD'
      };

      const endpoint = especialidadEditar
        ? `http://localhost:8080/institucion/especialidad/actualizar/${especialidadEditar.id}`
        : `http://localhost:8080/institucion/especialidad/insertar`;
      const method = especialidadEditar ? 'put' : 'post';

      const response = await axios[method](endpoint, especialidad);
      console.log("Especialidadguardada:", response.data);
      router.push('/administrador/gestionEspecialidad/listadoEspecialidades');
    } catch (error) {
      console.error("Error al guardar especialidad:", error);
      setSnackbarMessage("Error al guardar la especialidad");
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

  const handleSelectCoordinador = async (profesor) => {
    try {
      const estaAsignado = await verificarCoordinadorEspecialidad(profesor.id);

      if (estaAsignado && (!especialidadEditar || especialidadEditar.coordinador?.id !== profesor.id)) {
        setErrorCoordinador(true);
        setErrorCoordinadorMessage('Este profesor ya es director de carrera de otra especialidad');
        setSnackbarMessage('Este profesor ya es director de carrera otra especialidad');
        setSnackbarOpen(true);
        return;
      }

      setErrorCoordinador(false);
      setErrorCoordinadorMessage('');
      setCoordinador(profesor);
    } catch (error) {
      console.error("Error al verificar el coordinador:", error);
      setSnackbarMessage("Error al verificar el coordinador");
      setSnackbarOpen(true);
    }
  };

  // const handleSelectAsistendeDeCarrera = (asistente) => {
  //   setAsistenteDeCarrera(asistente);
  // };
  const handleSelectAsistendeDeCarrera = async (profesor) => {
    try {
      const estaAsignado = await verificarAsistenteEspecialidad(profesor.id);

      if (estaAsignado && (!especialidadEditar || especialidadEditar.asistenteDeCarrera?.id !== profesor.id)) {
        setErrorAsistente(true);
        setErrorAsistenteMessage('Este profesor ya es asistente de otra especialidad');
        setSnackbarMessage('Este profesor ya es asistente de otra especialidad');
        setSnackbarOpen(true);
        return;
      }

      setErrorAsistente(false);
      setErrorAsistenteMessage('');
      setAsistenteDeCarrera(profesor);
    } catch (error) {
      console.error("Error al verificar el asistente:", error);
      setSnackbarMessage("Error al verificar el asistente");
      setSnackbarOpen(true);
    }
  };
  const handleSelectFacultad = (depto) => {
    setFacultad(depto);
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
        const existe = await verificarEspecialidadEnBD(value);
        if (existe && (!especialidadEditar || especialidadEditar.codigo !== value)) {
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
        const existe = await verificarEspecialidadEnBD(inputValue);
        if (existe && (!especialidadEditar || especialidadEditar.codigo !== inputValue)) {
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
    const inputValue = e.target.value;
    setDireccionWeb(inputValue); // Actualiza el estado del nombre

    const webRegex = /^(https?:\/\/)?([\w\-]+(\.[\w\-]+)+)(\/[^\s]*)?$/;
    if (!webRegex.test(inputValue)) {
      setErrorDireccion(true);
    } else {
      setErrorDireccion(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: 'white', minHeight: '100vh' }}>
      <Box
        sx={{
          marginLeft: '220px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ padding: '20px', textAlign: 'left' }}>
          <Typography variant="h4" sx={{ mb: '50px', color: '#191D23' }}>
            {especialidadEditar ? "Editar especialidad" : "Registrar nueva especialidad"}
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
              marginRight: 0.8,
              lineHeight: '40px',
            }}>
              Director de Carrera
            </Typography>
            <Typography sx={{
              color: 'red',
              marginRight: 4.8,
              lineHeight: '40px',
            }}// Alinea verticalmente con el TextField
            >
              *
            </Typography>
            <TextField
              value={coordinador ? `${coordinador.nombres} ${coordinador.apellidos}`.trim() : ''}
              required
              variant="outlined"
              error={errorCoordinador}
              helperText={errorCoordinadorMessage}
              sx={{
                flex: 1,
                width: '100%',
                height: '40px',
                input: { height: '40px' },
                '& .MuiInputBase-root': { height: '40px' },
              }}
            />
            <Button
              onClick={() => setModalCoordinadorOpen(true)}
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




          {/* Campo Asistente */}
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            {/* Campo de Coordinador con botón de búsqueda */}
            <Typography sx={{
              marginRight: 0.8,
              lineHeight: '40px',
            }}>
              Asistente de Carrera
            </Typography>
            <Typography sx={{
              color: 'red',
              marginRight: 3.5,
              lineHeight: '40px',
            }}// Alinea verticalmente con el TextField
            >
              *
            </Typography>
            <TextField
              value={asistenteDeCarrera ? `${asistenteDeCarrera.nombres} ${asistenteDeCarrera.apellidos}`.trim() : ''}
              required
              variant="outlined"
              error={errorAsistente}
              helperText={errorAsistenteMessage}
              sx={{
                flex: 1,
                width: '100%',
                height: '40px',
                input: { height: '40px' },
                '& .MuiInputBase-root': { height: '40px' },
              }}
            />
            <Button
              onClick={() => setModalAsistendeDeCarreraOpen(true)}
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
          {/* Campo de Facultad con botón de búsqueda */}
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <Typography sx={{
              marginRight: 0.5,
              lineHeight: '40px',
            }}>
              Facultad
            </Typography>
            <Typography sx={{
              color: 'red',
              marginRight: 15,
              lineHeight: '40px',
            }}// Alinea verticalmente con el TextField
            >
              *
            </Typography>
            <TextField
              //label="Facultad"
              value={facultad ? `${facultad.codigo} - ${facultad.nombre}` : ''}
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
              onClick={() => setModalFacultadOpen(true)}
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
            label="Correo de Contacto"
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
            label="Dirección Web"
            value={direccionWeb}
            onChange={(e) => handleChangeDireccion(e)}
            error={errorDireccion}
            helperText={errorDireccion ? "El campo no puede estar vacio y debe ser una direccion web válida" : ""}
            type="url"
            sx={{ marginBottom: 2 }}
            inputProps={{ style: { height: '40px' } }}
            pattern="https?://.+"
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

      {/* Modales de selección */}
      <ModalSeleccionCoordinador
        open={modalCoordinadorOpen}
        onClose={() => setModalCoordinadorOpen(false)}
        onSelect={handleSelectCoordinador}
      />

      <ModalSeleccionAsistendeDeCarrera
        open={modalAsistendeDeCarreraOpen}
        onClose={() => setModalAsistendeDeCarreraOpen(false)}
        onSelect={handleSelectAsistendeDeCarrera}
      />

      <ModalSeleccionFacultad
        open={modalFacultadOpen}
        onClose={() => setModalFacultadOpen(false)}
        onSelect={handleSelectFacultad}
      />

      {/* Modal de confirmación */}
      <EstaSeguroAccion
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        texto={`¿Está seguro de ${especialidadEditar ? "editar" : "guardar"} la especialidad?`}
        handleAceptar={async () => {
          await handleClickInsertarEspecialidad();
          setModalOpen(false);
        }}
      />

      {/* Snackbar para mensajes */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity="warning"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default NuevoEspecialidad;
