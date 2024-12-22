import React, { useEffect, useState } from 'react';
import { Button,Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Pagination, Box } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import EditIcon from '@mui/icons-material/Edit';


const rowsPerPage = 7; // Define la cantidad de filas por página

const TablaAprobacionAsesor = ({solicitudesAprobacion = []}) => {
  // Estado para manejar la paginación
  const [page, setPage] = useState(1); // Página actual (empezamos desde 1)

  // Maneja el cambio de página en el componente de paginación
  const handleChangePage = (event, value) => {
    setPage(value);
  };
  useEffect(() => {
    setPage(1); // Reiniciar a la primera página cuando cambie el término de búsqueda
  }, [solicitudesAprobacion]);
// Filtrar las solicitudes a mostrar por página, asegurándose de que solicitudes sea un array
const solicitudesPaginadas = Array.isArray(solicitudesAprobacion) ? solicitudesAprobacion.slice((page - 1) * rowsPerPage, page * rowsPerPage) : [];


  const sizeFont=10; //tamaño de fuente

  const estilosEncabezado = () => {
    return { color: 'white' ,fontWeight:'bold', backgroundColor: '#363581'};
  };

  const estilosIndice = () =>{
    return {'& .Mui-selected': {
        color: '#fafafa',        // Color del texto o número seleccionado
        backgroundColor: '#363581', // Color de fondo del botón seleccionado
        },};
  }

  //!router para redirigir ---------------------------------------------------------------------------------------
  const router=useRouter();
  //Para que el click en el eyeIcon redirija a la solicitud 
  const handleClickVisualizar = (solicitud) =>{
    //Llamar un query que recupere un array y luego redireccionar a la pagina de resumenVisualizacion con esta data para su renderizado
    
    router.push(`/asesor/tesis/visualizarSolicitudesAprobacion/visualizarRevisiones?id=${solicitud.id}`);
  }

  const handleClickEditar = (solicitud) =>{
    router.push(`/asesor/tesis/visualizarSolicitudesAprobacion/registrarAprobacion?id=${solicitud.id}`);

  }

  return (
    <Box>
      <TableContainer component={Paper} sx={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', overflow: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          {/* Encabezado de la tabla */}
          <TableHead sx={{backgroundColor:'#363581'}}>
            <TableRow>
              <TableCell align='center' sx={estilosEncabezado()}>Código</TableCell>
              <TableCell align='center' sx={estilosEncabezado()}>Nombre</TableCell>
              <TableCell align='center' sx={estilosEncabezado()}>Título</TableCell>
              <TableCell align='center' sx={estilosEncabezado()}>Estado</TableCell>
              <TableCell align='center' sx={estilosEncabezado()}>Fecha de Creación</TableCell>
              <TableCell align='center' sx={estilosEncabezado()}></TableCell>
            </TableRow>
          </TableHead>

          {/* Cuerpo de la tabla */}
          <TableBody>
            {solicitudesPaginadas.map((solicitud) => (
              <TableRow key={solicitud.id}>
                {/* Muestra el número de página */}
                <TableCell align='center' sx={{ padding: '11px' }}>{solicitud.emisor.codigo}</TableCell>
                <TableCell align='center' sx={{ padding: '11px' }}>{solicitud.emisor.nombre+" "+solicitud.emisor.apellidoPaterno+" "+solicitud.emisor.apellidoMaterno}</TableCell>
                <TableCell align='center' sx={{ padding: '11px' }}>{solicitud.tesis.titulo}</TableCell>
                <TableCell align='center' sx={{ padding: '11px' }}>{solicitud.estadoAprobacion}</TableCell>
                <TableCell align='center' sx={{ padding: '11px' }}>{new Date(solicitud.fechaCreacion).toLocaleDateString('es-ES')}</TableCell>
                <TableCell align='center' sx={{ padding: '11px' }}>
                    {solicitud.estadoAprobacion == 'EN_REVISION_POR_ASESOR'? (
                    <Button onClick={() => handleClickEditar(solicitud)}>
                                            <EditIcon color="primary" />
                                        </Button>

                    ) : (
                      <Button onClick={() => handleClickVisualizar(solicitud)}>
                      <Visibility color="primary" />
                  </Button>
                    )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginador debajo de la tabla */}
      <Box display="flex" justifyContent="end" mt={2}>
        <Pagination
          count={Math.ceil(solicitudesAprobacion.length / rowsPerPage)} // Número total de páginas
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

export default TablaAprobacionAsesor;