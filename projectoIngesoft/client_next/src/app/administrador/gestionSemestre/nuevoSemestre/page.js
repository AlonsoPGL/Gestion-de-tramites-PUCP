"use client";
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import InputField from '../../../../../componentesGenerales/inputs/InputField';
import EstaSeguroAccion from '../../../../../componentesGenerales/modales/EstaSeguroAccion';
import { useSemestre } from '../../../SemestreContext';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

function NuevoSemestre() {
  const { semestre: semestreEditar } = useSemestre();
  const [nombre, setNombre] = useState("");
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [errores, setErrores] = useState({});
  const [erroresMensaje, setErroresMensaje] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (semestreEditar) {
      setNombre(semestreEditar?.nombre);
      setFechaInicio(semestreEditar?.fechaInicio ? dayjs(semestreEditar.fechaInicio) : null);
      setFechaFin(semestreEditar?.fechaFin ? dayjs(semestreEditar.fechaFin) : null);
    }
  }, [semestreEditar]);

  const mensajesError = {
    nombre: "El nombre del semestre debe tener entre 1 y 50 caracteres y seguir el formato '20XX-X'.",
    fechaInicio: "La fecha de inicio es requerida y debe ser una fecha válida(año del nombre del semestre).",
    fechaFin: "La fecha fin es requerida, debe ser una fecha válida y posterior a la fecha de inicio.",
    fechaInicioAño: "La fecha de inicio debe corresponder al año del semestre indicado",
    fechaFinAño: "La fecha fin debe corresponder al año del semestre indicado" // Nuevo mensaje
  };

  // Validaciones
  const validarNombre = (nombre) => {
    // Regex para validar formato "20XX-X" donde X son números
    const regexSemestre = /^20\d{2}-[0-2]$/;
    return regexSemestre.test(nombre);
  };

  const validarFechaInicio = (fecha, nombreSemestre) => {
    if (!fecha || !dayjs(fecha).isValid()) return false;

    // Si hay un nombre de semestre válido, verificar que el año coincida
    if (nombreSemestre && /^20\d{2}-[0-2]$/.test(nombreSemestre)) {
      const anioSemestre = nombreSemestre.split('-')[0];
      const anioFecha = dayjs(fecha).year().toString();
      return anioSemestre === anioFecha;
    }

    return true;
  };

  const validarFechaFin = (fechaFin, fechaInicio, nombreSemestre) => {
    if (!fechaFin || !dayjs(fechaFin).isValid()) return false;
    if (!fechaInicio) return false;
    
    const fechaFinDate = dayjs(fechaFin).startOf('day');
    const fechaInicioDate = dayjs(fechaInicio).startOf('day');
    
    // Verificar si están en el mismo mes y año
    const mismoMesYAno = fechaFinDate.format('YYYY-MM') === fechaInicioDate.format('YYYY-MM');
    
    // Si están en el mismo mes y año, comparar los días
    if (mismoMesYAno) {
      if (fechaFinDate.date() <= fechaInicioDate.date()) {
        return false;
      }
    } else {
      // Si no están en el mismo mes, solo verificar que el mes final sea posterior
      if (!fechaFinDate.isAfter(fechaInicioDate, 'month')) {
        return false;
      }
    }
    
    // Validar que el año coincida con el nombre del semestre
    if (nombreSemestre && /^20\d{2}-[0-2]$/.test(nombreSemestre)) {
      const anioSemestre = nombreSemestre.split('-')[0];
      const anioFecha = fechaFinDate.year().toString();
      return anioSemestre === anioFecha;
    }
    
    return true;
  };


  const verificarSemestreEnBD = async (nombre) => {
    try {
      //http://localhost:8080/institucion/semestre/existe/2025-2
      const response = await axios.get(`http://localhost:8080/institucion/semestre/existe/${nombre}`);
      return response.data;
    } catch (error) {
      console.error("Error al verificar el semestre en la BD:", error);
      return false;
    }
  };

  const handleChange = (setter, validator, field) => async (value) => {
    const newValue = field === 'nombre' ? value.target.value : value;
    setter(newValue);

    const nuevosErrores = { ...errores };
    const nuevosErroresMensaje = { ...erroresMensaje };

    if (field === 'nombre') {
      if (!validator(newValue)) {
        nuevosErrores[field] = true;
        nuevosErroresMensaje[field] = mensajesError[field];
      } else {
        const existe = await verificarSemestreEnBD(newValue);
        if (existe && (!semestreEditar || semestreEditar.nombre !== newValue)) {
          nuevosErrores[field] = true;
          nuevosErroresMensaje[field] = "El semestre ya existe.";
        } else {
          delete nuevosErrores[field];
          delete nuevosErroresMensaje[field];
        }
      }
    } else if (field === 'fechaFin') {
      if (!validator(newValue, fechaInicio, nombre)) {
        nuevosErrores[field] = true;
        nuevosErroresMensaje[field] = mensajesError[field];
      } else {
        delete nuevosErrores[field];
        delete nuevosErroresMensaje[field];
      }
    } else {
      if (!validator(newValue, nombre)) {
        nuevosErrores[field] = true;
        nuevosErroresMensaje[field] = mensajesError[field];
      } else {
        delete nuevosErrores[field];
        delete nuevosErroresMensaje[field];
      }
    }

    setErrores(nuevosErrores);
    setErroresMensaje(nuevosErroresMensaje);
  };

  const validarFormulario = async () => {
    const nuevosErrores = {};
    const nuevosErroresMensaje = {};

    if (!validarNombre(nombre)) {
      nuevosErrores.nombre = true;
      nuevosErroresMensaje.nombre = mensajesError.nombre;
    } else {
      const existe = await verificarSemestreEnBD(nombre);
      if (existe && (!semestreEditar || semestreEditar.nombre !== nombre)) {
        nuevosErrores.nombre = true;
        nuevosErroresMensaje.nombre = "El semestre ya existe.";
      }
    }

    if (!validarFechaInicio(fechaInicio, nombre)) {
      nuevosErrores.fechaInicio = true;
      nuevosErroresMensaje.fechaInicio = mensajesError.fechaInicio;
    }

    if (!validarFechaFin(fechaFin, fechaInicio, nombre)) {
      nuevosErrores.fechaFin = true;
      nuevosErroresMensaje.fechaFin = mensajesError.fechaFin;
    }

    setErrores(nuevosErrores);
    setErroresMensaje(nuevosErroresMensaje);

    return Object.keys(nuevosErrores).length === 0;
  };

  const handleClickInsertarSemestre = async () => {
    try {
      // Ajustamos las fechas para asegurar que se guarden correctamente
      const semestre = {
        nombre: nombre,
        fechaInicio: fechaInicio ? 
          dayjs(fechaInicio)
            .startOf('day')
            .format('YYYY-MM-DD') : null,
        fechaFin: fechaFin ? 
          dayjs(fechaFin)
            .startOf('day')
            .format('YYYY-MM-DD') : null,
      };
      console.log(semestre.fechaFin);
      console.log(semestre.fechaInicio);
      //Agregar un dia a la fecha fin
      semestre.fechaFin = dayjs(semestre.fechaFin).add(1, 'day').format('YYYY-MM-DD');
      //Agregar un dia a la fecha inicio
      semestre.fechaInicio = dayjs(semestre.fechaInicio).add(1, 'day').format('YYYY-MM-DD');
      const endpoint = semestreEditar
        ? `http://localhost:8080/institucion/semestre/actualizar/${semestreEditar.idSemestre}`
        : 'http://localhost:8080/institucion/semestre/insertar';
      const method = semestreEditar ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(semestre),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Semestre guardado:", responseData);
      router.push('/administrador/gestionSemestre/listadoSemestres');

    } catch (error) {
      console.error("Error al guardar semestre:", error);
      alert("ERROR al guardar semestre");
    }
  };


  const handleGuardar = async (e) => {
    e.preventDefault();
    if (await validarFormulario()) {
      setModalOpen(true);
    }
  };

  return (
    <Box sx={{ backgroundColor: 'white', minHeight: '100vh', paddingBottom: '10px' }}>
      <Box
        sx={{
          marginLeft: '220px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ marginRight: '69%', padding: '10px' }}>
          <Typography variant="h4" sx={{ mb: '20px', color: '#191D23' }}>
            {semestreEditar ? "Editar semestre" : "Registrar nuevo semestre"}
          </Typography>
        </Box>

        <Box
          sx={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #D9D9D9',
            borderRadius: 2,
            padding: 4,
            boxShadow: 2,
            width: '100%',
            maxWidth: 700,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, alignSelf: 'flex-start', fontWeight: 'bold' }}>
            Datos semestre:
          </Typography>

          <InputField
            label="Nombre"
            value={nombre}
            onChange={handleChange(setNombre, validarNombre, "nombre")}
            required
            error={!!errores.nombre}
            helperText={erroresMensaje.nombre}
            height="30px"
            sx={{ mb: 3 }}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1, mb: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <DatePicker
                  label="Fecha de inicio"
                  value={fechaInicio}
                  onChange={(newValue) => handleChange(setFechaInicio, (fecha) => validarFechaInicio(fecha, nombre), "fechaInicio")(newValue)}
                  inputFormat="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "outlined",
                      error: !!errores.fechaInicio,
                      sx: {
                        '& .MuiFormHelperText-root': {
                          position: 'absolute',
                          bottom: '-20px'
                        }
                      }
                    }
                  }}
                />
                {errores.fechaInicio && (
                  <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
                    {erroresMensaje.fechaInicio}
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <DatePicker
                  label="Fecha de fin"
                  value={fechaFin}
                  onChange={handleChange(setFechaFin, (fecha) => validarFechaFin(fecha, fechaInicio, nombre), "fechaFin")}
                  inputFormat="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "outlined",
                      error: !!errores.fechaFin,
                      sx: {
                        '& .MuiFormHelperText-root': {
                          position: 'absolute',
                          bottom: '-20px'
                        }
                      }
                    }
                  }}
                />
                {errores.fechaFin && (
                  <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
                    {erroresMensaje.fechaFin}
                  </Typography>
                )}
              </Box>
            </Box>
          </LocalizationProvider>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant='outlined'
            onClick={() => router.back()}
            sx={{ width: '170px', marginRight: '20px' }}
          >
            Cancelar
          </Button>
          <Button
            variant='contained'
            onClick={handleGuardar}
            sx={{ width: '170px' }}
          >
            Guardar
          </Button>
        </Box>
      </Box>

      <EstaSeguroAccion
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        texto={`¿Está seguro de ${semestreEditar ? "editar" : "guardar"} el semestre?`}
        handleAceptar={async () => {
          await handleClickInsertarSemestre();
          setModalOpen(false);
        }}
      />
    </Box>
  );
}

export default NuevoSemestre;