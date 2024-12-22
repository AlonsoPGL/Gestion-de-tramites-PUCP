"use client";

import { Box ,TableContainer,TableCell,TableRow,Paper,Table,TableHead,TableBody,Pagination,Typography, Button, Grid} from "@mui/material";
import { useState } from "react";
import { TextField, InputAdornment } from "@mui/material";
import axios from 'axios';

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
const TablaBusquedaDocentes = ({ onClose, alumnosBase, setAlumnos }) => {
    // Estado para manejar la paginación
    const [page, setPage] = useState(1); // Página actual (empezamos desde 1)
  
    // Maneja el cambio de página en el componente de paginación
    const handleChangePage = (event, value) => {
      setPage(value);
    };


    const estilosEncabezado = () => {
      return { color: 'white', fontWeight: 'bold' };
    };
  
    const estilosIndice = () => {
      return {
        '& .Mui-selected': {
          color: '#fafafa', // Color del texto o número seleccionado
          backgroundColor: '#363581', // Color de fondo del botón seleccionado
        },
      };
    };
  
    //! Agregando el alumno seleccionado al array
    const handleClickAgregarAlumno = (nuevoAlumno) => {
      const alumnosUpdate = [...alumnosBase, nuevoAlumno]; // Añadir el nuevo alumno
      console.log(alumnosBase);
      console.log(nuevoAlumno);
      console.log(alumnosUpdate);
      setAlumnos(alumnosUpdate);
      onClose(); // Cierra el modal
    };

    const funcionSeleccionar = (alumno) => (
      <Typography
        onClick={() => handleClickAgregarAlumno(alumno)}
        sx={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}
      >
        Seleccionar
      </Typography>
    );

    //! Logica de la barra de busqueda

    async function fetchAlumnosPorParametros({ nombres, apellidoPaterno, apellidoMaterno, codigo }) {
      try {
          // Filtrar solo los parámetros que no están vacíos
          const params = { apellidoPaterno, apellidoMaterno, nombres, codigo };
          const filteredParams = Object.fromEntries(
              Object.entries(params).filter(([_, v]) => v !== '') // Excluye los campos vacíos
          );
  
          // Realizar la petición utilizando los parámetros filtrados
          const response = await axios.get('http://localhost:8080/rrhh/docente/buscarPorParametros', {
              params: filteredParams,
          });
          console.log(response.data);
          return response.data;
  
      } catch (error) {
          if (error.response && error.response.status === 404) {
              throw new Error("No se encontraron alumnos con los criterios proporcionados.");
          } else {
              throw new Error("Error interno del servidor.");
          }
      }
  }
  
  const handleClickBuscar = async () => {
      try {
          const alumnosResponse = await fetchAlumnosPorParametros({
              nombres: nuevoNombre,
              apellidoPaterno: nuevoApellidoPaterno,
              apellidoMaterno: nuevoApellidoMaterno,
              codigo: nuevoCodigo,
          });
          setAlumnosBusqueda(alumnosResponse);
          console.log(alumnosResponse); // Cambiado de `alumnos` a `alumnosResponse` para ver el resultado correcto
      } catch (error) {
          console.error(error.message); // Manejo de errores
      }
  };
    

    //! Almacenado de informacion para realizar la busqueda
    const [nuevoNombre, setNuevoNombre] = useState(''); // Cambia null por ''
    const [nuevoApellidoPaterno, setNuevoApellidoPaterno] = useState('');
    const [nuevoApellidoMaterno, setNuevoApellidoMaterno] = useState('');
    const [nuevoCodigo, setNuevoCodigo] = useState('');
    
    //! Resultado de la búsqueda y lo que se piensa renderizar en la tabla
    const [alumnosBusqueda, setAlumnosBusqueda] = useState([]);
    /*const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          handleClickBuscar(); // Llama a la función al presionar Enter
        }
      };*/

    // Filtrar los cursos a mostrar por página
    const alumnosPaginados = (alumnosBusqueda || []).slice((page - 1) * rowsPerPage, page * rowsPerPage);

    //!Return del componente
    return (
      <Box>
        <Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <TextField
                label="Nombre"
                variant="outlined"
                fullWidth
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
              />
            </Box>
            <Box>
              <TextField
                label="Apellido Paterno"
                variant="outlined"
                fullWidth
                value={nuevoApellidoPaterno}
                onChange={(e) => setNuevoApellidoPaterno(e.target.value)}
              />
            </Box>
            <Box>
              <TextField
                label="Apellido Materno"
                variant="outlined"
                fullWidth
                value={nuevoApellidoMaterno}
                onChange={(e) => setNuevoApellidoMaterno(e.target.value)}
              />
            </Box>
            <Box>
              <TextField
                label="Código"
                variant="outlined"
                fullWidth
                value={nuevoCodigo}
                onChange={(e) => setNuevoCodigo(e.target.value)}
              />
            </Box>
            {/* Botón de búsqueda */}
            <Box sx={{ marginBottom: '20px', textAlign: 'center' }}>
              <Button variant="contained" color="primary" onClick={handleClickBuscar}>
                Buscar
              </Button>
            </Box>
          </Box>
        </Box>

        <TableContainer component={Paper} sx={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', overflow: 'auto' }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            {/* Encabezado de la tabla */}
            <TableHead sx={{ backgroundColor: '#363581' }}>
              <TableRow>
                <TableCell align="center" sx={estilosEncabezado()}>Código</TableCell>
                <TableCell align="center" sx={estilosEncabezado()}>Nombre</TableCell>
                <TableCell align="center" sx={estilosEncabezado()}>Correo</TableCell>
                <TableCell align="center" sx={estilosEncabezado()}>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alumnosPaginados.map((alumno) => (
                <TableRow key={alumno.codigo}>
                  <TableCell align="center" sx={{ padding: '11px' }}>{alumno.codigo}</TableCell>
                  <TableCell align="center" sx={{ padding: '11px' }}>{alumno.nombre+" "+alumno.apellidoPaterno+" "+alumno.apellidoMaterno}</TableCell>
                  <TableCell align="center" sx={{ padding: '11px' }}>{alumno.email}</TableCell>
                  <TableCell align="center" sx={{ padding: '11px' }}>{funcionSeleccionar(alumno)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
  
        {/* Paginador debajo de la tabla */}
        <Box display="flex" justifyContent="end" mt={2}>
          <Pagination
            count={Math.ceil(alumnosBusqueda.length / rowsPerPage)} // Número total de páginas
            page={page} // Página actual
            onChange={handleChangePage} // Manejador de cambio de página
            size="large"
            color="primary"
            sx={estilosIndice()}
          />
        </Box>
      </Box>
    );
  };
  
  export default TablaBusquedaDocentes;