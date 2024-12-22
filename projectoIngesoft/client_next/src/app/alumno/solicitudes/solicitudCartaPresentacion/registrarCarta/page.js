"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Typography, IconButton, MenuItem, Select, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ErrorConDescripcion from '../../../../../../componentesGenerales/modales/ErrorConDescripcion';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { usePersona } from '@/app/PersonaContext';
import { useUnidad } from '@/app/UnidadContex';
export default function CartaPresentacion() {
  const router = useRouter();
  const { persona } = usePersona();
  const { unidad } = useUnidad();
  const [currentDate, setCurrentDate] = useState('');
  const [emisorDTO,setEmisorDTO]=useState();
  const [alumnos, setAlumnos] = useState([
    {
      id: persona.id, // ID de la persona
      nombre: persona.nombre, // Nombre de la persona
      apellidoPaterno: persona.apellidoPaterno, // Apellido paterno de la persona
      apellidoMaterno: persona.apellidoMaterno, // Apellido materno de la persona
      email: persona.email, // Email de la persona
      DNI: persona.DNI || 0, // DNI, con valor por defecto 0 si no existe
      edad: persona.edad || 0, // Edad, con valor por defecto 0 si no existe
      codigo: persona.codigo || 0, // Código, con valor por defecto 0 si no existe
      tipo: persona.tipo || "ADMINISTRADOR", // Suponiendo que hay un tipo correspondiente
    },
  ]);
  const [personaSeleccionada, setPersonaSeleccionada] = useState(null);
  const [curso, setCurso] = useState('');
  const [actividades, setActividades] = useState('');
  const [openAlumnoModal, setOpenAlumnoModal] = useState(false);
  const [openAlumnoEditModal, setOpenAlumnoEditModal] = useState(false);
    // Estado para almacenar los valores de búsqueda
    const [claveCurso, setClaveCurso] = useState('');
    const [nombreCurso, setNombreCurso] = useState('');
    const [unidadAcademica, setUnidadAcademica] = useState('');

// Estado para almacenar los resultados de búsqueda
    const [resultados, setResultados] = useState([]);
    const [resultadosAlumnos, setResultadosAlumnos] = useState([]);
    const [error, setError] = useState('');
    const [errorAlumno, setErrorAlumno] = useState('');
  const [open, setOpen] = useState(false);

  const [profesor, setProfesor] = useState(null);
  const [horarios, setHorarios] = useState([]); // Estado para almacenar los profesores
  const [cursoFinal, setCursofinal] = useState(null);
  const [especialidad, setEspecialidad] = useState({});
  const [profesorFinal, setProfesorfinal] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTexto, setModalTexto] = useState('');
  const obtenerProfesores = async (idCurso) => {
    if (!idCurso) {
      console.log("No se puede obtener profesores sin un idCurso.");
      return;
    }
  
    try {
      const response = await axios.get(`http://localhost:8080/institucion/horario/curso/${idCurso}`);
      if (response.data && response.data.length > 0) {
        setHorarios(response.data);
        setProfesorfinal(response.data[0]?.docentes[0] || {});
      }
    } catch (error) {
      console.error("Error al obtener los profesores", error);
    }
  };

  // Llama a la API del backend cuando el componente se monta o cuando el dropdown se abre
  useEffect(() => {
    obtenerProfesores();
  }, []);
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]; // Obtiene la fecha en formato YYYY-MM-DD
    setCurrentDate(today);
  }, []);
  // Funciones para abrir y cerrar el diálogo
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleOpen = (alumno) => {
    setSelectedAlumno(alumno);  // Guardamos los datos del alumno seleccionado
    setOpen(true);              // Abrimos el modal
  };

  const handleClose = () => {
    setOpen(false);
  };
  
     // Estados para la búsqueda de alumno
     const [nuevoNombre, setNuevoNombre] = useState('');
     const [nuevoApellidoPaterno, setNuevoApellidoPaterno] = useState('');
     const [nuevoApellidoMaterno, setNuevoApellidoMaterno] = useState('');
     const [nuevoCodigo, setNuevoCodigo] = useState('');

     const [editNombre, setEditNombre] = useState('');
     const [editApellidoPaterno, setEditApellidoPaterno] = useState('');
     const [editApellidoMaterno, setEditApellidoMaterno] = useState('');
     const [editCodigo, setEditCodigo] = useState('');
     const [indexAlumnoSeleccionado, setIndexAlumnoSeleccionado] = useState(null);

     const handleOpenEditAlumnoModal = (index,alumno) => {
      // Llenar los valores con los datos del alumno seleccionado
      setIndexAlumnoSeleccionado(index);
      setEditNombre(alumno.nombre);
      setEditApellidoPaterno(alumno.apellidoPaterno);
      setEditApellidoMaterno(alumno.apellidoMaterno);
      setEditCodigo(alumno.codigo);
      
      setPersonaSeleccionada(alumno); // Guardar referencia del alumno que se está editando
      setOpenAlumnoEditModal(true); // Abrir el modal
    };
  
    const handleCloseEditAlumnoModal = () => {
      setOpenAlumnoEditModal(false);
    };

    const handleUpdateAlumno = (alumnoActualizado) => {
      if (indexAlumnoSeleccionado !== null) {
        // Reemplaza directamente el alumno en la posición correspondiente
        setAlumnos((prevAlumnos) => {
          const nuevosAlumnos = [...prevAlumnos];
          nuevosAlumnos[indexAlumnoSeleccionado] = alumnoActualizado; // Reemplaza en el índice correcto
          return nuevosAlumnos;
        });
      }
      handleCloseEditAlumnoModal();
    };

     
    const handleGuardar = async () => {
      // Validar si se seleccionó un curso y un profesor
      console.log("llego aqui")
      if (!cursoFinal || !profesor) {
        console.log("llego aqui2")
        setModalTexto('Por favor, selecciona un curso y un profesor antes de guardar.');
        setIsModalOpen(true);
        return; // Salir de la función
      }
      console.log("llego aqui2")
      try {
        const dataToSend = {
          emisor:{
            id:persona.id
          },
          integrantes: alumnos,
          curso: cursoFinal,
          profesor: profesor,
          especialidad: especialidad,
        };
        
        console.log(dataToSend);
        const response = await fetch(`http://localhost:8080/solicitudes/carta/insertar?unidadId=${unidad.idUnidad}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        });
  
        console.log('Solicitud guardada:', response.data);
        router.back(); // Regresar a la página anterior
      } catch (error) {
        console.error('Error al guardar la solicitud:', error);
      }
    };
  

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };



  const handleBuscarEditAlumno = async () => {
    try {
      const response = await axios.get('http://localhost:8080/rrhh/alumno/buscar', {
        params: {
          nombre: editNombre,
          apellidoPaterno:editApellidoPaterno,
          apellidoMaterno: editApellidoMaterno,
          codigo: editCodigo
        },
      });
      console.log(response.data)
      setResultadosAlumnos(response.data);
    } catch (error) {
      console.error("Error en la búsqueda de alumnos", error);
      setResultadosAlumnos([]);
    }
  }; 
  
  const handleBuscarAlumno = async () => {
    const params = {
      nombre:nuevoNombre,
      apellidoPaterno: nuevoApellidoPaterno,
      apellidoMaterno: nuevoApellidoMaterno,
      codigo:nuevoCodigo,
    };
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== '') // Excluye los campos vacíos
    );


    try {
      const response = await axios.get('http://localhost:8080/rrhh/alumno/buscarPorParametros', {
        params: filteredParams,
      });
      console.log(response.data);
      setResultadosAlumnos(response.data);
      console.log("Hola");
      console.log(resultadosAlumnos);
      setErrorAlumno('');  // Resetea el error si la búsqueda es exitosa
    } catch (error) {
      console.error("Error en la búsqueda de alumnos", error);
      setResultadosAlumnos([]);
      setErrorAlumno(error.response.data); // Setea el error
    }
  };
  
  const handleClickOpenAlumnoModal = () => {
    setOpenAlumnoModal(true);
  };

  const handleCloseAlumnoModal = () => {
    setOpenAlumnoModal(false);
  };
  // Función para añadir un nuevo alumno
  const handleAddAlumno = (alumnonuevo) => {
    
    setAlumnos([...alumnos, alumnonuevo]);
    handleCloseAlumnoModal(); // Cierra el diálogo
  };

  const handleEditAlumno = (alumnonuevo) => {
    
    setAlumnos([...alumnos, alumnonuevo]);
    handleCloseAlumnoModal(); // Cierra el diálogo
  };












  const handleDeleteAlumno = (index) => {
    const updatedAlumnos = [...alumnos];
    updatedAlumnos.splice(index, 1);
    setAlumnos(updatedAlumnos);
  };

  const handleSeleccionarCurso = (cursoSeleccionado) => {
    setCursofinal(cursoSeleccionado)
    setCurso(cursoSeleccionado.nombre); // Asigna el nombre del curso seleccionado
    if (cursoSeleccionado.especialidad) {
      setEspecialidad(cursoSeleccionado.especialidad); // Asigna el objeto especialidad completo
    }
    console.log(cursoSeleccionado);
    obtenerProfesores(cursoSeleccionado.idCurso);
    setOpen(false); // Cierra el modal
  };
  

  const handleBuscar = async () => {
    try {
      const response = await axios.get('http://localhost:8080/institucion/curso/buscarCursoNombreCodigoFacultad', {
        params: {
          codigo: claveCurso,
          nombre: nombreCurso,
          nombreFacultad: unidadAcademica,
        },
      });

      // Actualizamos los resultados con los datos recibidos del backend
      setResultados(response.data);
      setError('');

    } catch (error) {
       console.log(error)         // Si hay un error, lo mostramos en la interfaz
      if (error.response && error.response.status === 404) {
        setError(error.response.data);
        setResultados([]); // Limpiamos los resultados si no hay datos
      } else {
        setError('Ocurrió un error en la búsqueda.');
        setResultados([]);
      }
    }
  };
  

  const [opciones, setOpciones] = useState([]); // Estado para almacenar las opciones

  // Llamada al backend para obtener las opciones
  useEffect(() => {
    const fetchOpciones = async () => {
      try {
        const response = await fetch('http://localhost:8080/institucion/facultad/listar'); // URL del backend
        const data = await response.json();
        setOpciones(data); // Actualiza las opciones con los datos obtenidos
      } catch (error) {
        console.error('Error al obtener las opciones:', error);
      }
    };

    fetchOpciones(); // Llama al backend cuando el componente se monta
  }, []);



  return (
    <Box sx={{ backgroundColor: 'white', color: 'black', height: '100vh', paddingLeft: '240px', paddingTop: '20px' ,paddingRight:'20px'}}>
      
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black', marginBottom: '20px' }}>
        CARTA DE PRESENTACION
      </Typography>

      <Box>
  <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
    <Grid item xs={9}>
      <TextField
        label="Curso"
        variant="outlined"
        value={curso !== null ? curso : ""}  // Asegúrate de que curso no sea null
        onChange={(e) => setCurso(e.target.value)}
        InputProps={{
          endAdornment: (
            <IconButton onClick={handleClickOpen}>
              <SearchIcon />
            </IconButton>
          ),
        }}
        sx={{ width: '500px' }}
      />
    </Grid>

    <Grid item xs={3}>
      <TextField
        label="Fecha"
        type="date"
        value={currentDate || ""}  // Asegúrate de que currentDate no sea null
        InputLabelProps={{
          shrink: true,
        }}
        sx={{ width: '100%' }}
        InputProps={{
          readOnly: true,  // Hace que el campo no sea editable
        }}
      />
    </Grid>

    {/* Profesor */}
    <Grid item xs={12}>
      <Select
        value={profesor !== null ? profesor : ""}  // Asegúrate de que profesor no sea null
        onChange={(e) => setProfesor(e.target.value)}
        displayEmpty
        variant="outlined"
        sx={{ width: '500px' }}
      >
        <MenuItem value="">
          <em>Seleccione un Profesor</em>
        </MenuItem>
        {/* Renderiza dinámicamente los profesores */}
        {horarios.map((horar, index) => (
          horar.docentes.length > 0 ? (  // Comprueba que haya docentes en el horario
            <MenuItem key={index} value={horar.docentes[0]}>
              {horar.docentes[0].nombre}
            </MenuItem>
          ) : null  // Si no hay docentes, no renderices nada
        ))}
      </Select>
    </Grid>
  </Grid>
</Box>

      {/* Dialogo (pop-up) */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Buscar Curso</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate autoComplete="off">
            <Grid container spacing={2}>
              {/* Clave del curso */}
              <Grid item xs={12}>
                <TextField
                  label="Clave del curso"
                  variant="outlined"
                  fullWidth
                  value={claveCurso}
                  onChange={(e) => setClaveCurso(e.target.value)}
                />
              </Grid>

              {/* Nombre del curso */}
              <Grid item xs={12}>
                <TextField
                  label="Nombre del curso"
                  variant="outlined"
                  fullWidth
                  value={nombreCurso}
                  onChange={(e) => setNombreCurso(e.target.value)}
                />
              </Grid>

              {/* Unidad académica */}
              <Grid item xs={12}>
                <Select
                  fullWidth
                  value={unidadAcademica}
                  onChange={(e) => setUnidadAcademica(e.target.value)}
                  displayEmpty
                  variant="outlined"
                >
                  <MenuItem value="">
                    <em>Unidad académica</em>
                  </MenuItem>
                  {/* Renderiza dinámicamente las opciones */}
                  {opciones.map((opcion, index) => (
                    <MenuItem key={index} value={opcion.nombre}>
                      {opcion.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              {/* Botón de búsqueda */}
              <Grid item xs={12} textAlign="center">
                <Button sx={{ backgroundColor: '#363581' }} variant="contained" color="primary" onClick={handleBuscar}>
                  Buscar
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Resultados de búsqueda */}
          <Box mt={4}>
            <Typography variant="h6">Resultados de búsqueda:</Typography>

            {error && (
              <Typography color="error" variant="body1">
                {error}
              </Typography>
            )}

            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: '#363581' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white' }}>Código</TableCell>
                    <TableCell sx={{ color: 'white' }}>Curso</TableCell>
                    <TableCell sx={{ color: 'white' }}></TableCell>
                  </TableRow>
                </TableHead>
                    <TableBody>
                        {resultados.length > 0 ? (
                            resultados.map((resultado, index) => (
                                <TableRow key={index}>
                                    <TableCell>{resultado.codigo}</TableCell>
                                    <TableCell>{resultado.nombre}</TableCell>
                                    {/* Celda con el botón */}
                                    <TableCell align="right"> {/* Alineamos el botón a la derecha */}
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleSeleccionarCurso(resultado)}
                                            size="small" // Para un tamaño más compacto
                                            style={{ textTransform: 'none' }} // Mantener el texto como está (sin capitalizar todo)
                                        >
                                            Seleccionar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    No se encontraron resultados
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>             

              </Table>
            </TableContainer>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

       {/* Dialogo para buscar alumno */}
      <Dialog open={openAlumnoModal} onClose={handleCloseAlumnoModal} maxWidth="md" fullWidth>
        <DialogTitle>Buscar Alumno</DialogTitle>
        <DialogContent>
        <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nombre"
                variant="outlined"
                fullWidth
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Apellido Paterno"
                variant="outlined"
                fullWidth
                value={nuevoApellidoPaterno}
                onChange={(e) => setNuevoApellidoPaterno(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Apellido Materno"
                variant="outlined"
                fullWidth
                value={nuevoApellidoMaterno}
                onChange={(e) => setNuevoApellidoMaterno(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Código"
                variant="outlined"
                fullWidth
                value={nuevoCodigo}
                onChange={(e) => setNuevoCodigo(e.target.value)}
              />
            </Grid>
            {/* Botón de búsqueda */}
            <Grid item xs={12} sx={{ marginBottom: '20px' }} textAlign="center">
                <Button variant="contained" color="primary" onClick={handleBuscarAlumno}>
                  Buscar
                </Button>
              </Grid>
          </Grid>
          {errorAlumno && (
            <Grid item xs={12}>
              <p style={{ color: 'red', textAlign: 'center' }}>{errorAlumno}</p>
            </Grid>
          )}                
          <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead color="primary" sx={{ backgroundColor: '#363581' }}>
                    <TableRow>
                      <TableCell sx={{ color: 'white' }}>Código</TableCell>
                      <TableCell sx={{ color: 'white' }}>Nombre Completo</TableCell>
                      <TableCell sx={{ color: 'white' }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                
                  {resultadosAlumnos.length > 0 ? (
  resultadosAlumnos.map((alumno, index) => (
    <TableRow key={index}>
      <TableCell>{alumno.codigo}</TableCell>
      <TableCell>{alumno.nombre}</TableCell>
      <TableCell align="right">
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleAddAlumno(alumno)}
          size="small"
          style={{ textTransform: 'none' }}
        >
          Seleccionar
        </Button>
      </TableCell>
    </TableRow>
  ))
) : (
  <TableRow>
    <TableCell colSpan={3} align="center">
      No se encontraron resultados
    </TableCell>
  </TableRow>
)}

                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlumnoModal} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>                 








      <Dialog open={openAlumnoEditModal} onClose={handleCloseEditAlumnoModal} maxWidth="md" fullWidth>
        <DialogTitle>Buscar Alumno</DialogTitle>
        <DialogContent>
        <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nombre"
                variant="outlined"
                fullWidth
                value={editNombre}
                onChange={(e) => setEditNombre(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Apellido Paterno"
                variant="outlined"
                fullWidth
                value={editApellidoPaterno}
                onChange={(e) => setEditApellidoPaterno(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Apellido Materno"
                variant="outlined"
                fullWidth
                value={editApellidoMaterno}
                onChange={(e) => setEditApellidoMaterno(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Código"
                variant="outlined"
                fullWidth
                value={editCodigo}
                onChange={(e) => setEditCodigo(e.target.value)}
              />
            </Grid>
            {/* Botón de búsqueda */}
            <Grid item xs={12} sx={{ marginBottom: '20px' }} textAlign="center">
                <Button variant="contained" color="primary" onClick={handleBuscarEditAlumno}>
                  Buscar
                </Button>
              </Grid>
          </Grid>

          <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead color="primary" sx={{ backgroundColor: '#363581' }}>
                    <TableRow>
                      <TableCell sx={{ color: 'white' }}>Código</TableCell>
                      <TableCell sx={{ color: 'white' }}>Nombre Completo</TableCell>
                      <TableCell sx={{ color: 'white' }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                
                  {resultadosAlumnos.codigo? (
                        
                          <TableRow>
                            <TableCell>{resultadosAlumnos.codigo}</TableCell>
                            <TableCell>{resultadosAlumnos.nombre}</TableCell>
                            <TableCell align="right">
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleUpdateAlumno(resultadosAlumnos)}
                                size="small"
                                style={{ textTransform: 'none' }}
                              >
                                Seleccionar
                              </Button>
                            </TableCell>
                          </TableRow>
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            No se encontraron resultados
                          </TableCell>
                        </TableRow>
                      )
                    } 
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditAlumnoModal} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>                 










      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <Typography variant="h6">Alumnos:</Typography>
        <Button sx={{ backgroundColor: '#363581' }} variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleClickOpenAlumnoModal}>
          Añadir
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#363581' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Codigo</TableCell>
              <TableCell sx={{ color: 'white' }}>Nombre Completo</TableCell>
              <TableCell sx={{ color: 'white' }}>Correo</TableCell>
              <TableCell sx={{ color: 'white' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alumnos.map((alumno, index) => (
              <TableRow key={index}>
                <TableCell>{alumno.codigo}</TableCell>
                <TableCell>{alumno.nombre}</TableCell>
                <TableCell>{alumno.email}</TableCell>
                <TableCell>
                  <IconButton aria-label="edit"  onClick={() => handleOpenEditAlumnoModal(index,alumno)}>
                    <EditIcon color="primary"  />
                  </IconButton>
                  <IconButton aria-label="delete" onClick={() => handleDeleteAlumno(index)}>
                    <DeleteIcon color="primary" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" sx={{ marginTop: '20px' }}>
        Actividades que se desarrollarán:
      </Typography>
      <TextField
  fullWidth
  multiline
  rows={4}
  variant="outlined"
  value={actividades}
  onChange={(e) => setActividades(e.target.value)}
  sx={{ 
    marginTop: '10px', 
    backgroundColor: '#f0f0f0', // Color plomo claro
    "& .Mui-disabled": {
      color: '#808080', // Color del texto cuando está deshabilitado
    }
  }}
  disabled // Propiedad para bloquear el campo
/>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
      <Button
          variant="outlined"
          color="secondary"
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
        
        <Button sx={{ backgroundColor: '#363581' }} variant="contained" color="primary" onClick={handleGuardar}>
        Guardar
      </Button>
      <ErrorConDescripcion open={isModalOpen} onClose={handleCloseModal} texto={modalTexto} />
      </Box>
    </Box>
  );
}