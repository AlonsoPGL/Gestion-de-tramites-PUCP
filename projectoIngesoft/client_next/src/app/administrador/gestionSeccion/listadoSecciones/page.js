"use client";
import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, Button, Pagination, TextField, InputAdornment } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SearchIcon from '@mui/icons-material/Search';
import TablaSeccions from '../../../../../componentesAdministrador/gestionSeccion/TablaSeccions';
import BarraBusqueda from '../../../../../componentesAdministrador/BarraBusqueda';
import Link from 'next/link';
import { usePersona } from '@/app/PersonaContext';
import Papa from 'papaparse';
import axios from 'axios';

export default function GestionSeccion() {
  const { seccion } = usePersona();
  const fileInputRef = useRef(null);
  const [seccions, setSeccions] = useState([]);
  const [filteredSeccions, setFilteredSeccions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalSeccions, setTotalSeccions] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    cargarSeccions();
  }, [page, rowsPerPage]);

  const cargarSeccions = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/institucion/seccion/listar`);
      setSeccions(response.data);
      setFilteredSeccions(response.data);
      //setTotalSeccions(response.data.totalElements);
    } catch (error) {
      console.error('Error al cargar secciones:', error);
    }
  };

  const handleBuscarSeccion = async (busqueda) => {
    if (busqueda.trim() !== "") {
      const resultadosFiltrados = seccions.filter((seccion) =>
        seccion.codigo?.toLowerCase().includes(busqueda.toLowerCase()) ||
        seccion.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        seccion.correoContacto?.toLowerCase().includes(busqueda.toLowerCase())
      );
      setFilteredSeccions(resultadosFiltrados);
    } else {
      await cargarSeccions();
      setFilteredSeccions(seccions);
    }
  };

  const handleSearch = (event) => {
    const busqueda = event.target.value.toLowerCase(); // Convertir la búsqueda a minúsculas
    setSearchTerm(busqueda);

    // Filtrar las preguntas frecuentes
    const resultadosFiltrados = seccions.filter((seccion) =>
      seccion.nombre?.toLowerCase().includes(busqueda) || 
      seccion.codigo?.toLowerCase().includes(busqueda) ||
      seccion.correoContacto?.toLowerCase().includes(busqueda) ||
      seccion.telefonoContacto?.includes(busqueda)
    );
    setFilteredSeccions(resultadosFiltrados);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const limpiarSeccion = () => {
    setSeccion({
      codigo: '',
      nombre: '',
      telefonoContacto: '',
      correoContacto: '',
      direccionWeb: '',
      jefe: null,
    });
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          const nuevosSeccions = results.data
            .map(row => ({
              nombre: row.nombre,
              apellidoPaterno: row.apellidoPaterno,
              apellidoMaterno: row.apellidoMaterno,
              cuenta: {
                seccion: row.seccion,
                contrasenia: row.contrasenia,
              },
              tipo: row.tipo,
              email: row.email
            }))
            .filter(seccion => seccion.nombre && seccion.apellidoPaterno && seccion.cuenta.seccion && seccion.cuenta.contrasenia);

          if (nuevosSeccions.length > 0) {
            try {
              const response = await axios.post('http://localhost:8080/institucion/seccion/insertarCSV', nuevosSeccions, {
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              await cargarSeccions();
              setTotalSeccions(prevTotal => prevTotal + nuevosSeccions.length);
            } catch (error) {
              console.error('Error al realizar la solicitud:', error.message);
            }
          } else {
            console.error('No se encontraron secciones válidas para insertar.');
          }
        },
        error: (error) => {
          console.error('Error al analizar el archivo:', error);
        }
      });
    }
  };

  const eliminarSeccion = async (codigo, id) => {
    try {
      await axios.delete(`http://localhost:8080/institucion/seccion/eliminar/${id}`);
      const nuevoTotal = totalSeccions - 1;
      setTotalSeccions(nuevoTotal);

      // Verificar si la página actual excede el total de páginas
      const totalPages = Math.ceil(nuevoTotal / rowsPerPage);
      if (page >= totalPages && totalPages > 0) {
        setPage(totalPages - 1);
      }

      await cargarSeccions();
    } catch (error) {
      console.error("Error al eliminar la sección:", error);
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
          Gestión de Secciones
        </Typography>

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
          />

          <Button
            component={Link}
            href="./nuevoSeccion"
            variant="contained"
            color="primary"
            onClick={limpiarSeccion}
            sx={{ ml: 2, display: 'flex', alignItems: 'center', height: '40px', backgroundColor: '#363581' }}
          >
            Añadir
            <AddCircleOutlineIcon sx={{ ml: 1, color: 'white', width: '20px', height: '20px' }} />
          </Button>
        </Box>

        <TablaSeccions
          seccions={filteredSeccions}
          eliminarSeccion={eliminarSeccion}
        />
      </Box>
    </Box>
  );
}