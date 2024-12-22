import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Pagination, Box } from '@mui/material'; 
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import EstaSeguroAccion from 'componentesGenerales/modales/EstaSeguroAccion';
import { usePreguntaFrecuente } from 'src/app/PreguntaFrecuenteContext';

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

const TablaPreguntasFrecuentesGest = ({ preguntasFrecuentes, elimina }) => {
  // Estado para manejar la paginación
  const [page, setPage] = useState(1); // Página actual (empezamos desde 1)

  // Maneja el cambio de página en el componente de paginación
  const handleChangePage = (event, value) => {
    setPage(value);
  };
  const { setPreguntaFrecuente } = usePreguntaFrecuente();
  
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  // Filtrar los cursos a mostrar por página
  const preguntasFrecuentesPaginadas = preguntasFrecuentes.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const [preguntaFrecAEliminar, setPreguntaFrecAEliminar] = useState(null);
  
  const sizeFont=10;

  const estilosEncabezado = () => {
    return { color: 'white' ,fontWeight:'bold'};
  };

  const estilosIndice = () =>{
    return {'& .Mui-selected': {
        color: '#fafafa',        // Color del texto o número seleccionado
        backgroundColor: '#363581', // Color de fondo del botón seleccionado
        },};
  }
  
  const handleOpenModal = async (preguntaFrecuente) => {
    setPreguntaFrecAEliminar(preguntaFrecuente);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setPreguntaFrecAEliminar(null);
  };

  const confirmEliminarPreguntaFrecuente = async () => {
    try {
      if (preguntaFrecAEliminar) {
        await elimina(preguntaFrecAEliminar.id);
        handleCloseModal();
      }
    } catch (error) {
        console.error("Error al eliminar facultad:", error);
    }
  };

  const editarPreguntaFrec = (preguntaFrecuente) => {
    setPreguntaFrecuente(preguntaFrecuente);    
    router.push('/directorCarrera/preguntasFrecuentes/revisarPreguntaFrec');
  };

  return (
    <>
    <Box>
      <TableContainer component={Paper} sx={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', overflow: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{backgroundColor:'#363581'}}>
            <TableRow>
              <TableCell align='center' sx={estilosEncabezado()}>Pregunta</TableCell> {/*Si quiero agregar un tamaño definido debo de utilizar  sx={{fontSize:'10px'}} dentro de TableCell*/}
              <TableCell align='center' sx={estilosEncabezado()}>Fecha</TableCell>
              <TableCell align='center' sx={estilosEncabezado()}>Tema</TableCell>
              <TableCell align='center' sx={estilosEncabezado()}>Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {preguntasFrecuentesPaginadas.map((preguntaFrecuente, index) => (
              <TableRow key={preguntaFrecuente.id}>
                <TableCell align='center'>{preguntaFrecuente.pregunta}</TableCell>
                <TableCell align='center'>{formatDate(preguntaFrecuente.fechaRegistro)}</TableCell>
                <TableCell align='center'>{preguntaFrecuente.categoria || 'Sin categoría'}</TableCell>
                <TableCell align='center'>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <EditIcon
                      sx={{ fontSize: 25, cursor: 'pointer', color: '#363581' }}
                      onClick={() => editarPreguntaFrec(preguntaFrecuente)}
                    />
                    <DeleteIcon
                      sx={{ fontSize: 25, cursor: 'pointer', color: '#363581' }}
                      onClick={() => handleOpenModal(preguntaFrecuente)}
                    />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
    <EstaSeguroAccion
        open={modalOpen}
        onClose={handleCloseModal}
        texto={`¿Está seguro de eliminar la pregunta?`}
        handleAceptar={async () => {
        await confirmEliminarPreguntaFrecuente();
        setModalOpen(false);
        }}
    />
    </>    
  );
};

export default TablaPreguntasFrecuentesGest;