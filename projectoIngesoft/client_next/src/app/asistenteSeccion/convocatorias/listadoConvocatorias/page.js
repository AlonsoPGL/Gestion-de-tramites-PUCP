"use client";
import { useEffect, useState } from 'react';
import { Box, Typography, Button, Pagination, PaginationItem } from "@mui/material";
import TablaConvocatorias from '../../../../../componentesAsistenteSeccion/convocatorias/TablaConvocatorias';
import BarraBusqueda from '../../../../../componentesAdministrador/BarraBusqueda';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Link from 'next/link';
import { useConvocatoria } from '../../../convocatoriaContext';
import axios from 'axios';


export default function listadoConvocatorias() {
  const [convocatorias, setConvocatorias] = useState([]); // Estado para almacenar los usuarios
  const [filteredConvocatorias, setFilteredConvocatorias] = useState([]); // Estado para usuarios filtrados
  const { setConvocatoria } = useConvocatoria();
  const [page, setPage] = useState(0); // Página actual
  const [rowsPerPage, setRowsPerPage] = useState(5); // Número de filas por página
  const [totalConvocatorias, setTotalConvocatorias] = useState(0);

  useEffect(() => {
    cargarConvocatorias();
  }, [page, rowsPerPage]);

  const cargarConvocatorias = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/procesoDeSeleccion/listar?page=${page}&size=${rowsPerPage}`);
      setConvocatorias(response.data.content);
      setFilteredConvocatorias(response.data.content);
      setTotalConvocatorias(response.data.totalElements);
    } catch (error) {
      console.error('Error cargando las convocatorias:', error);
    }
  };

  const limpiarconvocatoriaContext = async () => {
    localStorage.removeItem('selectedConvocatoria');
    localStorage.removeItem('editarConvocatoria');
    setConvocatoria('');
  }


  const handleBuscarConvocatoria = async (busqueda) => {
    if (busqueda.trim() !== "") {

      const resultadosFiltrados = convocatorias.filter((convocatoria) =>
        convocatoria.puesto?.toLowerCase().includes(busqueda.toLowerCase())
      );
      setFilteredConvocatorias(resultadosFiltrados);

    } else {
      await cargarConvocatorias();
      // Si la búsqueda está vacía, recargar los usuarios desde la API
      setFilteredConvocatorias(convocatorias); // Asegurarte de que filteredconvocatorias sea igual a convocatorias
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
          Listado de Convocatorias
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <BarraBusqueda onSearch={handleBuscarConvocatoria} />
          </Box>

          <Button
            component={Link}
            href="./nuevaConvocatoria"
            variant="contained"
            color="primary"
            onClick={limpiarconvocatoriaContext}
            sx={{ ml: 2, display: 'flex', alignItems: 'center', height: '40px', backgroundColor: '#363581' }}
          >
            Añadir
            <AddCircleOutlineIcon sx={{ ml: 1, color: 'white', width: '20px', height: '20px' }} />
          </Button>

        </Box>

        <TablaConvocatorias
          convocatorias={filteredConvocatorias || []}
        />
        <Box>
          <Pagination
            count={Math.ceil(totalConvocatorias / rowsPerPage)}
            page={page + 1}
            onChange={(event, value) => setPage(value - 1)}
            size="large"
            color="primary"
            sx={{ 
              mt: 3,
              '& .MuiPaginationItem-root': {
                borderRadius: '50%',
                color: '#363581',
                margin: '0px',
                width: '35px', // Ancho del círculo
                height: '35px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center', // Centrar el texto dentro del círculo
                '&:hover': {
                  backgroundColor: '#f0f0f0', // Hover color
                },
                '&.Mui-selected': {
                  backgroundColor: '#363581',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#303f9f',
                  },
                },
              },
              ul: { justifyContent: 'right' },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
