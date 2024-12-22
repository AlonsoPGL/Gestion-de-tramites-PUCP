"use client";
import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, Button } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TablaSemestres from '../../../../componentesAdministrador/gestionSemestre/TablaSemestre';
import BarraBusqueda from '../../../../componentesAdministrador/BarraBusqueda';
import Link from 'next/link';
import { usePersona } from '@/app/PersonaContext';
import Papa from 'papaparse';
import axios from 'axios';

export default function GestionSemestre() {
  const { semestre } = usePersona();
  const fileInputRef = useRef(null);
  const [semestres, setSemestres] = useState([]); // Estado para almacenar los semestres
  const [filteredSemestres, setFilteredSemestres] = useState([]); // Estado para semestres filtrados

  useEffect(() => {
    const cargarSemestres = async () => {
      const response = await axios.get('http://localhost:8080/institucion/semestre/listar');
      setSemestres(response.data);
      setFilteredSemestres(response.data); // Inicialmente, mostrar todos los semestres
    };

    cargarSemestres();
  }, []);

  const handleBuscarSemestre = (busqueda) => {
    const resultadosFiltrados = semestres.filter((semestre) => 
      semestre.nombre?.toLowerCase().includes(busqueda.toLowerCase())  
    );
    setFilteredSemestres(resultadosFiltrados);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          // Filtra los semestres vacíos
          const nuevosSemestres = results.data
            .map(row => ({
              nombre: row.nombre,
              apellidoPaterno: row.apellidoPaterno,
              apellidoMaterno: row.apellidoMaterno, 
              tipo: row.tipo,
              email: row.email
            }))
            .filter(semestre => semestre.nombre && semestre.apellidoPaterno && semestre.cuenta.semestre && semestre.cuenta.contrasenia); // Asegúrate de que los campos requeridos no estén vacíos
  
          // Verificar los datos antes de enviarlos
          console.log('Datos a enviar al servidor:', nuevosSemestres);
  
          if (nuevosSemestres.length > 0) {
            try {
              const response = await axios.post('http://localhost:8080/institucion/semestre/insertarCSV', nuevosSemestres, {
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              setSemestres(prevSemestres => [...prevSemestres, ...nuevosSemestres]);
              setFilteredSemestres(prevSemestres => [...prevSemestres, ...nuevosSemestres]);
              console.log('Semestres insertados:', response.data);
            } catch (error) {
              if (error.response) {
                console.error('Error en la respuesta del servidor:', error.response.data);
                console.error('Código de estado:', error.response.status);
              } else {
                console.error('Error al realizar la solicitud:', error.message);
              }
            }
          } else {
            console.error('No se encontraron semestres válidos para insertar.');
          }
        },
        error: (error) => {
          console.error('Error al analizar el archivo:', error);
        }
      });
    }
  };

  // Función para eliminar un semestre
  const eliminarSemestre = async (codigo,id) => {
    try {
      await axios.delete(`http://localhost:8080/institucion/semestre/eliminar/${id}`); // Cambia la URL según tu configuración
      // Actualiza la lista de semestres
      setSemestres((prevSemestres) => prevSemestres.filter(semestre => semestre.nombre !== nombre)); 
      console.log(`Semestre con código ${nombre} eliminado exitosamente.`);
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
          <Box sx={{ flexGrow: 1 }}>
            <BarraBusqueda onSearch={handleBuscarSemestre} /> {/* Pasar setSearchTerm como prop */}
          </Box>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          <Button
            variant="contained"
            color="primary"
            sx={{ ml: 2, display: 'flex', alignItems: 'center', height: '40px', backgroundColor: '#363581' }}
            onClick={handleUploadClick}
          >
            Subir
            <CloudUploadIcon sx={{ ml: 1, color: 'white', borderRadius: '50%', backgroundColor: '#363581', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
          </Button>

          <Button
            component={Link}
            href="./gestionSemestre/nuevoSemestre"
            variant="contained"
            color="primary"
            sx={{ ml: 2, display: 'flex', alignItems: 'center', height: '40px', backgroundColor: '#363581' }}
          >
            Añadir
            <AddCircleOutlineIcon sx={{ ml: 1, color: 'white', borderRadius: '50%', backgroundColor: '#363581', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
          </Button>
        </Box>

        {/* Tabla de Semestres, pasando los semestres filtrados y la función eliminarSemestre */}
        <TablaSemestres semestres={filteredSemestres} eliminarSemestre={eliminarSemestre} />
      </Box>
    </Box>
  );
}
