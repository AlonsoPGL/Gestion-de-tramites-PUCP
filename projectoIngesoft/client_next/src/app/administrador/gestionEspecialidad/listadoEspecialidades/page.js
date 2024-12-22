"use client";
import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, InputAdornment  } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TablaEspecialidades from '../../../../../componentesAdministrador/gestionEspecialidad/TablaEspecialidades';
import BarraBusqueda from '../../../../../componentesAdministrador/BarraBusqueda';
import Link from 'next/link';
import SearchIcon from '@mui/icons-material/Search';
import { usePersona } from '@/app/PersonaContext';
import Papa from 'papaparse';
import axios from 'axios';
import ModalSuperior from 'componentesGenerales/modales/ModalSuperior';

export default function GestionEspecialidad() {
  const [isSubirVisible, setIsSubirVisible] = useState(true); // Estado para controlar la visibilidad
  const [especialidad, setEspecialidad] = useState(null);
  const fileInputRef = useRef(null);
  const [confirmacionOpen, setConfirmacionOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [especialidads, setEspecialidads] = useState([]);
  const [filteredEspecialidads, setFilteredEspecialidads] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalEspecialidads, setTotalEspecialidads] = useState(0);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    cargarEspecialidads();
  }, [page, rowsPerPage]);

  const cargarEspecialidads = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/institucion/especialidad/listar`);
      if (response.data) {
        setEspecialidads(response.data);
        setFilteredEspecialidads(response.data);
        //setTotalEspecialidads(response.data.totalElements);
      } 
    } catch (error) {
      console.error('Error al cargar especialidades:', error);
      setError('Error al cargar las especialidades');
    }
  };

  const handleBuscarEspecialidad = async (busqueda) => {
    if (busqueda.trim() !== "") {
      const resultadosFiltrados = especialidads.filter((especialidad) =>
        especialidad.codigo?.toLowerCase().includes(busqueda.toLowerCase()) ||
        especialidad.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        especialidad.correoContacto?.toLowerCase().includes(busqueda.toLowerCase())
      );
      setFilteredEspecialidads(resultadosFiltrados);
    } else {
      await cargarEspecialidads();
    }
  };

  const handleSearch = (event) => {
    const busqueda = event.target.value.toLowerCase(); // Convertir la búsqueda a minúsculas
    setSearchTerm(busqueda);

    // Filtrar las preguntas frecuentes
    const resultadosFiltrados = especialidads.filter((especialidad) =>
      especialidad.nombre?.toLowerCase().includes(busqueda) || 
      especialidad.codigo?.toLowerCase().includes(busqueda) ||
      especialidad.correoContacto?.toLowerCase().includes(busqueda) ||
      especialidad.telefonoContacto?.includes(busqueda)
    );
    setFilteredEspecialidads(resultadosFiltrados);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const limpiarEspecialidad = () => {
    setEspecialidad({
      codigo: '',
      nombre: '',
      telefonoContacto: '',
      correoContacto: '',
      direccionWeb: '',
      coordinador: null,
      asistenteDeCarrera : null,
      facultad: null
    });
  };
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
    setErrorCodigo(false);
    setErrorNombre(false);
    setErrorCoordinador(false);
    setErrorCoordinadorMessage('');
    setErrorAsistente(false);
    setErrorAsistenteMessage('');
    setErrorTelefono(false);
    setErrorCorreo(false);
    setErrorDireccion(false);
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
        const nuevosEspecialidads = results.data
          .map(row => ({
            nombre: row.nombre,
            codigo: row.codigo,
            telefonoContacto: row.telefonoContacto || '',
            correoContacto: row.correoContacto || '',
            direccionWeb: row.direccionWeb || '',
            coordinador: row.coordinador_nombre ? {
              nombre: row.coordinador_nombre,
              codigo: row.coordinador_codigo
            } : null,
            asistenteDeCarrera : row.asistenteDeCarrera_nombre ? {
              nombre: row.asistenteDeCarrera_nombre,
              codigo: row.asistenteDeCarrera_codigo
            } : null,
            facultad: row.facultad_codigo ? {
              nombre: row.facultad_nombre,
              codigo: row.facultad_codigo
            } : null
          }))
          .filter(especialidad => especialidad.nombre && especialidad.codigo);

        if (nuevosEspecialidads.length > 0) {
          try {
            const response = await axios.post('http://localhost:8080/institucion/especialidad/insertarCSV', nuevosEspecialidads, {
              headers: {
                'Content-Type': 'application/json',
              },
            });
            await cargarEspecialidads();
          } catch (error) {
            console.error('Error al realizar la solicitud:', error.message);
            setError('Error al subir las especialidades');
          }
        } else {
          console.error('No se encontraron especialidades válidas para insertar.');
          setError('No se encontraron especialidades válidas en el archivo');
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

  const eliminarEspecialidad = async (codigo, id) => {
    try {
      await axios.delete(`http://localhost:8080/institucion/especialidad/eliminar/${id}`);
      const nuevoTotal = totalEspecialidads - 1;
      setTotalEspecialidads(nuevoTotal);

      const totalPages = Math.ceil(nuevoTotal / rowsPerPage);
      if (page >= totalPages && totalPages > 0) {
        setPage(totalPages - 1);
      }

      await cargarEspecialidads();
    } catch (error) {
      console.error("Error al eliminar la especialidad:", error);
      setError('Error al eliminar la especialidad');
    }
  };

  return (
    <Box sx={{ backgroundColor: 'white', height: '100vh' }}>
      <Box
        sx={{
          marginLeft: '220px',
          height: '100vh',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h4" sx={{ mb: '20px', color: '#191D23' }}>
          Gestión de Especialidades
        </Typography>

        {error && (
          <Box sx={{ mb: 2, p: 2, bgcolor: '#ffebee', color: '#c62828', borderRadius: 1 }}>
            {error}
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
        <Box sx={{ flexGrow: 1,  mr: 2 }}>
                <TextField
                    placeholder="Buscar..."
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={handleSearch}
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon/>
                        </InputAdornment>
                        ),
                    }}
                 style={{width: '100%', marginBottom: '20px' }}
                 sx={{
                    '& .MuiOutlinedInput-root': {
                    height: '40px', // Altura total del TextField
                    minWidth: '150px',
                    display: 'flex',
                    alignItems: 'center', // Alineación vertical del contenido interno
                    }}}
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
            component={Link}
            href="./nuevoEspecialidad"
            variant="contained"
            color="primary"
            onClick={limpiarFormulario}
            sx={{ ml: 2, display: 'flex', alignItems: 'center', height: '40px', backgroundColor: '#363581' }}
          >
            Añadir
            <AddCircleOutlineIcon sx={{ ml: 1, color: 'white', width: '20px', height: '20px' }} />
          </Button>
        </Box>

        <TablaEspecialidades
          especialidads={filteredEspecialidads || []}
          eliminarEspecialidad={eliminarEspecialidad}
        />
        <ModalSuperior
          open={confirmacionOpen}
          handleClose={() => {
            setConfirmacionOpen(false);
            setSelectedFile(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
            setError('');
          }}
          title="¿Está seguro de insertar el CSV de especialidades?"
          onConfirm={confirmarSubidaCSV}
        />
      </Box>
    </Box>
  );
}