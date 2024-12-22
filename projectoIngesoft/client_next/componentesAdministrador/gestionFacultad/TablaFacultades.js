import React, { useState }  from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Pagination,Typography} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import EstaSeguroAccion from '../../componentesGenerales/modales/EstaSeguroAccion';
import { useFacultad } from '../../src/app/FacultadContext';


const rowsPerPage = 5; 

const TablaFacultades = ({ facultades , eliminarFacultad }) => {
  const { setFacultad } = useFacultad();
  const [modalOpen, setModalOpen] = useState(false);
  const [facultadAEliminar, setFacultadAEliminar] = useState(null);
  const [page, setPage] = useState(1); // Página actual (empezamos desde 1)
  const router = useRouter();

  // Maneja el cambio de página en el componente de paginación
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const facultadesPaginadas = Array.isArray(facultades) 
        ? facultades.slice((page - 1) * rowsPerPage, page * rowsPerPage)
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

  const editarFacultad = (facultad) => {
    setFacultad(facultad);
    console.log("Facultad seleccionado:", facultad);
    router.push('/administrador/gestionFacultad/nuevoFacultad?mode=edit');
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

  const handleOpenModal = async (facultad) => {
    setFacultadAEliminar(facultad);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setFacultadAEliminar(null);
  };

  const confirmEliminarFacultad = async () => {
    try {
      if (facultadAEliminar) {
        await eliminarFacultad(facultadAEliminar.codigo, facultadAEliminar.id);
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error al eliminar facultad:", error);
    }
  };
      // Si no hay facultades o el array está vacío
  // Solo mostramos el mensaje si facultades es explícitamente un array vacío
  if (Array.isArray(facultades) && facultades.length === 0) {
    return (
      <Box className="w-full p-8 text-center bg-white rounded-lg shadow">
        <Typography 
          className="text-xl text-gray-600"
        >
          No hay facultades para listar
        </Typography>
      </Box>
    );
  }
  return (
    <>
    <TableContainer component={Paper} sx={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', overflow: 'auto'}}>
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
        {/* quiero colocar el orden inverso */}

        <TableBody >
          {facultadesPaginadas.map((facultad, index) => (
            <TableRow  key={facultad.id} sx={{ backgroundColor: '#F8F9FA' } }>
              <TableCell  align='center'>{facultad.codigo}</TableCell>
              <TableCell  align='center'>{facultad.nombre}</TableCell>
              <TableCell  align='center'>{facultad.telefonoContacto}</TableCell>
              <TableCell  align='center'>{facultad.correoContacto}</TableCell>
              <TableCell  align='center'>
                <a
                  href={facultad.direccionWeb}
                  onClick={(e) => handleLinkClick(e, facultad.direccionWeb)}
                  style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {facultad.direccionWeb}
                </a>
              </TableCell>

              <TableCell align='center'>
                <EditIcon
                  sx={{ fontSize: 25, cursor: 'pointer', marginRight: '10px', color: '#363581' }}
                  onClick={() => editarFacultad(facultad)}
                />
                <DeleteIcon
                  sx={{ fontSize: 25, cursor: 'pointer', color: '#363581' }}
                  onClick={() => handleOpenModal(facultad)}
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
        count={Math.ceil(facultades.length / rowsPerPage)} // Número total de páginas
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
      texto={`¿Está seguro de eliminar la facultad?`}
      handleAceptar={async () => {
        await confirmEliminarFacultad();
        setModalOpen(false);
      }}
    />
    </>
  );
}

export default TablaFacultades;