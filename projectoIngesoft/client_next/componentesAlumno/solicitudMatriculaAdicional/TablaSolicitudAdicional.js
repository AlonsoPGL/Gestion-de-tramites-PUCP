import {Pagination, Table, Checkbox, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, Container } from '@mui/material';
import { useState,useEffect } from 'react';

//! Limpiar la caché

const rowsPerPage = 7; // Define la cantidad de filas por página

const TablaSolicitudAdicional = ({ cursos,updateCursos }) => {
  //obteniendo los cursos a renderizar
  //const [cursos,setCursosAxios]=useState([]);
  
  // Estado para manejar la paginación
  const [page, setPage] = useState(1); // Página actual (empezamos desde 1)

  // Maneja el cambio de página en el componente de paginación
  const handleChangePage = (event, value) => {
    setPage(value);
  };
  useEffect(() => {
    setPage(1); // Reiniciar a la primera página cuando cambie el término de búsqueda
  }, [cursos]);
  // Filtrar los cursos a mostrar por página
  const cursosPaginados = cursos.slice((page - 1) * rowsPerPage, page * rowsPerPage);

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

  //Manejo de seleccion de cursos
  // Función para manejar el cambio de selección de un checkbox
  const handleActualizarCursos = (cursoIndex, horarioId) => {
    const cursosActualizados = [...cursos]; // Copia del estado actual de los cursos

    // Buscando el curso y actualizando el horario seleccionado
    cursosActualizados[cursoIndex] = {
      ...cursosActualizados[cursoIndex],
      horarios: cursosActualizados[cursoIndex].horarios.map((horario) =>
        horario.idHorario === horarioId
          ? { ...horario, seleccionado: !horario.seleccionado }
          : horario
      ),
    };

    // Verifica si alguno de los horarios está seleccionado para actualizar el curso
    const algunHorarioSeleccionado = cursosActualizados[cursoIndex].horarios.some(
      (horario) => horario.seleccionado
    );

    // Si al menos un horario está seleccionado, marca el curso como seleccionado
    cursosActualizados[cursoIndex].seleccionado = algunHorarioSeleccionado;

    updateCursos(cursosActualizados);
    console.log(cursosActualizados);
  }

  const obtenerSesiones = (horario) => {
    if (!horario.sesiones || horario.sesiones.length === 0) {
      return 'Sin sesiones';
    }
  
    // Mapeamos las sesiones para formar una cadena con el día y las horas
    return horario.sesiones.map(sesion => 
      `${sesion.dia}: ${sesion.horaInicio} - ${sesion.horaFin}`
    ).join('\n'); // Unimos todas las sesiones en una cadena separada por comas
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
            <TableCell align='center' sx={estilosEncabezado()}>Horarios</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cursosPaginados.map((curso,index) => {
            // Calcula el índice global basado en la página actual
            const indexGlobal = (page - 1) * rowsPerPage + index;

            return (
              <TableRow key={curso.codigo}>
                <TableCell align='center' sx={{ padding: '6px' }}>{curso.codigo}</TableCell>
                <TableCell align='center' sx={{ padding: '6px' }}>{curso.nombre}</TableCell>
                <TableCell align='center' sx={{ padding: '6px' }}>{curso.creditos}</TableCell>
                {/* Aquí en la misma fila principal colocamos la lista de horarios */}
                <TableCell>
                  <Table size="small">
                    <TableBody>
                      {curso.horarios && curso.horarios.map((horario) => (
                        <TableRow key={horario.idHorario}>
                          <TableCell align='center' sx={{ padding: '6px' }}>{horario.codigo}</TableCell>
                          <TableCell align='center' sx={{ padding: '6px', display: 'flex', justifyContent: 'center' }}>
                              <Typography component="span" style={{ textAlign: 'left', whiteSpace: 'pre-line' }}>
                                {obtenerSesiones(horario)}
                              </Typography>
                          </TableCell>
                          <TableCell align='center' sx={{ padding: '6px' }}>
                          <Checkbox
                                onChange={() => handleActualizarCursos(indexGlobal, horario.idHorario)}
                                color="primary"
                                checked={horario.seleccionado}
                              />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
        count={Math.ceil(cursos.length / rowsPerPage)} // Número total de páginas
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

export default TablaSolicitudAdicional;
