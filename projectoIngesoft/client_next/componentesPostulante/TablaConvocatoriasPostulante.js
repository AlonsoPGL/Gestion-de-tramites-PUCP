import React, { useState ,useEffect} from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Pagination,Typography, Box } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import { Visibility } from '@mui/icons-material';
import { useConvocatoria } from '@/app/convocatoriaContext';
import Link from 'next/link';

const rowsPerPage = 5; 

export default function TablaConvocatoriasPostulante({ convocatorias }) {
  const router = useRouter();
  const [page, setPage] = useState(1); // Página actual (empezamos desde 1)
  const { setConvocatoria } = useConvocatoria();

  const formatDate = (dateString) => {
    const date = new Date(dateString);  // Crea un objeto Date a partir de la fecha ISO
    return date.toLocaleDateString('es-ES');  // Convierte la fecha al formato español (día/mes/año)
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };
  useEffect(() => {
    setPage(1); // Reiniciar a la primera página cuando cambie el término de búsqueda
  }, [convocatorias]);
  const convocatoriasPaginadas = Array.isArray(convocatorias) 
        ? convocatorias.slice((page - 1) * rowsPerPage, page * rowsPerPage)
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

  const detalleConvocatoria = (convocatoria) => {
    setConvocatoria(convocatoria);
    router.push('/postulante/postulacion/convocatorias/detalleConvocatoria');
  };

  const funcionSeleccionar = (convocatoria) => {
        const handleClick = () => {
            setConvocatoria(convocatoria);
            router.push(`/postulante/postulacion/nuevaSolicitud?id=${convocatoria.id}`);
        };
    
        return (
        <Typography
            sx={{
            color: 'blue',
            textDecoration: 'underline',
            cursor: 'pointer',
            }}
            onClick={handleClick}
        >
            POSTULAR
        </Typography>
        );
    }

  return (
    <>
    <TableContainer component={Paper} sx={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', overflow: 'auto' }}>
      <Table sx={{ borderCollapse: 'collapse' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center' }}>Nombre</TableCell>
            <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center' }}>Fecha Inicio</TableCell>
            <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center' }}>Fecha Fin</TableCell>
            <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center' }}>Acción</TableCell>
            <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center' }}></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {convocatoriasPaginadas.map((convocatoria, index) => (
            <TableRow key={convocatoria.id} sx={{ backgroundColor: '#F8F9FA' }}>
              <TableCell align='left'>{convocatoria.puesto}</TableCell>
              <TableCell align='center'>{formatDate(convocatoria.fechaInicio)}</TableCell>
              <TableCell align='center'>{formatDate(convocatoria.fechaFin)}</TableCell>
              <TableCell align='center'>

                <IconButton aria-label="visualizar" onClick={() => detalleConvocatoria(convocatoria)}>
                  <Visibility color="primary" />
                </IconButton>
              </TableCell>
              <TableCell align='center'>
                 {funcionSeleccionar(convocatoria)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Box display="flex" justifyContent="end" mt={2}>
      <Pagination
        count={Math.ceil(convocatorias.length / rowsPerPage)} // Número total de páginas
        page={page}                                   // Página actual
        onChange={handleChangePage}                   // Manejador de cambio de página
        size='large'
        color='primary'
        sx={estilosIndice()}
      />
    </Box>
    </>
  );
}
