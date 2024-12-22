"use client";
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Typography, Button, TextField, FormControlLabel, RadioGroup, Radio } from '@mui/material';
import axios from 'axios';

export default function VisualizarSolicitudInformacion() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idSolicitud = searchParams.get('idSolicitud');
  
  const [solicitud, setSolicitud] = useState(null); 
  const [comentario, setComentario] = useState('');
  const [rendimiento, setRendimiento] = useState('');
  const [loaded, setLoaded] = useState(false); // Para marcar cuando se hayan cargado datos

  // Mapeo de etiquetas a valores
  const notas = [
    { label: "Muy Malo", value: "1" },
    { label: "Malo", value: "2" },
    { label: "Regular", value: "3" },
    { label: "Bueno", value: "4" },
    { label: "Muy Bueno", value: "5" },
  ];

  useEffect(() => {
    if (idSolicitud) {
      // Obtener los datos de la solicitud del backend
      const obtenerSolicitud = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/solicitudes/infoAlumnosEnRiesgo/obtenerInformacionFull`, {
            params: { solicitudId: idSolicitud }
          });
          setSolicitud(response.data);
          console.log("Solicitud AlumnosEnRiesgo:", response.data);
          setComentario(response.data.comentario || '');
          setRendimiento(response.data.puntajeRendimiento ? String(response.data.puntajeRendimiento) : '');
          setLoaded(true);
        } catch (error) {
          console.error("Error al obtener la solicitud:", error);
        }
      };
      obtenerSolicitud();
    }
  }, [idSolicitud]);

  if(!solicitud){
    return('');
  };

  const fechaSolicitudFormatted = solicitud.fechaSolicitud
    ? new Date(solicitud.fechaSolicitud).toLocaleString('es-ES', {
        dateStyle: 'short',
        timeStyle: 'short',
      })
    : 'Desconocida';

  const fechaRespuestaFormatted = solicitud.fechaRespuesta
    ? new Date(solicitud.fechaRespuesta).toLocaleString('es-ES', {
        dateStyle: 'short',
        timeStyle: 'short',
      })
    : 'Sin respuesta';

  return (
    <Box sx={{ backgroundColor: 'white', height: '100vh', padding: '20px' }}>
      <Box
        sx={{
          marginLeft: '220px',
          height: '100%',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Información del alumno y curso, encabezado */}
        <Box sx={{ marginBottom: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', mb: 4, borderBottom: '1px solid #ccc' }}>
          
          {/* Título e información de la solicitud */}
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', mb: '20px'}}>
            <Typography variant="h4" sx={{ color: '#191D23', mb: '30px'}}>
            Visualizar Solicitud de Información de Alumno en Riesgo
            </Typography>
            {/* Sección de información de la solicitud */}
            <Box sx={{ display: 'flex'}}>
              <Box sx={{width: '500px'}}>
                <Typography ><strong>Código del Alumno:</strong> {solicitud.alumnoEnRiesgoXHorarioDTO.alumno.codigo}</Typography>
                <Typography ><strong>Nombre:</strong> 
                  {` ${solicitud.alumnoEnRiesgoXHorarioDTO.alumno.nombre} ${solicitud.alumnoEnRiesgoXHorarioDTO.alumno.apellidoPaterno} ${solicitud.alumnoEnRiesgoXHorarioDTO.alumno.apellidoMaterno}`}
                </Typography>
                <Typography ><strong>Correo Electrónico:</strong> {solicitud.alumnoEnRiesgoXHorarioDTO.alumno.email}</Typography>
              </Box>
              <Box sx={{width: '400px'}}>
                <Typography><strong>Fecha de Solicitud:</strong> {fechaSolicitudFormatted}</Typography>
                <Typography><strong>Fecha de Respuesta:</strong> {fechaRespuestaFormatted}</Typography>
                <Typography><strong>Estado:</strong> {solicitud.abierto ? 'Abierto' : 'Cerrado'}</Typography>
              </Box>
            </Box>
          </Box>
          
          {/* Información del Curso-Horario y botón de Docentes */}
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'right', mb: '20px', mr: 6}}>
            <Typography variant="h5" sx={{ color: '#191D23', mt:1, mb: '30px' }}>
              <strong>{`${solicitud.alumnoEnRiesgoXHorarioDTO.horario.nombreCurso} (${solicitud.alumnoEnRiesgoXHorarioDTO.horario.codigoCurso}-${solicitud.alumnoEnRiesgoXHorarioDTO.horario.codigo})`}</strong>
            </Typography>
          </Box>

        </Box>
        
        <Box sx={{ width: '1000px' }}>
          {/* Sección de evaluación y nota */}
          <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: '10px'}}>Puntuación del rendimiento del alumno:</Typography>
            <RadioGroup
              sx={{
                '& .Mui-checked': {
                  color: 'black',
                },
                '& .Mui-checked + .MuiFormControlLabel-label': {
                  fontWeight: 'bold', // texto en negrita para el seleccionado
                },
                '& .MuiFormControlLabel-root': {
                  cursor: 'default', // Cambia el cursor a default
                },
                '& .MuiRadio-root': {
                  pointerEvents: 'none', // Desactiva eventos del ratón para los botones de radio
                },
              }}
              row
              name="nota"
              value={rendimiento}
            >
              {notas.map((nota) => (
                <FormControlLabel
                  key={nota.value}
                  value={nota.value}
                  control={<Radio />}
                  label={nota.label}
                />
              ))}
            </RadioGroup>
          </Box>

          {/* Sección de comentario */}
          <Box sx={{ mb:4 }}>
            <Typography variant="h6">Comentario:</Typography>
            <TextField
              placeholder="Ingrese sus observaciones acerca del desempeño del alumno."
              multiline
              rows={12}
              value={comentario}
              sx={{ pointerEvents: 'none', width: '100%', mt: 2 }}
            />
          </Box>
        </Box>

        <Box sx={{width: '1000px', display: 'flex', flexDirection: 'row', justifyContent: "flex-end" }}>
          <Button sx={{ width: '240px', height: '40px'}}
            variant="outlined" onClick={() => router.back()}>
            Regresar
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
