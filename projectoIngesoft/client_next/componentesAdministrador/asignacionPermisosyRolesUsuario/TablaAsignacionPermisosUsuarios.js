"use client";
import React, {useState }  from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Pagination } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useRouter } from 'next/navigation';
import { useUsuario } from '../../src/app/UsuarioContext';

const rowsPerPage = 5; 

export default function TablaAsignacionPermisosUsuarios({ usuarios }) {
  const router = useRouter();
  const { setUsuario } = useUsuario();  // Agrega esta línea para obtener setRol del contexto
  const [page, setPage] = useState(1); // Página actual (empezamos desde 1)
  
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const estilosIndice = () =>{
    return {'& .Mui-selected': {
      color: '#fafafa',        // Color del texto o número seleccionado
      backgroundColor: '#363581', // Color de fondo del botón seleccionado
    },};
  };

  const usuariosPaginados = Array.isArray(usuarios) 
  ? usuarios.slice((page - 1) * rowsPerPage, page * rowsPerPage)
 : [];

  const asignarPermisos = (usuario) => {
    setUsuario(usuario);  // Establecemos el usuario seleccionado en el contexto
    //console.log("Usuario seleccionado:", usuario);  // Agrega esta línea
    router.push('/administrador/asignacionPermisosyRolesUsuarios/asignacionRolyPermisos'); // Redirigir a la pantalla de permisos
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', overflow: 'auto' }}>
        <Table sx={{ borderCollapse: 'collapse' }}>
          <TableHead>
            <TableRow>
              <TableCell align='center' sx={{ backgroundColor: '#363581', color: 'white' }}>Nombre</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#363581', color: 'white' }}>Tipo de usuario</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center' }}>Añadir roles y permisos</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuariosPaginados.map((usuario) => (
              <TableRow key={usuario.id} sx={{ backgroundColor: '#F8F9FA' }}>
                <TableCell align='center'>{usuario.nombre || 'N/A'} {usuario.apellidoPaterno || ""} {usuario.apellidoMaterno || ""}</TableCell>
                <TableCell align='center'>{usuario.tipo || 'N/A'}</TableCell>

                <TableCell align="center">
                  <AddCircleIcon
                    sx={{ fontSize: 25, cursor: 'pointer', color: '#363581' }}
                    onClick={() => asignarPermisos(usuario)} // Cambiar aquí para pasar el usuario completo
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
    </>
  );
}
