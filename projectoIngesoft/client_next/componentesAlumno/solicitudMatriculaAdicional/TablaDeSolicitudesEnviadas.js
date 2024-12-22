import React, { useEffect, useState } from 'react';
import { Button,Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Pagination, Box } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const solicitudes = [
    { codigo: '20230001', fechaDeRegistro: '2024-09-15', estado: 'Por revisar', fechaDeActualizacion: '2024-09-16' },
    { codigo: '20230002', fechaDeRegistro: '2024-09-14', estado: 'Aprobado', fechaDeActualizacion: '2024-09-15' },
    { codigo: '20230003', fechaDeRegistro: '2024-09-13', estado: 'Rechazado', fechaDeActualizacion: '2024-09-14' },
    { codigo: '20230004', fechaDeRegistro: '2024-09-12', estado: 'Por revisar', fechaDeActualizacion: '2024-09-13' },
    { codigo: '20230005', fechaDeRegistro: '2024-09-11', estado: 'Aprobado', fechaDeActualizacion: '2024-09-12' },
    { codigo: '20230006', fechaDeRegistro: '2024-09-10', estado: 'Rechazado', fechaDeActualizacion: '2024-09-11' },
    { codigo: '20230007', fechaDeRegistro: '2024-09-09', estado: 'Por revisar', fechaDeActualizacion: '2024-09-10' },
    { codigo: '20230008', fechaDeRegistro: '2024-09-08', estado: 'Aprobado', fechaDeActualizacion: '2024-09-09' },
    { codigo: '20230009', fechaDeRegistro: '2024-09-07', estado: 'Rechazado', fechaDeActualizacion: '2024-09-08' },
    { codigo: '20230010', fechaDeRegistro: '2024-09-06', estado: 'Por revisar', fechaDeActualizacion: '2024-09-07' },
    { codigo: '20230011', fechaDeRegistro: '2024-09-05', estado: 'Aprobado', fechaDeActualizacion: '2024-09-06' }
    
  // Agrega más cursos si es necesario
];

const rowsPerPage = 7; // Define la cantidad de filas por página

const TablaDeSolicitudesEnviadas = () => {
  // Estado para manejar la paginación
  const [page, setPage] = useState(1); // Página actual (empezamos desde 1)

  // Maneja el cambio de página en el componente de paginación
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // Filtrar los cursos a mostrar por página
  const cursosPaginados = solicitudes.slice((page - 1) * rowsPerPage, page * rowsPerPage);

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

  //!router para redirigir ---------------------------------------------------------------------------------------
  const router=useRouter();
  //Para que el click en el eyeIcon rediriga a la solicitud 
  const handleClickVisualizar = () =>{
    //Llamar un query que recupere un array y luego redireccionar a la pagina de resumenVisualizacion con esta data para su renderizado
    router.push("./listadoDeSolicitudesAdicionales/resumenVisualizacion");
  }

  return (
    <Box>
      <TableContainer component={Paper} sx={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', overflow: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          {/* Encabezado de la tabla */}
          <TableHead sx={{backgroundColor:'#363581'}}>
            <TableRow>
              <TableCell align='center' sx={estilosEncabezado()}>N° Solicitud</TableCell> {/*Si quiero agregar un tamaño definido debo de utilizar  sx={{fontSize:'10px'}} dentro de TableCell*/}
              <TableCell align='center' sx={estilosEncabezado()}>Fecha de registro</TableCell>
              <TableCell align='center' sx={estilosEncabezado()}>Estado</TableCell>
              <TableCell align='center' sx={estilosEncabezado()}>Fecha de última actualización</TableCell>
              <TableCell align='center' sx={estilosEncabezado()}>Ver detalle</TableCell>
            </TableRow>
          </TableHead>

          {/* Cuerpo de la tabla */}
          <TableBody>
            {cursosPaginados.map((solicitudes, index) => (
              <TableRow key={solicitudes.codigo}>
                {/* Muestra el número de página */}
                <TableCell align='center' sx={{ padding: '11px' }}>{solicitudes.codigo}</TableCell> {/* Cambia el padding aquí */}
                <TableCell align='center' sx={{ padding: '11px' }}>{solicitudes.fechaDeRegistro}</TableCell>
                <TableCell align='center' sx={{ padding: '11px' }}>{solicitudes.estado}</TableCell>
                <TableCell align='center' sx={{ padding: '11px' }}>{solicitudes.fechaDeActualizacion}</TableCell>
                <TableCell align='center' sx={{ padding: '51px' }}>
                    <Button align='center' onClick={handleClickVisualizar}>
                        <Visibility color="primary" /> {/* Checkbox para seleccionar horario */}
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginador debajo de la tabla */}
      <Box display="flex" justifyContent="end" mt={2}>
        <Pagination
          count={Math.ceil(solicitudes.length / rowsPerPage)} // Número total de páginas
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

export default TablaDeSolicitudesEnviadas;
