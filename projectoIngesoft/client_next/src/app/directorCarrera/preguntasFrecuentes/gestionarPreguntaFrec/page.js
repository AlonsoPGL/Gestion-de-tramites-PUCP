"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePersona } from "@/app/PersonaContext";
import { Table,Button, Typography, TextField, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Box, InputAdornment   } from '@mui/material';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import SearchIcon from '@mui/icons-material/Search';
import TablaPreguntasFrecuentesGest from "componentesDirectorDeCarrera/TablaPreguntasFrecuentesGest";
import BarraBusqueda from "componentesAdministrador/BarraBusqueda";
import axios from 'axios';
import PreguntaFrec from "@/app/alumno/preguntasFrecuentes/visualizarPreguntaFrec/page";

export default function PreguntasFrecuentes() {
  const { persona } = usePersona();
  const [preguntasFrecuentes, setPreguntasFrecuentes] = useState([]);
  //const [filteredAlumnos, setFilteredAlumnos] = useState([]); // Estado para alumnos filtrados
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [totalPreguntasFrec, setTotalPreguntasFrec] = useState(0);
  const [filteredPreguntasFrecuentes, setFilteredPreguntasFrecuentes] = useState([]);
 

  // Function to handle search input changes
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
    cargarPreguntasFrecuentesGest();
  }, [page, rowsPerPage]);

  const cargarPreguntasFrecuentesGest = async () => {
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


  // Función para eliminar pregunta frec
  const elimina = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/preguntas/preguntasFrecuentes/eliminar/${id}`); // Cambia la URL según tu configuración
      // Actualiza la lista de facultades
      setPreguntasFrecuentes((prevPreguntaFrec) => prevPreguntaFrec.filter(preguntasFrecuentes => preguntasFrecuentes.id !== id)); 
      setFilteredPreguntasFrecuentes((prevFiltered) => prevFiltered.filter(preguntasFrecuentes => preguntasFrecuentes.id !== id));
      //console.log(`Pregunta con código ${codigo} eliminada exitosamente.`);
    
      const nuevoTotal = totalPreguntasFrec - 1;
      setTotalPreguntasFrec(nuevoTotal);
      
      const totalPages = Math.ceil(nuevoTotal / rowsPerPage);
      if (page >= totalPages && totalPages > 0) {
        setPage(totalPages - 1);
      }
    } catch (error) {
      console.error("Error al eliminar la pregunta:", error);
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
                <Link href="/directorCarrera/preguntasFrecuentes" passHref>
                  <Button variant="contained" color="primary" style={{ height: '56px' }} endIcon={<ManageSearchIcon />}>
                    Vista de alumno
                  </Button>
                </Link>  
            </Box>
        </Box>
        <Box sx={{ marginLeft: '20px', marginRight: '20px' }}>
            <TablaPreguntasFrecuentesGest preguntasFrecuentes={filteredPreguntasFrecuentes} elimina={elimina}/>
        </Box>
      </Box>       
    </Box>
  );
}
