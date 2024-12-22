import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';     // Ícono de lápiz
import DeleteIcon from '@mui/icons-material/Delete'; // Ícono de tacho de basura
import { useRouter } from 'next/navigation'; // Importar useRouter
import axios from 'axios';

export default function TablaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const router = useRouter();  // Instancia del enrutador de Next.js

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const response = await axios.get('http://localhost:8080/rrhh/persona/listar'); // Cambia la URL según tu configuración
        console.log(response.data);  // Verifica que la respuesta es la esperada
        setUsuarios(response.data);   // Actualiza el estado con la lista de usuarios
      } catch (error) {
        console.error("Error al obtener la lista de usuarios:", error);
      }
    };

    obtenerUsuarios(); // Llama a la función para obtener los usuarios
  }, []); 

  // Función para manejar la edición del usuario
  const manejarEditarUsuario = (usuario) => {
    // Redirigir a la página de modificación con los datos del usuario como query params
    router.push({
      pathname: '/administrador/gestionUsuario/modificarUsuario',
      query: {
        codigo: usuario.codigo,
        nombre: usuario.nombre,
        tipo: usuario.tipo,
        email: usuario.email
      }
    });
  };

  return (
    <TableContainer component={Paper} sx={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', overflow: 'auto' }}>
      <Table sx={{ borderCollapse: 'collapse'}}>
        <TableHead> 
          <TableRow>
            <TableCell sx={{ backgroundColor: '#363581', color: 'white' }}>Código</TableCell>
            <TableCell sx={{ backgroundColor: '#363581', color: 'white' }}>Nombre</TableCell>
            <TableCell sx={{ backgroundColor: '#363581', color: 'white' }}>TipoUsuario</TableCell>
            <TableCell sx={{ backgroundColor: '#363581', color: 'white' }}>Correo</TableCell>
            <TableCell sx={{ backgroundColor: '#363581', color: 'white' }}>Acción</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {usuarios.map((usuario) => (
            <TableRow key={usuario.codigo} sx={{ backgroundColor: '#F8F9FA'}}>
              <TableCell >{usuario.codigo}</TableCell>
              <TableCell>{usuario.nombre}</TableCell>
              <TableCell>{usuario.tipo}</TableCell>
              <TableCell>{usuario.email}</TableCell>
              <TableCell>
                <EditIcon 
                  sx={{ fontSize: 18, cursor: 'pointer', marginRight: '10px', color: '#363581'}} 
                  //onClick={() => manejarEditarUsuario(usuario)} // Manejar la acción de edición
                />
                <DeleteIcon sx={{ fontSize: 18, cursor: 'pointer', color: '#363581' }} /> {/* Ícono de tacho de basura */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
