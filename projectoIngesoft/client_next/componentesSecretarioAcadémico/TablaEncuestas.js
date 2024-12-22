import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button , Snackbar} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import MuiAlert from '@mui/material/Alert';
import { useRouter } from 'next/navigation';
import { useEncuesta } from '../src/app/EncuestaContext';
import EstaSeguroAccion from '/componentesGenerales/modales/EstaSeguroAccion';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const TablaEncuestas = ({ encuestas, onDelete }) => {

    const router = useRouter();
    const { setEncuesta } = useEncuesta();
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEncuesta, setSelectedEncuesta] = useState(null);
    const editarEncuesta = (encuesta) => {
        console.log("Que hay", encuesta);
        setEncuesta(encuesta);
        router.push('/asistenteSeccion/encuestaDocente/registrarEncuesta');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES');
    };

    const isFechaFinMayorHoy = (fechaFin) => {
        const today = new Date();
        return new Date(fechaFin) >= today; // Cambié la comparación para incluir la fecha de hoy
    };

    const handleCloseSnackbar = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpenSnackbar(false);
    };

    const handleAsignar = async ( ) => {
      if(selectedEncuesta){
        const today = new Date();
        const fechaFin = new Date(selectedEncuesta.fechaFin);
        
        if (fechaFin < today) {
          setSnackbarMessage('La fecha de fin es menor a la fecha de hoy. No se puede asignar.');
          setOpenSnackbar(true);
          return;  
        } 
        else {
            console.log('Asignando encuesta:', selectedEncuesta.idEncuesta);
            try {
              const idEncuesta = parseInt(selectedEncuesta.idEncuesta, 10);
              
              await axios.post('http://localhost:8080/preguntas/encuesta/asignarHorariosEncuestaDocente',idEncuesta, { headers: { 'Content-Type': 'application/json' } });
              window.location.reload();
            } catch (error) {
              console.error('NO SE PUDO ASIGNAR LA ENCUESTA A LOS HORARIOS');
            }
        }
      }
    };
    
    return (
        <TableContainer component={Paper} sx={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', overflow: 'auto' }}>
            <Table sx={{ borderCollapse: 'collapse' }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center' }}>Título</TableCell>
                        <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center' }}>Fecha Inicio</TableCell>
                        <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center' }}>Fecha Fin</TableCell>
                        <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center' }}>Es Intermedia</TableCell>
                        <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center' }}>¿Está Asignada?</TableCell>
                        <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center' }}>Acción</TableCell>
                        <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center' }}>Asignar</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {encuestas.map((encuesta) => {
                        const estaVigente = isFechaFinMayorHoy(encuesta.fechaFin);
                        const puedeAsignar = !encuesta.asignada; // Botón habilitado si no está asignada y está vigente

                        return (
                            <TableRow key={encuesta.idEncuesta}>
                                <TableCell align='left'>{encuesta.titulo}</TableCell>
                                <TableCell align='center'>{formatDate(encuesta.fechaInicio)}</TableCell>
                                <TableCell align='center'>{formatDate(encuesta.fechaFin)}</TableCell>
                                <TableCell align='center'>{encuesta.esIntermedia ? "Sí" : "No"}</TableCell>
                                <TableCell align='center'>{encuesta.asignada ? "Sí" : "No"}</TableCell>
                                <TableCell align='center'>
                                    <IconButton onClick={() => editarEncuesta(encuesta)}>
                                        <EditIcon sx={{ fontSize: 25, cursor: 'pointer', marginRight: '10px', color: '#363581' }} />
                                    </IconButton>
                                    <IconButton onClick={() => onDelete(encuesta.idEncuesta)}>
                                        <DeleteIcon sx={{ fontSize: 25, cursor: 'pointer', color: '#363581' }} />
                                    </IconButton>
                                </TableCell>
                                <TableCell align='center'>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={!puedeAsignar} // Botón deshabilitado si ya está asignada o no está vigente
                                        onClick={() => { 
                                          setSelectedEncuesta(encuesta); 
                                          setModalOpen(true);  // Abre el modal al hacer clic
                                      }}
                                    >
                                        Asignar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="error">
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <EstaSeguroAccion
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          texto={`¿Está seguro que desea aperturar la encuesta?`}
          handleAceptar={async () => {
            await handleAsignar();
            setModalOpen(false);
          }}
        />
        </TableContainer>
        
    );
};
export default TablaEncuestas;

/* 
*/