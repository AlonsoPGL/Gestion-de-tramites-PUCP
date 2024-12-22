"use client";
import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, Button } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TablaFacultades from '../../../../componentesAdministrador/gestionFacultad/TablaFacultades';
import BarraBusqueda from '../../../../componentesAdministrador/BarraBusqueda';
import Link from 'next/link';
import { usePersona } from '@/app/PersonaContext';
import Papa from 'papaparse';
import axios from 'axios';

export default function GestionFacultad() {
  const { facultad } = usePersona();
  const fileInputRef = useRef(null);
  const [facultades, setFacultades] = useState([]); 
  const [filteredFacultades, setFilteredFacultades] = useState([]); 
  
  useEffect(() => {
    const cargarFacultades = async () => {
      try {
        const response = await axios.get('http://localhost:8080/institucion/facultad/listar');
        console.log("Datos obtenidos:", response.data); 
        setFacultades(response.data);
        setFilteredFacultades(response.data); // Inicialmente, mostrar todos los semestres
      } catch (error) {
        console.error('Error al cargar facultades:', error);
      }
    };
    cargarFacultades();
  }, []);

  const handleBuscarFacultad = (busqueda) => {
    const resultadosFiltrados = facultades.filter((facultad) => 
      facultad.nombre?.toLowerCase().includes(busqueda.toLowerCase())  
    );
    setFilteredFacultades(resultadosFiltrados);
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
          // Filtra las facultades vacíos
          const nuevasFacultades = results.data
            .map(row => ({
              codigo: row.codigo,
              nombre: row.nombre,
              telefonoContacto: row.telefonoContacto, 
              correoContacto: row.correoContacto,
              direccionWeb: row.direccionWeb,
              tipo: 'FACULTAD',
              activo: true
            }))
            .filter(facultad => facultad.nombre); // Asegúrate de que los campos requeridos no estén vacíos
  
          // Verificar los datos antes de enviarlos
          console.log('Datos a enviar al servidor:', nuevasFacultades);
  
          if (nuevasFacultades.length > 0) {
            try {
              const response = await axios.post('http://localhost:8080/institucion/facultad/insertarCSV', nuevasFacultades, {
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              setFacultades(prevFacultades => [...prevFacultades, ...nuevasFacultades]);
              setFilteredFacultades(prevFacultades => [...prevFacultades, ...nuevasFacultades]);
              console.log('Facultades insertadas:', response.data);
            } catch (error) {
              if (error.response) {
                console.error('Error en la respuesta del servidor:', error.response.data);
                console.error('Código de estado:', error.response.status);
              } else {
                console.error('Error al realizar la solicitud:', error.message);
              }
            }
          } else {
            console.error('No se encontraron facultades válidas para insertar.');
          }
        },
        error: (error) => {
          console.error('Error al analizar el archivo:', error);
        }
      });
    }
  };

  // Función para eliminar un semestre
  const eliminarFacultad = async (codigo,id) => {
    try {
      await axios.delete(`http://localhost:8080/institucion/facultad/eliminar/${id}`); // Cambia la URL según tu configuración
      // Actualiza la lista de facultades
      setFacultades((prevFacultades) => prevFacultades.filter(facultad => facultad.codigo !== codigo)); 
      setFilteredFacultades((prevFiltered) => prevFiltered.filter(facultad => facultad.codigo !== codigo));
      console.log(`Facultad con código ${codigo} eliminada exitosamente.`);
    } catch (error) {
      console.error("Error al eliminar la facultad:", error);
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
          Gestión de Facultades
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <BarraBusqueda onSearch={handleBuscarFacultad} /> {/* Pasar setSearchTerm como prop */}
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
            //href="./gestionFacultad/nuevaFacultad"
            href="./gestionFacultad/nuevaFacultad?mode=add"
            variant="contained"
            color="primary"
            sx={{ ml: 2, display: 'flex', alignItems: 'center', height: '40px', backgroundColor: '#363581' }}
          >
            Añadir
            <AddCircleOutlineIcon sx={{ ml: 1, color: 'white', borderRadius: '50%', backgroundColor: '#363581', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
          </Button>
        </Box>

        {/* Tabla de Facultades, pasando las facultades filtradas y la función eliminarFacultad */}
        <TablaFacultades facultades={filteredFacultades} eliminarFacultad={eliminarFacultad} />
      </Box>
    </Box>
  );
}
