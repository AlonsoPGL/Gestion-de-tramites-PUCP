import React, { useEffect, useState } from 'react';
import { Button,Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Pagination, Box } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import EditIcon from '@mui/icons-material/Edit';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';

const rowsPerPage = 7; // Define la cantidad de filas por página

const TablaSegundoFiltro = ({postulaciones = []}) => {
  // Estado para manejar la paginación
  const [page, setPage] = useState(1); // Página actual (empezamos desde 1)

  // Maneja el cambio de página en el componente de paginación
  const handleChangePage = (event, value) => {
    setPage(value);
  };
// Filtrar las solicitudes a mostrar por página, asegurándose de que solicitudes sea un array
const postulacionesPaginadas = Array.isArray(postulaciones) ? postulaciones.slice((page - 1) * rowsPerPage, page * rowsPerPage) : [];


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
  const handleClickInfo = (postulacion) => {
    router.push(`/comiteSeleccion/docentes/listarPrimerFiltro/visualizarPostulacion?id=${postulacion.id}`);
  }

const handleDescargarCV = async (postulacion) => {
  try {
    // Asegúrate de que Axios reciba la respuesta como 'blob'
    const response = await axios.get(`http://localhost:8080/postulaciones/buscarCV/${postulacion.id}`, {
      responseType: 'blob'
    });

    // Verifica si el estado de la respuesta es exitoso (200-299)
    if (response.status >= 200 && response.status < 300) {
      const url = URL.createObjectURL(response.data); // Crea un objeto URL para el blob
      const a = document.createElement('a');
      a.href = url;
      a.download = `cv_postulacion_${postulacion.id}.pdf`; // Cambia el nombre del archivo si es necesario
      a.click();
      URL.revokeObjectURL(url); // Libera el objeto URL después de la descarga
      console.log("Archivo listo para descargar.");
    } else {
      console.error('Error al obtener el CV:', response.status);
    }
  } catch (err) {
    console.error("Error al obtener el CV:", err.message);
  }
}
const handleVerPuntuacion = (postulacion) => {
  router.push(`/comiteSeleccion/docentes/listarSegundoFiltro/visualizarPuntuacion?id=${postulacion.id}`);
}
const handleEditarPuntuacion = (postulacion) => {
  router.push(`/comiteSeleccion/docentes/listarSegundoFiltro/registrarPuntuacion?id=${postulacion.id}`);
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
              <TableCell align='center' sx={estilosEncabezado()}>Correo</TableCell>
              <TableCell align='center' sx={estilosEncabezado()}>CV</TableCell>
              <TableCell align='center' sx={estilosEncabezado()}>Información</TableCell>
              <TableCell align='center' sx={estilosEncabezado()}>Estado</TableCell>
              <TableCell align='center' sx={estilosEncabezado()}>Aprobación</TableCell>
            </TableRow>
          </TableHead>

          {/* Cuerpo de la tabla */}
          <TableBody>
            {postulacionesPaginadas.map((postulacion) => (
              <TableRow key={postulacion.id}>
                {/* Muestra el número de página */}
                <TableCell align='center' sx={{ padding: '11px' }}>{postulacion.dni}</TableCell>
                <TableCell align='center' sx={{ padding: '11px' }}>{postulacion.nombrePostulante+" "+postulacion.apelidoPaternoPostulante+" "+postulacion.apelidoMaternoPostulante}</TableCell>
                <TableCell align='center' sx={{ padding: '11px' }}>{postulacion.correo}</TableCell>
                <TableCell align='center' sx={{ padding: '11px' }}>{
                                      <Button onClick={() => handleDescargarCV(postulacion)}>
                                      <AssignmentIndIcon color="primary" />
                                      </Button>
                    }</TableCell>
                <TableCell align='center' sx={{ padding: '11px' }}>{
                                      <Button onClick={() => handleClickInfo(postulacion)}>
                                      <InfoIcon color="primary" />
                                      </Button>                    
                    }</TableCell>
                <TableCell align="center" sx={{ padding: '11px' }}>
                    {postulacion.estado === 'ESPERA_PASAR_SEGUNDO_FILTRO' || postulacion.estado === 'PASO_PRIMER_FILTRO' ? (
                         <>
                         <span>Pendiente</span>
                    </>
                    ) :
                        <span>Revisado</span>}
                </TableCell>
                <TableCell align='center' sx={{ padding: '11px' }}>
                    {postulacion.estado === 'ESPERA_PASAR_SEGUNDO_FILTRO' || postulacion.estado === 'PASO_PRIMER_FILTRO'? (
                 <>
                  <Button onClick={() => handleEditarPuntuacion(postulacion)}>
                  <EditIcon color="primary" />
                  </Button>
                  </>
                    ) : (
                      <Button onClick={() => handleVerPuntuacion(postulacion)}>
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
          count={Math.ceil(postulaciones.length / rowsPerPage)} // Número total de páginas
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

export default TablaSegundoFiltro;