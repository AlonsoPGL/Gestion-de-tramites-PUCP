"use client";
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useRouter } from 'next/navigation';
import { useRol } from '../../src/app/RolContext'; 

export default function TablaRoles({ roles, onEditRole, onDeleteRole }) {
  const router = useRouter();
  const { setRol } = useRol();  // Agrega esta línea para obtener setRol del contexto

  const asignarPermisos = (rol) => {
    setRol(rol);  // Establecemos el rol seleccionado en el contexto
    //console.log("Rol seleccionado:", rol);  // Agrega esta línea
    router.push('/administrador/gestionRoles/asignacionDePermisosRoles'); // Redirigir a la pantalla de permisos
  };

  return (
    <TableContainer component={Paper} sx={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', overflow: 'auto' }}>
      <Table sx={{ borderCollapse: 'collapse' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: '#363581', color: 'white' }}>ID</TableCell>
            <TableCell sx={{ backgroundColor: '#363581', color: 'white' }}>Nombre</TableCell>
            <TableCell sx={{ backgroundColor: '#363581', color: 'white' }}>Tipo de unidad</TableCell>
            <TableCell sx={{ backgroundColor: '#363581', color: 'white' }}>Descripción</TableCell>
            <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center' }}>Añadir Permisos</TableCell>
            <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center' }}>Acción</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {roles.map((rol) => (
            <TableRow key={rol.id} sx={{ backgroundColor: '#F8F9FA' }}>
              <TableCell>{rol.id}</TableCell>
              <TableCell>{rol.nombre}</TableCell>
              <TableCell>{rol.tipo}</TableCell>
              <TableCell sx={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <Tooltip title={rol.descripcion} arrow>
                  <span>{rol.descripcion}</span>
                </Tooltip>
              </TableCell>
              <TableCell align="center">
                <AddCircleIcon 
                  sx={{ fontSize: 25, cursor: 'pointer', color: '#363581' }} 
                  onClick={() => asignarPermisos(rol)} // Cambiar aquí para pasar el rol completo
                />
              </TableCell>
              <TableCell align='center'>
                <EditIcon
                  sx={{ fontSize: 25, cursor: 'pointer', marginRight: '10px', color: '#363581' }}
                  onClick={() => onEditRole(rol)}
                />
                <DeleteIcon
                  sx={{ fontSize: 25, cursor: 'pointer', color: '#363581' }}
                  onClick={() => onDeleteRole(rol.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
