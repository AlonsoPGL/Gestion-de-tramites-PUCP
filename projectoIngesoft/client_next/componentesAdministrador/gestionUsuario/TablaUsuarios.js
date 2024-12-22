import React, {useState }  from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Pagination } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import EstaSeguroAccion from '../../componentesGenerales/modales/EstaSeguroAccion';
import { useUsuario } from '../../src/app/UsuarioContext';
import axios from 'axios';


const rowsPerPage = 5; 

const TablaUsuarios = ({ usuarios, listar}) => {
  const router = useRouter();
  const { setUsuario } = useUsuario();
  const [modalOpen, setModalOpen] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [page, setPage] = useState(1); // Página actual (empezamos desde 1)

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const usuariosPaginados = Array.isArray(usuarios) 
        ? usuarios.slice((page - 1) * rowsPerPage, page * rowsPerPage)
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

  const editarUsuario = (usuario) => {
    setUsuario(usuario);
    console.log("Usuario seleccionado:", usuario);
    router.push('/administrador/gestionUsuario/nuevoUsuario');
  };

  const handleOpenModal = async (usuario) => {
    setUsuarioAEliminar(usuario);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setUsuarioAEliminar(null);
  };

  const confirmEliminarUsuario = async () => {
    try {
      if (usuarioAEliminar) {
        console.log("Elimi",usuarioAEliminar);
        await axios.delete(`http://localhost:8080/rrhh/persona/eliminar/${usuarioAEliminar.id}`);
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error al eliminar persona:", error);
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
            <TableCell  align='center' sx={{ backgroundColor: '#363581', color: 'white' }}>Tipo de Usuario</TableCell>
            <TableCell  align='center' sx={{ backgroundColor: '#363581', color: 'white' }}>Correo</TableCell>
            <TableCell  align='center' sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center' }}>Acción</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {usuariosPaginados.map((usuario, index) => (
            <TableRow key={usuario.codigo} sx={{ backgroundColor: '#F8F9FA' }}>
              <TableCell align='center'>{usuario.codigo}</TableCell>
              <TableCell align='center'>{usuario.nombre + ' ' + usuario.apellidoPaterno + ' ' + usuario.apellidoMaterno }</TableCell>
              <TableCell align='center'>{usuario.tipo}</TableCell>
              <TableCell align='center'>{usuario.email}</TableCell>

              <TableCell align='center'>
                <EditIcon
                  sx={{ fontSize: 25, cursor: 'pointer', marginRight: '10px', color: '#363581' }}
                  onClick={() => editarUsuario(usuario)}
                />
                <DeleteIcon
                  sx={{ fontSize: 25, cursor: 'pointer', color: '#363581' }}
                  onClick={() => handleOpenModal(usuario)} 
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Box display="flex" justifyContent="end" mt={2}>
      <Pagination
        count={Math.ceil(usuarios.length / rowsPerPage)} // Número total de páginas
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
      texto={`¿Está seguro de eliminar el usuario?`}
      handleAceptar={async () => {
        await confirmEliminarUsuario();
        setModalOpen(false);
        listar();
      }}
    />
  </>
  );
}

export default TablaUsuarios;