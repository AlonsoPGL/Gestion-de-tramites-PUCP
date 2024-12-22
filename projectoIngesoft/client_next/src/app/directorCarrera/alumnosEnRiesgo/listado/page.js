"use client";
import { useRef, useEffect, useState } from 'react';
import { Box, Typography, Button, Modal, Backdrop, Fade, TextField, IconButton, Alert, AlertTitle } from "@mui/material";
import { Table, TableBody, TableCell, TableHead, TableRow, } from "@mui/material";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TablaAlumnosEnRiesgo from "../../../../../componentesDirectorDeCarrera/TablaAlumnosEnRiesgo";
import BarraBusqueda from "../../../../../componentesAdministrador/BarraBusqueda";
import axios from 'axios';
import RegistradoConExito from "../../../../../componentesGenerales/modales/RegistradoConExito";

export default function GestionUsuario() {
  // Se accede a la data del contexto creado
  const [alumnos, setAlumnos] = useState([]);
  const [MostrarRegistroExitoso, setMostrarRegistroExitoso] = useState( ); // Mensaje de éxito
  // State to manage horarios, vez, and motivo
  const [horarios, setHorarios] = useState([]);
  const [selectedHorario, setSelectedHorario] = useState(null);
  const [vez, setVez] = useState("");
  const [motivo, setMotivo] = useState("");
  // Barra de busqueda
  const [searchTerm, setSearchTerm] = useState(''); // Estado para almacenar el valor de búsqueda
  // Modal alumno
  const [openGestionarModal, setOpenGestionarModal] = useState(false);
  const [codigoAlumno, setCodigoAlumno] = useState("");
  const [alumnoEncontrado, setAlumnoEncontrado] = useState(null);
  // Estado para confirmacion
  const [openConfirmModal, setOpenConfirmModal] = useState(false); // Modal de confirmación
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Mensaje de éxito

  const [isLoading, setIsLoading] = useState(true); // Nuevo estado para controlar la carga
  
  // Fetch horarios when a student is found
  useEffect(() => {
    const fetchHorarios = async () => {
      if (alumnoEncontrado) {
        try {
          console.log('Alumno encontrado:', alumnoEncontrado); // Debugging
          const response = await axios.get(`http://localhost:8080/rrhh/alumno/${alumnoEncontrado.id}/horario`);
          setHorarios(response.data);  // Update the horarios state with fetched data
          console.log('Horarios fetched:', response.data); // Debugging
        } catch (error) {
          console.error("Error fetching horarios", error);
        }
      }
    };
    
    fetchHorarios();
  }, [alumnoEncontrado]);  // Will trigger whenever alumnoEncontrado changes
  
  // Function to handle selecting a horario
  const handleHorarioChange = (event) => {
    const selectedHorarioId = event.target.value;
    const horario = horarios.find(h => h.idHorario === parseInt(selectedHorarioId));
    
    setSelectedHorario(horario);  // Store the selected horario details
  };

  // Function to add the student in risk
  const handleAgregarAlumno = async () => {
    if (!selectedHorario || vez === "" || motivo === "") {
      alert("Por favor llene todos los cambios");
      return;
    }

    try {
      const params = new URLSearchParams({
        codigo: alumnoEncontrado.codigo,
        codigoHorario: selectedHorario.codigo,
        codigoCurso: selectedHorario.codigoCurso,
        vez: vez,
        motivo: motivo
      });

      const response = await axios.put(`http://localhost:8080/rrhh/alumno/agregarRiesgo?${params.toString()}`);
      if (response.status === 200) {
        setAlumnoEncontrado(null);
        setOpenGestionarModal(false);
        actualizarAlumnos();
        setMostrarRegistroExitoso(true);
      } else {
        console.error("Failed to add student", response.data);
      }
    } catch (error) {
      console.error("Error adding student", error);
    }
  };

  // Referencia para el campo input de archivos
  const fileInputRef = useRef(null);

  // Maneja el evento para abrir el cuadro de diálogo
  const handleUploadClick = () => {
    fileInputRef.current.click(); // Simula el clic en el input de archivos
  };

  const [errorMessages, setErrorMessages] = useState(null); // Mostrar si hay mensajes de error
  const [ignoredDuplicates, setIgnoredDuplicates] = useState(null); // Almacenar info de duplicados

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);  // Añadir el archivo al FormData

      try {
        // Enviar el archivo Excel al backend
        const response = await axios.post('http://localhost:8080/rrhh/alumno/subirExcel', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        // Manejar la respuesta
        if (response.status === 200) {
          const result = response.data; 
          // result = { success: true/false, errorMessages: [], ignoredDuplicates: [] }

          // Actualizar la lista de alumnos en riesgo
          const alumnosResponse = await axios.get('http://localhost:8080/rrhh/alumno/listarEnRiesgo');
          setAlumnos(alumnosResponse.data);

          // Si existen duplicados
          console.log("Los duplicados son: "+ result.ignoredDuplicates)
          if (result.ignoredDuplicates && result.ignoredDuplicates.length > 0) {
            setIgnoredDuplicates(result.ignoredDuplicates);
          } else {
            setIgnoredDuplicates(null);
          }

          setErrorMessages(null);
          if (result.success) {
            // Si todo se procesó bien
            setMostrarRegistroExitoso(true);
          } else {
            // Si hubiera errores parciales, aunque success: false se usa para todo reprobado
            setErrorMessages(result.errorMessages);
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          // Error del backend con errorMessages
          const result = error.response.data;
          setErrorMessages(result.errorMessages || ["Error desconocido al procesar el archivo."]);
          setMostrarRegistroExitoso(false);
          setIgnoredDuplicates(result.ignoredDuplicates || null);
        } else {
          console.error("Error al subir el archivo:", error);
          setErrorMessages(["No se pudo procesar el archivo. Error desconocido."]);
          setMostrarRegistroExitoso(false);
        }
      }
    }
  };

  const filteredAlumnos = alumnos.filter((aluxhor) =>
    aluxhor.alumno.nombre?.toLowerCase().includes(searchTerm.toLowerCase())||
    aluxhor.alumno.apellidoPaterno?.toLowerCase().includes(searchTerm.toLowerCase())||
    aluxhor.alumno.apellidoMaterno?.toLowerCase().includes(searchTerm.toLowerCase())||
    aluxhor.alumno.email?.toLowerCase().includes(searchTerm.toLowerCase())||
    String(aluxhor.alumno.codigo)?.toLowerCase().includes(searchTerm.toLowerCase())||
    aluxhor.horario.codigoCurso?.toLowerCase().includes(searchTerm.toLowerCase())||
    aluxhor.horario.codigo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    // Obtener la lista de alumnos en riesgo
    const fetchAlumnosEnRiesgo = async () => {
      try {
        setIsLoading(true); // Iniciar la carga
        const response = await axios.get('http://localhost:8080/rrhh/alumno/listarEnRiesgo');
        setAlumnos(response.data);
      } catch (error) {
        console.error("Error al obtener la lista de alumnos en riesgo:", error);
      }finally{
        setIsLoading(false); // Finalizar la carga independientemente del resultado
      }

    };
    fetchAlumnosEnRiesgo();
  }, []);

  // ******* BARRA DE BUSQUEDA DE ALUMNOS EN RIESGO ***** //
  // Función que se llama cuando se obtienen los resultados de la búsqueda
  const handleSearch = (term) => {
    setSearchTerm(term); // Actualiza el estado con el valor de búsqueda
  };

  // ************** AGREGAR UN SOLO ALUMNO ******************* //
  // Función para abrir y cerrar el modal
  const handleOpenGestionar = () => {
    setOpenGestionarModal(true);
  };

  const handleCloseGestionar = () => {
    setOpenGestionarModal(false);
    setAlumnoEncontrado(null); // Resetear cuando se cierra el modal
    setHorarios([]);
    setSelectedHorario(null);
    setVez("");
    setMotivo("");
    setCodigoAlumno("");
  };

  const buscarAlumno = async () => {
    try {
      console.log('Buscando al alumno...'); // Debugging
      const response = await axios.get(`http://localhost:8080/rrhh/alumno/buscarPorCodigo/${codigoAlumno}`); 
      setAlumnoEncontrado(response.data);
    } catch (error) {
      console.error("Error buscando al alumno", error);
      setAlumnoEncontrado(null);
    }
  };

  // Funcion para actualizarAlumnos
  const actualizarAlumnos = async () => {
    try {
      console.log('Actualizando alumnos en riesgo...'); // Debugging
      
      const response = await axios.get('http://localhost:8080/rrhh/alumno/enRiesgo');
      setAlumnos(response.data);
    } catch (error) {
      console.error("Error al actualizar alumnos:", error);
    } finally {
      
    }

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
    <Box sx={{ backgroundColor: 'white', height: '100vh' }}>
      {/* Mostrar alertas si hay errores */}
      {errorMessages && errorMessages.length > 0 && (
        <Box sx={{ marginLeft: '220px', padding: '20px' }}>
          <Alert
            severity="error"
            onClose={() => setErrorMessages(null)} // Permite cerrar el mensaje
            sx={{ mb: 2 }}
          >
            <AlertTitle>Se encontraron los siguientes errores:</AlertTitle>
            {errorMessages.map((msg, index) => (
              <Typography key={index}>{msg}</Typography>
            ))}
          </Alert>
        </Box>
      )}
      {/* Mostrar alertas si hay duplicados */}
      {ignoredDuplicates && ignoredDuplicates.length > 0 && (
        <Box sx={{ marginLeft: '220px', padding: '20px' }}>
          <Alert
            severity="warning"
            onClose={() => setIgnoredDuplicates(null)} // Permite cerrar el mensaje
            sx={{ mb: 2 }}
          >
            <AlertTitle>Los usuarios han sido agregados con éxito, excepto los siguientes:</AlertTitle>
            {ignoredDuplicates.map((msg, index) => (
              <Typography key={index}>{msg}</Typography>
            ))}
          </Alert>
        </Box>
      )}
      {/* Contenido existente */}
      <Box
        sx={{
          marginLeft: '220px',
          height: '100vh',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Título */}
        <Typography variant="h4" sx={{ mb: '20px', fontFamily: "system-ui", fontWeight: 'bold', color: 'black', marginBottom: '20px',}}>
          Lista de Alumnos en Riesgo
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ mb: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <BarraBusqueda onSearch={handleSearch}/>
          </Box>

          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} // Oculta el input
            onChange={handleFileChange} 
          />

          <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
            <Button   // Boton SUBIR
              variant="contained"  
              sx={{ ...botonEstilo, ml: 2, height: '40px', width: '160px' }}
              onClick={handleUploadClick}
            >            
              Subir
              <CloudUploadIcon sx={{ ml: 1, color: 'white', borderRadius: '50%', backgroundColor: '#363581', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
            </Button>

            <Button   // Boton DESCARGAR PLANTILLA
              component="a"  // Cambiamos a 'a' para utilizar el atributo href
              href="https://view.officeapps.live.com/op/view.aspx?src=https%3A%2F%2Frtfsprocesados.s3.us-east-1.amazonaws.com%2FPlantillaAlumnosEnRiesgo.xlsx&wdOrigin=BROWSELINK" // Ruta relativa al archivo en la carpeta public
              variant="contained" 
              sx={{ ...botonEstilo, ml: 2, height: '40px', width: '160px' }}
              //color="primary" 
              //sx={{ ml: 2, display: 'flex', alignItems: 'center', height: '40px', width: '160px', backgroundColor:'#363581' }}
              download // Añadimos el atributo download para sugerir descarga
            >
              Plantilla
              <DownloadIcon sx={{ ml: 1, color: 'white', borderRadius: '50%', backgroundColor: '#363581', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
            </Button>

            <Button   // Boton AÑADIR
              variant="contained" 
              sx={{ ...botonEstilo, ml: 2, height: '40px', width: '160px' }}
              onClick={handleOpenGestionar} // Manejar apertura del modal
            >
              Añadir
              <AddCircleOutlineIcon sx={{ ml: 1, color: 'white', borderRadius: '50%', backgroundColor: '#363581', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
            </Button>
            </Box>
        </Box>

        {/* Tabla de Alumnos en Riesgo */}
        <TablaAlumnosEnRiesgo valorBusqueda={filteredAlumnos} isLoading={isLoading}/>

        {/* Modal para registro exitoso */}
        <RegistradoConExito 
          open={MostrarRegistroExitoso}
          onClose={() => setMostrarRegistroExitoso(false)}
        />

        {/* Modal para gestionar alumnos en riesgo */}
        <Modal
          open={openGestionarModal}
          onClose={handleCloseGestionar}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openGestionarModal}>
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
              {/* Search Field for Student */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField 
                  label="Código del Alumno" 
                  variant="outlined" 
                  fullWidth 
                  value={codigoAlumno}
                  onChange={(e) => setCodigoAlumno(e.target.value)}
                />
                <IconButton color="primary" onClick={buscarAlumno} sx={{ ml: 1 }}>
                  <SearchIcon />
                </IconButton>
              </Box>

              {/* Display found student information */}
              {alumnoEncontrado && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1"><strong>Nombre:</strong> {`${alumnoEncontrado.nombre} ${alumnoEncontrado.apellidoPaterno}`}</Typography>
                  <Typography variant="body1"><strong>Correo:</strong> {alumnoEncontrado.email}</Typography>
                </Box>
              )}

              {/* Horarios Table with Radio butto */}
              {horarios.length > 0 ? (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6"><strong>Seleccionar Horario:</strong></Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Horario</TableCell>
                        <TableCell>Curso</TableCell>
                        <TableCell>Nombre del Curso</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {horarios.map((horario) => (
                        <TableRow key={horario.idHorario}>
                          <TableCell>{horario.codigo}</TableCell>
                          <TableCell>{horario.codigoCurso}</TableCell>
                          <TableCell>{horario.nombreCurso}</TableCell>
                          <TableCell>
                            <RadioGroup
                              value={selectedHorario?.idHorario || ""}
                              onChange={handleHorarioChange}
                            >
                              <FormControlLabel 
                                value={horario.idHorario.toString()} 
                                control={<Radio />} 
                                label="" 
                              />
                            </RadioGroup>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              ) : (
                <Typography variant="body1" color="textSecondary">
                  No hay horario para este alumno
                </Typography>
              )}

              {/* Input for "Vez" */}
              <TextField
                label="Vez"
                type="number"
                fullWidth
                value={vez}
                onChange={(e) => setVez(e.target.value)}
                sx={{ mb: 2 }}
              />

              {/* Input for "Motivo" */}
              <TextField
                label="Motivo"
                multiline
                rows={4}
                fullWidth
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                sx={{ mb: 2 }}
              />

              {/* Action Buttons  */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" onClick={handleCloseGestionar}>
                  Cancelar
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleAgregarAlumno} 
                  disabled={!selectedHorario || vez === "" || motivo === ""}
                >
                  Agregar
                </Button>
              </Box>

            </Box>
          </Fade>
        </Modal>
      </Box>
    </Box>
  );
}
