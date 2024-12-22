"use client"; 
import { useEffect, useState } from 'react';
import { Box, Typography } from "@mui/material";
import TablaAlumnosEnRiesgo from '../../../../componentesDocente/TablaAlumnosEnRiesgo';
import { usePersona } from '@/app/PersonaContext';
import BarraBusqueda from "../../../../componentesAdministrador/BarraBusqueda";
import axios from "axios";

export default function GestionAlumno() {
  const { persona } = usePersona();
  const [alumnosEnRiesgo, setAlumnosEnRiesgo] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const cargarAlumnosEnRiesgo = async () => {
      console.log('Docente encontrado:', persona); // Debugging
      const response = await axios.get(`http://localhost:8080/rrhh/alumno/listarAlumnoEnRiesgoxDocente/${persona.id}`);
      setAlumnosEnRiesgo(response.data);
      console.log('AlumnosEnRiesgo fetched:', response.data); // Debugging
      //setFilteredAlumnos(response.data); // Inicialmente, mostrar todos los alumnos
    };

    cargarAlumnosEnRiesgo();
  }, []);

  // Function to handle search input changes
  const handleSearch = (term) => {
    setSearchTerm(term); // Actualiza el estado con el valor de búsqueda
  };

  // Filter students based on the search term
  const filteredAlumnosEnRiesgo = alumnosEnRiesgo.filter((aluxhor) =>
    aluxhor.alumno.nombre?.toLowerCase().includes(searchTerm.toLowerCase())||
    aluxhor.alumno.apellidoPaterno?.toLowerCase().includes(searchTerm.toLowerCase())||
    aluxhor.alumno.apellidoMaterno?.toLowerCase().includes(searchTerm.toLowerCase())||
    aluxhor.alumno.email?.toLowerCase().includes(searchTerm.toLowerCase())||
    String(aluxhor.alumno.codigo)?.toLowerCase().includes(searchTerm.toLowerCase())||
    aluxhor.horario.codigoCurso?.toLowerCase().includes(searchTerm.toLowerCase())||
    aluxhor.horario.nombreCurso?.toLowerCase().includes(searchTerm.toLowerCase())||
    aluxhor.horario.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  return (
    <Box sx={{ backgroundColor: 'white', height: '100vh'}}>
      <Box
        sx={{
          marginLeft: '220px',
          height: '100vh',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h4" sx={{ color: 'black', mb: '20px'}}>
          Información de Alumnos en Riesgo
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: '20px' }}>
          <Box sx={{ mb: "10px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <BarraBusqueda onSearch={handleSearch}/>
          </Box>
        </Box>

        {/* Tabla de Alumnos en Riesgo, pasando el valor de búsqueda y el id del docente */}
        <TablaAlumnosEnRiesgo
          alumnosEnRiesgo={filteredAlumnosEnRiesgo}
        />
      </Box>
    </Box>
  );
}
