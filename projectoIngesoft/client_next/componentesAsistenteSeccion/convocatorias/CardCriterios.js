"use client"
import React from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Box, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
const CardCriterios = ({ criterios, onDelete, onEdit, disabled = false }) => {

  const formatDate = (dateString) => {
    const date = new Date(dateString);  // Crea un objeto Date a partir de la fecha ISO
    return date.toLocaleDateString('es-ES');  // Convierte la fecha al formato español (día/mes/año)
  };

  return (
    <Box sx={{ bgcolor: '#5D71BC', color: 'white', p: '2px 10px 15px 10px', width: '100%', mt: 2, borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ bgcolor: '#5D71BC', color: 'white', p: 1 }}>
        <Typography variant="h7">Criterios de evaluación</Typography>
      </Box>

      <Box sx={{ background: 'white', borderRadius: 2, maxHeight: '265px', overflow: 'hidden', p: "1px 2px 0px 0px" }}>
        <TableContainer component={Paper} sx={{ borderRadius: 2, maxHeight: '265px', overflow: 'auto', '&::-webkit-scrollbar': { width: '20px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#5D71BC', borderRadius: '10px' }, '&::-webkit-scrollbar-track': { background: '#e0e0e0', borderRadius: '10px' } }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Criterio</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Puntuación máxima</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Fecha de creación</TableCell>
                {!disabled && (
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Acciones</TableCell>
                )}              
              </TableRow>
            </TableHead>
            <TableBody>
              {criterios.map((row, index) => (

                <TableRow key={index} sx={{ '&:nth-of-type(odd)': { bgcolor: '#f5f5f5' } }}>
                  <TableCell align='left'>{row.nombre}</TableCell>
                  <TableCell align='center'>{row.maximo_puntaje}</TableCell>
                  <TableCell align='center'>{formatDate(row.fechaCreacioN)}</TableCell>
                  {!disabled && (
                    <TableCell align='center'>
                      <EditIcon
                        sx={{ fontSize: 25, cursor: 'pointer', marginRight: '10px', color: '#5D71BC' }}
                        onClick={() => onEdit(index)}
                      />
                      <DeleteIcon
                        sx={{ fontSize: 25, cursor: 'pointer', color: '#5D71BC' }}
                        onClick={() => onDelete(index)}
                      />

                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default CardCriterios;
