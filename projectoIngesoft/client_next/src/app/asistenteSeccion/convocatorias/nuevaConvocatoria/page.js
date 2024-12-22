"use client";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Box, Typography, Button, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useRouter } from 'next/navigation';
import InputField from '../../../../../componentesGenerales/inputs/InputField'; // Importa el componente
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EstaSeguroAccion from '../../../../../componentesGenerales/modales/EstaSeguroAccion';
import CardCriterios from '../../../../../componentesAsistenteSeccion/convocatorias/CardCriterios';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FileUpload from '../../../../../componentesGenerales/inputs/FileUpload'; // Importa el componente
import dayjs from 'dayjs';
import { useConvocatoria } from '../../../convocatoriaContext';
import ModalAnhadirEditar from 'componentesAsistenteSeccion/convocatorias/ModalAnhadirEditar';

function NuevaConvocatoria() {
  const [isEditing, setIsEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenAddEdit, setModalOpenAddEdit] = useState(false);
  const [editingCriterioIndex, setEditingCriterioIndex] = useState(null); // Para saber si estamos editando un criterio
  const [errores, setErrores] = useState({}); // Para rastrear campos incompletos
  const router = useRouter();
  const [erroresMensaje, setErroresMensaje] = useState({});
  const { convocatoria } = useConvocatoria('');
  const [values, setValues] = useState({
    fechaInicio: null,
    fechaFin: null,
    puesto: "",
    requisitos: [],
    frecuencia: "",
    modalidad: "",
    criteriosSeleccion: [],
    activo: true

  })

  const mensajesError = {
    puesto: "El nombre debe contener solo letras y espacios, y tener entre 1 y 300 caracteres.",
    fechas: "Debe ingresar fecha y la fecha de fin debe ser posterior a la fecha de inicio.",
    frecuencia: "Debe seleccionar una frecuencia.",
    modalidad: "Debe seleccionar una modalidad.",
    requisitos: "Debe subir un archivo para los requisitos.",
    criterios: "Debe agregar al menos un criterio de evaluación.",
  };

  const validarPuesto = (puesto) => /^[A-Za-záéíóúÁÉÍÓÚñÑ0-9\s]{1,300}$/.test(puesto);
  const validarArchivo = (archivo) => archivo && archivo.length > 0; // Validar si se ha subido un archivo
  const validarFrecuencia = (frecuencia) => frecuencia !== "";
  const validarModalidad = (modalidad) => modalidad !== "";
  const validarFechas = (fechaInicio, fechaFin) => {
    return fechaInicio && fechaFin && new Date(fechaInicio) < new Date(fechaFin);
  };
  const validarCriterios = (criteriosSeleccion) => criteriosSeleccion && criteriosSeleccion.length > 0;


  useEffect(() => {
    const loadStoredConvocatoria = async () => {
      // Primero intenta obtener la convocatoria desde el contexto
      if (convocatoria) {
        setValues(convocatoria);
        setIsEditing(true);

        localStorage.removeItem('selectedConvocatoria');
        localStorage.removeItem('editarConvocatoria');
        // Guarda en localStorage para la próxima vez
        localStorage.setItem('selectedConvocatoria', JSON.stringify(convocatoria));
        localStorage.setItem('editarConvocatoria', JSON.stringify(true));

      } else {
        // Si no hay convocatoria en el contexto, intenta obtenerla de localStorage
        const storedConvocatoria = JSON.parse(localStorage.getItem('selectedConvocatoria'));
        const storedIsEditing = JSON.parse(localStorage.getItem('editarConvocatoria'));

        if (storedConvocatoria) {
          setValues(storedConvocatoria);
          setIsEditing(storedIsEditing || false);
        } else {
          setIsEditing(false);
          // Si no hay datos en localStorage, inicializa el estado como vacío o predeterminado
          console.log("No hay convocatoria almacenada en localStorage.");
        }
      }
    };

    loadStoredConvocatoria();
  }, [convocatoria]); // Solo ejecutar cuando 'convocatoria' cambie


  const handleInputChange = (event, validator, field) => {
    const { name, value } = event.target;

    // Verifica si el nombre incluye un índice de array
    if (name.includes('.')) {
      const [parent, child, index] = name.split('.');  // Para capturar el índice en un arreglo

      // Si el array no está inicializado correctamente, lo inicializamos como un arreglo vacío
      const updatedCriterios = [...values[parent]];

      // Aseguramos que el índice esté dentro de los límites del arreglo
      if (updatedCriterios[index]) {
        updatedCriterios[index] = {
          ...updatedCriterios[index],
          [child]: value,  // Actualizamos solo el campo específico
        };
      } else {
        // Si el índice no existe, lo inicializamos
        updatedCriterios.push({
          [child]: value,
        });
      }

      // Actualiza el estado con el arreglo actualizado
      setValues(prevValues => ({
        ...prevValues,
        [parent]: updatedCriterios, // Actualizamos la parte correspondiente del estado
      }));
    } else {
      // Si no es un campo de array, actualizamos directamente
      setValues(prevValues => ({
        ...prevValues,
        [name]: value,
      }));
    }

    // Validación en tiempo real
    const nuevosErrores = { ...errores };
    const nuevosErroresMensaje = { ...erroresMensaje };
    if (!validator(value)) {
      nuevosErrores[field] = true;
      nuevosErroresMensaje[field] = mensajesError[field];
    } else {
      delete nuevosErrores[field];
      delete nuevosErroresMensaje[field];
    }
    setErrores(nuevosErrores);
    setErroresMensaje(nuevosErroresMensaje);
  };


  const validarFormulario = async () => {
    const nuevosErrores = {};
    const nuevosErroresMensaje = {};

    // Validación de puesto
    if (!validarPuesto(values.puesto)) {
      nuevosErrores.puesto = true;
      nuevosErroresMensaje.puesto = mensajesError.puesto;
    }

    // Validación de archivo
    if (!validarArchivo(values.requisitos)) {
      nuevosErrores.requisitos = true;
      nuevosErroresMensaje.requisitos = mensajesError.requisitos;
    } 

    // Validación de fechas
    if (!validarFechas(values.fechaInicio, values.fechaFin)) {
      nuevosErrores.fechas = true;
      nuevosErroresMensaje.fechas = mensajesError.fechas;
    }

    // Validación de frecuencia
    if (!validarFrecuencia(values.frecuencia)) {
      nuevosErrores.frecuencia = true;
      nuevosErroresMensaje.frecuencia = mensajesError.frecuencia;
    }

    // Validación de modalidad
    if (!validarModalidad(values.modalidad)) {
      nuevosErrores.modalidad = true;
      nuevosErroresMensaje.modalidad = mensajesError.modalidad;
    }

    if (!validarCriterios(values.criteriosSeleccion)) {
      nuevosErrores.criterios = true;
      nuevosErroresMensaje.criterios = mensajesError.criterios;
    }

    setErrores(nuevosErrores);
    setErroresMensaje(nuevosErroresMensaje);

    // Si no hay errores, retorna true
    return Object.keys(nuevosErrores).length === 0;
  };

  // Función para manejar la edición de un criterio
  const handleEditCriterio = (index) => {
    setEditingCriterioIndex(index);
    setModalOpenAddEdit(true);
  };

  const handleSaveCriterio = (criterio) => {

    // Agregar la fecha de creación actual a cada criterio
    const criterioConFecha = {
      ...criterio,
      fechaCreacioN: dayjs().toISOString()  // Usa dayjs para obtener la fecha actual en formato ISO (dateTime)
    };

    if (editingCriterioIndex !== null) {
      // Si estamos editando un criterio, actualizamos el índice correspondiente
      const updatedCriterios = [...values.criteriosSeleccion];
      updatedCriterios[editingCriterioIndex] = criterioConFecha;
      setValues(prevValues => ({
        ...prevValues,
        criteriosSeleccion: updatedCriterios
      }));
    } else {

      // Si no estamos editando, simplemente añadimos el nuevo criterio
      setValues(prevValues => ({
        ...prevValues,
        criteriosSeleccion: [...prevValues.criteriosSeleccion, criterioConFecha]
      }));
    }
    setModalOpenAddEdit(false); // Cerrar el modal
    setEditingCriterioIndex(null); // Resetear el índice de edición
  };



  const handleDeleteCriterio = (index) => {
    const updatedCriterios = values.criteriosSeleccion.filter((_, i) => i !== index);
    setValues(prevValues => ({
      ...prevValues,
      criteriosSeleccion: updatedCriterios
    }));
  };


  const handleSubmit = (event) => {
    event.preventDefault()
    console.log(values);
  }



  const handleClickInsertarconvocatoria = async (e) => {
    // Datos a enviar
    const data = {
      ...(isEditing && { id: values.id }),
      fechaInicio: values.fechaInicio,
      fechaFin: values.fechaFin,
      puesto: values.puesto,
      requisitos: values.requisitos,
      frecuencia: values.frecuencia,
      modalidad: values.modalidad,
      criteriosSeleccion: values.criteriosSeleccion,
      activo: values.activo
    };
    console.log("AQUII", data);
    try {
      const endpoint = isEditing ? `http://localhost:8080/procesoDeSeleccion/actualizar` : `http://localhost:8080/procesoDeSeleccion/insertar`;
      const method = isEditing ? 'put' : 'post';
      const response = await axios[method](endpoint, data);
      if (response != null) {
        router.push('/asistenteSeccion/convocatorias/listadoConvocatorias');
      }

    } catch (error) {
      console.error('Error al enviar la convocatoia:', error);
    }
  };



  const handleGuardar = async (e) => {
    e.preventDefault();
    const formularioValido = await validarFormulario();

    if (formularioValido) {
      setModalOpen(true); // Si todo es válido, abrir el modal
    }
  };



  const handleFechaChange = (newValue, field) => {
    setValues({
      ...values,
      [field]: newValue,
    });
  };



  return (
    <Box sx={{ backgroundColor: 'white', minHeight: '100vh', paddingBottom: '10px' }}>

      <Box sx={{ ml: 29, padding: '10px' }}>
        <Typography variant="h4" sx={{ mb: '5px', color: '#191D23' }}>
          {isEditing ? "Editar detalles de convocatoria" : "Iniciar convocatoria"}
        </Typography>
      </Box>
      <Box
        sx={{
          marginLeft: '220px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >


        <Box
          onSubmit={handleSubmit}
          sx={{

            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #D9D9D9',
            borderRadius: 2,
            boxShadow: 2,
            width: '100%',
          }}
        >

          <Box sx={{ padding: 4 }}>
            <Typography variant="h5" sx={{ mb: '20px', color: '#191D23', fontWeight: 'bold' }}>
              Detalle de convocatoria
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mt: 2, mb: 3 }}>
                <Typography sx={{ mb: 2, mr: '80px' }}>Fechas</Typography>
                <Box sx={{ display: 'flex', gap: 5, mb: 2 }}>
                  <DatePicker
                    label="Fecha Inicio"
                    name="fechaInicio"
                    variant="outlined"
                    value={values.fechaInicio ? dayjs(values.fechaInicio) : null}
                    onChange={(newValue) => handleFechaChange(newValue, 'fechaInicio')}

                  />

                  <DatePicker
                    label="Fecha Fin"
                    name="fechaFin"
                    size="small"
                    value={values.fechaFin ? dayjs(values.fechaFin) : null}
                    onChange={(newValue) => handleFechaChange(newValue, 'fechaFin')}
                  />
                  {erroresMensaje.fechas && (
                    <Typography marginTop="18px" color="error" variant="body2">{erroresMensaje.fechas}</Typography>  // Mensaje de error
                  )}
                </Box>
              </Box>

            </LocalizationProvider>


            <InputField
              label="Puesto"
              name="puesto"
              value={values.puesto}
              onChange={(e) => handleInputChange(e, validarPuesto, 'puesto')}
              required
              error={!!errores.puesto}
              helperText={erroresMensaje.puesto}
              height="30px"
              width='75%'
              mrLabel="131px"
            />

            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mt: 4 }}>
              <Typography sx={{ mb: 2, mr: '55px' }}>Requisitos</Typography>
              <Box sx={{ mb: 2, width: '100%' }}>
                <FileUpload
                  file={isEditing && values.requisitos != null ? values.requisitos[0] : null}
                  name="requisitos"
                  width='75%'
                  onChange={(e) => handleInputChange(e, validarArchivo, 'requisitos')}
                  isEditing={isEditing}
                  convocatoriaId={values.id} >

                </FileUpload>
              </Box>

            </Box>
            {errores.requisitos && (
              <Typography marginBottom="18px" marginLeft="145px" color="error" variant="body2" fontSize="13px">{erroresMensaje.requisitos}</Typography>  // Mensaje de error
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mt: 2 }}>
              <Typography sx={{ mb: 2, width: '150px' }}>Frecuencia</Typography>
              <RadioGroup
                row
                name="frecuencia"
                value={values.frecuencia}
                onChange={(e) => handleInputChange(e, validarFrecuencia, 'frecuencia')}
                sx={{ marginBottom: 2, ml: -2 }}
                aria-label="Tipo de Frecuencia"
              >
                <FormControlLabel value="TIEMPO_COMPLETO" control={<Radio />} label="Tiempo completo" />
                <FormControlLabel value="TIEMPO_PARCIAL" control={<Radio />} label="Tiempo parcial" />
              </RadioGroup>
              {errores.frecuencia && (
                <Typography marginBottom="18px" color="error" variant="body2">{erroresMensaje.frecuencia}</Typography>  // Mensaje de error
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mt: 2 }}>
              <Typography sx={{ mb: 2, width: '150px' }}>Modalidad</Typography>
              <RadioGroup
                row
                name="modalidad"
                value={values.modalidad}
                onChange={(e) => handleInputChange(e, validarModalidad, 'modalidad')}
                sx={{ marginBottom: 2, ml: -2 }}
                aria-label="Tipo de Modalidad"
              >
                <FormControlLabel value="PRESENCIAL" control={<Radio />} label="Presencial" />
                <FormControlLabel sx={{ ml: 5 }} value="REMOTO" control={<Radio />} label="Remoto" />
              </RadioGroup>
              {errores.modalidad && (
                <Typography marginBottom="18px" color="error" variant="body2">{erroresMensaje.modalidad}</Typography>  // Mensaje de error
              )}
            </Box>

          </Box>
          <Box sx={{ borderBottom: '1px solid #A9A9A9', width: '100%', mb: 2 }} />

          <Box sx={{ padding: 4 }}>


            <Typography variant="h5" sx={{ color: '#191D23', fontWeight: 'bold', mb: 4 }}>
              Detalle de criterios  de evaluación
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>


              <Button
                variant="contained"
                color="primary"
                onClick={() => setModalOpenAddEdit(true)}
                sx={{ display: 'flex', alignItems: 'center', height: '40px', backgroundColor: '#5D71BC' }}
              >
                Añadir
                <AddCircleOutlineIcon sx={{ ml: 1, color: 'white', width: '20px', height: '20px' }} />
              </Button>
            </Box>


            <CardCriterios criterios={values.criteriosSeleccion || []} onDelete={handleDeleteCriterio} onEdit={handleEditCriterio} />
            {errores.criterios && (
              <Typography marginBottom="18px" color="error" variant="body2">{erroresMensaje.criterios}</Typography>  // Mensaje de error
            )}
          </Box>
        </Box>


        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button variant='outlined' onClick={() => router.back()} sx={{ width: '170px', marginRight: '20px' }}>
            Cancelar
          </Button>
          <Button variant='contained' onClick={handleGuardar} sx={{ width: '170px' }}>
            Guardar
          </Button>
        </Box>
      </Box>



      <EstaSeguroAccion
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        texto={`¿Está seguro de ${isEditing ? "editar" : "guardar"} la convocatoria?`}
        handleAceptar={async () => {
          await handleClickInsertarconvocatoria();
          setModalOpen(false);
        }}
      />

      <ModalAnhadirEditar
        open={modalOpenAddEdit}
        onClose={() => setModalOpenAddEdit(false)}
        titulo={isEditing ? "Editar criterio" : "Añadir criterio"}
        values={values}
        onSave={handleSaveCriterio}
        editingIndex={editingCriterioIndex}
      />


    </Box>
  );
}

export default NuevaConvocatoria;
