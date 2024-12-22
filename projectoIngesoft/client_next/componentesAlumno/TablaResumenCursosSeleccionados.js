import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Pagination, Box } from '@mui/material';

const rowsPerPage = 3; // Define la cantidad de filas por página

const TablaResumenCursosSeleccionados = ({cursosSeleccionados}) => {
  // Estado para manejar la paginación
  const [page, setPage] = useState(1); // Página actual (empezamos desde 1)

  // Maneja el cambio de página en el componente de paginación
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // Filtrar los cursos a mostrar por página
  const cursosPaginados = cursosSeleccionados.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const sizeFont=10;

  const estilosEncabezado = () => {
    return { color: 'white' ,fontWeight:'bold'};
  };

  const estilosIndice = () =>{
    return {'& .Mui-selected': {
        color: '#fafafa',        // Color del texto o número seleccionado
        backgroundColor: '#363581', // Color de fondo del botón seleccionado
        },};
  }

  return (
    <Box>
      <TableContainer component={Paper} sx={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', overflow: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          {/* Encabezado de la tabla */}
          <TableHead sx={{backgroundColor:'#363581'}}>
            <TableRow>
              <TableCell align='center' sx={estilosEncabezado()}>Código</TableCell> {/*Si quiero agregar un tamaño definido debo de utilizar  sx={{fontSize:'10px'}} dentro de TableCell*/}
              <TableCell align='center' sx={estilosEncabezado()}>Nombre</TableCell>
              <TableCell align='center' sx={estilosEncabezado()}>Créditos</TableCell>
              <TableCell align='center' sx={estilosEncabezado()}>Horario</TableCell>
              <TableCell align='center' sx={estilosEncabezado()}>Docentes</TableCell>
            </TableRow>
          </TableHead>

          {/* Cuerpo de la tabla */}
          <TableBody>
            {cursosPaginados.map((cursosSeleccionados, index) => (
              <TableRow key={cursosSeleccionados.codigo}>
                {/* Muestra el número de página */}
                <TableCell align='center'>{cursosSeleccionados.codigo}</TableCell>
                <TableCell align='center'>{cursosSeleccionados.nombre}</TableCell>
                <TableCell align='center'> {cursosSeleccionados.creditos}</TableCell>
                <TableCell align='center'>{cursosSeleccionados.horario}</TableCell>
                <TableCell align='center'>
                  <Checkbox color="primary" /> {/* Checkbox para seleccionar horario */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginador debajo de la tabla */}
      <Box display="flex" justifyContent="end" mt={2}>
        <Pagination
          count={Math.ceil(cursosSeleccionados.length / rowsPerPage)} // Número total de páginas
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