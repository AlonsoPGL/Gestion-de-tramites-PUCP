"use client"
import React from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Box, Typography, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
const Cardcursos = ({ cursos, onDelete, onEdit, disabled = false }) => {

  return (
    <Box sx={{ bgcolor: '#5D71BC', color: 'white', p: '2px 10px 15px 10px', width: '100%', mt: 2, borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ bgcolor: '#5D71BC', color: 'white', p: 1 }}>
        <Typography variant="h7">Solicitar cantidad de horarios</Typography>
      </Box>

      <Box sx={{ background: 'white', borderRadius: 2, maxHeight: '265px', overflow: 'hidden', p: "1px 2px 0px 0px" }}>
        <TableContainer component={Paper} sx={{ borderRadius: 2, maxHeight: '265px', overflow: 'auto', '&::-webkit-scrollbar': { width: '20px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#5D71BC', borderRadius: '10px' }, '&::-webkit-scrollbar-track': { background: '#e0e0e0', borderRadius: '10px' } }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>codigo</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Créditos</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Cantidad de Horarios</TableCell>             
              </TableRow>
            </TableHead>
            <TableBody>
              {cursos.map((plan,index) => (

                <TableRow key={plan.id} sx={{ '&:nth-of-type(odd)': { bgcolor: '#f5f5f5' } }}>
                  <TableCell align='center'>{plan.curso.codigo}</TableCell>
                  <TableCell align='center'>{plan.curso.nombre}</TableCell>
                  <TableCell align='center'>{plan.curso.creditos}</TableCell>
                  <TableCell align='center'>
                    <TextField
                      disabled={disabled}
                      value={plan.cantHorarios || ''}
                      onChange={(e) => onEdit(index, 'cantHorarios', parseInt(e.target.value, 10))}// onEdit es una función que manejará el cambio
                      size="small"
                      type="number"
                      inputProps={{ min: 1 }} 
                      sx={{ width: '80px' }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Cardcursos;
