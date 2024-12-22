"use client";
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { Snackbar, Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, CircularProgress } from '@mui/material';
import Alert from '@mui/material/Alert';

import { useRouter } from 'next/navigation';
import InputField from '../../../../../componentesGenerales/inputs/InputField'; // Importa el componente
import EstaSeguroAccion from '../../../../../componentesGenerales/modales/EstaSeguroAccion';
import { useSeccion } from '../../../SeccionContext'; // Importa el contexto de Seccion
const ModalSeleccionAsistente = ({ open, onClose, onSelect }) => {
  const [asistentes, setProfesores] = useState([]);
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

      const filteredResults = response.data.content.filter(asistente => {
        const nombreCompleto = `${asistente.nombre} ${asistente.apellidoPaterno} ${asistente.apellidoMaterno}`.toLowerCase();
        const codigo = asistente.codigo?.toString().toLowerCase() || '';
        const email = asistente.email?.toLowerCase() || '';

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
        const results = response.data.content.filter(asistente => {
          const nombreCompleto = `${asistente.nombre} ${asistente.apellidoPaterno} ${asistente.apellidoMaterno}`.toLowerCase();
          const codigo = asistente.codigo?.toString().toLowerCase() || '';
          const email = asistente.email?.toLowerCase() || '';

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
      <DialogTitle>Seleccionar Asistente de Departamento</DialogTitle>
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
                          backgroundColor: '#363581',
                          '&:hover': {
                            backgroundColor: '#363581',
                          },
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
                          backgroundColor: '#363581',
                          '&:hover': {
                            backgroundColor: '#363581',
                          },
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
// ModalSeleccionDepartamento.js
const ModalSeleccionDepartamento = ({ open, onClose, onSelect }) => {
  const [departamentos, setDepartamentos] = useState([]);
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
      cargarDepartamentos();
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
    setDepartamentos([]);
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
      cargarDepartamentos();
    }
  }, [filtro]);

  const cargarDepartamentos = async () => {
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();

    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/institucion/departamento/listar_indexado?page=${page}&size=6`,
        { signal: abortController.current.signal }
      );

      if (response.data?.content) {
        setDepartamentos(response.data.content);
        setTotalPages(response.data.totalPages);
        setSearchMessage('');
      } else {
        setDepartamentos([]);
        setSearchMessage('No se encontraron resultados');
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error('Error al cargar departamentos:', error);
        setSearchMessage('Error al cargar la lista de departamentos');
        setDepartamentos([]);
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

  const handleSelect = (departamento) => {
    onSelect({
      id: departamento.id,
      codigo: departamento.codigo,
      nombre: departamento.nombre,
      correoContacto: departamento.correoContacto
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Seleccionar Departamento</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2, mt: 1 }}>
          <TextField
            fullWidth
            label="Buscar"
            color='#363581'
            variant="outlined"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            size="small"
            placeholder="Buscar por código, nombre o correo..."
          />
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
              {departamentos.map((departamento) => (
                <TableRow key={departamento.id} hover>
                  <TableCell>{highlightMatch(departamento.codigo, highlightText)}</TableCell>
                  <TableCell>{highlightMatch(departamento.nombre, highlightText)}</TableCell>
                  <TableCell>{highlightMatch(departamento.correoContacto, highlightText)}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleSelect(departamento)}
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

function NuevoSeccion() {
  const { seccion: seccionEditar } = useSeccion();
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefonoContacto, setTelefonoContacto] = useState("");
  const [correoContacto, setCorreoContacto] = useState("");
  const [direccionWeb, setDireccionWeb] = useState("");
  const [jefe, setJefe] = useState(null);
  const [asistente, setAsistente] = useState(null);
  const [departamento, setDepartamento] = useState(null);

  // Estados para los modales
  const [modalJefeOpen, setModalJefeOpen] = useState(false);
  const [modalDepartamentoOpen, setModalDepartamentoOpen] = useState(false);
  const [modalAsistenteOpen, setModalAsistenteOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Estado para el Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  //Errores
  const [errores, setErrores] = useState({});
  const [erroresMensaje, setErroresMensaje] = useState({});
  const [errorJefe, setErrorJefe] = useState(false);
  const [errorJefeMessage, setErrorJefeMessage] = useState('');
  const [errorAsistente, setErrorAsistente] = useState(false);
  const [errorAsistenteMessage, setErrorAsistenteMessage] = useState('');
  const router = useRouter();
  const validarCaracteresEspeciales = (texto) => {
    const regex = /^[a-zA-Z0-9\s]*$/;
    return regex.test(texto);
  };

  const validarNombreCaracteresEspeciales = (texto) => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,]*$/;
    return regex.test(texto);
  };

  const verificarSeccionEnBD = async (codigo) => {
    try {
      const response = await axios.get(`http://localhost:8080/institucion/seccion/existe/${codigo}`);
      return response.data;
    } catch (error) {
      console.error("Error al verificar la sección en la BD:", error);
      return false;
    }
  };

  const verificarJefeSeccion = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/institucion/seccion/existePorJefe/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al verificar el jefe:", error);
      return false;
    }
  };

  const verificarAsistenteSeccion = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/institucion/seccion/existePorAsistente/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al verificar el asistente:", error);
      return false;
    }
  };

  useEffect(() => {
    if (seccionEditar) {
      setCodigo(seccionEditar?.codigo);
      setNombre(seccionEditar?.nombre);
      setTelefonoContacto(seccionEditar?.telefonoContacto);
      setCorreoContacto(seccionEditar?.correoContacto);
      setDireccionWeb(seccionEditar?.direccionWeb);
      setAsistente(seccionEditar?.asistente);
      // Configurar el jefe si existe
      if (seccionEditar.jefe) {
        const jefeData = seccionEditar.jefe;
        setJefe({
          id: jefeData.id,
          nombres: jefeData.nombre,
          apellidos: `${jefeData.apellidoPaterno || ''} ${jefeData.apellidoMaterno || ''}`.trim(),
          correo: jefeData.email
        });
      }
      console.log(seccionEditar);
      if (seccionEditar.asistente) {
        const asistenteData = seccionEditar.asistente;
        setAsistente({
          id: asistenteData.id,
          nombres: asistenteData.nombre,
          apellidos: `${asistenteData.apellidoPaterno || ''} ${asistenteData.apellidoMaterno || ''}`.trim(),
          correo: asistenteData.email
        });
      }
      // Configurar el departamento si existe
      if (seccionEditar.departamento) {
        const deptoData = seccionEditar.departamento;
        setDepartamento({
          id: deptoData.id,
          codigo: deptoData.codigo,
          nombre: deptoData.nombre,
          correoContacto: deptoData.correoContacto
        });
      }
    } else {
      limpiarFormulario();
    }
  }, [seccionEditar]);

  const limpiarFormulario = () => {
    setCodigo("");
    setNombre("");
    setTelefonoContacto("");
    setCorreoContacto("");
    setDireccionWeb("");
    setJefe(null);
    setDepartamento(null);
  };

  const validateFields = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!codigo || !nombre || !telefonoContacto || !correoContacto || !jefe || !departamento) {
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
        setSnackbarMessage("La dirección web debe tener un formato válido (https:// o https://).");
        setSnackbarOpen(true);
        return false;
      }
    }

    return true;
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleClickInsertarSeccion = async () => {
    try {
      if (departamento !== null) {
        console.log("Departamento: ");
        console.log(departamento.id);
      }
      if (asistente !== null) {
        console.log("Asistente: ");
        console.log(asistente.id);
      }
      if (jefe !== null) {
        console.log("Jefe: ");
        console.log(jefe.id
        );
      }
      const seccion = {
        codigo: codigo,
        nombre: nombre,
        telefonoContacto: telefonoContacto,
        correoContacto: correoContacto,
        direccionWeb: direccionWeb,
        jefe: jefe ? { id: jefe.id } : null,
        departamento: departamento ? { id: departamento.id } : null,
        asistente: asistente ? { id: asistente.id } : null,
        tipo: "SECCION",
        activo: true
      };

      const endpoint = seccionEditar
        ? `http://localhost:8080/institucion/seccion/actualizar/${seccionEditar.id}`
        : `http://localhost:8080/institucion/seccion/insertar`;
      const method = seccionEditar ? 'put' : 'post';

      console.log(seccion);
      const response = await axios[method](endpoint, seccion);
      console.log("Sección guardada:", response.data);
      router.push('/administrador/gestionSeccion/listadoSecciones');
    } catch (error) {
      console.error("Error al guardar sección:", error);
      setSnackbarMessage("Error al guardar la sección");
      setSnackbarOpen(true);
    }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (validateFields()) {
      setModalOpen(true);
    }
  };

  const handleSelectJefe = async (profesor) => {
    try {
      const estaAsignado = await verificarJefeSeccion(profesor.id);

      if (estaAsignado && (!seccionEditar || seccionEditar.jefe?.id !== profesor.id)) {
        setErrorJefe(true);
        setErrorJefeMessage('Este profesor ya es jefe de otra sección');
        setSnackbarMessage('Este profesor ya es jefe de otra sección');
        setSnackbarOpen(true);
        return;
      }

      setErrorJefe(false);
      setErrorJefeMessage('');
      setJefe(profesor);
    } catch (error) {
      console.error("Error al verificar el jefe:", error);
      setSnackbarMessage("Error al verificar el jefe");
      setSnackbarOpen(true);
    }
  };
  const handleSelectAsistente = async (profesor) => {
    try {
      const estaAsignado = await verificarAsistenteSeccion(profesor.id);

      if (estaAsignado && (!seccionEditar || seccionEditar.asistente?.id !== profesor.id)) {
        setErrorAsistente(true);
        setErrorAsistenteMessage('Este profesor ya es asistente de otra sección');
        setSnackbarMessage('Este profesor ya es asistente de otra sección');
        setSnackbarOpen(true);
        return;
      }

      setErrorAsistente(false);
      setErrorAsistenteMessage('');
      setAsistente(profesor);
    } catch (error) {
      console.error("Error al verificar el asistente:", error);
      setSnackbarMessage("Error al verificar el asistente");
      setSnackbarOpen(true);
    }
  };
  const handleSelectDepartamento = (depto) => {
    setDepartamento(depto);
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
        const existe = await verificarSeccionEnBD(inputValue);
        if (existe && (!seccionEditar || seccionEditar.codigo !== inputValue)) {
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

    // Add http:// if no protocol is specified
    if (inputValue && !inputValue.match(/^https?:\/\//)) {
      inputValue = 'https://' + inputValue;
    }

    setDireccionWeb(inputValue);

    const webRegex = /^(https?:\/\/)?([\w\-]+(\.[\w\-]+)+)(\/[^\s]*)?$/;
    setErrorDireccion(!webRegex.test(inputValue));
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
        <Box sx={{ padding: '20px', textAlign: 'left' }}>
          <Typography variant="h4" sx={{ mb: '50px', color: '#191D23' }}>
            {seccionEditar ? "Editar sección" : "Registrar nueva sección"}
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
            maxWidth: 950,
          }}
        >
          <InputField
            label="Código"
            value={codigo}
            onChange={handleChangeCodigo}
            required
            error={errorCodigo || errores.codigo}
            helperText={errores.codigo ? erroresMensaje.codigo : (errorCodigo ? 'El campo no puede estar vacío y debe ser menor a 10 caracteres' : "")}
            sx={{ marginBottom: 2 }}
            mr="50%"
            inputProps={{ style: { height: '40px' } }}
          />
          <InputField
            label="Nombre"
            value={nombre}
            onChange={handleChangeNombre}
            required
            error={errorNombre || errores.nombre}
            helperText={errores.nombre ? erroresMensaje.nombre : (errorNombre ? 'El campo no puede estar vacío y debe ser menor a 100 caracteres' : "")}
            sx={{ marginBottom: 2 }}
            mr="50%"
            inputProps={{ style: { height: '40px' } }}
          />


          {/* Campo de Jefe con botón de búsqueda */}
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <Typography sx={{
              marginRight: '20px',
              lineHeight: '40px',
            }}>
              Coordinador de Sección
            </Typography>
            <Typography sx={{
              color: 'red',
              marginRight: 8,
              lineHeight: '40px',
            }}// Alinea verticalmente con el TextField
            >
              *
            </Typography>
            <TextField
              value={jefe ? `${jefe.nombres} ${jefe.apellidos}`.trim() : ''}
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
          {/* Campo de Departamento con botón de búsqueda */}
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <Typography sx={{
              marginRight: 0.5,
              lineHeight: '40px',
            }}>
              Departamento
            </Typography>
            <Typography sx={{
              color: 'red',
              marginRight: '150px',
              lineHeight: '40px',
            }}// Alinea verticalmente con el TextField
            >
              *
            </Typography>
            <TextField
              value={departamento ? `${departamento.codigo} - ${departamento.nombre}` : ''}
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
              onClick={() => setModalDepartamentoOpen(true)}
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
          {/* Asistente field */}
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <Typography sx={{
              marginRight: '10px',
              lineHeight: '40px',
            }}>
              Asistente de Sección
            </Typography>
            <Typography sx={{
              color: 'red',
              marginRight: '95px',
              lineHeight: '40px',
            }}>
              *
            </Typography>
            <TextField
              value={asistente ? `${asistente.nombres} ${asistente.apellidos}`.trim() : ''}
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
              onClick={() => setModalAsistenteOpen(true)}
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
            requirederror={errorTelefono}
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
            onChange={(e) => { handleChangeDireccion(e) }}
            error={errorDireccion}
            helperText={errorDireccion ? "El campo no puede estar vacio y debe ser una direccion web válida" : ""}
            type="url"
            sx={{ marginBottom: 2 }}
            inputProps={{ style: { height: '40px' } }}
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
      <ModalSeleccionJefe
        open={modalJefeOpen}
        onClose={() => setModalJefeOpen(false)}
        onSelect={handleSelectJefe}
      />
      {/* Modal seleccion assitente */}
      <ModalSeleccionAsistente
        open={modalAsistenteOpen}
        onClose={() => setModalAsistenteOpen(false)}
        onSelect={handleSelectAsistente}
      />
      <ModalSeleccionDepartamento
        open={modalDepartamentoOpen}
        onClose={() => setModalDepartamentoOpen(false)}
        onSelect={handleSelectDepartamento}
      />

      {/* Modal de confirmación */}
      <EstaSeguroAccion
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        texto={`¿Está seguro de ${seccionEditar ? "editar" : "guardar"} la sección?`}
        handleAceptar={async () => {
          await handleClickInsertarSeccion();
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

export default NuevoSeccion;
