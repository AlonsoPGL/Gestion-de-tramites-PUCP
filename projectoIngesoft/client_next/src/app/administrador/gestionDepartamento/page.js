"use client";
import React, { useRef, useEffect, useState } from 'react';
import {  Box, Typography, Button } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TablaDepartamentos from '../../../../componentesAdministrador/gestionDepartamento/TablaDepartamentos';
import BarraBusqueda from '../../../../componentesAdministrador/BarraBusqueda';
import Link from 'next/link';
import { usePersona } from '@/app/PersonaContext';
import Papa from 'papaparse';
import axios from 'axios';

export default function GestionDepartamento() {
  const { departamento } = usePersona();
  const fileInputRef = useRef(null);
  const [departamentos, setDepartamentos] = useState([]); // Estado para almacenar los departamentos
  const [filteredDepartamentos, setFilteredDepartamentos] = useState([]); // Estado para departamentos filtrados

  useEffect(() => {
    const cargarDepartamentos = async () => {
      const response = await axios.get('http://localhost:8080/institucion/departamento/listar');
      setDepartamentos(response.data);
      setFilteredDepartamentos(response.data); // Inicialmente, mostrar todos los departamentos
    };

    cargarDepartamentos();
  }, []);

  const handleBuscarDepartamento = (busqueda) => {
    const resultadosFiltrados = departamentos.filter((departamento) =>
      departamento.codigo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      departamento.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      departamento.correoContacto?.toLowerCase().includes(busqueda.toLowerCase())
    );
    setFilteredDepartamentos(resultadosFiltrados);
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
          // Filtra los departamentos vacíos
          const nuevosDepartamentos = results.data
            .map(row => ({
              nombre: row.nombre,
              apellidoPaterno: row.apellidoPaterno,
              apellidoMaterno: row.apellidoMaterno, 
              tipo: row.tipo,
              email: row.email
            }))
            .filter(departamento => departamento.nombre && departamento.apellidoPaterno && departamento.cuenta.departamento && departamento.cuenta.contrasenia); // Asegúrate de que los campos requeridos no estén vacíos
  
          // Verificar los datos antes de enviarlos
          console.log('Datos a enviar al servidor:', nuevosDepartamentos);
  
          if (nuevosDepartamentos.length > 0) {
            try {
              const response = await axios.post('http://localhost:8080/institucion/departamento/insertarCSV', nuevosDepartamentos, {
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              setDepartamentos(prevDepartamentos => [...prevDepartamentos, ...nuevosDepartamentos]);
              setFilteredDepartamentos(prevDepartamentos => [...prevDepartamentos, ...nuevosDepartamentos]);
              console.log('Departamentos insertados:', response.data);
            } catch (error) {
              if (error.response) {
                console.error('Error en la respuesta del servidor:', error.response.data);
                console.error('Código de estado:', error.response.status);
              } else {
                console.error('Error al realizar la solicitud:', error.message);
              }
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

  // Función para eliminar un departamento
  const eliminarDepartamento = async (codigo,id) => {
    try {
      await axios.delete(`http://localhost:8080/institucion/departamento/eliminar/${id}`); // Cambia la URL según tu configuración
      // Actualiza la lista de departamentos
      setDepartamentos((prevDepartamentos) => prevDepartamentos.filter(departamento => departamento.codigo !== codigo));
      setFilteredDepartamentos((prevFiltered) => prevFiltered.filter(departamento => departamento.codigo !== codigo));
      console.log(`Departamento con código ${codigo} eliminado exitosamente.`);
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
          <Box sx={{ flexGrow: 1 }}>
            <BarraBusqueda onSearch={handleBuscarDepartamento} /> {/* Pasar setSearchTerm como prop */}
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
            href="./gestionDepartamento/nuevoDepartamento"
            variant="contained"
            color="primary"
            sx={{ ml: 2, display: 'flex', alignItems: 'center', height: '40px', backgroundColor: '#363581' }}
          >
            Añadir
            <AddCircleOutlineIcon sx={{ ml: 1, color: 'white', borderRadius: '50%', backgroundColor: '#363581', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
          </Button>
        </Box>

        {/* Tabla de Departamentos, pasando los departamentos filtrados y la función eliminarDepartamento */}
        <TablaDepartamentos departamentos={filteredDepartamentos} eliminarDepartamento={eliminarDepartamento} />
      </Box>
    </Box>
  );
}