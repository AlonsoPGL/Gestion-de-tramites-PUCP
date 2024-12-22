"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePersona } from "@/app/PersonaContext";
import { Button, Typography, Box, TextField } from '@mui/material';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import TablaPreguntasFrecuentes from "componentesAlumno/TablaPreguntasFrecuentes";
import BarraBusqueda from '../../../../componentesAdministrador/BarraBusqueda';
import axios from 'axios';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';


export default function PreguntasFrecuentes() {
  const { preguntaFrecuente } = usePersona();
  const [preguntasFrecuentes, setPreguntasFrecuentes] = useState([]);
  const [filteredAlumnos, setFilteredAlumnos] = useState([]); // Estado para alumnos filtrados
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [totalPreguntasFrecuentes, setTotalPreguntasFrecuentes] = useState(0);
  const [filteredPreguntasFrecuentes, setFilteredPreguntasFrecuentes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
 
  const handleSearch = (event) => {
    const busqueda = event.target.value.toLowerCase(); // Convertir la búsqueda a minúsculas
    setSearchTerm(busqueda);

    // Filtrar las preguntas frecuentes
    const resultadosFiltrados = preguntasFrecuentes.filter((preguntaFrecuente) =>
      preguntaFrecuente.pregunta?.toLowerCase().includes(busqueda) // Cambia "nombre" al campo correcto en tu objeto
    );
    setFilteredPreguntasFrecuentes(resultadosFiltrados);
  };

  useEffect(() => {
    cargarPreguntasFrecuentes();
  }, [page, rowsPerPage]);

    const cargarPreguntasFrecuentes = async () => {
      try {
        const response = await axios.get('http://localhost:8080/preguntas/preguntasFrecuentes/listar');
        console.log("Datos obtenidos:", response.data); 
        setPreguntasFrecuentes(response.data);
        setFilteredPreguntasFrecuentes(response.data); // Inicialmente, mostrar todos los semestres
        setTotalPreguntasFrecuentes(response.data.totalElements);
      } catch (error) {
        console.error('Error al cargar preg frecuentes:', error);
      }
    };
  
  const handleBuscarPregunta = (busqueda) => {
    const resultadosFiltrados = preguntasFrecuentes.filter((preguntaFrecuente) => 
      preguntaFrecuente.pregunta?.toLowerCase().includes(busqueda.toLowerCase())  
    );
    setFilteredPreguntasFrecuentes(resultadosFiltrados);
  };

  return (
    <Box sx={{ backgroundColor: 'white', height: '100vh', padding: '20px' }}>
      <Box
        sx={{
          marginLeft: '220px',
          height: '100vh',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="body2" align="center" gutterBottom
        sx={{
          fontSize: '1.25rem', // Aumenta el tamaño de la fuente (puedes ajustar según sea necesario)
          fontWeight: 'bold',  // Aplica negrita al texto
        }}>
          GURU-PUCP
        </Typography>
        <Box sx={{ marginLeft: '1000px', marginRight: '20px', display: 'flex' }}>
          <Typography variant="body2" align="right" gutterBottom>
            ¿No encuentras tu respuesta?
          </Typography>
        </Box>
        <Box sx={{ marginLeft: '20px', marginRight: '20px', display: 'flex' }}>
            <Box sx={{ flexGrow: 1,  mr: 2 }}>
                <TextField
                    placeholder="Buscar pregunta..."
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
                    height: '56px', // Altura total del TextField
                    minWidth: '150px',
                    display: 'flex',
                    alignItems: 'center', // Alineación vertical del contenido interno
                    }}}
                />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignSelf: 'stretch'  }}>
                <Link href="/alumno/preguntasFrecuentes/registrarPreguntaFrec" passHref>
                  <Button variant="contained" color="primary" style={{ height: '56px' }} endIcon={<ManageSearchIcon/>}>
                  Preguntar Ahora
                  </Button>
                </Link>  
            </Box>
        </Box>
        <Box sx={{ marginLeft: '20px', marginRight: '20px' }}>
            <TablaPreguntasFrecuentes preguntasFrecuentes={filteredPreguntasFrecuentes}/>
        </Box>
      </Box>       
    </Box>
  );
}
