"use client";
import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, InputAdornment } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SearchIcon from '@mui/icons-material/Search';
import TablaDepartamentos from '../../../../../componentesAdministrador/gestionDepartamento/TablaDepartamentos';
import BarraBusqueda from '../../../../../componentesAdministrador/BarraBusqueda';
import Link from 'next/link';
import { usePersona } from '@/app/PersonaContext';
import Papa from 'papaparse';
import axios from 'axios';

export default function GestionDepartamento() {
  const { departamento, setDepartamento } = usePersona();
  const fileInputRef = useRef(null);
  const [departamentos, setDepartamentos] = useState([]); // Estado para almacenar los departamentos
  const [filteredDepartamentos, setFilteredDepartamentos] = useState([]); // Estado para departamentos filtrados
  const [page, setPage] = useState(0); // Página actual
  const [rowsPerPage, setRowsPerPage] = useState(5); // Número de filas por página
  const [totalDepartamentos, setTotalDepartamentos] = useState(0); // Total de departamentos después de filtrar
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    cargarDepartamentos();
  }, [page, rowsPerPage]);

  const cargarDepartamentos = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/institucion/departamento/listar`);
      setDepartamentos(response.data);
      setFilteredDepartamentos(response.data);
      //setTotalDepartamentos(response.data.totalElements);
    } catch (error) {
      console.error('Error al cargar departamentos:', error);
    }
  };

  const handleBuscarDepartamento = async (busqueda) => {
    if (busqueda.trim() !== "") {
      const resultadosFiltrados = departamentos.filter((departamento) =>
        departamento.codigo?.toLowerCase().includes(busqueda.toLowerCase()) ||
        departamento.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        departamento.correoContacto?.toLowerCase().includes(busqueda.toLowerCase())
      );
      setFilteredDepartamentos(resultadosFiltrados);
    } else {
      await cargarDepartamentos();
      setFilteredDepartamentos(departamentos);
    }
  };

  const handleSearch = (event) => {
    const busqueda = event.target.value.toLowerCase(); // Convertir la búsqueda a minúsculas
    setSearchTerm(busqueda);

    // Filtrar las preguntas frecuentes
    const resultadosFiltrados = departamentos.filter((departamento) =>
      departamento.nombre?.toLowerCase().includes(busqueda) || 
      departamento.codigo?.toLowerCase().includes(busqueda) ||
      departamento.correoContacto?.toLowerCase().includes(busqueda) ||
      departamento.telefonoContacto?.includes(busqueda)
    );
    setFilteredDepartamentos(resultadosFiltrados);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
const limpiarDepartamento = () => {
    setDepartamento({
      codigo: '',
      nombre: '',
      telefonoContacto: '',
      correoContacto: '',
      direccionWeb: '',
      jefe : null,
    });
  };
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          const nuevosDepartamentos = results.data
            .map(row => ({
              nombre: row.nombre,
              apellidoPaterno: row.apellidoPaterno,
              apellidoMaterno: row.apellidoMaterno,
              tipo: row.tipo,
              email: row.email
            }))
            .filter(departamento => departamento.nombre && departamento.apellidoPaterno && departamento.cuenta.departamento && departamento.cuenta.contrasenia);

          if (nuevosDepartamentos.length > 0) {
            try {
              const response = await axios.post('http://localhost:8080/institucion/departamento/insertarCSV', nuevosDepartamentos, {
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              await cargarDepartamentos(); // Recargar los departamentos después de insertar
              setTotalDepartamentos(prevTotal => prevTotal + nuevosDepartamentos.length);
            } catch (error) {
              console.error('Error al realizar la solicitud:', error.message);
            }
          } else {
            console.error('No se encontraron departamentos válidos para insertar.');
          }
        },
        error: (error) => {
          console.error('Error al analizar el archivo:', error);
        }
      });
    }
  };

  const eliminarDepartamento = async (codigo, id) => {
    try {
      await axios.delete(`http://localhost:8080/institucion/departamento/eliminar/${id}`);
      const nuevoTotal = totalDepartamentos - 1;
      setTotalDepartamentos(nuevoTotal);

      // Verificar si la página actual excede el total de páginas
      const totalPages = Math.ceil(nuevoTotal / rowsPerPage);
      if (page >= totalPages && totalPages > 0) {
        setPage(totalPages - 1);
      }

      await cargarDepartamentos(); // Recargar los departamentos después de eliminar
    } catch (error) {
      console.error("Error al eliminar el departamento:", error);
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
          Gestión de Departamentos
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
            href="./nuevoDepartamento"
            variant="contained"
            color="primary"
            onClick={limpiarDepartamento}
            sx={{ ml: 2, display: 'flex', alignItems: 'center', height: '40px', backgroundColor: '#363581' }}
          >
            Añadir
            <AddCircleOutlineIcon sx={{ ml: 1, color: 'white', width: '20px', height: '20px' }} />
          </Button>
        </Box>

        <TablaDepartamentos
          departamentos={filteredDepartamentos}
          eliminarDepartamento={eliminarDepartamento}
        />
      </Box>
    </Box>
  );
}