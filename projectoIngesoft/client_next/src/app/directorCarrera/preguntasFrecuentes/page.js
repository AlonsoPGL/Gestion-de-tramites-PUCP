"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePersona } from "@/app/PersonaContext";
import { Table,Button, Typography, TextField, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Box, InputAdornment   } from '@mui/material';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import SearchIcon from '@mui/icons-material/Search';
import TablaPreguntasFrecuentes from "componentesDirectorDeCarrera/TablaPreguntasFrecuentes";
import BarraBusqueda from "componentesDirectorDeCarrera/BarraBusqueda";
import axios from 'axios';

export default function PreguntasFrecuentes() {
  const { persona } = usePersona();
  const [preguntasFrecuentes, setPreguntasFrecuentes] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [filteredPreguntasFrecuentes, setFilteredPreguntasFrecuentes] = useState([]); // Inicializar como arreglo
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
      //setTotalPreguntasFrecuentes(response.data.totalElements);
    } catch (error) {
      console.error('Error al cargar preg frecuentes:', error);
    }
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
                <Link href="/directorCarrera/preguntasFrecuentes/gestionarPreguntaFrec" passHref>
                  <Button variant="contained" color="primary" style={{ height: '56px' }} endIcon={<ManageSearchIcon />}>
                    Gestionar Preguntas
                  </Button>
                </Link>  
            </Box>
        </Box>
        <Box sx={{ marginLeft: '20px', marginRight: '20px' }}>
            <TablaPreguntasFrecuentes preguntasFrecuentes={filteredPreguntasFrecuentes} />
        </Box>
      </Box>       
    </Box>
  );
}
