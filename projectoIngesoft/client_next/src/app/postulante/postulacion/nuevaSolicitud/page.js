"use client";
import { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import EstaSeguroAccion from 'componentesGenerales/modales/EstaSeguroAccion';
import InputField from '../../../../../componentesGenerales/inputs/InputField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FileUpload from 'componentesGenerales/inputs/FileUpload';
import { useConvocatoria } from '../../../convocatoriaContext';
import dayjs from 'dayjs';
import { daysInWeek } from 'date-fns/constants';
function NuevaConvocatoria() {

  const [modalOpen, setModalOpen] = useState(false);
  const [errores, setErrores] = useState({}); // Para rastrear campos incompletos
  const router = useRouter();
  const [erroresMensaje, setErroresMensaje] = useState({});
  const { convocatoria } = useConvocatoria('');
  const [values, setValues] = useState({
    nombrePostulante: "",
    apelidoPaternoPostulante: "",
    apelidoMaternoPostulante: "",
    fechaNacimiento: null,
    dni: "",
    correo: "",
    celular: "",
    cv: [],
    referencias: [],
  })

  const mensajesError = {
    nombrePostulante: "El nombre debe contener solo letras y espacios, y tener entre 1 y 60 caracteres.",
    apelidoPaternoPostulante: "El apellido paterno debe contener solo letras y espacios, y tener entre 1 y 60 caracteres.",
    apelidoMaternoPostulante: "El apellido materno debe contener solo letras y espacios, y tener entre 1 y 60 caracteres.",
    correo: "El correo debe ser un correo válido.",
    dni: "El DNI debe tener 8 dígitos numéricos.",
    celular: "El celular debe tener 9 dígitos numéricos.",
  };



  const validarNombre = (nombrePostulante) => /^[A-Za-z\s]{1,60}$/.test(nombrePostulante);
  const validarApellido = (apellido) => /^[A-Za-z\s]{1,60}$/.test(apellido);
  const validarCorreo = (correo) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(correo);
  const validarDni = (dni) => /^[0-9]{8}$/.test(dni); // Validación de 8 dígitos
  const validarCelular = (celular) => /^[0-9]{9}$/.test(celular); // Validación de 9 dígitos
  const validarArchivo = (archivo) => archivo && archivo.length > 0; // Validar si se ha subido un archivo


  /*
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };
  */


  const handleSubmit = (event) => {
    event.preventDefault()
    console.log(values);
  }

  const handleClickInsertarSolicitud = async () => {
    // Datos a enviar
    const data = {
      nombrePostulante: values.nombrePostulante,
      apelidoPaternoPostulante: values.apelidoPaternoPostulante,
      apelidoMaternoPostulante: values.apelidoMaternoPostulante,
      fechaNacimiento: values.fechaNacimiento,
      dni: values.dni,
      correo: values.correo,
      celular: values.celular,
      cv: values.cv,
      referencias: values.referencias,
    };

    try {
      const response = await fetch('http://localhost:8080/postulaciones/insertar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("¡La solicitud fue ingresada correctamente!");

        // Retraso antes de redirigir
        setTimeout(() => {
          router.back(); // Regresa a la página anterior
        }, 2000); // 2000 ms = 2 segundos
      } else {
        console.error('Error al enviar la solicitud:', response.statusText);
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
    }
  };


  const handleChange = (event, validator, field) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
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

    if (!validarNombre(values.nombrePostulante)) {
      nuevosErrores.nombrePostulante = true;
      nuevosErroresMensaje.nombrePostulante = mensajesError.nombrePostulante;
    }

    if (!validarApellido(values.apelidoPaternoPostulante)) {
      nuevosErrores.apelidoPaternoPostulante = true;
      nuevosErroresMensaje.apelidoPaternoPostulante = mensajesError.apelidoPaternoPostulante;
    }

    if (!validarApellido(values.apelidoMaternoPostulante)) {
      nuevosErrores.apelidoMaternoPostulante = true;
      nuevosErroresMensaje.apelidoMaternoPostulante = mensajesError.apelidoMaternoPostulante;
    }

    if (!validarDni(values.dni)) {
      nuevosErrores.dni = true;
      nuevosErroresMensaje.dni = mensajesError.dni;
    }

    if (!validarCorreo(values.correo)) {
      nuevosErrores.correo = true;
      nuevosErroresMensaje.correo = mensajesError.correo;
    }

    if (!validarCelular(values.celular)) {
      nuevosErrores.celular = true;
      nuevosErroresMensaje.celular = mensajesError.celular;
    }

    if (!validarArchivo(values.cv)) {
      nuevosErrores.cv = true;
      nuevosErroresMensaje.cv = "Debe subir un archivo para el CV.";
    }

    if (!validarArchivo(values.referencias)) {
      nuevosErrores.referencias = true;
      nuevosErroresMensaje.referencias = "Debe subir un archivo para las referencias.";
    }



    setErrores(nuevosErrores);
    setErroresMensaje(nuevosErroresMensaje);

    // Si no hay errores, retorna true
    return Object.keys(nuevosErrores).length === 0;
  };


  const handleGuardar = async (e) => {
    e.preventDefault();

    // Validar el formulario antes de abrir el modal
    if (await validarFormulario()) {
      console.log(values);
      setModalOpen(true); // Si todo es válido, abrir el modal  
    }

  };

  //! Cambios/Fujiki
  const [sePuedeVer, setSePuedeVer] = useState(false);

  //Visualizar contraseña
  const handleClickVerContrasenia = () => {
    setSePuedeVer(!sePuedeVer);
  }


  const handleFechaChange = (newValue, field) => {
    setValues({
      ...values,
      [field]: newValue,
    });
  };

  //! Obteniendo el archivo de la solicitud

  const fetchArchivo = async () => {
    try {
      console.log("CONVO",convocatoria);
      const response = await fetch(`http://localhost:8080/procesoDeSeleccion/buscarRequisitos/${convocatoria.id}`);
      //! Cambiar el metodo del fetch cuando se tenga listo el servicio que envia el documento
      if (!response.ok) {
        throw new Error('Error al obtener el archivo de la solicitud');
      }

      // Obtén el blob directamente de la respuesta
      const blob = await response.blob();
      if (blob) {
        const url = URL.createObjectURL(blob); // Crea un objeto URL para el blob
        const a = document.createElement('a');
        a.href = url;
        a.download = 'requisitos.pdf'; // Cambia el nombre del archivo si es necesario
        a.click();
        URL.revokeObjectURL(url); // Libera el objeto URL después de la descarga
        console.log("Archivo listo para descargar.");
      } else {
        console.log("El archivo no se pudo obtener.");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleDescargaPdf = () => {
    fetchArchivo(); // Llama a la función para obtener y descargar el archivo
  };



  return (
    <Box sx={{ backgroundColor: 'white', minHeight: '100vh', paddingBottom: '10px' }}>

      <Box sx={{ ml: 29, padding: '10px' }}>
        <Typography variant="h4" sx={{ mb: '5px', color: '#191D23' }}>
           {convocatoria?.puesto || "Convocatoria docente "}  
        </Typography>
      </Box>
      <Box
        sx={{
          marginLeft: '220px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >


        <Box
          onSubmit={handleSubmit}
          sx={{

            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #D9D9D9',
            borderRadius: 2,
            padding: 4,
            boxShadow: 2,
            width: '80%', // Reducir el ancho al 50%
            maxWidth: '1000px', // Ancho máximo opcional
            minWidth: '800px', // Ancho mínimo opcional
            margin: '0 auto', // Centrar horizontalmente

          }}

        >

          <Box sx={{
            mb: "20px",
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="h4">Nueva Solicitud</Typography>

            <Box sx={{ display: 'flex' }} >
              <Box sx={{ mr: '5px' }}>
                <Typography variant="h6">Descargue las bases: </Typography>
              </Box>
              <Button onClick={handleDescargaPdf} variant='contained'>
                <PictureAsPdfIcon sx={{ marginRight: '5px' }}></PictureAsPdfIcon>
                BASES
              </Button>
            </Box>

          </Box>

          <InputField
            label="Nombres"
            name="nombrePostulante"
            value={values.nombrePostulante}
            onChange={(e) => handleChange(e, validarNombre, 'nombrePostulante')}
            required
            error={!!errores.nombrePostulante}
            helperText={erroresMensaje.nombrePostulante}
            height="30px"
            width='75%'
            mrLabel="200px"
          />

          <InputField
            label="Apellido Paterno"
            name="apelidoPaternoPostulante"
            value={values.apelidoPaternoPostulante}
            onChange={(e) => handleChange(e, validarApellido, 'apelidoPaternoPostulante')}
            required
            error={!!errores.apelidoPaternoPostulante}
            helperText={erroresMensaje.apelidoPaternoPostulante}
            height="30px"
            width='75%'
            mrLabel="200px"
          />

          <InputField
            label="Apellido Materno"
            name="apelidoMaternoPostulante"
            value={values.apelidoMaternoPostulante}
            onChange={(e) => handleChange(e, validarApellido, 'apelidoMaternoPostulante')}
            required
            error={!!errores.apelidoMaternoPostulante}
            helperText={erroresMensaje.apelidoMaternoPostulante}
            height="30px"
            width='75%'
            mrLabel="200px"
          />

          <InputField
            label="Correo"
            name="correo"
            value={values.correo}
            onChange={(e) => handleChange(e, validarCorreo, 'correo')}
            required
            error={!!errores.correo}
            helperText={erroresMensaje.correo}
            height="30px"
            width='75%'
            mrLabel="200px"
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mt: 2, mb: 2 }}> {/* Cambié 'flex-start' a 'center' */}
              <Typography sx={{ mb: 2, mr: '51px' }}>Fecha de nacimiento</Typography>
              <Box sx={{ display: 'flex', gap: 5, mb: 2 }}> {/* Espacio entre los DatePickers */}
                <DatePicker
                  label="Fecha de Nacimiento"
                  name="fechaNacimiento"
                  variant="outlined"
                  value={values.fechaNacimiento || null}
                  onChange={(newValue) => handleFechaChange(newValue, 'fechaNacimiento')} // Llama a la función específica
                  textField={<TextField fullWidth variant="outlined" sx={{ height: '30px' }} />}
                />

              </Box>
            </Box>
          </LocalizationProvider>
          <InputField
            label="DNI/CE"
            name="dni"
            value={values.dni}
            onChange={(e) => handleChange(e, validarDni, 'dni')}
            required
            error={!!errores.dni}
            helperText={erroresMensaje.dni}
            height="30px"
            width='30%'
            mrLabel="200px"
          />

          <InputField
            label="Celular"
            name="celular"
            value={values.celular}
            onChange={(e) => handleChange(e, validarCelular, 'celular')}
            required
            error={!!errores.celular}
            helperText={erroresMensaje.celular}
            height="30px"
            width='30%'
            mrLabel="200px"
          />
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mt: 2 }}>
            <Typography sx={{ mb: 2, mr: '86px' }}>Documentación</Typography>
            <Box sx={{ mb: 2, width: '100%' }}>
              <FileUpload name="cv" width='75%' onChange={(e) => handleChange(e, validarArchivo, 'cv')} ></FileUpload>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mt: 2 }}>
            <Typography sx={{ mb: 2, mr: '115px' }}>Referencias</Typography>
            <Box sx={{ mb: 2, width: '100%' }}>
              <FileUpload name="referencias" width='75%' onChange={(e) => handleChange(e, validarArchivo, 'referencias')} ></FileUpload>
            </Box>
          </Box>

        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button variant='outlined' onClick={() => router.back()} sx={{ width: '170px', marginRight: '20px' }}>
            Cancelar
          </Button>
          <Button type="submit" variant='contained' onClick={handleGuardar} sx={{ width: '170px' }}>
            Guardar
          </Button>
        </Box>
      </Box>

      <EstaSeguroAccion
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        texto={`¿Está seguro de guardar la  solicitud?`}
        handleAceptar={async () => {
          await handleClickInsertarSolicitud();
          setModalOpen(false);
        }}
      />
    </Box>
  );
}

export default NuevaConvocatoria;
