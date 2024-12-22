"use client";
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Button,
  Typography
} from "@mui/material";

export default function TablaUsuariosBusqueda({ usuarios, onSelect }) {
  // Función para formatear el nombre completo
  const getNombreCompleto = (usuario) => {
    return `${usuario.nombre} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}`.trim();
  };

  return (
    <TableContainer component={Paper} sx={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', overflow: 'auto' }}>
      <Table sx={{ borderCollapse: 'collapse' }}>
        <TableHead>
          <TableRow>
            <TableCell 
              sx={{ 
                backgroundColor: '#363581', 
                color: 'white',
                padding: '12px 16px',
                fontSize: '0.875rem',
                fontWeight: 'bold'
              }}
            >
              Código
            </TableCell>
            <TableCell 
              sx={{ 
                backgroundColor: '#363581', 
                color: 'white',
                padding: '12px 16px',
                fontSize: '0.875rem',
                fontWeight: 'bold'
              }}
            >
              Nombre
            </TableCell>
            <TableCell 
              sx={{ 
                backgroundColor: '#363581', 
                color: 'white',
                padding: '12px 16px',
                fontSize: '0.875rem',
                fontWeight: 'bold'
              }}
            >
              Tipo de usuario
            </TableCell>
            <TableCell 
              sx={{ 
                backgroundColor: '#363581', 
                color: 'white',
                padding: '12px 16px',
                fontSize: '0.875rem',
                fontWeight: 'bold'
              }}
            >
              Correo
            </TableCell>
            <TableCell 
              sx={{ 
                backgroundColor: '#363581', 
                color: 'white',
                padding: '12px 16px',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              Acción
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {usuarios.map((usuario) => (
            <TableRow 
              key={usuario.id} 
              sx={{ 
                backgroundColor: '#F8F9FA',
                '&:hover': {
                  backgroundColor: '#f5f5f5'
                }
              }}
            >
              <TableCell sx={{ padding: '12px 16px' }}>
                {usuario.codigo}
              </TableCell>
              <TableCell sx={{ padding: '12px 16px' }}>
                {getNombreCompleto(usuario)}
              </TableCell>
              <TableCell sx={{ padding: '12px 16px' }}>
                {usuario.tipo}
              </TableCell>
              <TableCell sx={{ padding: '12px 16px' }}>
                {usuario.email}
              </TableCell>
              <TableCell 
                align='center' 
                sx={{ 
                  padding: '12px 16px',
                  minWidth: '120px' // Asegura espacio suficiente para el botón
                }}
              >
                <Typography
                  onClick={() => onSelect(usuario)}
                  sx={{
                    textDecoration: 'underline',
                    color: '#363581',
                    cursor: 'pointer',
                    '&:hover': {
                      color: '#262570'
                    },
                    fontSize: '0.875rem',
                    fontWeight: 500
                  }}
                >
                  Seleccionar
                </Typography>
              </TableCell>
            </TableRow>
          ))}

          {usuarios.length === 0 && (
            <TableRow>
              <TableCell 
                colSpan={5} 
                align="center" 
                sx={{ 
                  padding: '20px',
                  color: '#666'
                }}
              >
                No se encontraron usuarios
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}