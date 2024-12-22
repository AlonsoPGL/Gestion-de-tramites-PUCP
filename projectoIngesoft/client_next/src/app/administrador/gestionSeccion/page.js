"use client";
import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, Button } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TablaSeccions from '../../../../componentesAdministrador/gestionSeccion/TablaSeccions';
import BarraBusqueda from '../../../../componentesAdministrador/BarraBusqueda';
import Link from 'next/link';
import { usePersona } from '@/app/PersonaContext';
import Papa from 'papaparse';
import axios from 'axios';

export default function GestionSeccion() {
  const { seccion } = usePersona();
  const fileInputRef = useRef(null);
  const [seccions, setSeccions] = useState([]); // Estado para almacenar los seccions
  const [filteredSeccions, setFilteredSeccions] = useState([]); // Estado para seccions filtrados

  useEffect(() => {
    const cargarSeccions = async () => {
      const response = await axios.get('http://localhost:8080/institucion/seccion/listar');
      setSeccions(response.data);
      setFilteredSeccions(response.data); // Inicialmente, mostrar todos los seccions
    };

    cargarSeccions();
  }, []);

  const handleBuscarSeccion = (busqueda) => {
    const resultadosFiltrados = seccions.filter((seccion) =>
      seccion.codigo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      seccion.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      seccion.correoContacto?.toLowerCase().includes(busqueda.toLowerCase())
    );
    setFilteredSeccions(resultadosFiltrados);
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
          // Filtra los seccions vacíos
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
            .filter(seccion => seccion.nombre && seccion.apellidoPaterno && seccion.cuenta.seccion && seccion.cuenta.contrasenia); // Asegúrate de que los campos requeridos no estén vacíos
  
          // Verificar los datos antes de enviarlos
          console.log('Datos a enviar al servidor:', nuevosSeccions);
  
          if (nuevosSeccions.length > 0) {
            try {
              const response = await axios.post('http://localhost:8080/institucion/seccion/insertarCSV', nuevosSeccions, {
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              setSeccions(prevSeccions => [...prevSeccions, ...nuevosSeccions]);
              setFilteredSeccions(prevSeccions => [...prevSeccions, ...nuevosSeccions]);
              console.log('Seccions insertados:', response.data);
            } catch (error) {
              if (error.response) {
                console.error('Error en la respuesta del servidor:', error.response.data);
                console.error('Código de estado:', error.response.status);
              } else {
                console.error('Error al realizar la solicitud:', error.message);
              }
            }
          } else {
            console.error('No se encontraron seccions válidos para insertar.');
          }
        },
        error: (error) => {
          console.error('Error al analizar el archivo:', error);
        }
      });
    }
  };

  // Función para eliminar un seccion
  const eliminarSeccion = async (codigo,id) => {
    try {
      await axios.delete(`http://localhost:8080/institucion/seccion/eliminar/${id}`); // Cambia la URL según tu configuración
      // Actualiza la lista de seccions
      setSeccions((prevSeccions) => prevSeccions.filter(seccion => seccion.codigo !== codigo));
      setFilteredSeccions((prevFiltered) => prevFiltered.filter(seccion => seccion.codigo !== codigo));
      console.log(`Seccion con código ${codigo} eliminado exitosamente.`);
    } catch (error) {
      console.error("Error al eliminar el seccion:", error);
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
          Gestión de Seccions
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <BarraBusqueda onSearch={handleBuscarSeccion} /> {/* Pasar setSearchTerm como prop */}
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
            href="./gestionSeccion/nuevoSeccion"
            variant="contained"
            color="primary"
            sx={{ ml: 2, display: 'flex', alignItems: 'center', height: '40px', backgroundColor: '#363581' }}
          >
            Añadir
            <AddCircleOutlineIcon sx={{ ml: 1, color: 'white', borderRadius: '50%', backgroundColor: '#363581', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
          </Button>
        </Box>

        {/* Tabla de Seccions, pasando los seccions filtrados y la función eliminarSeccion */}
        <TablaSeccions seccions={filteredSeccions} eliminarSeccion={eliminarSeccion} />
      </Box>
    </Box>
  );
}
