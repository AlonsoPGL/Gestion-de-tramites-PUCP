import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Pagination, Box } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { usePreguntaFrecuente } from 'src/app/PreguntaFrecuenteContext';
import { useRouter } from "next/navigation";

const rowsPerPage = 5; // Define la cantidad de filas por página

const formatDate = (dateString) => {
  const options = { 
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }
    return date.toLocaleDateString('es-ES', options);
  } catch (error) {
    return 'Fecha inválida';
  }
};


const TablaPreguntasFrecuentes = ({ preguntasFrecuentes = [] }) => {
  // Estado para manejar la paginación
  const [page, setPage] = useState(1); // Página actual (empezamos desde 1)

  const router = useRouter();

  // Maneja el cambio de página en el componente de paginación
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const { setPreguntaFrecuente } = usePreguntaFrecuente();

  const preguntasFrecuentesPaginadas = Array.isArray(preguntasFrecuentes) 
        ? preguntasFrecuentes.slice((page - 1) * rowsPerPage, page * rowsPerPage)
       : [];
  
  const sizeFont=10;

  const estilosEncabezado = () => {
    return { color: 'white' ,fontWeight:'bold'};
  };

  const estilosIndice = () =>{
    return {'& .Mui-selected': {
        color: '#fafafa',        // Color del texto o número seleccionado
        backgroundColor: '#363581', // Color de fondo del botón seleccionado
        },};
  };

  const verPreguntaFrecuente = (preguntaFrecuente) => {
    setPreguntaFrecuente(preguntaFrecuente);
    router.push('/directorCarrera/preguntasFrecuentes/visualizarPreguntaFrec');
  };

  return (
    <Box>
      <TableContainer component={Paper} sx={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', overflow: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          {/* Encabezado de la tabla */}
          <TableHead sx={{backgroundColor:'#363581'}}>
            <TableRow>
              <TableCell align='center' sx={estilosEncabezado()}>Pregunta</TableCell> {/*Si quiero agregar un tamaño definido debo de utilizar  sx={{fontSize:'10px'}} dentro de TableCell*/}
              <TableCell align='center' sx={estilosEncabezado()}>Fecha</TableCell>
              <TableCell align='center' sx={estilosEncabezado()}>Tema</TableCell>
              <TableCell align='center' sx={estilosEncabezado()}>Respuesta</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {preguntasFrecuentesPaginadas.map((preguntaFrecuente, index) => (
              <TableRow key={preguntaFrecuente.id}>
                {/* Muestra el número de página */}
                <TableCell align='center'>{preguntaFrecuente.pregunta}</TableCell>
                <TableCell align='center'>{formatDate(preguntaFrecuente.fechaRegistro)}</TableCell>
                <TableCell align='center'>{preguntaFrecuente.categoria || 'Sin categoría'}</TableCell>
                <TableCell align='center'>
                    <VisibilityIcon
                        sx={{ fontSize: 25, cursor: 'pointer', marginRight: '10px', color: '#363581' }}
                        onClick={() => verPreguntaFrecuente(preguntaFrecuente)}
                    />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Paginador debajo de la tabla */}
      <Box display="flex" justifyContent="end" mt={2}>
        <Pagination
          count={Math.ceil(preguntasFrecuentes.length / rowsPerPage)} // Número total de páginas
          page={page}                                   // Página actual
          onChange={handleChangePage}                   // Manejador de cambio de página
          size='large'
          color='primary'
          sx={estilosIndice()}
        />
      </Box>
    </Box>
  );
};

export default TablaPreguntasFrecuentes;