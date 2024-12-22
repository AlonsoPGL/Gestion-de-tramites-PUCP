import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box, Pagination } from '@mui/material';
import { Edit, Visibility } from '@mui/icons-material';
import { useEffect,useState } from 'react';
import { useRouter } from "next/navigation";

const rowsPerPage = 7; // Número de filas por página

const TablaSolicitudesAdicionalesDirector = ({ solicitudes = [] }) => {
  // Estado para manejar la paginación
  const [page, setPage] = useState(1);
  const router = useRouter();

  // Maneja el cambio de página en el componente de paginación
  const handleChangePage = (event, value) => {
    setPage(value);
  };
  useEffect(() => {
    setPage(1); // Reiniciar a la primera página cuando cambie el término de búsqueda
  }, [solicitudes]);
  // Filtrar las solicitudes a mostrar por página
  const solicitudesPaginadas = solicitudes.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const estilosEncabezado = {
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: '#363581',
    textAlign: 'center',
  };

  const handleModificarClick = (solicitud) => {
    // Navegamos a la nueva página pasando el ID en la query string
    router.push(`/directorCarrera/matriculaAdicional/visualizarSolicitud?id=${solicitud.id}`);
  };
  const handleVisualizarClick = (solicitud) => {
    // Navegamos a la nueva página pasando el ID en la query string
    router.push(`/directorCarrera/matriculaAdicional/comprobarSolicitud?id=${solicitud.id}`);
  };

  return (
    <Box>
      <TableContainer component={Paper} sx={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', overflow: 'auto' }}>
        <Table aria-label="solicitudes table">
          <TableHead>
            <TableRow>
              <TableCell sx={estilosEncabezado}>N° Solicitud</TableCell>
              <TableCell sx={estilosEncabezado}>Nombre del alumno</TableCell>
              <TableCell sx={estilosEncabezado}>Estado</TableCell>
              <TableCell sx={estilosEncabezado}>Fecha de registro</TableCell>
              <TableCell sx={estilosEncabezado}>Modificar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {solicitudesPaginadas.map((solicitud) => (
              <TableRow key={solicitud.id}>
                <TableCell align="center" sx={{ padding: '11px' }}>{solicitud.id}</TableCell>
                <TableCell align="center" sx={{ padding: '11px' }}>
                  {solicitud.emisor.nombre} {solicitud.emisor.apellidoPaterno} {solicitud.emisor.apellidoMaterno}
                </TableCell>
                <TableCell align="center" sx={{ padding: '11px' }}>{solicitud.estadoSolicitud}</TableCell>
                <TableCell align="center" sx={{ padding: '11px' }}>{new Date(solicitud.fechaCreacion).toLocaleDateString('es-ES')}</TableCell>
                <TableCell align="center" sx={{ padding: '11px' }}>
                  {solicitud.estadoSolicitud === 'EN_PROCESO' ? (
                    <IconButton aria-label="visualizar" onClick={() => handleModificarClick(solicitud)}>
                      <Edit color="primary" />
                    </IconButton>
                  ) : (
                    <IconButton aria-label="modificar" onClick={() => handleVisualizarClick(solicitud)}>
                      <Visibility color="primary" />
                    </IconButton>
                  )}
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

export default TablaSolicitudesAdicionalesDirector;
