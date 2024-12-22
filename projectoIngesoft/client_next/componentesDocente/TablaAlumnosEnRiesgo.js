import React, { useState, useEffect } from 'react'; 
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography } from "@mui/material";
import { useSearchParams, useRouter } from 'next/navigation';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Pagination from "@mui/material/Pagination";
import Link from 'next/link';
import axios from 'axios';

export default function TablaAlumnosEnRiesgo({ alumnosEnRiesgo }) {
  //const [alumnosEnRiesgo, setAlumnosEnRiesgo] = useState([]);
  const [page, setPage] = useState(1); // Página actual (empezamos desde 1)
  const rowsPerPage = 7;
  const router=useRouter();

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleVerDetallesAlumno = (id) => {
    router.push(`./alumnosEnRiesgo/detalles?idAlxhor=${id}`);
  };

  return (
    <Box>
      <TableContainer component={Paper} sx={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', overflow: 'auto' }}>
        <Table sx={{ borderCollapse: 'collapse' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: '#363581', color: 'white' }} align='center'>Código Alumno</TableCell>
              <TableCell sx={{ backgroundColor: '#363581', color: 'white' }} align='center'>Nombre del Alumno</TableCell>
              <TableCell sx={{ backgroundColor: '#363581', color: 'white' }} align='center'>Correo Electrónico</TableCell>
              <TableCell sx={{ backgroundColor: '#363581', color: 'white' }} align='center'>Curso</TableCell>
              <TableCell sx={{ backgroundColor: '#363581', color: 'white' }} align='center'>Nombre del Curso</TableCell>
              <TableCell sx={{ backgroundColor: '#363581', color: 'white' }} align='center'>Horario</TableCell>
              <TableCell sx={{ backgroundColor: '#363581', color: 'white' }} align='center'>Créditos</TableCell>
              <TableCell sx={{ backgroundColor: '#363581', color: 'white' }} align='center'>Por Responder</TableCell>
              <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center' }}>Acción</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {alumnosEnRiesgo ? (
              alumnosEnRiesgo.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((alxhor) => (
                <TableRow key={alxhor.id} sx={{ backgroundColor: '#F8F9FA' }}>
                  <TableCell align='center'>{alxhor.alumno.codigo}</TableCell>
                  <TableCell align='center'>{`${alxhor.alumno.nombre} ${alxhor.alumno.apellidoPaterno} ${alxhor.alumno.apellidoMaterno}`}</TableCell>
                  <TableCell align='center'>{alxhor.alumno.email}</TableCell>
                  <TableCell align='center'>{alxhor.horario.codigoCurso}</TableCell>
                  <TableCell align='center'>{alxhor.horario.nombreCurso}</TableCell>
                  <TableCell align='center'>{alxhor.horario.codigo}</TableCell>
                  <TableCell align='center'>{alxhor.horario.creditoCurso.toFixed(1)}</TableCell>
                  {alxhor.cantSolXResponder > 0 ? (
                      <TableCell align='center' sx={{color:'#363581'}}><strong>{alxhor.cantSolXResponder}</strong></TableCell>
                    ) : (
                      <TableCell align='center'>-</TableCell>
                    )}
                  <TableCell align='center'>
                    <IconButton onClick={() => handleVerDetallesAlumno(alxhor.id)}>
                      <VisibilityIcon sx={{ color: '#363581' }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
            ))) : (
              <TableRow>
                <TableCell colSpan={6} align='center'>
                  <Typography variant='subtitle1' color='textSecondary'>
                    No se encontraron alumnos en riesgo para este docente.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {alumnosEnRiesgo && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", padding: "20px" }}>
          <Pagination
            count={Math.ceil(alumnosEnRiesgo.length / rowsPerPage)} // Número total de páginas
            page={page} // Página actual
            onChange={handleChangePage} // Manejador de cambio de página
            size="large"
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}
