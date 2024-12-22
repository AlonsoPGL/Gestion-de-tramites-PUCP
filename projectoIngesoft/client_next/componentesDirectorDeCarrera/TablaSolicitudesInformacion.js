import React, { useState, useEffect } from 'react'; 
import { Box, Button, IconButton, Typography, Switch, TextField, CircularProgress } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import Pagination from "@mui/material/Pagination";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export default function TablaSolicitudesInformacion({ idAluXH }) {
  const router = useRouter();
  const [solicitudes, setSolicitudes] = useState([]);
  const [filtroAbierto, setFiltroAbierto] = useState(false);
  const [filtroFechaMin, setFiltroFechaMin] = useState('');
  const [filtroFechaMax, setFiltroFechaMax] = useState('');
  const [page, setPage] = useState(1); 
  const rowsPerPage = 5;
  const [loading, setLoading] = useState(true);
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' or 'desc'
  const [sortColumn, setSortColumn] = useState('fechaSolicitud'); // 'fechaSolicitud' or 'fechaRespuesta'

  const obtenerSolicitudes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/solicitudes/infoAlumnosEnRiesgo/listarSolicitudesPorAlumnoEnRiesgoXHorario`, {
        params: { idAluxhor: idAluXH }
      });
      setSolicitudes(response.data);
      console.log("Las solicitudes son: ");
      console.log(response.data);
    } catch (error) {
      console.error("Error al obtener la lista de solicitudes:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    obtenerSolicitudes();
  }, [idAluXH]);

  // Filtrar las solicitudes según los filtros
  const solicitudesFiltradas = solicitudes.filter(solicitud => {
    // Filtrar solo respondidas
    if (filtroAbierto && solicitud.fechaRespuesta === null) {
      return false;
    }

    // Filtrar por rango de fechas
    if ((filtroFechaMin || filtroFechaMax) && solicitud.fechaSolicitud) {
      const fechaSolicitud = new Date(solicitud.fechaSolicitud);
      if (filtroFechaMin) {
        const fechaMin = new Date(filtroFechaMin);
        fechaMin.setHours(fechaMin.getHours() + 5);
        fechaMin.setHours(0, 0, 0, 0);
        if (fechaSolicitud < fechaMin) {
          return false;
        }
      }
      if (filtroFechaMax) {
        const fechaMax = new Date(filtroFechaMax);
        fechaMax.setHours(fechaMax.getHours() + 5); 
        fechaMax.setHours(23, 59, 59, 999);
        if (fechaSolicitud > fechaMax) {
          return false;
        }
      }
    }

    return true;
  });

  // Function to sort by a selected date column
  const solicitudesOrdenadas = [...solicitudesFiltradas].sort((a, b) => {
    const dateA = a[sortColumn] ? new Date(a[sortColumn]) : null;
    const dateB = b[sortColumn] ? new Date(b[sortColumn]) : null;

    // Handle nulls for primary column
    if (!dateA && !dateB) return 0; // Both null
    if (!dateA) return 1;  // Nulls go last
    if (!dateB) return -1;  // Nulls go last

    // Primary column comparison
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const handleSortDate = (column) => {
    if(sortColumn === column){
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); // Toggle direction
    } else{
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleVerDetallesSolicitud = async (solicitud) => {
    console.log("Porque no salee si tengo "+ solicitud.id);
    try {
      const response = await axios.put(`http://localhost:8080/solicitudes/infoAlumnosEnRiesgo/revisionSolicitud`, null, {
        params: {
          idSolicitud: solicitud.id,
          leido: true
        }
      });

      console.log(response);
      if (response.status === 200) {
        router.push(`/directorCarrera/alumnosEnRiesgo/listado/solicitudinformacion?idSolicitud=${solicitud.id}`);
      } else {
        console.error("Error al actualizar la solicitud:", response.data);
      }
    } catch (error) {
      console.error("Error en la solicitud PUT:", error);
    }
  };
  
  return (
    <>
    {/* Filtros */}
    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '30px', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant='subtitle1'>Mostrar solo respondidas</Typography>
        <Switch checked={filtroAbierto} onChange={(event) => setFiltroAbierto(event.target.checked)} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant='subtitle1'>Filtrar desde:</Typography>
        <TextField
          type="date"
          variant="outlined"
          label="Fecha mínima"
          InputLabelProps={{ shrink: true }}
          inputProps={{
            min: "2024-01-01",
            max: "2024-12-31",
          }}
          value={filtroFechaMin}
          onChange={(event) => setFiltroFechaMin(event.target.value)}
          sx={{ width: 220 }}
        />
        <Typography variant='subtitle1'>hasta:</Typography>
        <TextField
          type="date"
          variant="outlined"
          label="Fecha máxima"
          InputLabelProps={{ shrink: true }}
          inputProps={{
            min: "2024-01-01",
            max: "2024-12-31",
          }}
          value={filtroFechaMax}
          onChange={(event) => setFiltroFechaMax(event.target.value)}
          sx={{ width: 220 }}
        />
      </Box>
    </Box>

    <TableContainer component={Paper} sx={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', overflow: 'auto' }}>
      <Table sx={{ borderCollapse: 'collapse' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: '#363581', color: 'white' }} align='center'>
              <Box
                onClick={() => handleSortDate('fechaSolicitud')}
                sx={{
                  cursor: 'pointer',
                  alignItems: 'center',
                  '&:hover': { color: '#eaeaff' }, // Change color on hover
                }}
              >
                <span><strong>Fecha de Solicitud</strong></span>
                {sortColumn === 'fechaSolicitud' && (
                  <IconButton size="small" sx={{ ml: 1 }}>
                    {sortDirection === 'asc' ? <ArrowUpwardIcon sx={{color: 'white'}}/> : <ArrowDownwardIcon sx={{color: 'white'}}/>}
                  </IconButton>
                )}
              </Box>
            </TableCell>
            <TableCell sx={{ backgroundColor: '#363581', color: 'white' }} align='center'>
              <Box
                onClick={() => handleSortDate('fechaRespuesta')}
                sx={{
                  cursor: 'pointer',
                  alignItems: 'center',
                  '&:hover': { color: '#eaeaff' }, // Change color on hover
                }}
              >
                <span><strong>Fecha de Respuesta</strong></span>
                {sortColumn === 'fechaRespuesta' && (
                  <IconButton size="small" sx={{ ml: 1 }}>
                    {sortDirection === 'asc' ? <ArrowUpwardIcon sx={{color: 'white'}}/> : <ArrowDownwardIcon sx={{color: 'white'}}/>}
                  </IconButton>
                )}
              </Box>
            </TableCell>
            <TableCell sx={{ backgroundColor: '#363581', color: 'white' }} align='center'><strong>Estado</strong></TableCell>
            <TableCell sx={{ backgroundColor: '#363581', color: 'white' }} align='center'><strong>Rendimiento</strong></TableCell>
            <TableCell sx={{ backgroundColor: '#363581', color: 'white' }} align='center'><strong>Acciones</strong></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {loading  ? (
            <TableRow>
              <TableCell colSpan={5} align='center' sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 2 }}>
                  <CircularProgress />
                  <Typography variant='subtitle1' color='textSecondary'>
                    Cargando información...
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) :  (
            <>
            {solicitudesOrdenadas &&
            solicitudesOrdenadas.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((solicitud) => {
              const fechaSolicitud = new Date(solicitud.fechaSolicitud);
              const fechaSolicitudFormatted = solicitud.fechaSolicitud
                ? fechaSolicitud.toLocaleString('es-ES', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })
                : 'Desconocida';
              const fechaRespuesta = solicitud.fechaRespuesta ? new Date(solicitud.fechaRespuesta) : null;
              const fechaRespuestaFormatted = fechaRespuesta
                ? fechaRespuesta.toLocaleString('es-ES', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })
                : 'Sin respuesta';

              return (
                <TableRow key={solicitud.id} sx={{ backgroundColor: '#F8F9FA' }}>
                  <TableCell align='center'>{fechaSolicitudFormatted}</TableCell>
                  <TableCell align='center'>{fechaRespuestaFormatted}</TableCell>
                  <TableCell align='center'>{solicitud.leido ? 'Leída' : solicitud.abierto ? 
                                      'Sin respuesta' : 'Respondida'}</TableCell>
                  <TableCell align='center'>
                    {solicitud.puntajeRendimiento !== null ? solicitud.puntajeRendimiento : 'Sin calificar'}
                  </TableCell>
                  <TableCell align='center'>                    
                    <IconButton onClick={() => handleVerDetallesSolicitud(solicitud)}
                      disabled={solicitud.abierto}  
                    >
                      <VisibilityIcon sx={{ color: solicitud.abierto ? '#9e9e9e' : '#363581'}} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
            {solicitudesOrdenadas.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align='center'>
                  <Typography variant='subtitle1' color='textSecondary'>
                    No se encontraron solicitudes para este alumno.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>

    {solicitudesOrdenadas && (
      <Box sx={{ display: "flex", justifyContent: "flex-end", padding: "20px" }}>
        <Pagination
          count={Math.ceil(solicitudesOrdenadas.length / rowsPerPage)} // Número total de páginas
          page={page} // Página actual
          onChange={handleChangePage} // Manejador de cambio de página
          size="large"
          color="primary"
        />
      </Box>
    )}

  </>
  );
}
