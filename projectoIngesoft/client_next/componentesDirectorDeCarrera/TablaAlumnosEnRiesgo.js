import React, { useState, useEffect, useRef } from 'react';
import { Modal, Backdrop, Fade, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Button, Box, IconButton,CircularProgress  } from "@mui/material";
import Checkbox from '@mui/material/Checkbox';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Pagination from "@mui/material/Pagination";
import EstaSeguroAccion from "../componentesGenerales/modales/EstaSeguroAccion";
import RegistradoConExito from "../componentesGenerales/modales/RegistradoConExito";
import ModalEliminar from "../componentesDirectorDeCarrera/modales/ModalEliminar";

export default function TablaAlumnosEnRiesgo({ valorBusqueda, isLoading = false }) {
  //const [alumnos, setAlumnos] = useState([]);
  const [page, setPage] = useState(1); // Página actual (empezamos desde 1)
  const rowsPerPage = 5;
  const router = useRouter();

  const [showSuccessMessage, setShowSuccessMessage] = useState(); // Mensaje de éxito
  const [openConfirmModal, setOpenConfirmModal] = useState(false); // Modal de confirmación
  const [alumnosEnRiesgo, setAlumnosEnRiesgo] = useState([]);
  // Estado para almacenar los IDs de los alumnos seleccionados
  const [selectedAlumnos, setSelectedAlumnos] = useState([]);

  // Para Modal editar Alumno en Riesgo (vez y motivo)
  const [openEditModal, setOpenEditModal] = useState(false);
  const [alumnoToEdit, setAlumnoToEdit] = useState(null);
  const [vezEdit, setVezEdit] = useState("");
  const [motivoEdit, setMotivoEdit] = useState("");

  const handleChangePage = (event, value) => {
    setPage(value);
  };
  useEffect(() => {
    setPage(1); // Reiniciar a la primera página cuando cambie el término de búsqueda
  }, [alumnosEnRiesgo]);
  // Obtener la lista de alumnos en riesgo
  const obtenerAlumnosEnRiesgo = async () => {
    try {
      const response = await axios.get('http://localhost:8080/rrhh/alumno/listarEnRiesgo');
      console.log("La respuesta es: " + response.data);
      setAlumnosEnRiesgo(response.data);
    } catch (error) {
      console.error("Error al obtener la lista de alumnos en riesgo:", error);
    }
  };

  useEffect(() => {
    if (valorBusqueda) {
      setAlumnosEnRiesgo(valorBusqueda); // Se actualiza la tabla con los resultados de la búsqueda
    } else {
      //obtenerAlumnos(); // Se obtienen todos los alumnos cuando no hay búsqueda
      obtenerAlumnosEnRiesgo();
    }
  }, [valorBusqueda]);

  // ************* ELIMINAR ALUMNO EN RIESGO  ***************************  //
  // Función para eliminar estado EnRiesgo al alumno
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [alumnoToDelete, setAlumnoToDelete] = useState(null);

  const handleOpenDeleteModal = (id) => {
    setAlumnoToDelete(id);
    setOpenDeleteModal(true);
  };
  
  const handleConfirmDelete = async () => {
    try {
      await handleEliminarRiesgoAlumno(alumnoToDelete);
      setOpenDeleteModal(false);
      setAlumnoToDelete(null);
    } catch (error) {
      console.error("Error al eliminar el alumno:", error);
    }
  };
  
  const handleEliminarRiesgoAlumno = async (idAluXH) => {
    try {
      console.log("Intentando enviar solicitud al back")
      console.log("ID es: " + idAluXH);
      const response = await axios.put(`http://localhost:8080/rrhh/alumno/eliminarRiesgo/${idAluXH}`);
      if (response.status === 200) {
        // Mostrar modal de éxito
        obtenerAlumnosEnRiesgo()
        setShowSuccessMessage(true);
      } else {
        // Mostrar error si el backend devuelve un error
        console.error("No se pudo eliminar el alumno-horario:", response.data);
      }
    } catch (error) {
      console.error("Error al agregar el registro alumno-horario en riesgo:", error);
    }
  };

  // Función que maneja la selección de los checkboxes
  const handleCheckboxChange = (event, alumnoId) => {
    if (event.target.checked) {
      // Agregar el ID del alumno seleccionado
      setSelectedAlumnos((prevSelected) => [...prevSelected, alumnoId]);
    } else {
      // Quitar el ID del alumno si el checkbox es desmarcado
      setSelectedAlumnos((prevSelected) =>
        prevSelected.filter((id) => id !== alumnoId)
      );
    }
  };

  // RF43: Enviar solicitud  

  //const handleEnviarSolicitud = () => {
  const handleEnviarSolicitud = () => {
    if (selectedAlumnos.length > 0) {
      console.log(selectedAlumnos);
      setOpenConfirmModal(true); // Abrir el modal de confirmación
    }
  };

  ////// Confirmación para enviar la solicitud //////  
  const handleConfirmSend = async () => {
    console.log("Aceptando envio");
    try {
      await axios.post('http://localhost:8080/solicitudes/infoAlumnosEnRiesgo/crearSolicitudInfoAlumnoEnRiesgo', selectedAlumnos);
      setOpenConfirmModal(false);
      setShowSuccessMessage(true);
      setSelectedAlumnos([]); // Desmarcar los checkboxes
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };

  const handleVerDetallesAlumno = (id) => {
    router.push(`./listado/detalles?idAlxhor=${id}`);
  };

  ////// Cancelar la acción y cerrar el modal //////  
  const handleCloseConfirmModal = () => {
    setOpenConfirmModal(false);
  };

  // Modales para Editar alumno en Riesgo
  const handleOpenEditModal = (alxhor) => {
    setAlumnoToEdit(alxhor);
    setVezEdit(alxhor.vez || ""); // Asegúrate de que el campo exista
    setMotivoEdit(alxhor.motivo || "");
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setAlumnoToEdit(null);
    setVezEdit("");
    setMotivoEdit("");
  };

  const handleUpdateAlumno = async () => {
    try {
      const params = new URLSearchParams({
        id: alumnoToEdit.id,
        vez: vezEdit,
        motivo: motivoEdit
      });

      const response = await axios.put(`http://localhost:8080/rrhh/alumno/actualizarAlumnoRiesgo?${params.toString()}`);

      if (response.status === 200) {
        // Actualizar la lista de alumnos en riesgo
        obtenerAlumnosEnRiesgo();
        setShowSuccessMessage(true);
        handleCloseEditModal();
      } else {
        console.error("No se pudo actualizar el alumno:", response.data);
      }
    } catch (error) {
      console.error("Error al actualizar el alumno:", error);
    }
  };

  // Estilos
  const estilosEncabezado = () => {
    return { color: 'white', backgroundColor: '#363581', textAlign: 'center' };
  };
  // Estilos
  const botonEstilo = {
    borderRadius: '20px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#363581',
    '&:hover': {
      backgroundColor: '#4a4f9a', // Un poco más claro que el color base
      boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.2)',
    },
  };
  
  return (
    <>
      <Box>
        {/* Mensaje de éxito */}
        {/*
        {showSuccessMessage && (
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h6" color="primary">
              Solicitudes enviadas con éxito
            </Typography>
          </Box>  dcdcff  363581
        )}
        */}

        <TableContainer component={Paper} sx={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', overflow: 'auto' }}>
          <Table sx={{ borderCollapse: 'collapse' }}>
            <TableHead sx={{ backgroundColor: '#363581' }}> 
              <TableRow>
                <TableCell align='center' sx={estilosEncabezado()}>Código Alumno</TableCell>
                <TableCell align='center' sx={estilosEncabezado()}>Nombre Completo</TableCell>
                <TableCell align='center' sx={estilosEncabezado()}>Correo</TableCell>
                <TableCell align='center' sx={estilosEncabezado()}>Curso</TableCell>
                <TableCell align='center' sx={estilosEncabezado()}>Nombre de Curso</TableCell>
                <TableCell align='center' sx={estilosEncabezado()}>Horario</TableCell>
                <TableCell align='center' sx={estilosEncabezado()}>Por Leer</TableCell>
                <TableCell align='center' sx={estilosEncabezado()}>Acción</TableCell>
                <TableCell align='center' sx={estilosEncabezado()}>Solicitar Información</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} align='center' sx={{ py: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 2 }}>
                      <CircularProgress />
                      <Typography variant='subtitle1' color='textSecondary'>
                        Cargando información...
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                alumnosEnRiesgo &&
                alumnosEnRiesgo.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((alxhor) => (
                  <TableRow key={alxhor.id} sx={{ backgroundColor: '#F8F9FA','&:hover': {
                  backgroundColor: '#eeeff1', // Color de fondo al hacer hover
                  }, }}>
                    <TableCell align='center'>{alxhor.alumno.codigo}</TableCell >
                    <TableCell align='center'>{`${alxhor.alumno.nombre} ${alxhor.alumno.apellidoPaterno} ${alxhor.alumno.apellidoMaterno}`}</TableCell>
                    <TableCell align='center'>{alxhor.alumno.email}</TableCell>
                    <TableCell align='center'>{alxhor.horario.codigoCurso}</TableCell>
                    <TableCell align='center'>{alxhor.horario.nombreCurso}</TableCell>
                    <TableCell align='center'>{alxhor.horario.codigo}</TableCell>
                    {alxhor.cantRespuestaXLeer > 0 ? (
                      <TableCell align='center' sx={{color:'#363581'}}><strong>{alxhor.cantRespuestaXLeer}</strong></TableCell>
                    ) : (
                      <TableCell align='center'>-</TableCell>
                    )}
                    <TableCell align='center'>
                      <Box sx={{ display: "flex", justifyContent: "center", gap: 1}}>
                        <IconButton onClick={() => handleOpenEditModal(alxhor)}>
                          <EditIcon sx={{ color: '#363581' }}/>
                        </IconButton>
                        <IconButton onClick={() => handleOpenDeleteModal(alxhor.id)}>
                          <DeleteIcon sx={{ color: '#363581' }}/>
                        </IconButton>
                        <IconButton onClick={() => handleVerDetallesAlumno(alxhor.id)}>
                          <VisibilityIcon sx={{ color: '#363581' }}/>
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align='center'>
                      <Checkbox
                        checked={selectedAlumnos.includes(alxhor.id)}
                        onChange={(event) => handleCheckboxChange(event, alxhor.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
              {!isLoading && (!alumnosEnRiesgo || alumnosEnRiesgo.length === 0) && (
                <TableRow>
                  <TableCell colSpan={8} align='center'>
                    <Typography variant='subtitle1' color='textSecondary'>
                      No se encontraron registros.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'end' }}>
        {alumnosEnRiesgo && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", padding: "20px" }}>
            <Pagination
              count={Math.ceil(alumnosEnRiesgo.length / rowsPerPage)} // Número total de páginas
              page={page} // Página actual
              onChange={handleChangePage} // Manejador de cambio de página
              size="large"
              color="primary"
            />
          </Box>
        )}

        {/* Botón Enviar Solicitud */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '20px'
          }}
        >
          <Button
            variant="contained"
            onClick={handleEnviarSolicitud}
            disabled={selectedAlumnos.length === 0} // Habilitar solo si hay alumnos seleccionados
            sx={{ ...botonEstilo, ml: 2, width: '200px', height: '40px'}}
          >
            Enviar Solicitud
          </Button>
        </Box>
      </Box>

      {/* Modal de Eliminar Alumno en Riesgo */}
      <ModalEliminar
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />

      {/* Modal de Confirmación de Solicitud */}
      <EstaSeguroAccion
        open={openConfirmModal}
        onClose={handleCloseConfirmModal}
        handleAceptar={handleConfirmSend}
        texto="¿Estás seguro de enviar las solicitudes de información seleccionadas?"
      />
      
      {/* Modal de éxito */}
      <RegistradoConExito
        open={showSuccessMessage}
        onClose={() => setShowSuccessMessage(false)}
        texto="Solicitudes enviadas con éxito."
      />

      <Modal
        open={openEditModal}
        onClose={handleCloseEditModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openEditModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 600,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>Editar Alumno en Riesgo</Typography>

            {alumnoToEdit && (
              <Box>
                <Typography><strong>Nombre:</strong> {`${alumnoToEdit.alumno.nombre} ${alumnoToEdit.alumno.apellidoPaterno} ${alumnoToEdit.alumno.apellidoMaterno}`}</Typography>
                <Typography><strong>Código:</strong> {alumnoToEdit.alumno.codigo}</Typography>
                <Typography><strong>Curso:</strong> {alumnoToEdit.horario.nombreCurso}</Typography>
                <Typography><strong>Horario:</strong> {alumnoToEdit.horario.codigo}</Typography>

                {/* Campos editables */}
                <TextField
                  label="Vez"
                  type="number"
                  fullWidth
                  value={vezEdit}
                  onChange={(e) => setVezEdit(e.target.value)}
                  sx={{ my: 2 }}
                />

                <TextField
                  label="Motivo"
                  multiline
                  rows={4}
                  fullWidth
                  value={motivoEdit}
                  onChange={(e) => setMotivoEdit(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button variant="contained" color="secondary" onClick={handleCloseEditModal}>
                    Cancelar
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdateAlumno}
                    disabled={vezEdit === "" || motivoEdit === ""}
                  >
                    Guardar Cambios
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
