"use client";
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, CircularProgress} from "@mui/material";
import { Modal, Backdrop, Fade, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import TablaSolicitudesInformacion from '../../../../../../componentesDirectorDeCarrera/TablaSolicitudesInformacion';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation'; // O useParams si usas next13 con app router

// Función auxiliar para convertir un número a su ordinal en español
function getOrdinal(numero) {
  // Este es un método simplificado para añadir sufijos a números.
  // Para casos reales en español: 
  // 1ra, 2da, 3ra, 4ta, ... 
  // Desafortunadamente el ordinal en español es más complejo que en inglés.
  // Implementaremos una aproximación:
  const ultimosDigitos = numero % 100; // últimos dos dígitos
  if (ultimosDigitos === 1) {
    return numero + "ra";
  } else if (ultimosDigitos === 2) {
    return numero + "da";
  } else if (ultimosDigitos === 3) {
    return numero + "ra";
  } else {
    return numero + "ta";
  }
}

export default function DetallesDirectorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const alxhorId = searchParams.get('idAlxhor'); // Suponiendo que pasamos el ID como query param en la URL
  // Alternativamente, si usas routing con segments, obtén el ID de la ruta.

  const [aluxhor, setAluxhor] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  if (!alxhorId) {
    return <div>No se proporcionó un ID de AlumnoEnRiesgo_X_Horario.</div>;
  }

  const obtenerAlumnoEnRiesgo = async () => {
    setLoading(true);
    try {
      console.log("El id del alumno en riesgo x horario es: " + alxhorId);
      const response = await axios.get(`http://localhost:8080/rrhh/alumno/obtenerAlumnoEnRiesgo`, {
        params: { id: alxhorId }
      });
      console.log("Fetch alumno en riesgo x horario:", response.data);
      setAluxhor(response.data);
    } catch (error) {
      console.error("Error al obtener el alumno en riesgo:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerAlumnoEnRiesgo();
  }, [alxhorId]);

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
    <Box sx={{ backgroundColor: 'white', height: '100vh'}}>   
      <Box
      sx={{
        marginLeft: '220px',
        height: '100vh',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
      }}
      >
        {/* Información del alumno y curso, encabezado */}
        <Box sx={{ marginBottom: '10px', display: 'flex', flexDirection: 'column', width: '100%', mb: 4, borderBottom: '1px solid #ccc' }}>
          
          {/* Título e información del curso */}
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', mb: '30px', mr: 4}}>
            <Typography variant="h4" sx={{ fontFamily: "system-ui", fontWeight: 'bold', color: '#363581' }}>
              Solicitudes de Información de Alumno en Riesgo
            </Typography>
            {!loading && (
              <Typography variant="h5" sx={{ color: '#191D23', mt: 1, ml: 2}}>
                <strong>{`${aluxhor.horario.nombreCurso} (${aluxhor.horario.codigoCurso}-${aluxhor.horario.codigo})`}</strong>
              </Typography>
            )}
          </Box>
          
          {/* Información del alumno y botón de docentes */}
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', mb: '20px', mr: 4}}>
            {/* Sección de información de la solicitud */}
            {loading ? (
              <Box sx={{width: '70%', height: 72}}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '10px' }}>
                  <CircularProgress />
                </Box>
              </Box>
            ) :  (
              <Box sx={{ display: 'flex', width: '75%'}}>
                <Box sx={{width: '50%'}}>
                  <Typography ><strong>Código del Alumno:</strong> {aluxhor.alumno.codigo}</Typography>
                  <Typography ><strong>Nombre:</strong> 
                    {` ${aluxhor.alumno.nombre} ${aluxhor.alumno.apellidoPaterno} ${aluxhor.alumno.apellidoMaterno}`}
                  </Typography>
                  <Typography ><strong>Correo Electrónico:</strong> {aluxhor.alumno.email}</Typography>
                </Box>
                <Box sx={{width: '50%'}}>
                  {aluxhor.vez && (
                    <Typography ><strong>Lleva el curso por:</strong> {getOrdinal(aluxhor.vez)} vez</Typography>
                  )}
                  {aluxhor.motivo && (
                    <Typography ><strong>Motivo de riesgo:</strong> {aluxhor.motivo || 'Sin motivo'}</Typography>
                  )}
                </Box>
              </Box>
            )}
            {/* Button to open modal */}
            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: "flex-end", ml: 2}}>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  ...botonEstilo, ml: 2,
                  ml: 2,
                  display: 'flex',
                  alignItems: 'center',
                  height: '40px',
                  width: '220px',
                  backgroundColor: '#363581',
                }}
                onClick={handleOpenModal}
              >
                Docentes
                <InfoIcon
                  sx={{
                    ml: 1,
                    color: 'white',
                    borderRadius: '50%',
                    backgroundColor: '#363581',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                />
              </Button>
            </Box>
          </Box>
        </Box>
        
        <TablaSolicitudesInformacion idAluXH={alxhorId} />

        {/* Modal */}
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openModal}>
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
                borderRadius: 2,
              }}
            >
              {/* Modal Content */}
              <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                Información de Docentes
              </Typography>

              <TableContainer component={Paper} sx={{ maxWidth: '100%', borderRadius: '5px', mb: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ backgroundColor: '#363581', color: 'white' }}>Nombre</TableCell>
                      <TableCell sx={{ backgroundColor: '#363581', color: 'white' }}>Contacto</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={2} align='center' sx={{ py: 4 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 2 }}>
                            <CircularProgress />
                          </Box>
                        </TableCell>
                    </TableRow>
                    ) :  (
                      <>
                        {aluxhor.horario.docentes ? (
                          aluxhor.horario.docentes.map((docente) => (
                            <TableRow key={docente.id} sx={{ backgroundColor: 'white' }}>
                              <TableCell>{`${docente.nombre} ${docente.apellidoPaterno} ${docente.apellidoMaterno}`}</TableCell>
                              <TableCell>{docente.email}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={2}>No se encontraron docentes</TableCell>
                          </TableRow>
                        )}
                      </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Close button */}
              <Box sx={{ textAlign: 'right', mt: 4 }}>
                <Button variant="outlined" onClick={handleCloseModal}>
                  Cerrar
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>

      </Box>
    </Box>
  );
}