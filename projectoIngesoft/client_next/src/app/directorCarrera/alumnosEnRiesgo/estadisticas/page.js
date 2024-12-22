"use client";
import { useState, useEffect } from 'react';
import { Box, Typography, Switch } from "@mui/material";
import axios from 'axios';
import TablaRendimientos from '../../../../../componentesDirectorDeCarrera/TablaRendimientos';
import BarraBusqueda from "../../../../../componentesAdministrador/BarraBusqueda";

export default function EstudiantesRendimientoPage() {
  const [informacionFull, setInformacionFull] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [soloCalificados, setSoloCalificados] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Nuevo estado para controlar la carga

  useEffect(() => {
    const cargarInformacionFull = async () => {
     
      try {
        setIsLoading(true); // Iniciar la carga
        console.log('Listando la informacion de la matriz de estadisticas de rendimiento de alumnos en riesgo');
        const response = await axios.get('http://localhost:8080/solicitudes/infoAlumnosEnRiesgo/listarInformacionFull');
        setInformacionFull(response.data);
        console.log('Informacion Full fetched:', response.data);
      } catch (error) {
        console.error("Error al obtener la información completa:", error);
      } finally {
        setIsLoading(false); // Finalizar la carga independientemente del resultado
      }
    };

    cargarInformacionFull();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Filtrar la información basada en los criterios
  const informacionFiltrada = informacionFull.filter(item => {
    const { alumno, horario } = item.alumnoEnRiesgoXHorarioDTO;
    const nombreCompleto = `${alumno.nombre} ${alumno.apellidoPaterno} ${alumno.apellidoMaterno}`.toLowerCase();
    const cursoCampos = `${horario.codigoCurso} ${horario.nombreCurso} ${horario.codigo}`.toLowerCase();
    const textoBusqueda = searchTerm.toLowerCase();
    const coincide = 
      alumno.codigo.toString().includes(textoBusqueda) ||
      nombreCompleto.includes(textoBusqueda) ||
      cursoCampos.includes(textoBusqueda);

    if (!coincide) {
      return false;
    }

    if (soloCalificados && item.puntajeRendimiento == null) {
      return false;
    }

    return true;
  });

  return (
    <Box sx={{ backgroundColor: 'white', height: '100vh' }}>
      <Box
        sx={{
          marginLeft: '220px',
          height: '100%',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h4" sx={{ mb: '20px', fontFamily: "system-ui", fontWeight: 'bold', color: 'black', marginBottom: '20px',}}>
          Rendimiento de Alumnos en Riesgo
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: '20px', gap: 2 }}>
          <BarraBusqueda onSearch={handleSearch} />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Switch checked={soloCalificados} onChange={(event) => setSoloCalificados(event.target.checked)} />
            <Typography variant='subtitle1'>Mostrar solo alumnos calificados</Typography>
          </Box>
        </Box>

        <TablaRendimientos data={informacionFiltrada} isLoading={isLoading} />
        
      </Box>
    </Box>
  );
}