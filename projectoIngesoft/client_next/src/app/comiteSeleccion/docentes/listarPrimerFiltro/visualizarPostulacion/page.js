"use client";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import { useSearchParams, useRouter } from 'next/navigation';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import dayjs from 'dayjs';

function visualizarPostulacion() {
    

  const [nombres, setNombres] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [fecha, setFecha] = useState(null);
  const [dni, setDNI] = useState("");
  const [celular, setCelular] = useState("");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [correo, setCorreo] = useState("");
  const [errores, setErrores] = useState({}); // Para rastrear campos incompletos
  const router = useRouter();
  const [erroresMensaje, setErroresMensaje] = useState({});
  const searchParams = useSearchParams(); // Obtener los parámetros de búsqueda
  const id = searchParams.get('id'); // Obtener el parámetro 'id' de la URL
  useEffect(() => {
    if (id) {
        const fetchPostulacion = async () => {
        try{
            const response = await fetch(`http://localhost:8080/postulaciones/${id}`)
            const data = await response.json();
            console.log('Datos obtenidos:', data);
            setNombres(data.nombrePostulante);
            setApellidoMaterno(data.apelidoMaternoPostulante)
            setApellidoPaterno(data.apelidoPaternoPostulante)
            setCorreo(data.correo);
            setDNI(data.dni)
            setCelular(data.celular)
        // Convertir la fecha a un objeto dayjs
        const fechaPostulacion = dayjs(data.fechaPostulacion);
        setFecha(fechaPostulacion);
        } catch (error){
            console.error('Error al obtener la solicitud:', error);
        }
    };
    fetchPostulacion();
}
  },[id])
  const handleDescargarCV = async () => {
    try {
      // Asegúrate de que Axios reciba la respuesta como 'blob'
      const response = await axios.get(`http://localhost:8080/postulaciones/buscarCV/${id}`, {
        responseType: 'blob'
      });
  
      // Verifica si el estado de la respuesta es exitoso (200-299)
      if (response.status >= 200 && response.status < 300) {
        const url = URL.createObjectURL(response.data); // Crea un objeto URL para el blob
        const a = document.createElement('a');
        a.href = url;
        a.download = `cv_postulacion_${id}.pdf`; // Cambia el nombre del archivo si es necesario
        a.click();
        URL.revokeObjectURL(url); // Libera el objeto URL después de la descarga
        console.log("Archivo listo para descargar.");
      } else {
        console.error('Error al obtener el CV:', response.status);
      }
    } catch (err) {
      console.error("Error al obtener el CV:", err.message);
    }
  }
  const handleDescargarReferencias = async () => {
    try {
      // Asegúrate de que Axios reciba la respuesta como 'blob'
      const response = await axios.get(`http://localhost:8080/postulaciones/buscarReferencia/${id}`, {
        responseType: 'blob'
      });
  
      // Verifica si el estado de la respuesta es exitoso (200-299)
      if (response.status >= 200 && response.status < 300) {
        const url = URL.createObjectURL(response.data); // Crea un objeto URL para el blob
        const a = document.createElement('a');
        a.href = url;
        a.download = `referencias_postulacion_${id}.pdf`; // Cambia el nombre del archivo si es necesario
        a.click();
        URL.revokeObjectURL(url); // Libera el objeto URL después de la descarga
        console.log("Archivo listo para descargar.");
      } else {
        console.error('Error al obtener la referencia:', response.status);
      }
    } catch (err) {
      console.error("Error al obtener la referencia:", err.message);
    }
  }
  const handleRegresar = () => {
    router.back();
  }
  return (
    <Box sx={{ backgroundColor: 'white', minHeight: '100vh', paddingBottom: '10px' }}>

      <Box sx={{ ml: 29, padding: '10px' }}>
        <Typography variant="h4" sx={{ mb: '5px', color: '#191D23' }}>
          Visualizar Solicitud
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
          sx={{

            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #D9D9D9',
            borderRadius: 2,
            padding: 4,
            boxShadow: 2,
            width: '100%',

          }}
          
        >

<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography sx={{ flex: `0 1 200px`, textAlign: 'left', alignSelf: 'flex-start',color: 'black'}}>
                    Nombres:
                </Typography>
                <TextField
                variant="outlined"
                type="text"
                disabled
                value= {nombres}
                sx={{
                flex: '1',
                backgroundColor: 'white',
                
                '& .MuiOutlinedInput-root': {
                    height: '30px',
                    width: '75%',
                    borderRadius: 2,
                }
                }}
                >
                </TextField>
      
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography sx={{ flex: `0 1 200px`, textAlign: 'left', alignSelf: 'flex-start',color: 'black' }}>
                    Apellido Paterno:
                </Typography>
                <TextField
                variant="outlined"
                type="text"
                disabled
                value= {apellidoPaterno}
                sx={{
                flex: '1',
                backgroundColor: 'white',
                
                '& .MuiOutlinedInput-root': {
                    height: '30px',
                    width: '75%',
                    borderRadius: 2,
                }
                }}
                >
                </TextField>
      
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography sx={{ flex: `0 1 200px`, textAlign: 'left', alignSelf: 'flex-start',color: 'black' }}>
                    Apellido Materno:
                </Typography>
                <TextField
                variant="outlined"
                type="text"
                disabled
                value= {apellidoMaterno}
                sx={{
                flex: '1',
                backgroundColor: 'white',
                
                '& .MuiOutlinedInput-root': {
                    height: '30px',
                    width: '75%',
                    borderRadius: 2,
                }
                }}
                >
                </TextField>
      
      </Box>      


          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mt: 2, mb: 3 }}> {/* Cambié 'flex-start' a 'center' */}
              <Typography sx={{ mb: 2, mr: '51px',color: 'black' }}>Fecha de postulación</Typography>
              <Box sx={{ display: 'flex', gap: 5, mb: 2 }}> {/* Espacio entre los DatePickers */}
                <DatePicker
                  label="Fecha de Postulacion"
                  variant="outlined"
                  value={fecha}
                  disabled
                  textField={<TextField fullWidth variant="outlined" sx={{ height: '30px' }} />}
                />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography sx={{ flex: `0 1 131px`, textAlign: 'left', alignSelf: 'flex-start',marginTop:'10px',color: 'black' }}>
                    DNI/CE:
                </Typography>
                <TextField
                variant="outlined"
                type="text"
                disabled
                value= {dni}
                sx={{
                flex: '1',
                backgroundColor: 'white',
                
                '& .MuiOutlinedInput-root': {
                    height: '30px',
                    width: '100%',
                    borderRadius: 2,
                }
                }}
                >
                </TextField>
      
      </Box>   

              </Box>
            </Box>
          </LocalizationProvider>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography sx={{ flex: `0 1 200px`, textAlign: 'left', alignSelf: 'flex-start', width: '200px',color: 'black'}}>
                    Correo:
                </Typography>
                <TextField
                variant="outlined"
                type="text"
                disabled
                value= {correo}
                sx={{
                flex: '1',
                backgroundColor: 'white',
                
                '& .MuiOutlinedInput-root': {
                    height: '30px',
                    width: '100%',
                    borderRadius: 2,
                }
                }}
                >
                </TextField>
      
      </Box>  

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography sx={{ flex: `0 1 131px`, textAlign: 'left', alignSelf: 'flex-start',marginLeft:'75px',color: 'black' }}>
                Celular:
                </Typography>
                <TextField
                variant="outlined"
                type="text"
                disabled
                value= {celular}
                sx={{
                flex: '1',
                backgroundColor: 'white',
                
                '& .MuiOutlinedInput-root': {
                    height: '30px',
                    width: '100%',
                    borderRadius: 2,
                }
                }}
                >
                </TextField>
      
      </Box>        
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mt: 2 }}>
            <Typography sx={{ mb: 2, mr: '55px',color: 'black' }}>Documentación:</Typography>

          </Box>
          <Box sx={{ display: "flex", marginBottom: '20px', alignItems: 'center' }}>
                    <Button variant="contained" onClick={handleDescargarCV} sx={{ marginLeft: '20px' }}>
                      <PictureAsPdfIcon sx={{marginRight:'10px'}}></PictureAsPdfIcon>
                      Descargar
                    </Button>
                  </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mt: 2 }}>
            <Typography sx={{ mb: 2, mr: '55px',color: 'black' }}>Referencias:</Typography>
          </Box>
          <Box sx={{ display: "flex", marginBottom: '20px', alignItems: 'center' }}>
                    <Button variant="contained" onClick={handleDescargarReferencias} sx={{ marginLeft: '20px' }} >
                      <PictureAsPdfIcon sx={{marginRight:'10px'}}></PictureAsPdfIcon>
                      Descargar
                    </Button>
                  </Box>

        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button variant='outlined' onClick={handleRegresar} sx={{ width: '170px', marginRight: '20px' }}>
            Regresar
          </Button>
        </Box>
      </Box>

    </Box>
  );
}

export default visualizarPostulacion;