"use client";
import { Box, TableContainer, TableCell, TableRow, Paper, Table, TableHead, TableBody, Pagination, Typography,Button } from "@mui/material";
import { useEffect, useState } from "react";
import VerObservacionModal from "./VerObservacionModal";
import { useRouter } from 'next/navigation';
import EstaSeguroAccion from "componentesGenerales/modales/EstaSeguroAccion";
import axios from "axios";
import ScoreIcon from '@mui/icons-material/Score';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
// Componente de la tabla
const TablaSeleccionFinalDocentes = ({ docentes = [] }) => {
    // Imprime los datos de docentes cada vez que cambia
    useEffect(() => {
        console.log("Docentes recibidos:", docentes);
    }, [docentes]);
    const router = useRouter();
    // Control de paginación
    const [page, setPage] = useState(1);
    const rowsPerPage = 7;

    const docentesPaginados = docentes.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const estilosEncabezado = () => {
        return { color: 'white', fontWeight: 'bold' };
    };

    const estilosIndice = () => {
        return {
            '& .Mui-selected': {
                color: '#fafafa',
                backgroundColor: '#363581',
            },
        };
    };

    const funcionSeleccionar = (docente) => {
      if(docente.estado=="PASO_SEGUNDO_FILTRO"){
        return (
            <>
            <Button onClick={() => seleccionarDocente(docente)}>
                <CheckCircleIcon color="primary" />
            </Button>
            <Button onClick={() => rechazarDocente(docente)}>
                <CancelIcon color="primary" />
            </Button>
    </>
        );
      }
        
      if(docente.estado=="PASO_FILTRO_FINAL"){
        return (
            <Typography>
                SELECCIONADO
            </Typography>
        );
      }

      //sino paso filtro final
      return (
        <Typography>
            RECHAZADO
        </Typography>
      );
    };
    const handleVerPuntuacion = (postulacion) => {
        router.push(`/coordinadorSeccion/seleccionFinalDocentes/visualizarPuntuacion?id=${postulacion.id}`);
      }
    const [openModalSeguro, setOpenModalSeguro] = useState(false);
    const [docenteSeleccionado, setDocenteSeleccionado] = useState(null);
    const [docenteNoSeleccionado, setDocenteNoSeleccionado] = useState(null);

    const handleCloseSeguro = () => {
        setOpenModalSeguro(false);
    };

    const seleccionarDocente = (docente) => {
        setDocenteSeleccionado(docente);
        setOpenModalSeguro(true);
    };

    const rechazarDocente =(docente)=>{
      setDocenteNoSeleccionado(docente);
      setOpenModalSeguro(true);
    }

    const actualizarEstadoDocente = async () => {
      if (docenteSeleccionado) {
        try {
          // Aquí el parámetro nuevoEstado se pasa como parte de la URL
          await axios.put(`http://localhost:8080/postulaciones/${docenteSeleccionado.id}/estado?nuevoEstado=PASO_FILTRO_FINAL`);
          
          alert(`El estado del docente ${docenteSeleccionado.nombrePostulante} ha sido actualizado.`);
          setOpenModalSeguro(false); // Cierra el modal después de la actualización

          window.location.reload(); // Recarga la página
        } catch (error) {
          console.error("Error al actualizar el estado:", error);
          alert("Ocurrió un error al intentar actualizar el estado.");
        }
      }
      if (docenteNoSeleccionado) {
        try {
          // Aquí el parámetro nuevoEstado se pasa como parte de la URL
          await axios.put(`http://localhost:8080/postulaciones/${docenteNoSeleccionado.id}/estado?nuevoEstado=NO_PASO_FILTRO_FINAL`);
          
          alert(`El estado del docente ${docenteNoSeleccionado.nombrePostulante} ha sido actualizado.`);
          setOpenModalSeguro(false); // Cierra el modal después de la actualización

          window.location.reload(); // Recarga la página
        } catch (error) {
          console.error("Error al actualizar el estado:", error);
          alert("Ocurrió un error al intentar actualizar el estado.");
        }
      }
    };

    // Control de visualización de observaciones
    const [openModal, setOpenModal] = useState(false);
    const [observacion, setObservacion] = useState('');

    const visualizarObservacion = (docente) => {
        if(docente.observaciones!=null)setObservacion(docente.observaciones);
          else
            setObservacion("No hay observaciones registradas.")
        setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
    };

    return (
        <Box>
            <TableContainer component={Paper} sx={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', overflow: 'auto' }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    {/* Encabezado de la tabla */}
                    <TableHead sx={{ backgroundColor: '#363581' }}>
                        <TableRow>
                            <TableCell align="center" sx={estilosEncabezado()}>Nombre</TableCell>
                            <TableCell align="center" sx={estilosEncabezado()}>Observaciones</TableCell>
                            <TableCell align="center" sx={estilosEncabezado()}>Puntaje</TableCell>
                            <TableCell align="center" sx={estilosEncabezado()}>Detalle de puntaje</TableCell>
                            <TableCell align="center" sx={estilosEncabezado()}>Acción/Estado</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {docentesPaginados.map((docente) => (
                            <TableRow key={docente.id}>
                                <TableCell align="center" sx={{ padding: '11px' }}>
                                  {docente.nombrePostulante+" "+docente.apelidoPaternoPostulante+" "+docente.apelidoMaternoPostulante}
                                  </TableCell>
                                  <TableCell align="center" sx={{ padding: '11px' }}>
                                <Button onClick={() => visualizarObservacion(docente)}>
                                      <InfoIcon color="primary" />
                                      </Button>           
                                </TableCell>
                                <VerObservacionModal
                                    observacion={observacion}
                                    open={openModal}
                                    onClose={handleClose}
                                />
                                <TableCell align="center" sx={{ padding: '11px' }}>{docente.puntaje + "/100"}</TableCell>
                                <TableCell align='center' sx={{ padding: '11px' }}>{
                                      <Button onClick={() => handleVerPuntuacion(docente)}>
                                      <ScoreIcon color="primary" />
                                      </Button>
                    }</TableCell>
                                <TableCell align="center" sx={{ padding: '11px' }}>{funcionSeleccionar(docente)}</TableCell>
                                <EstaSeguroAccion open={openModalSeguro} onClose={handleCloseSeguro} handleAceptar={actualizarEstadoDocente} />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box display="flex" justifyContent="end" mt={2}>
                <Pagination
                    count={Math.ceil(docentes.length / rowsPerPage)}
                    page={page}
                    onChange={handleChangePage}
                    size="large"
                    color="primary"
                    sx={estilosIndice()}
                />
            </Box>
        </Box>
    );
}

export default TablaSeleccionFinalDocentes;
