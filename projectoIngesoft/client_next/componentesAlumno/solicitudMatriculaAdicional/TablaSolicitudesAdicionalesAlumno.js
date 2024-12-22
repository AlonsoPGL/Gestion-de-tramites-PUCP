import { Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, IconButton } from '@mui/material';
import { Edit, Visibility } from '@mui/icons-material'; // Icono de lápiz para modificar
import { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';

const rowsPerPage = 7; // Número de filas por página

/*const solicitudes = [
  { id: 20203848, nombre: 'Jaime de la Cruz', estado: 'Registrado', fecha: '20/10/2024' },
  { id: 20203849, nombre: 'Ana Pérez', estado: 'Por revisar', fecha: '21/10/2024' },
  { id: 20203850, nombre: 'Carlos Ramírez', estado: 'Aceptado', fecha: '22/10/2024' },
  { id: 23123213, nombre: 'Carlos Peter', estado: 'Aceptado', fecha: '22/10/2024' },
  { id: 10102737, nombre: 'Peter Ramírez', estado: 'Registrado', fecha: '22/10/2024' },
  { id: 38383839, nombre: 'Ramírez Romario', estado: 'Aceptado', fecha: '22/10/2024' },
  { id: 28282920, nombre: 'Carlos Romario', estado: 'Aceptado', fecha: '22/10/2024' },
  { id: 29292992, nombre: 'Romario Ramírez', estado: 'Registrado', fecha: '22/10/2024' },
  { id: 39812290, nombre: 'Peter Romario', estado: 'Aceptado', fecha: '22/10/2024' },
  // Agrega más ejemplos si es necesario
];*/

const TablaSolicitudesAdicionalesAlumno = ({ solicitudes = [] }) => {
  // Estado para manejar la paginación
  const [page, setPage] = useState(1);
  const router = useRouter();

  // Maneja el cambio de página en el componente de paginación
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // Filtrar las solicitudes a mostrar por página
  const solicitudesPaginadas = solicitudes.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const estilosEncabezado = {
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: '#363581',
    textAlign: 'center',
  };
  useEffect(() => {
    setPage(1); // Reiniciar a la primera página cuando cambie el término de búsqueda
  }, [solicitudes]);
  const handleModificarClick = (solicitud) => {
    // Navegamos a la nueva página pasando el ID en la query string
    router.push(`/alumno/solicitudes/solicitudMatriculaAdicional/listadoDeSolicitudesAdicionales/resumenVisualizacion?id=${solicitud.id}`);
  };
  

  return (
    <Box>
      <TableContainer component={Paper} sx={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', overflow: 'auto' }}>
        <Table aria-label="solicitudes table">
          <TableHead>
            <TableRow>
              <TableCell sx={estilosEncabezado}>N° Solicitud</TableCell>
              <TableCell sx={estilosEncabezado}>Estado</TableCell>
              <TableCell sx={estilosEncabezado}>Fecha de registro</TableCell>
              <TableCell sx={estilosEncabezado}>Visualizar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {solicitudesPaginadas.map((solicitud) => (
              <TableRow key={solicitud.id}>
                <TableCell align="center">{solicitud.id}</TableCell>
                <TableCell align="center">{solicitud.estadoSolicitud}</TableCell>
                <TableCell align="center">{new Date(solicitud.fechaCreacion).toLocaleDateString('es-ES')}</TableCell>
                <TableCell align="center">
                  <IconButton aria-label="modificar" onClick={() => handleModificarClick(solicitud)}>
                    <Visibility  color="primary" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginador debajo de la tabla */}
      <Box display="flex" justifyContent="end" mt={2} mb={2}>
        <Pagination
          count={Math.ceil(solicitudes.length / rowsPerPage)} // Número total de páginas
          page={page}                                        // Página actual
          onChange={handleChangePage}                        // Manejador de cambio de página
          size="large"
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default TablaSolicitudesAdicionalesAlumno;
