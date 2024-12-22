import React, { useState }  from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Pagination } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import { useSeccion } from '../../src/app/SeccionContext';
import EstaSeguroAccion from '../../componentesGenerales/modales/EstaSeguroAccion';


const rowsPerPage = 5; 

const TablaSeccions = ({ seccions, eliminarSeccion }) => {
  const router = useRouter();
  const { setSeccion } = useSeccion();
  const [modalOpen, setModalOpen] = useState(false);
  const [seccionAEliminar, setSeccionAEliminar] = useState(null);
  const [page, setPage] = useState(1); // Página actual (empezamos desde 1)

  const handleChangePage = (event, value) => {
    setPage(value);
  };
  
  const seccionesPaginadas = Array.isArray(seccions) 
        ? seccions.slice((page - 1) * rowsPerPage, page * rowsPerPage)
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

  const editarSeccion = (seccion) => {
    setSeccion(seccion);
    //console.log("Seccion seleccionado:", seccion);
    router.push('/administrador/gestionSeccion/nuevoSeccion');
  };
  const handleLinkClick = (e, url) => {
    // Verificar si la URL es válida y segura
    // if (!url.startsWith('http://') && !url.startsWith('https://')) {
    //   e.preventDefault(); // Prevenir la navegación por defecto
    //   alert('URL no válida o insegura');
    //   return;
    // }
  
    // Aquí puede agregar lógica adicional si es necesario
    console.log(`Abriendo enlace: ${url}`);
    // La navegación ocurrirá automáticamente gracias al href
  };

  const handleOpenModal = async (seccion) => {
    setSeccionAEliminar(seccion);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSeccionAEliminar(null);
  };

  const confirmEliminarSeccion = async () => {
    try {
      if (seccionAEliminar) {
        await eliminarSeccion(seccionAEliminar.codigo, seccionAEliminar.id);
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error al eliminar seccion:", error);
    }
  };

  return (
    <>
    <TableContainer component={Paper} sx={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', overflow: 'auto' }}>
      <Table sx={{ borderCollapse: 'collapse' }}>
        <TableHead>
          <TableRow>
            <TableCell  align='center' sx={{ backgroundColor: '#363581', color: 'white' }}>Código</TableCell>
            <TableCell  align='center' sx={{ backgroundColor: '#363581', color: 'white' }}>Nombre</TableCell>
            <TableCell  align='center' sx={{ backgroundColor: '#363581', color: 'white' }}>Teléfono</TableCell>
            <TableCell  align='center' sx={{ backgroundColor: '#363581', color: 'white' }}>Correo</TableCell>
            <TableCell  align='center' sx={{ backgroundColor: '#363581', color: 'white' }}>Link</TableCell>
            <TableCell  align='center' sx={{ backgroundColor: '#363581', color: 'white' }}>Acción</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {seccionesPaginadas.map((seccion, index) => (
            <TableRow key={seccion.codigo} sx={{ backgroundColor: '#F8F9FA' }}>
              <TableCell  align='center'>{seccion.codigo}</TableCell>
              <TableCell  align='center'>{seccion.nombre}</TableCell>
              <TableCell  align='center'>{seccion.telefonoContacto}</TableCell>
              <TableCell  align='center'>{seccion.correoContacto}</TableCell>
              <TableCell  align='center'>
                <a
                  href={seccion.direccionWeb}
                  onClick={(e) => handleLinkClick(e, seccion.direccionWeb)}
                  style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {seccion.direccionWeb}
                </a>
              </TableCell>

              <TableCell align='center'>
                <EditIcon
                  sx={{ fontSize: 25, cursor: 'pointer', marginRight: '10px', color: '#363581' }}
                  onClick={() => editarSeccion(seccion)}
                />
                <DeleteIcon
                  sx={{ fontSize: 25, cursor: 'pointer', color: '#363581' }}
                  onClick={() => handleOpenModal(seccion)} // Cambia 'seccion.id' por 'seccion.codigo'
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer >
    <Box display="flex" justifyContent="end" mt={2}>
      <Pagination
        count={Math.ceil(seccions.length / rowsPerPage)} // Número total de páginas
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
      texto={`¿Está seguro de eliminar la sección?`}
      handleAceptar={async () => {
        await confirmEliminarSeccion();
        setModalOpen(false);
      }}
    />
  </>
  );
}
export default TablaSeccions;