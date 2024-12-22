import React, {useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Pagination } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import EstaSeguroAccion from '../../componentesGenerales/modales/EstaSeguroAccion';
import { useEspecialidad } from '../../src/app/EspecialidadContext';


const rowsPerPage = 5; 

const TablaEspecialidads = ({ especialidads, eliminarEspecialidad }) => {
  const { setEspecialidad } = useEspecialidad();
  const [modalOpen, setModalOpen] = useState(false);
  const [especialidadAEliminar, setEspecialidadAEliminar] = useState(null);
  const [page, setPage] = useState(1); // Página actual (empezamos desde 1)

  const router = useRouter();

  // Maneja el cambio de página en el componente de paginación
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const especialidadesPaginadas = Array.isArray(especialidads) 
        ? especialidads.slice((page - 1) * rowsPerPage, page * rowsPerPage)
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

  const editarEspecialidad = (especialidad) => {
    setEspecialidad(especialidad);
    //console.log("Especialidad seleccionado:", especialidad);
    router.push('/administrador/gestionEspecialidad/nuevoEspecialidad');
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

  const handleOpenModal = async (especialidad) => {
    setEspecialidadAEliminar(especialidad);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEspecialidadAEliminar(null);
  };

  const confirmEliminarEspecialidad = async () => {
    try {
      if (especialidadAEliminar) {
        await eliminarEspecialidad(especialidadAEliminar.codigo, especialidadAEliminar.id);
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error al eliminar especialidad:", error);
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
          {especialidadesPaginadas.map((especialidad, index) => (
            <TableRow key={especialidad.id} sx={{ backgroundColor: '#F8F9FA' }}>
              <TableCell  align='center'>{especialidad.codigo}</TableCell>
              <TableCell  align='center'>{especialidad.nombre}</TableCell>
              <TableCell  align='center'>{especialidad.telefonoContacto}</TableCell>
              <TableCell  align='center'>{especialidad.correoContacto}</TableCell>
              <TableCell  align='center'>
                <a
                  href={especialidad.direccionWeb}
                  onClick={(e) => handleLinkClick(e, especialidad.direccionWeb)}
                  style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {especialidad.direccionWeb}
                </a>
              </TableCell>

              <TableCell align='center'>
                <EditIcon
                  sx={{ fontSize: 25, cursor: 'pointer', marginRight: '10px', color: '#363581' }}
                  onClick={() => editarEspecialidad(especialidad)}
                />
                <DeleteIcon
                  sx={{ fontSize: 25, cursor: 'pointer', color: '#363581' }}
                  onClick={() => handleOpenModal(especialidad)} // Cambia 'especialidad.id' por 'especialidad.codigo'
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer >
    {/* Paginador debajo de la tabla */}
    <Box display="flex" justifyContent="end" mt={2}>
      <Pagination
        count={Math.ceil(especialidads.length / rowsPerPage)} // Número total de páginas
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
      texto={`¿Está seguro de eliminar la especialidad?`}
      handleAceptar={async () => {
        await confirmEliminarEspecialidad();
        setModalOpen(false);
      }}
    />
    </>
  );
}
export default TablaEspecialidads;
