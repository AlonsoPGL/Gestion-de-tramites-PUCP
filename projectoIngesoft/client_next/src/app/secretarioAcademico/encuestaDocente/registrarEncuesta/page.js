"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, Button, TextField, Snackbar, FormControl, InputLabel, Select, MenuItem, Typography, Dialog, DialogActions, DialogContent, DialogTitle, ToggleButton, ToggleButtonGroup } from '@mui/material';
import TablaPreguntas from '../../../../../componentesSecretarioAcadémico/TablaPreguntas';
import EstaSeguroAccion from '../../../../../componentesGenerales/modales/EstaSeguroAccion';
import MuiAlert from '@mui/material/Alert';
import { useEncuesta } from '../../../EncuestaContext';
import dayjs from 'dayjs';
import InputField from 'componentesGenerales/inputs/InputField';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function RegistrarEncuesta() {
  const [tipoPreguntaSeleccionada, setTipoPreguntaSeleccionada] = useState('');
  const [isEditing, setIsEditing] = useState(false); // para manejar la edicion
  const [isEditingEncuesta, setIsEditingEncuesta] = useState(false); // para manejar la edicion
  // Atributos comunes para ambas preguntas
  const [descripcion, setDescripcion] = useState('');
  // Estados para PreguntaOpcionMultiple
  const [openDialog, setOpenDialog] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); //Manejo de le edicion
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const { encuestaEdit } = useEncuesta('');
  const [facultades, setFacultades] = useState([]); // Estado para almacenar facultades
  const [facultadSeleccionada, setFacultadSeleccionada] = useState({ id: '', nombre: '' });
  const [objetoFacultad, setObjetoFacultad] = useState(null);
  const [numeracion, setNumeracion] = useState(1); // Initialize it if needed
  const [semestres, setSemestres] = useState([]); // Estado para almacenar facultades
  const [semestreSeleccionado, setSemestreSeleccionado] = useState({ id: '', nombre: '' });
  const [encuesta, setEncuesta] = useState([
    {
      titulo: '',
      esIntermedia: false,
      facultad: null,
      fechaInicio: '',
      fechaFin: '',
      activo: true,
      preguntas: [],
    },
  ]);

  useEffect(() => {
    
    const loadStoredEncuesta = () => {
      const storedEncuesta = JSON.parse(localStorage.getItem('selectedEncuesta'));
      const storedIsEditingEncuesta = JSON.parse(localStorage.getItem('editar'));      
      if (encuestaEdit) {
        setEncuesta(encuestaEdit);
        setFacultadSeleccionada({id:encuestaEdit.facultad.id, nombre: encuestaEdit.facultad.nombre});
        setObjetoFacultad(encuestaEdit.facultad);
        setIsEditingEncuesta(true);
        
        localStorage.setItem('selectedEncuesta', JSON.stringify(encuestaEdit));
        localStorage.setItem('editar', JSON.stringify(true));
      } else if (storedEncuesta) {
        setEncuesta(storedEncuesta);
        setFacultadSeleccionada({id:storedEncuesta.facultad.id, nombre: storedEncuesta.facultad.nombre});
        setObjetoFacultad(storedEncuesta.facultad);

        setIsEditingEncuesta(storedIsEditingEncuesta || false);
      }else {
        setIsEditingEncuesta(false);
        // Si no hay datos en localStorage, inicializamos el estado como vacío o predeterminado
        console.log("No hay encuesta almacenada en localStorage.");
      }
    };

    // Cargar datos almacenados al montar el componente
    loadStoredEncuesta();
    listarFacultades();
    listarSemestres();
    
  }, [encuestaEdit]);


  // Actualiza el localStorage cada vez que  cambia
  useEffect(() => {
    if(encuesta?.titulo){
      encuesta.facultad = objetoFacultad; 
      localStorage.setItem("selectedEncuesta", JSON.stringify(encuesta));
    }
  }, [encuesta]);



  const listarFacultades = async () => {
    try {
      const response = await axios.get('http://localhost:8080/institucion/facultad/listar'); // Cambia la URL según tu API
      setFacultades(response.data);
    } catch (error) {
      console.error('Error al obtener facultades:', error);
    }
  };

  const listarSemestres = async () => {
    try {
      const response = await axios.get('http://localhost:8080/institucion/semestre/listar'); // Cambia la URL según tu API
      setSemestres(response.data);
    } catch (error) {
      console.error('Error al obtener facultades:', error);
    }
  };

  const actualizarTitulo = (event) => {
    setEncuesta((prevEncuesta) => ({
      ...prevEncuesta, // Mantiene los demás campos sin cambios
      titulo: event.target.value, // Solo se actualiza el título
    }));
  };

  const actualizarFacultad = (event) => {
    const selectedFacultad = facultades.find(facultad => facultad.nombre === event.target.value);
    setObjetoFacultad(selectedFacultad);
    setFacultadSeleccionada({ id: selectedFacultad.id, nombre: selectedFacultad.nombre }); // Guardar ID y nombre
    setEncuesta((prevEncuesta) => ({
      ...prevEncuesta,
      facultad: { id: selectedFacultad.id }, // Actualizar solo el ID en la encuesta
    }));
  };

  const actualizarSemestreSelecionado = (event) => {
    const nombreSemestreSeleccionado = event.target.value;  // El nombre del rol seleccionado
    const semestreEncontrado = semestres.find(semestre => semestre.nombre === nombreSemestreSeleccionado); // Encuentra el rol completo
    if (semestreEncontrado) {
      setSemestreSeleccionado({ id: semestreEncontrado.id, nombre: semestreEncontrado.nombre });

      // Actualiza las fechas de la encuesta según el semestre seleccionado
      setEncuesta(prevEncuesta => ({
        ...prevEncuesta,
        fechaInicio: semestreEncontrado.fechaInicio,
        fechaFin: semestreEncontrado.fechaFin,
      }));
    }
  };

  const handleFechaInicioChange = (newValue) => {
    setEncuesta((prevEncuesta) => ({
      ...prevEncuesta,
      fechaInicio: newValue, // Aquí usamos el nuevo valor directamente
    }));
  };

  // Manejar el cambio de fecha de fin
  const handleFechaFinChange = (newValue) => {
    setEncuesta((prevEncuesta) => ({
      ...prevEncuesta,
      fechaFin: newValue, // Aquí también usamos el nuevo valor directamente
    }));
  };

  const handleClickOpen = () => {
    setIsEditing(false);
    setDescripcion('')
    setTipoPreguntaSeleccionada('')
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    // Resetear los campos para agregar otra pregunta
    setDescripcion('');
    setTipoPreguntaSeleccionada('');
  };

  const resetFields = () => {
    setEncuesta({
      titulo: '',
      esIntermedia: false,
      facultad: null,
      fechaInicio: null, // Cambiar a null para el DatePicker
      fechaFin: null,
      activo: true,
      preguntas: [],
    });
    setTipoPreguntaSeleccionada('');
    setDescripcion('');
  };
  const handleEsIntermediaChange = (event, newValue) => {
    if (newValue !== null) {
      setEncuesta((prevEncuesta) => ({
        ...prevEncuesta,
        esIntermedia: newValue, // Aquí también usamos el nuevo valor directamente
      }));
    }
  };

  const agregarPregunta = () => {
    
    if (!tipoPreguntaSeleccionada) {
      setSnackbarMessage('Debe seleccionar un tipo de pregunta.');
      setOpenSnackbar(true);
      return; // Salir de la función si no se seleccionó un tipo
    }
  
    if (!descripcion) {
      setSnackbarMessage('Debe ingresar una descripción para la pregunta.');
      setOpenSnackbar(true);
      return; // Salir de la función si la descripción está vacía
    }

    const preguntasA = encuesta.preguntas || [];
    let nuevaPregunta = {
      numeracion: preguntasA.length > 0 ? encuesta.preguntas[encuesta.preguntas.length - 1].numeracion + 1 : 1,
      descripcion,
    };

    if (tipoPreguntaSeleccionada === 'TextBox') {
      nuevaPregunta = {
        ...nuevaPregunta,
        tipo: "TextBox",
      };
    } else if (tipoPreguntaSeleccionada === 'OpcionMultiple') {
      nuevaPregunta = {
        ...nuevaPregunta,
        tipo: "OpcionMultiple",
      };
    }

    setEncuesta((prevEncuesta) => {
      const nuevasPreguntas = [...(prevEncuesta.preguntas || []), nuevaPregunta];
      console.log("Preguntas", nuevasPreguntas); // Muestra las preguntas actualizadas
      return {
        ...prevEncuesta,
        preguntas: nuevasPreguntas,
      };
    });
    handleClose();
    setIsEditing(true);

  };



  const eliminarPregunta = (index) => {
    setEncuesta((prevEncuesta) => {
      // Filtra la pregunta eliminada
      const preguntasActualizadas = prevEncuesta.preguntas.filter((_, i) => i !== index);

      // Re-numerar las preguntas
      const preguntasConNumeracionActualizada = preguntasActualizadas.map((pregunta, i) => ({
        ...pregunta,
        numeracion: i + 1, // Reasignar numeración
      }));

      return {
        ...prevEncuesta,
        preguntas: preguntasConNumeracionActualizada,
      };
    });
  };

  const handleGuardar = async () => {
    // Muestra el diálogo de confirmación cuando se hace clic en guardar
    setModalOpen(true);
  };
  const handleCancel = () => {
    // Cierra la ventana de confirmación
    setOpenConfirmDialog(false);
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleGuardarEncuesta = async () => {
    if (new Date(encuesta.fechaFin) < new Date(encuesta.fechaInicio)) {
      setSnackbarMessage('La fecha de fin no puede ser menor que la fecha de inicio.');
      setOpenSnackbar(true);
      return;
    }
    else if (encuesta.preguntas.length === 0) {
      setSnackbarMessage('Debe ingresar por lo menos una pregunta.');
      setOpenSnackbar(true);
      return;
    }
    else if (!encuesta.titulo || !facultadSeleccionada) {
      setSnackbarMessage('No pueden haber campos vacios');
      setOpenSnackbar(true);
      return;
    }


    console.log("facultad", facultades);

    try {
      
      const dataToSend = {
        titulo: encuesta.titulo,
        esIntermedia: encuesta.esIntermedia,
        facultad: objetoFacultad, // Usa el ID aquí
        fechaInicio: encuesta.fechaInicio,
        fechaFin: encuesta.fechaFin,
        preguntas: encuesta.preguntas,
        activo: true,
      };

      if (encuesta) {
        encuesta.titulo = encuesta.titulo;
        encuesta.esIntermedia = encuesta.esIntermedia;
        encuesta.facultad = objetoFacultad;
        encuesta.fechaInicio = encuesta.fechaInicio;
        encuesta.fechaFin = encuesta.fechaFin;
        encuesta.preguntas = encuesta.preguntas;

      }
      //Verifico si llega el objeto encuesta  editado o nuevo
      console.log("EDITAR", dataToSend);
      const endpoint = isEditingEncuesta ? `http://localhost:8080/preguntas/encuesta/actualizar/${encuesta.id_Encuesta}` : 'http://localhost:8080/preguntas/encuesta/insertar';
      const method = isEditingEncuesta ? 'put' : 'post';
      const response = await axios[method](endpoint, encuesta ? encuesta : dataToSend);
      if (!encuesta) {
        resetFields(); // Limpia los campos
      }

      console.log('Encuesta guardada:', response.data);
      router.push('../encuestaDocente/gestionEncuestaDocente');
    } catch (error) {
      console.error('Error al guardar la encuesta:', error.response ? error.response.data : error.message);
    }
  };

  const editarPregunta = (index) => {
    const pregunta = encuesta.preguntas[index];
    console.log("EDITAAAAAA", pregunta.tipo);
    // Actualizar los estados con los datos de la pregunta
    setDescripcion(pregunta.descripcion || '');
    setTipoPreguntaSeleccionada(pregunta.tipo || ''); // Establecer el tipo de pregunta

    setEditingIndex(index);
    setIsEditing(true);
    setOpenDialog(true);

  };

  const handleSaveEdit = () => {
    const updatedPreguntas = [...encuesta.preguntas];
    const preguntaActualizada = {
      ...updatedPreguntas[editingIndex],
      descripcion,  // Actualiza la descripción con el valor ingresado
      tipo: tipoPreguntaSeleccionada || '', // Establece el tipo de pregunta actualizado
    };

    updatedPreguntas[editingIndex] = preguntaActualizada;

    setEncuesta((prevEncuesta) => ({
      ...prevEncuesta,
      preguntas: updatedPreguntas,
    }));

    setEditingIndex(null);
    setOpenDialog(false); // Cierra el diálogo
    setIsEditing(false); // Restablecer estado



  };

  return (
    <Box sx={{ backgroundColor: 'white', height: '100vh' }}>

      {/*Aqui se llamaba explicitamente al componente barra lateral, pero esto no era necesario, ya que se esta usando un layout que es el archivo que esta en la raiz*/}

      <Box
        sx={{
          marginLeft: '220px',
          height: '100vh',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Título */}
        <Typography variant="h4" sx={{ mb: '20px', color: '#191D23' }}>
          {isEditingEncuesta ? "Editar Encuesta Docente" : "Registro Encuesta Docente"}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}> {/* Ajusta el valor de 'ml' según sea necesario */}
          <InputField
            label="Título"
            value={encuesta.titulo}
            onChange={actualizarTitulo}
            height="30px"
            width="70%"
            mrLabel='150px' //Acercar o alejar input de label
          />


          <LocalizationProvider dateAdapter={AdapterDayjs}>


            <InputField
              label="Facultad"
              select
              height="30px"
              width="70%"
              mrLabel='150px'
              value={facultadSeleccionada.nombre || encuesta?.facultad?.nombre || ''}
              onChange={actualizarFacultad}
            >
              {facultades.map((facultad) => (
                <MenuItem key={facultad.id} value={facultad.nombre}
                  style={{ color: '#363581' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#363581';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#363581';
                  }}>{facultad.nombre}</MenuItem>
              ))}
            </InputField>

            <InputField
              label="Semestre"
              select
              height="30px"
              width="70%"
              mrLabel='150px'
              value={semestreSeleccionado.nombre || ''}
              onChange={actualizarSemestreSelecionado}
              helperText={"Puede usar el campo de semestre para asignar las fechas. No es un campo obligatorio."}
            >
              {semestres.map((semestre) => (
                <MenuItem
                  key={semestre.idSemestre}
                  value={semestre.nombre}
                  style={{ color: '#363581' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#363581';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#363581';
                  }}>{semestre.nombre}</MenuItem>
              ))}
            </InputField>
           

            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mt: 2 }}> {/* Cambié 'flex-start' a 'center' */}
              <Typography sx={{ mb: 2, mr: '100px' }}>Fechas</Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}> {/* Espacio entre los DatePickers */}
                <DatePicker
                  label="Fecha Inicio"
                  variant="outlined"
                  value={encuesta?.fechaInicio ? dayjs(encuesta.fechaInicio) : null}
                  onChange={handleFechaInicioChange}
                  textField={<TextField fullWidth variant="outlined" sx={{ height: '30px' }} />}
                />
                <DatePicker
                  label="Fecha Fin"
                  size="small"
                  value={encuesta?.fechaFin ? dayjs(encuesta.fechaFin) : null}
                  onChange={handleFechaFinChange}
                  textField={<TextField fullWidth variant="outlined" sx={{ height: '30px' }} />}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mt: 2 }}> {/* Cambié 'flex-start' a 'center' */}
              <Typography sx={{ mb: 2, mr: '75px' }}>Modalidad</Typography>
              <ToggleButtonGroup
                value={encuesta.esIntermedia || false}
                exclusive
                onChange={handleEsIntermediaChange}
                aria-label="Tipo de Encuesta"
                sx={{ marginBottom: 2 }}
              >
                <ToggleButton value={true} aria-label="Intermedia">
                  Intermedia
                </ToggleButton>
                <ToggleButton value={false} aria-label="Final">
                  Final
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </LocalizationProvider>


        </Box>
        <Box
          sx={{
            height: '15px', // Altura del rectángulo
            backgroundColor: '#363581', // Color azul oscuro
            width: '100%', // Ancho completo
            mt: 2, // Margen superior para separarlo de los elementos anteriores
            mb: 2
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
          <Typography variant="h6" color="black">
            Preguntas
          </Typography>
          <Box>
            <Button
              onClick={handleClickOpen}
              variant="contained"
              color="primary"
              sx={{ ml: 2, display: 'flex', alignItems: 'center', height: '40px', backgroundColor: '#363581' }} // Ajusta la altura según sea necesario
            >
              Añadir
              <AddCircleOutlineIcon sx={{ ml: 1, color: 'white', borderRadius: '50%', backgroundColor: '#363581', width: '20px', height: '20px' }} />
            </Button>
          </Box>
        </Box>


        {/*DIALOGO PARA PODER REGISTRAR LA NUEVA PREGUNTA*/}
        <Dialog open={openDialog} onClose={handleClose}>
          <DialogTitle> {isEditing ? "Editar Pregunta" : "Insertar Nueva Pregunta"}</DialogTitle>
          <DialogContent sx={{ width: '600px' }}>
            <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
              <InputLabel id="tipo-pregunta-label">Tipo de Pregunta</InputLabel>
              <Select
                labelId="tipo-pregunta-label"
                label="Tipo de Pregunta"
                value={tipoPreguntaSeleccionada}
                onChange={(e) => setTipoPreguntaSeleccionada(e.target.value)}
              >
                <MenuItem value="TextBox">Pregunta de Texto</MenuItem>
                <MenuItem value="OpcionMultiple">Pregunta Opción Múltiple</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Pregunta"
              variant="outlined"
              multiline
              rows={5}
              fullWidth
              sx={{ mb: 2 }}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}

            />
            {tipoPreguntaSeleccionada === 'TextBox' && (
              <Box sx={{
                mt: 1,
                p: 2,
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
                boxShadow: 1
              }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Ejemplo de Pregunta de Texto:
                </Typography>
                <Typography variant="body1" sx={{ fontStyle: 'italic', color: '#363581', fontWeight: 'bold' }}>
                  ¿Cuál es tu opinión sobre el curso?
                </Typography>

                <Box sx={{
                  mt: 1,
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  backgroundColor: '#FFFF',
                  boxShadow: 1,
                  height: '80px'
                }}></Box>
              </Box>
            )}

            {tipoPreguntaSeleccionada === 'OpcionMultiple' && (
              <Box sx={{
                mt: 1,
                p: 2,
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
                boxShadow: 1
              }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold'}}>
                  Ejemplo de Pregunta Opción Múltiple:
                </Typography>
                <Typography variant="body1" sx={{ fontStyle: 'italic', color: '#363581', mb: 2, fontWeight: 'bold' }}>
                  ¿Cómo calificarías la enseñanza del curso?
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <FormControlLabel

                    control={<Radio checked={false} />}
                    label="Muy bajo"
                  />
                  <FormControlLabel
                    control={<Radio checked={false} />}
                    label="Bajo"
                  />
                  <FormControlLabel
                    control={<Radio checked={false} />}
                    label="Normal"
                  />
                  <FormControlLabel
                    control={<Radio checked={false} />}
                    label="Bueno"
                  />
                  <FormControlLabel
                    control={<Radio checked={false} />}
                    label="Muy bueno"
                  />

                </Box>
              </Box>
            )}

          </DialogContent>
          <DialogActions sx={{ display: 'flex', justifyContent: 'center', mb: 2, width: '100%' }} >
            <Button variant="outlined" color="primary" sx={{ width: '170px', marginRight: '20px' }} onClick={handleClose}>Cancelar</Button>
            <Button sx={{ width: '170px' }} onClick={isEditing ? handleSaveEdit : agregarPregunta} variant="contained">{isEditing ? "Guardar cambios" : "Agregar"}</Button>
          </DialogActions>
        </Dialog>


        {/* Tabla de Preguntas */}

        <TablaPreguntas preguntas={encuesta?.preguntas || []} onEdit={editarPregunta} onDelete={eliminarPregunta} ></TablaPreguntas>


        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, width: '100%' }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => router.back()}
            sx={{ width: '170px', marginRight: '20px' }}
          >
            Cancelar
          </Button>

          <Button
            onClick={handleGuardar}
            variant="contained"
            sx={{ width: '170px' }}
          >
            Guardar
          </Button>
        </Box>

        <EstaSeguroAccion
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          texto={`¿Está seguro de agregar la encuesta?`}
          handleAceptar={async () => {
            await handleGuardarEncuesta();
            setModalOpen(false);
          }}
        />

        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="error">
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}