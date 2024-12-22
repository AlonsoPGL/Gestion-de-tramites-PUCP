"use client";
import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, Button } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TablaEspecialidades from '../../../../componentesAdministrador/gestionEspecialidad/TablaEspecialidades';
import BarraBusqueda from '../../../../componentesAdministrador/BarraBusqueda';
import Link from 'next/link';
import { usePersona } from '@/app/PersonaContext';
import Papa from 'papaparse';
import axios from 'axios';

export default function GestionEspecialidad() {
  const { especialidad } = usePersona();
  const fileInputRef = useRef(null);
  const [especialidades, setEspecialidades] = useState([]); // Estado para almacenar los semestres
  const [filteredEspecialidades, setFilteredEspecialidades] = useState([]); // Estado para semestres filtrados

  useEffect(() => {
    const cargarEspecialidades = async () => {
      try {
        const response = await axios.get('http://localhost:8080/institucion/especialidad/listar');
        console.log("Datos obtenidos:", response.data); 
        setEspecialidades(response.data);
        setFilteredEspecialidades(response.data); // Inicialmente, mostrar todos los semestres
      } catch (error) {
        console.error('Error al cargar especialidades:', error);
      }
    };
    cargarEspecialidades();
  }, []);

  const handleBuscarEspecialidad = (busqueda) => {
    const resultadosFiltrados = especialidades.filter((especialidad) => 
      especialidad.nombre?.toLowerCase().includes(busqueda.toLowerCase())  
    );
    setFilteredEspecialidades(resultadosFiltrados);
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
          // Filtra las especialidades vacías
          const nuevasEspecialidades = results.data
            .map(row => ({
              codigo: row.codigo,
              nombre: row.nombre,
              telefonoContacto: row.telefonoContacto, 
              correoContacto: row.correoContacto,
              direccionWeb: row.direccionWeb,
              tipo: 'ESPECIALIDAD',
              activo: true
            }))
            .filter(especialidad => especialidad.nombre); 
          
            // Verificar los datos antes de enviarlos
          console.log('Datos a enviar al servidor:', nuevasEspecialidades);
  
          if (nuevasEspecialidades.length > 0) {
            try {
              const response = await axios.post('http://localhost:8080/institucion/especialidad/insertarCSV', nuevosSemestres, {
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              setEspecialidades(prevEspecialidades => [...prevEspecialidades, ...nuevasEspecialidades]);
              setFilteredEspecialidades(prevEspecialidades => [...prevEspecialidades, ...nuevasEspecialidades]);
              console.log('Especialidades insertados:', response.data);
            } catch (error) {
              if (error.response) {
                console.error('Error en la respuesta del servidor:', error.response.data);
                console.error('Código de estado:', error.response.status);
              } else {
                console.error('Error al realizar la solicitud:', error.message);
              }
            }
          } else {
            console.error('No se encontraron especialidades válidas para insertar.');
          }
        },
        error: (error) => {
          console.error('Error al analizar el archivo:', error);
        }
      });
    }
  };

  // Función para eliminar un semestre
  const eliminarEspecialidad = async (codigo,id) => {
    try {
      await axios.delete(`http://localhost:8080/institucion/especialidad/eliminar/${id}`); // Cambia la URL según tu configuración
      // Actualiza la lista de especialidades
      setEspecialidades((prevEspecialidades) => prevEspecialidades.filter(especialidad => especialidad.codigo !== codigo)); 
      setFilteredEspecialidades((prevFiltered) => prevFiltered.filter(especialidad => especialidad.codigo !== codigo));
      console.log(`Especialidad con código ${codigo} eliminada exitosamente.`);
    } catch (error) {
      console.error("Error al eliminar la especialidad:", error);
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

        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <BarraBusqueda onSearch={handleBuscarEspecialidad} /> {/* Pasar setSearchTerm como prop */}
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
            //href="./gestionEspecialidad/nuevaEspecialidad"
            href="./gestionEspecialidad/nuevaEspecialidad?mode=add"
            variant="contained"
            color="primary"
            sx={{ ml: 2, display: 'flex', alignItems: 'center', height: '40px', backgroundColor: '#363581' }}
          >
            Añadir
            <AddCircleOutlineIcon sx={{ ml: 1, color: 'white', borderRadius: '50%', backgroundColor: '#363581', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
          </Button>
        </Box>

        {/* Tabla de Especialidades, pasando las facultades filtradas y la función eliminarEspecialidad*/}
        <TablaEspecialidades especialidades={filteredEspecialidades} eliminarEspecialidad={eliminarEspecialidad} />
      </Box>
    </Box>
  );
}
