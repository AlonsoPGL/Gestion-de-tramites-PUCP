"use client";
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Typography, Button, TextField, FormControlLabel, RadioGroup, Radio } from '@mui/material';
import { Modal, Backdrop, Fade } from "@mui/material";
import EstaSeguroAccion from "../../../../../../componentesGenerales/modales/EstaSeguroAccion";
import RegistradoConExito from "../../../../../../componentesGenerales/modales/RegistradoConExito";
import axios from 'axios';

export default function EditarSolicitudInformacion() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idSolicitud = searchParams.get('idSolicitud'); // se obtiene ?idSolicitud=...
  
  const [solicitud, setSolicitud] = useState(null);
  const [comentario, setComentario] = useState('');
  const [rendimiento, setRendimiento] = useState('');
  const [loaded, setLoaded] = useState(false); // Para marcar cuando se hayan cargado datos
  
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Mensaje de éxito
  const [openConfirmModal, setOpenConfirmModal] = useState(false); // Modal de confirmación
  const [openModalError, setOpenModalError] = useState(false);
  const [error, setError] = useState('');

  //const handleOpenModalError = () => setOpenModalError(true);
  const handleCloseModalError = () => {
    setOpenModalError(false);
    //setError('');
  }

  // Mapeo de etiquetas a valores
  const notas = [
    { label: "Muy Malo", value: "1" },
    { label: "Malo", value: "2" },
    { label: "Regular", value: "3" },
    { label: "Bueno", value: "4" },
    { label: "Muy Bueno", value: "5" },
  ];

  // Función para manejar el cambio de nota seleccionada
  const manejarRendimiento = (event) => {
    setRendimiento(event.target.value);
  };

  // Función para manejar el cambio del comentario
  const manejarComentario = (event) => {
    setComentario(event.target.value);
  };

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

  // Abrir modal de guardado
  const handleModalGuardar = () => {
    setOpenConfirmModal(true); // Abrir el modal de confirmación
  };

  // Cancelar la acción y cerrar el modal
  const handleCloseConfirmModal = () => {
    setOpenConfirmModal(false);
  };

  const handleGuardar = async () => {
    if(rendimiento === ''){
      //alert("Debe puntuar el rendimiento del alumno.");
      setError('Debe puntuar el rendimiento del alumno.');
      setOpenConfirmModal(false);
      setOpenModalError(true);
    }
    else if(comentario === ''){
      //alert("Debe ingresar un comentario sobre el desempeño del alumno.");
      setError('Debe ingresar un comentario sobre el desempeño del alumno.');
      setOpenConfirmModal(false);
      setOpenModalError(true);
    }
    else{
      try {
        // Actualizar la solicitud en el backend
        const id = parseInt(idSolicitud, 10);
        const puntaje = rendimiento === '' ? null : Number(rendimiento);
        const comment = comentario || '';

        await axios.put(`http://localhost:8080/solicitudes/infoAlumnosEnRiesgo/actualizarSolicitud`, null, {
          params: {
            idSolicitud: id,
            puntaje: puntaje,
            comentario: comment
          }
        });
        console.log("Solicitud actualizada con éxito.");
        setOpenConfirmModal(false);
        setShowSuccessMessage(true);
        // Navegar de regreso a la página anterior
        //router.back();
      } catch (error) {
        console.error("Error al actualizar la solicitud:", error);
      }
    }
  };

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
            Editar Solicitud de Información de Alumno en Riesgo
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
            <Typography variant="h6" sx={{ mb: '10px'}}>Puntuación del rendimiento del alumno: *</Typography>
            <RadioGroup
              row
              name="nota"
              value={rendimiento}
              onChange={manejarRendimiento}
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
            <Typography variant="h6">Comentario: *</Typography>
            <TextField
              placeholder="Ingrese sus observaciones acerca del desempeño del alumno."
              multiline
              rows={12}
              value={comentario}
              onChange={manejarComentario}
              sx={{ width: '100%', mt: 2 }}
            />
          </Box>
        </Box>

        <Box sx={{width: '1000px', display: 'flex', flexDirection: 'row', justifyContent: "flex-end" }}>
          <Button sx={{ width: '240px', ml: 4}}
            variant="outlined" onClick={() => router.back()}>
            Regresar
          </Button>
          <Button sx={{ width: '240px', height: '40px', backgroundColor: "#363581", color: "#FFFFFF", ml:4 }}
            variant="outlined" onClick={handleModalGuardar}>
            Guardar
          </Button>
        </Box>
      </Box>
      
      {/* Modal de Confirmación */}
      <EstaSeguroAccion
        open={openConfirmModal}
        onClose={handleCloseConfirmModal}
        handleAceptar={handleGuardar}
        texto="¿Estás seguro de guardar su respuesta a la solicitud de información?"
      />

      {/* Modal de éxito */}
      <RegistradoConExito
        open={showSuccessMessage}
        onClose={() => setShowSuccessMessage(false)}
        texto="Solicitud guardada con éxito."
      />

      <Modal
        open={openModalError}
        onClose={handleCloseModalError}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModalError}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 450,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            {/* Modal Content */}
            <Box sx={{width: '100%', textAlign: 'center', mt: 2, mb: 2}}>
              <Typography variant="h6" sx={{ mb: 2, color: '#363581', justifyContent: 'center' }}>
                <strong>Alerta de Error</strong>
              </Typography>
            </Box>
            
            <Box sx={{width: '100%', textAlign: 'center', mb: 2}}>
              <Typography >{error}</Typography>
            </Box>
            
            {/* Close button */}            
            {/*
            <Box sx={{ textAlign: 'right', mt: 4 }}>
              <Button variant="outlined" onClick={handleCloseModal}>
                Cerrar
              </Button>
            </Box>
            */}
          </Box>
        </Fade>
      </Modal>

    </Box>
  );
}
