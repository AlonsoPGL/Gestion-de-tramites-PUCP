"use client";
import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, Button, Pagination,TextField, InputAdornment  } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import Link from 'next/link';
import axios from 'axios';
import TablaConvocatoriasPostulante from 'componentesPostulante/TablaConvocatoriasPostulante';
import { useConvocatoria } from '@/app/convocatoriaContext';
import BarraBusqueda from 'componentesAdministrador/BarraBusqueda';

function ListadoDeConvocatorias() {
    const [convocatorias, setConvocatorias] = useState([]); // Estado para almacenar los usuarios
    const [filteredConvocatorias, setFilteredConvocatorias] = useState([]); // Estado para usuarios filtrados
    const { setConvocatoria } = useConvocatoria();
    const [page, setPage] = useState(0); // Página actual
    const [rowsPerPage, setRowsPerPage] = useState(5); // Número de filas por página
    const [totalConvocatorias, setTotalConvocatorias] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    cargarConvocatorias();
  }, [page, rowsPerPage]);

  const cargarConvocatorias = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/procesoDeSeleccion/listar?page=0&size=1000`);
      setConvocatorias(response.data.content);
      setFilteredConvocatorias(response.data.content);
      setTotalConvocatorias(response.data.totalElements);
    } catch (error) {
      console.error('Error cargando las convocatorias:', error);
    }
  };

  const limpiarconvocatoriaContext = async () => {
    localStorage.removeItem('selectedConvocatoria');
    localStorage.removeItem('editarConvocatoria');
    setConvocatoria('');
  }


  const handleBuscarConvocatoria = async (busqueda) => {
    if (busqueda.trim() !== "") {

      const resultadosFiltrados = convocatorias.filter((convocatoria) =>
        convocatoria.puesto?.toLowerCase().includes(busqueda.toLowerCase())
      );
      setFilteredConvocatorias(resultadosFiltrados);

    } else {
      await cargarConvocatorias();
      // Si la búsqueda está vacía, recargar los usuarios desde la API
      setFilteredConvocatorias(convocatorias); // Asegurarte de que filteredconvocatorias sea igual a convocatorias
    }
  };

  const handleSearch = (event) => {
    const busqueda = event.target.value.toLowerCase(); // Convertir la búsqueda a minúsculas
    setSearchTerm(busqueda);

    // Filtrar las preguntas frecuentes
    const resultadosFiltrados = convocatorias.filter((convocatoria) =>
      convocatoria.puesto?.toLowerCase().includes(busqueda) 
    );
    setFilteredConvocatorias(resultadosFiltrados);
  };

    return(
        <>
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
                    Lista de Convocatorias
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
                </Box>

                <TablaConvocatoriasPostulante
                    convocatorias={filteredConvocatorias || []}
                    />
              </Box>
        </>
    );
}

export default ListadoDeConvocatorias;

