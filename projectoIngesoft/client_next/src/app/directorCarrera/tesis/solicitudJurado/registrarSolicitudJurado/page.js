"use client";
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams,useRouter } from 'next/navigation';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Typography, IconButton, MenuItem, Select, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ErrorConDescripcion from '../../../../../../componentesGenerales/modales/ErrorConDescripcion';
import Link from 'next/link';
import { usePersona } from '@/app/PersonaContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import TablaPersonaSolicitudJurado from '../../../../../../componentesDirectorDeCarrera/solicitudJurado/TablaPersonaSolicitudJurado';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
export default function MostrarInfoTesis() {

  const router=useRouter();
  const { persona } = usePersona();
  const [alumnos,setAlumnos] = useState([]); //Para guardar los alumnos que desarrollan la tesis
  const [asesor,setAsesor] = useState([]); // Para guardar el asesor 
  const [temaTesis,setTemaTesis] = useState("");
    

  const [solicitudObtenida,setSolicitud] = useState({});
  const [solicitudTemaTesis,setSolicitudTemaTesis] = useState(null);
  const searchParams = useSearchParams(); // Obtener los parámetros de búsqueda
  const id = searchParams.get('id'); // Obtener el parámetro 'id' de la URL
  const handleContinuarClick = () => {
    router.push(`./registrarSolicitudJurado/seleccionarJurado?id=${id}`);
  };
  useEffect(() => {
    if (id) {
        const fetchSolicitud = async () => {
        try{
            const response = await fetch(`http://localhost:8080/solicitudes/jurados/obtenerSolicitud/${id}`)
            const data = await response.json();
            console.log('Datos obtenidos:', data);
            setSolicitud(data);
            setAsesor(data.tesis.asesores)
            setAlumnos(data.tesis.integrantes)
            setTemaTesis(data.tesis.titulo)
            const response2 = await fetch(`http://localhost:8080/solicitudes/solicitudTemaTesis/buscarPorTesis/${data.tesis.id}`)
            const data2 = await response2.json();
            setSolicitudTemaTesis(response2)
        } catch (error){
            console.error('Error al obtener la solicitud:', error);
        }
    };
    fetchSolicitud();
}
  },[id])


    //! Obteniendo el archivo de la solicitud
    
    const fetchArchivo = async () => {
      if (solicitudTemaTesis) { // Asegúrate de que la solicitud esté disponible
          try {
              const response = await fetch(`http://localhost:8080/solicitudes/solicitudTemaTesis/buscarDocumentoSolicitudTesis/${solicitudTemaTesis.id}`);
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
        <Typography variant="h4" sx={{ marginLeft:'20px', fontWeight: '', color: 'black',fontWeight:'bold' }}>SOLICITUD DE JURADO</Typography>
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
                  {solicitudTemaTesis && (
    <Button variant="contained" sx={{ marginLeft: '20px' }} onClick={handleDescargaPdf}>
      <PictureAsPdfIcon sx={{ marginRight: '10px' }} />
      Descargar
    </Button>
  )}
                  </Box>             
        <Box sx={{display:'flex'}}>
        <Typography variant="h6" sx={{ marginLeft:'20px', marginTop:'20px',fontWeight: '', color: 'black' ,fontWeight:'bold'}}>Asesor:</Typography>
        </Box>        
        <Box sx={{marginLeft:'20px',marginRight:'20px', marginTop:'10px'}}>
            <TablaPersonaSolicitudJurado personas={asesor}></TablaPersonaSolicitudJurado>
        </Box>        
        <Box display="flex" justifyContent="space-between" mt={1} sx={{marginRight:'20px'}}>

          <Button variant="outlined" sx={{position:'end', marginRight:''}} onClick={() => router.back()}>Regresar</Button>

          <Button 
            sx={{ backgroundColor: '#363581' }} 
            variant="contained" 
            color="primary" 
            onClick={handleContinuarClick}
          >
            Continuar
          </Button>
        </Box>  
        </Box>
        </Box>


  );
};