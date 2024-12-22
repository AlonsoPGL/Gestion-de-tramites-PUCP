"use client";
import { useEffect, useState } from 'react';
import { useSearchParams,useRouter } from 'next/navigation';
import { Box, Button, TextField, Typography } from '@mui/material';
import Link from 'next/link';
import TablaPersonaSolicitudJurado from 'componentesDirectorDeCarrera/solicitudJurado/TablaPersonaSolicitudJurado';

import ListaComentarios from 'componentesAsesor/ListaComentarios';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
export default function visualizarRevisionesAsesor() {

  const searchParams = useSearchParams(); // Obtener los parámetros de búsqueda
  const id = searchParams.get('id'); // Obtener el parámetro 'id' de la URL"
  const [alumnos,setAlumnos] = useState([]); //Para guardar los alumnos que desarrollan la tesis
  const [asesor,setAsesor] = useState([]); // Para guardar el asesor 
  const [temaTesis,setTemaTesis] = useState("");

  const router=useRouter();
  const [comentarios,setComentarios] = useState([]);


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


    //Obtención de comentarios de la solicitud



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
                  setComentarios(data.comentarios)
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
            sx={{ marginTop: '10px', marginBottom: '32px' }} 
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
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black', marginLeft:'20px',marginBottom: '16px',marginRight: '32px',marginTop: '32px' }}>
          Lista de revisiones previas
        </Typography>
        <Box sx={{marginLeft:'20px',marginRight:'20px'}}>
            <ListaComentarios comentarios={comentarios} ></ListaComentarios>
        </Box> 

        <Box display="flex" justifyContent="space-between" mt={1} sx={{marginRight:'20px'}}>

            <Button variant="outlined" sx={{position:'end', marginRight:''}} onClick={() => router.back()}>Regresar</Button>

        </Box>  
        </Box>
        </Box>


  );
};