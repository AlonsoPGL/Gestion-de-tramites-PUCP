"use client";
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, InputAdornment  } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TablaSemestres from '../../../../../componentesAdministrador/gestionSemestre/TablaSemestre'; 
import BarraBusqueda from '../../../../../componentesAdministrador/BarraBusqueda';
import Link from 'next/link';
import { useSemestre } from '../../../SemestreContext';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';

export default function GestionSemestre() {
  const [semestres, setSemestres] = useState([]); 
  const [filteredSemestres, setFilteredSemestres] = useState([]); 
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalSemestres, setTotalSemestres] = useState(0);
  const { setSemestre } = useSemestre();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    cargarSemestres();
  }, [page, rowsPerPage]);
  
  const cargarSemestres = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/institucion/semestre/listar`);
      setSemestres(response.data);
      setFilteredSemestres(response.data);
      //setTotalSemestres(response.data.totalElements);
    } catch (error) {
      console.error("Error al cargar los semestres:", error);
    }
  };

  const limpiarSemestreContext = () => {
    setSemestre('');
  }

  const handleBuscarSemestre = async (busqueda) => {
    if (busqueda.trim() !== "") {
      const resultadosFiltrados = semestres.filter((semestre) =>
        semestre.nombre?.toLowerCase().includes(busqueda.toLowerCase())
      );
      setFilteredSemestres(resultadosFiltrados);
    } else {
      await cargarSemestres();
      setFilteredSemestres(semestres);
    }
  };

  const handleSearch = (event) => {
    const busqueda = event.target.value.toLowerCase(); // Convertir la búsqueda a minúsculas
    setSearchTerm(busqueda);

    // Filtrar las preguntas frecuentes
    const resultadosFiltrados = semestres.filter((semestre) =>
      semestre.nombre?.toLowerCase().includes(busqueda) 
    );
    setFilteredSemestres(resultadosFiltrados);
  };

  const eliminarSemestre = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/institucion/semestre/eliminar/${id}`);
      setSemestres((prevSemestres) => prevSemestres.filter(semestre => semestre.idSemestre !== id));
      setFilteredSemestres((prevFiltered) => prevFiltered.filter(semestre => semestre.idSemestre !== id));
      
      const nuevoTotal = totalSemestres - 1;
      setTotalSemestres(nuevoTotal);

      const totalPages = Math.ceil(nuevoTotal / rowsPerPage);
      if (page >= totalPages && totalPages > 0) {
        setPage(totalPages - 1);
      }
    } catch (error) {
      console.error("Error al eliminar el semestre:", error);
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
          Gestión de Semestres
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

          <Button
            component={Link}
            href="./nuevoSemestre"
            variant="contained"
            color="primary"
            onClick={limpiarSemestreContext}
            sx={{ ml: 2, display: 'flex', alignItems: 'center', height: '40px', backgroundColor: '#363581' }}
          >
            Añadir
            <AddCircleOutlineIcon sx={{ ml: 1, color: 'white', width: '20px', height: '20px' }} />
          </Button>
        </Box>

        <TablaSemestres 
          semestres={filteredSemestres} 
          eliminarSemestre={eliminarSemestre} 
        />
      </Box>
    </Box>
  );
}

