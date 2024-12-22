"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Button, TextField, Typography, Grid, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import ErrorConDescripcion from 'componentesGenerales/modales/ErrorConDescripcion';
import EstaSeguroAccion from 'componentesGenerales/modales/EstaSeguroAccion';
import Link from 'next/link';
import { usePersona } from '@/app/PersonaContext';
import TablaPersonaSolicitudJurado from 'componentesDirectorDeCarrera/solicitudJurado/TablaPersonaSolicitudJurado';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
export default function registrarAprobacionAsesor() {

  const router=useRouter();
  const { persona } = usePersona();//Para usar los datos del usuario
  const [alumnos,setAlumnos] = useState([]); //Para guardar los alumnos que desarrollan la tesis
  const [asesor,setAsesor] = useState([]); // Para guardar el asesor 
  const [temaTesis,setTemaTesis] = useState("");

  const [openModalSeguro, setOpenModalSeguro] = useState(false); //Estado del modal DE estas Seguro?
  const [openModalError,setOpenModalError] = useState(false);//Estado del modal de error?  
  const [hayError, setHayError] = useState(false);


  const [comments, setComments] = useState('');//Estado de los comentarios
  const [approval, setApproval] = useState(false);//Estado de la aprobación o desaprobación


  const searchParams = useSearchParams(); // Obtener los parámetros de búsqueda
  const id = searchParams.get('id'); // Obtener el parámetro 'id' de la URL
  //Estado para la solicitud
  const [solicitud,setSolicitud]=useState(null);
    if (solicitud && solicitud.tesis.documento) {
        const url = URL.createObjectURL(solicitud.tesis.documento);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'documento_tesis.pdf'; // Cambia el nombre del archivo si es necesario
        a.click();
        URL.revokeObjectURL(url); // Libera el objeto URL después de la descarga
    } else {
        console.log('No hay documento disponible para descargar.');
    }

      //Aca se conseguira la solicitud sin su archivo, ya que este pesa demasiado
      useEffect(() => {
        const fetchSolicitud = async () => {
            try {
                const response = await fetch(`http://localhost:8080/solicitudes/solicitudTemaTesis/buscar/${id}`);
                
                if (!response.ok) {
                    throw new Error('Error al obtener la solicitud');
                }
                
                const data = await response.json();
                
                // Verifica si se encontró una solicitud
                if (data) {
                setSolicitud(data);
                  console.log("procede al editado");
                  console.log(data);
                  setAlumnos(data.tesis.integrantes);
                  setAsesor(data.tesis.asesores);
                  setTemaTesis(data.tesis.titulo);
                } else {
                setSolicitud(null); // Si no se encontró, establece solicitud como null
                  console.log("procede al registro");
                }
            } catch (err) {
                console.log(err.message); // Maneja el error
            }
        };
        
    
        fetchSolicitud();
    }, []); // Dependencia: se ejecuta cuando alumnoId cambia
    
    //! Obteniendo el archivo de la solicitud
    
    const fetchArchivo = async () => {
        if (solicitud) { // Asegúrate de que la solicitud esté disponible
            try {
                const response = await fetch(`http://localhost:8080/solicitudes/solicitudTemaTesis/buscarDocumentoSolicitudTesis/${solicitud.id}`);
                if (!response.ok) {
                    throw new Error('Error al obtener el archivo de la solicitud');
                }
    
                // Obtén el blob directamente de la respuesta
                const blob = await response.blob();
                if (blob) {
                    const url = URL.createObjectURL(blob); // Crea un objeto URL para el blob
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'documento_tesis.pdf'; // Cambia el nombre del archivo si es necesario
                    a.click();
                    URL.revokeObjectURL(url); // Libera el objeto URL después de la descarga
                    console.log("Archivo listo para descargar.");
                } else {
                    console.log("El archivo no se pudo obtener.");
                }
            } catch (err) {
                console.log(err.message);
            }
        } else {
            console.log('No se puede obtener el archivo sin una solicitud válida.');
        }
    };
    
    const handleDescargaPdf = () => {
        fetchArchivo(); // Llama a la función para obtener y descargar el archivo
    };


  const handleCommentsChange = (event) => {
    setComments(event.target.value);
  };

  const handleApprovalChange = (event) => {
    setApproval(event.target.value === "true");
  };

  const handleGuardar = () =>{
    if(comments === ''){
      console.log("Error: no hay justificación");
      setHayError(true)
      setOpenModalError(true);
    }else{
      setHayError(false)
      setOpenModalSeguro(true);
    }
  }




  const handleCloseModalSeguro = () => setOpenModalSeguro(false); //Cierra modal de "Estas seguro?"
  const handleCloseModalError = () => setOpenModalError(false); //Cierra el modal de error

  const redirigirASolicitudesAprobacion = async () => {
    const comentario = {
      comentario: comments,
      revisor: persona?.id ? { id: persona.id } : null,
      fecha: new Date().toISOString(),
      solicitudTemaTesisId: {id: id},
      activo: true,
      aprobado: approval,
      file_revision: null
    };

    console.log("Datos enviados:", JSON.stringify(comentario));
    try {
      await axios.post('http://localhost:8080/solicitudes/comentarios/insertar', comentario, {
        headers: { 'Content-Type': 'application/json' },
      });
      const nuevoEstado = approval ? "EN_REVISION_POR_COORDINADOR" : "OBSERVADO_POR_ASESOR";
      console.log("Datos enviados:", nuevoEstado);
      
      await axios.put(`http://localhost:8080/solicitudes/solicitudTemaTesis/${id}/estado`, nuevoEstado, {
        headers: { 'Content-Type': 'text/plain' },
      });
      router.push('.');
    } catch (error) {
      console.error("Error al actualizar la solicitud:", error);
    }
  }


  return (
    <Box sx={{ backgroundColor: 'white', color: 'white', height: '100vh',marginBottom:'20px' }}>
    <Box
    sx={{
        marginLeft: '220px',
        height: '100vh',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
    }}
    >
        <Box>
        <Typography variant="h4" sx={{ marginLeft:'20px', fontWeight: '', color: 'black',fontWeight:'bold' }}>SOLICITUD DE TEMA DE TESIS</Typography>
        </Box>
        <Box sx={{display:'flex'}}>
        <Typography variant="h6" sx={{ marginLeft:'20px', marginTop:'20px',fontWeight: '', color: 'black' ,fontWeight:'bold'}}>Alumnos:</Typography>
        </Box>

        <Box sx={{marginLeft:'20px',marginRight:'20px', marginTop:'10px'}}>
            <TablaPersonaSolicitudJurado personas={alumnos}></TablaPersonaSolicitudJurado>
        </Box>
        {/* Sección de Título */}
        <Box sx={{ marginTop: '20px', marginLeft: '20px' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
            Título
          </Typography>          
          <TextField 
            variant="outlined" 
            disabled 
            defaultValue={temaTesis} 
            fullWidth
            sx={{ marginTop: '10px', marginBottom: '16px' }} 
          />
        </Box>   
        <Box sx={{ display: "flex", marginBottom: '20px', alignItems: 'center' }}>
                  <Typography  sx={{ color: 'black', fontWeight: 'bold',marginLeft:'20px'}} >Tema de tesis: </Typography>
                    <Button variant="contained" sx={{ marginLeft: '20px' }} onClick={handleDescargaPdf}>
                      <PictureAsPdfIcon sx={{marginRight:'10px'}}></PictureAsPdfIcon>
                      Descargar
                    </Button>
                  </Box>     
        <Box sx={{display:'flex'}}>
        <Typography variant="h6" sx={{ marginLeft:'20px', marginTop:'20px',fontWeight: '', color: 'black' ,fontWeight:'bold'}}>Asesores:</Typography>
        </Box>        
        <Box sx={{marginLeft:'20px',marginRight:'20px', marginTop:'10px'}}>
            <TablaPersonaSolicitudJurado personas={asesor}></TablaPersonaSolicitudJurado>
        </Box>     
               {/* Revisión de tema de tesis */}
               <Box sx={{ marginTop: '20px', padding: '20px', backgroundColor: '#f2f4ff', borderRadius: '8px' }}>
               <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black', marginLeft:'20px',marginBottom: '16px',marginRight: '32px' }}>
          Revisión de tesis
        </Typography>


                {/* Comentarios */}
                <Grid item xs={3}>
                    <Typography variant="body1" sx={{ color: 'black', fontWeight: 'bold',marginBottom: '32px' }}>Comentarios:</Typography>
                </Grid>
                <Grid item xs={9}>
                    <TextField fullWidth multiline rows={4} value={comments} onChange={handleCommentsChange} sx={{marginBottom: '32px'}} />
                </Grid>
                {/* Aprobación */}
                <Grid item xs={3}>
                    <FormLabel component="legend" sx={{ color: 'black', fontWeight: 'bold',marginBottom: '32px' }}>Aprobación:</FormLabel>
                </Grid>
                <Grid item xs={9}>
                    <RadioGroup row value={approval ? "true" : "false"} onChange={handleApprovalChange}>
                        <FormControlLabel value="true" control={<Radio />} label={<Typography sx={{ color: 'black' }}>Aprobar</Typography>} />
                        <FormControlLabel value="false" control={<Radio />} label={<Typography sx={{ color: 'black' }}>Rechazar</Typography>} />
                    </RadioGroup>
                </Grid>
          
        </Box>   
        <Box display="flex" justifyContent="space-between" mt={1} sx={{marginRight:'20px'}}>
            <Button variant="outlined" sx={{position:'end', marginRight:''}} onClick={() => router.back()}>Regresar</Button>

            <Button sx={{ backgroundColor: '#363581'}} variant="contained" color="primary" onClick={handleGuardar}>
              Guardar
            </Button>

            <EstaSeguroAccion 
          open={openModalSeguro} 
          onClose={handleCloseModalSeguro} 
          handleAceptar={redirigirASolicitudesAprobacion} 
          />
        <ErrorConDescripcion 
          texto="Error: No hay comentario" 
          open={openModalError} 
          onClose={handleCloseModalError} 
        />
        </Box>  
        </Box>
        </Box>


  );
};