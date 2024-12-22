"use client";
import { Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography } from '@mui/material';
import { useState } from 'react';

const rowsPerPage = 7; // Define la cantidad de filas por página

const TablaResumenCursosSeleccionados = ({ horarioSeleccionado = [] }) => {
  // Estado para manejar la paginación
  const [page, setPage] = useState(1); // Página actual (empezamos desde 1)

  // Maneja el cambio de página en el componente de paginación
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // Filtrar los cursos a mostrar por página
  const cursosPaginados = horarioSeleccionado.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const estilosEncabezado = () => {
    return { color: 'white', fontWeight: 'bold' };
  };

  const estilosIndice = () => {
    return {
      '& .Mui-selected': {
        color: '#fafafa',        // Color del texto o número seleccionado
        backgroundColor: '#363581', // Color de fondo del botón seleccionado
      },
    };
  };

  return (
    <Box>
      <TableContainer component={Paper} sx={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', overflow: 'auto' }}>
        <Table aria-label="cursos table">
          <TableHead sx={{ backgroundColor: '#363581' }}>
            <TableRow>
              <TableCell align='center' sx={estilosEncabezado()}>Código</TableCell>
              <TableCell align='center' sx={estilosEncabezado()}>Nombre</TableCell>
              <TableCell align='center' sx={estilosEncabezado()}>Créditos</TableCell>
              <TableCell align='center' sx={estilosEncabezado()}>Sesiones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cursosPaginados.map((curso, index) => {
              const indexGlobal = (page - 1) * rowsPerPage + index;
              return (
                <TableRow key={curso.codigoCurso}>
                  <TableCell align='center' sx={{ padding: '10px' }}>{curso.codigoCurso}</TableCell>
                  <TableCell align='center' sx={{ padding: '10px' }}>{curso.nombreCurso}</TableCell>
                  <TableCell align='center' sx={{ padding: '10px' }}>{curso.creditoCurso}</TableCell>
                    <TableCell align='center' sx={{ padding: '10px' }}>
                        <Typography component="span" style={{ textAlign: 'left', whiteSpace: 'pre-line' }}>
                        {curso.sesiones && curso.sesiones.length > 0 
                            ? curso.sesiones.map(sesion => 
                                `${sesion.dia}: ${sesion.horaInicio} - ${sesion.horaFin}`
                            ).join('\n')
                            : 'Sin sesiones'}
                        </Typography>
                    </TableCell>

                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginador debajo de la tabla */}
      <Box display="flex" justifyContent="end" mt={2} mb={2}>
        <Pagination
          count={Math.ceil(horarioSeleccionado.length / rowsPerPage)} // Número total de páginas
          page={page}                                   // Página actual
          onChange={handleChangePage}                   // Manejador de cambio de página
          size='large'
          color='primary'
          sx={estilosIndice()}
        />
      </Box>
    </Box>
  );
};

export default TablaResumenCursosSeleccionados;
