import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Box } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';     // Ícono de lápiz
import DeleteIcon from '@mui/icons-material/Delete'; // Ícono de tacho de basura


const TablaPreguntas = ({ preguntas, onEdit, onDelete }) => {
  console.log("onDelete prop:", onDelete);
  return (
    <Box sx={{ background: 'white', borderRadius: 2, maxHeight: '450px', overflow: 'hidden', p: "1px 2px 0px 0px" }}>
      <TableContainer component={Paper} sx={{ maxWidth: '100%', maxHeight: '450px', borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', overflow: 'auto' }}>
        <Table sx={{ borderCollapse: 'collapse' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center' }}>Nro.</TableCell>
              <TableCell sx={{ backgroundColor: '#363581', color: 'white' }}>Pregunta</TableCell>
              <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center' }}>Tipo de Pregunta</TableCell>
              <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center' }}>Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {preguntas.map((pregunta, index) => (
              <TableRow key={index}>
                <TableCell align='center'>{pregunta.numeracion}</TableCell>
                <TableCell sx={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <Tooltip title={pregunta.descripcion} arrow>
                    <span>{pregunta.descripcion}</span>
                  </Tooltip>
                </TableCell>

                <TableCell align='center'>{pregunta.tipo === "TextBox" ? "Texto" : "Opción Múltiple"}</TableCell>
                <TableCell align='center'>
                  <IconButton onClick={() => onEdit(index)}>
                    <EditIcon sx={{ fontSize: 25, cursor: 'pointer', marginRight: '10px', color: '#363581' }} />
                  </IconButton>
                  <IconButton onClick={() => onDelete(index)}>
                    <DeleteIcon sx={{ fontSize: 25, cursor: 'pointer', marginRight: '10px', color: '#363581' }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>
    </Box>
  );

}
export default TablaPreguntas; 