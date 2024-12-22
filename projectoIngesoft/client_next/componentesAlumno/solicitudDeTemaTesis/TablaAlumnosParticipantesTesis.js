"use client";

import { Box ,TableContainer,TableCell,TableRow,Paper,Table,TableHead,TableBody,Pagination} from "@mui/material";
import { useState } from "react";

// Datos de ejemplo para la tabla
/*const alumnos = [
    { codigo: "001", nombre: "Juan Pérez", correo: "juan.perez@example.com" },
    { codigo: "002", nombre: "María López", correo: "maria.lopez@example.com" },
    { codigo: "003", nombre: "Carlos García", correo: "carlos.garcia@example.com" },
    { codigo: "004", nombre: "Ana Torres", correo: "ana.torres@example.com" },
    { codigo: "005", nombre: "Luis Martínez", correo: "luis.martinez@example.com" },
    { codigo: "006", nombre: "Elena Sánchez", correo: "elena.sanchez@example.com" },
];*/

const rowsPerPage = 3; // Define la cantidad de filas por página


//! Inicio del componente
const TablaAlumnosParticipantesTesis = ({alumnos=[]}) => {

    // Estado para manejar la paginación
  const [page, setPage] = useState(1); // Página actual (empezamos desde 1)

  // Maneja el cambio de página en el componente de paginación
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // Filtrar los cursos a mostrar por página
  const cursosPaginados = alumnos.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const estilosEncabezado = () => {
    return { color: 'white' ,fontWeight:'bold'};
  };

  const estilosIndice = () =>{
    return {'& .Mui-selected': {
        color: '#fafafa',        // Color del texto o número seleccionado
        backgroundColor: '#363581', // Color de fondo del botón seleccionado
        },};
  }

//!Return del componente
    return (
        <Box>
      <TableContainer component={Paper} sx={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', overflow: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          {/* Encabezado de la tabla */}
          <TableHead sx={{backgroundColor:'#363581'}}>
            <TableRow>
              <TableCell align='center' sx={estilosEncabezado()}>Código</TableCell>
              <TableCell align='center' sx={estilosEncabezado()}>Nombre</TableCell>
              <TableCell align='center' sx={estilosEncabezado()}>Correo</TableCell>
            </TableRow>
          </TableHead>

          {/* Cuerpo de la tabla */}
          <TableBody>
            {cursosPaginados.length > 0 ? (
              cursosPaginados.map((alumno) => (
                <TableRow key={alumno.codigo}>
                  <TableCell align='center' sx={{ padding: '11px' }}>{alumno.codigo}</TableCell>
                  <TableCell align='center' sx={{ padding: '11px' }}>{alumno.nombre+" "+alumno.apellidoPaterno+" "+alumno.apellidoMaterno}</TableCell>
                  <TableCell align='center' sx={{ padding: '11px' }}>{alumno.email}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align='center' sx={{ padding: '20px', fontStyle: 'italic',fontSize:'15px' }}>
                  Nada por aquí nada por allá...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="end" mt={2}>
        <Pagination
          count={Math.ceil(alumnos.length / rowsPerPage)} // Número total de páginas
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

export default TablaAlumnosParticipantesTesis;