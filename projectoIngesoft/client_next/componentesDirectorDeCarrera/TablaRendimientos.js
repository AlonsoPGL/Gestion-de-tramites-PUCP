import React, { useMemo, useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress } from "@mui/material";

// Funciones auxiliares permanecen igual
function agruparPorAlumnoEnRiesgoXHorario(data) {
  const mapa = new Map();
  for (const item of data) {
    const arxhId = item.alumnoEnRiesgoXHorarioDTO.id;
    if (!mapa.has(arxhId)) {
      mapa.set(arxhId, []);
    }
    mapa.get(arxhId).push(item);
  }
  return mapa;
}

function obtenerMaximoSolicitudes(mapaAgrupado) {
  let max = 0;
  for (const [_, items] of mapaAgrupado.entries()) {
    if (items.length > max) {
      max = items.length;
    }
  }
  return max;
}

function obtenerColorRendimientoAzules(rendimiento) {
  if (rendimiento == null) {
    return '';
  }

  const intensidades = {
    1: '#d6eaff',
    2: '#adcfff',
    3: '#85b6ff',
    4: '#6ea8fe',
    5: '#4d94f8'
  };
  return intensidades[rendimiento] || '';
}

function obtenerColorRendimiento(rendimiento) {
  if (rendimiento == null) {
    return '';
  }

  const coloresPastel = {
    1: 'rgba(255, 77, 77, 0.5)', // Rojo intenso
    2: 'rgba(255, 165, 77, 0.5)', // Naranja
    3: 'rgba(255, 255, 102, 0.5)', // Amarillo
    4: 'rgba(119, 221, 153, 0.5)', // Verde cactus claro (pastel)
    5: 'rgba(34, 139, 34, 0.5)',
  };

  return coloresPastel[rendimiento] || '';
}


export default function TablaRendimientos({ data, isLoading = false }) {
  // Agrupar las solicitudes por alumno
  const mapaAgrupado = useMemo(() => agruparPorAlumnoEnRiesgoXHorario(data), [data]);
  const maxSolicitudes = useMemo(() => obtenerMaximoSolicitudes(mapaAgrupado), [mapaAgrupado]);

  // Array para iterar las columnas de rendimiento
  const rendimientoColumns = Array.from({ length: maxSolicitudes }, (_, i) => i + 1);

  // El render
  return (
    <Box>
      <Typography sx={{fontStyle: 'italic', color: 'black'}}>
        El rendimiento de los alumnos es calificado por los docentes del 1 (muy malo) al 5 (muy bueno).
      </Typography>
      <TableContainer component={Paper} sx={{ maxWidth: '100%', mt: 2, borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', overflow: 'hidden', }}>
        <Table sx={{ borderCollapse: 'collapse' }}>
          <TableHead>
            {/* Primera fila de cabecera */}
            <TableRow>
              <TableCell
                colSpan={2}
                sx={{
                  backgroundColor: '#363581',
                  color: 'white',
                  borderRight: '2px solid white', // Línea separadora entre Alumno y Curso
                }}
                align="center"
              >
                Alumno
              </TableCell>
              <TableCell
                colSpan={4}
                sx={{
                  backgroundColor: '#363581',
                  color: 'white',
                  borderRight: '2px solid white', // Línea separadora entre Curso y Rendimiento
                }}
                align="center"
              >
                Curso
              </TableCell>
              <TableCell
                colSpan={maxSolicitudes}
                sx={{ backgroundColor: '#363581', color: 'white' }}
                align="center"
              >
                Rendimiento
              </TableCell>
            </TableRow>
            {/* Segunda fila de cabecera */}
            <TableRow>
              <TableCell
                sx={{
                  backgroundColor: '#6a73ae',
                  color: 'white',
                }}
                align="center"
              >
                Código
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: '#6a73ae',
                  color: 'white',
                  borderRight: '2px solid white',
                }}
                align="center"
              >
                Nombre
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: '#6a73ae',
                  color: 'white',
                }}
                align="center"
              >
                Código Curso
              </TableCell>
              <TableCell sx={{ backgroundColor: '#6a73ae', color: 'white' }} align="center">
                Nombre
              </TableCell>
              <TableCell sx={{ backgroundColor: '#6a73ae', color: 'white' }} align="center">
                Horario
              </TableCell>
              <TableCell sx={{ backgroundColor: '#6a73ae', color: 'white',
                  borderRight: '2px solid white', }} align="center">
                Vez
              </TableCell>
              {rendimientoColumns.map((col) => (
                <TableCell
                  key={col}
                  sx={{ backgroundColor: '#6a73ae', color: 'white' }}
                  align="center"
                >
                  R{col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align='center' sx={{ py: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 2 }}>
                    <CircularProgress />
                    <Typography variant='subtitle1' color='textSecondary'>
                      Cargando información...
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {[...mapaAgrupado.keys()].map(alumKey => {
                  const items = mapaAgrupado.get(alumKey);
                  if (items.length === 0) return null;
                  const alumnoInfo = items[0].alumnoEnRiesgoXHorarioDTO.alumno;
                  const horarioInfo = items[0].alumnoEnRiesgoXHorarioDTO.horario;

                  const sortedItems = items.slice().sort((a, b) => a.id - b.id);

                  return (
                    <TableRow key={alumKey} sx={{ backgroundColor: '#F8F9FA' }}>
                      <TableCell align='center'>{alumnoInfo.codigo}</TableCell>
                      <TableCell align='center'>{`${alumnoInfo.nombre} ${alumnoInfo.apellidoPaterno} ${alumnoInfo.apellidoMaterno}`}</TableCell>
                      <TableCell align='center'>{horarioInfo.codigoCurso}</TableCell>
                      <TableCell align='center'>{horarioInfo.nombreCurso}</TableCell>
                      <TableCell align='center'>{horarioInfo.codigo}</TableCell>
                      <TableCell align='center'>{items[0].alumnoEnRiesgoXHorarioDTO.vez}</TableCell>

                      {rendimientoColumns.map((colIndex) => {
                        const item = sortedItems[colIndex - 1];
                        if (item) {
                          const color = obtenerColorRendimientoAzules(item.puntajeRendimiento);
                          return (
                            <TableCell
                              key={colIndex}
                              align='center'
                              sx={{ backgroundColor: color , fontWeight: 'bold', }}
                            >
                              {item.puntajeRendimiento !== null ? item.puntajeRendimiento : ''}
                            </TableCell>
                          );
                        } else {
                          return <TableCell key={colIndex} align='center'></TableCell>;
                        }
                      })}
                    </TableRow>
                  );
                })}
                {!isLoading && mapaAgrupado.size === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align='center'>
                      <Typography variant='subtitle1' color='textSecondary'>
                        No se encontraron registros.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}