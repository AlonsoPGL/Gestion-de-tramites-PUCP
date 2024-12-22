import React, { useState }  from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Pagination } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import EstaSeguroAccion from '../../componentesGenerales/modales/EstaSeguroAccion';
import { useSemestre } from '../../src/app/SemestreContext';
// import EstaSeguroAccion from '../../src/componentesGenerales/modales/EstaSeguroAccion';

const rowsPerPage = 5; 

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


const TablaSemestres = ({ semestres, eliminarSemestre }) => {
  const router = useRouter();
  const { setSemestre } = useSemestre();
  const [modalOpen, setModalOpen] = useState(false);
  const [semestreAEliminar, setSemestreAEliminar] = useState(null);
  const [page, setPage] = useState(1); // Página actual (empezamos desde 1)

  // // Verificar los datos que llegan
  // React.useEffect(() => {
  //   console.log('Semestres recibidos:', semestres);
  //   // Verificar IDs únicos
  //   const ids = semestres.map(s => s.idSemestre);
  //   const uniqueIds = new Set(ids);
  //   if (ids.length !== uniqueIds.size) {
  //     console.warn('¡Hay IDs duplicados en los semestres!');
  //   }
  // }, [semestres]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };
  
  const semestresPaginados = Array.isArray(semestres) 
        ? semestres.slice((page - 1) * rowsPerPage, page * rowsPerPage)
       : [];

  const estilosEncabezado = () => {
    return { color: 'white' ,fontWeight:'bold'};
  };
    
  const estilosIndice = () =>{
    return {'& .Mui-selected': {
      color: '#fafafa',        // Color del texto o número seleccionado
      backgroundColor: '#363581', // Color de fondo del botón seleccionado
    },};
  };

  const editarSemestre = (semestre) => {
    setSemestre(semestre);
    console.log("Semestre seleccionado:", semestre);
    router.push('/administrador/gestionSemestre/nuevoSemestre');
  }; 

  const handleOpenModal = async (semestre) => {
    setSemestreAEliminar(semestre);
    setModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setModalOpen(false);
    setSemestreAEliminar(null);
  };
  
  const confirmEliminarSemestre = async () => {
    try {
      if (semestreAEliminar) {
        await eliminarSemestre(semestreAEliminar.idSemestre);
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error al eliminar semestre:", error);
    }
  };
  

  return (
    <>
    <TableContainer component={Paper} sx={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', overflow: 'auto' }}>
      <Table sx={{ borderCollapse: 'collapse' }}>
        <TableHead>
          <TableRow> 
            <TableCell  align='center' sx={{ backgroundColor: '#363581', color: 'white' }}>Nombre</TableCell>
            <TableCell  align='center' sx={{ backgroundColor: '#363581', color: 'white' }}>Fecha Inicio</TableCell>
            <TableCell  align='center' sx={{ backgroundColor: '#363581', color: 'white' }}>Fecha Fin</TableCell>
            <TableCell  align='center' sx={{ backgroundColor: '#363581', color: 'white' }}>Acción</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {semestresPaginados.map((semestre, index) => (
            <TableRow key={semestre.idSemestre} sx={{ backgroundColor: '#F8F9FA' }}> 
              <TableCell  align='center'>{semestre.nombre}</TableCell>
              <TableCell  align='center'>{formatDate(semestre.fechaInicio)}</TableCell>
              <TableCell  align='center'>{formatDate(semestre.fechaFin)}</TableCell>

              <TableCell align='center'>
                <EditIcon
                  sx={{ fontSize: 25, cursor: 'pointer', marginRight: '10px', color: '#363581' }}
                  onClick={() => editarSemestre(semestre)}
                />
                <DeleteIcon
                  sx={{ fontSize: 25, cursor: 'pointer', color: '#363581' }}
                  onClick={() => handleOpenModal(semestre)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </TableContainer >
      <Box display="flex" justifyContent="end" mt={2}>
        <Pagination
          count={Math.ceil(semestres.length / rowsPerPage)} // Número total de páginas
          page={page}                                   // Página actual
          onChange={handleChangePage}                   // Manejador de cambio de página
          size='large'
          color='primary'
          sx={estilosIndice()}
        />
      </Box>     
    <EstaSeguroAccion
      open={modalOpen}
      onClose={handleCloseModal}
      texto={`¿Está seguro de eliminar el semestre?`}
      handleAceptar={async () => {
        await confirmEliminarSemestre();
        setModalOpen(false);
      }}
    />
    </>
  );

}
export default TablaSemestres;
