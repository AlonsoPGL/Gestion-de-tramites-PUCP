import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Pagination } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import EstaSeguroAccion from '../../componentesGenerales/modales/EstaSeguroAccion';
import { useDepartamento } from '../../src/app/DepartamentoContext';


const rowsPerPage = 5; 

const TablaDepartamentos = ({ departamentos, eliminarDepartamento }) =>{
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const { setDepartamento } = useDepartamento();
  const [departamentoAEliminar, setDepartamentoAEliminar] = useState(null);
  const [page, setPage] = useState(1); // Página actual (empezamos desde 1)

  const handleChangePage = (event, value) => {
    setPage(value);
  };
  
  const departamentosPaginados = Array.isArray(departamentos) 
        ? departamentos.slice((page - 1) * rowsPerPage, page * rowsPerPage)
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

  const editarDepartamento = (departamento) => {
    setDepartamento(departamento);
    //console.log("Departamento seleccionado:", departamento);
    router.push('/administrador/gestionDepartamento/nuevoDepartamento');
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

  const handleOpenModal = async (departamento) => {
    setDepartamentoAEliminar(departamento);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setDepartamentoAEliminar(null);
  };

  const confirmEliminarDepartamento = async () => {
    try {
      if (departamentoAEliminar) {
        await eliminarDepartamento(departamentoAEliminar.codigo, departamentoAEliminar.id);
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error al eliminar departamento:", error);
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
          {departamentosPaginados.map((departamento, index) => (
            <TableRow key={departamento.codigo} sx={{ backgroundColor: '#F8F9FA' }}>
              <TableCell  align='center'>{departamento.codigo}</TableCell>
              <TableCell  align='center'>{departamento.nombre}</TableCell>
              <TableCell  align='center'>{departamento.telefonoContacto}</TableCell>
              <TableCell  align='center'>{departamento.correoContacto}</TableCell>
              <TableCell  align='center'>
                <a
                  href={departamento.direccionWeb}
                  onClick={(e) => handleLinkClick(e, departamento.direccionWeb)}
                  style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {departamento.direccionWeb}
                </a>
              </TableCell>

              <TableCell align='center'>
                <EditIcon
                  sx={{ fontSize: 25, cursor: 'pointer', marginRight: '10px', color: '#363581' }}
                  onClick={() => editarDepartamento(departamento)}
                />
                <DeleteIcon
                  sx={{ fontSize: 25, cursor: 'pointer', color: '#363581' }}
                  onClick={() => handleOpenModal(departamento)} // Cambia 'departamento.id' por 'departamento.codigo'
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer >
    <Box display="flex" justifyContent="end" mt={2}>
      <Pagination
        count={Math.ceil(departamentos.length / rowsPerPage)} // Número total de páginas
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
      texto={`¿Está seguro de eliminar el departamento?`}
      handleAceptar={async () => {
        await confirmEliminarDepartamento();
        setModalOpen(false);
      }}
    />
    </>
  );
}

export default TablaDepartamentos;