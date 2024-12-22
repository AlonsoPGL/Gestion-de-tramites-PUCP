import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Pagination, Box, Typography } from '@mui/material';

const TablaPersonaSolicitudJurado = ({personas = []}) => {
  // Estado para manejar la paginación
  const [page, setPage] = useState(1); // Página actual (empezamos desde 1)

  const estilosEncabezado = () => {
    return { color: 'white' ,fontWeight:'bold'};
  };

  //const estilosIndice = () =>{
  //  return {'& .Mui-selected': {
  //      color: '#fafafa',        // Color del texto o número seleccionado
 //       backgroundColor: '#c', // Color de fondo del botón seleccionado
 //       },};
 // }

  return (
    <Box>
      <TableContainer component={Paper}   sx={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', overflow: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          {/* Encabezado de la tabla */}
          <TableHead sx={{backgroundColor: '#363581' }}>
            <TableRow>
              <TableCell align='center' sx={estilosEncabezado()}>Código</TableCell>
              <TableCell align='center' sx={estilosEncabezado()}>Nombre</TableCell>
              <TableCell align='center' sx={estilosEncabezado()}>Correo</TableCell>
            </TableRow>
          </TableHead>
          {/* Cuerpo de la tabla */}
          <TableBody>
            {personas.map((personaSolicitud) => (
              <TableRow key={personaSolicitud.codigo}>
                <TableCell sx={{ padding: '16px' }} align='center'>{personaSolicitud.codigo}</TableCell>
                <TableCell sx={{ padding: '16px' }} align='center'>{personaSolicitud.nombre+" "+personaSolicitud.apellidoPaterno+" "+personaSolicitud.apellidoMaterno}</TableCell>
                <TableCell sx={{ padding: '16px' }} align='center'>{personaSolicitud.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </Box>
  );
};

export default TablaPersonaSolicitudJurado;
