"use client";
import React, { useEffect, useState } from 'react';
import { Typography, TextField, Button, Box, Grid } from '@mui/material';
import { useSearchParams,useRouter } from 'next/navigation';
import Link from 'next/link';
import CardMenu from "componentesGenerales/cards/CardMenu";
import { usePersona } from '@/app/PersonaContext';



export default function VisualizarPuntuacion() {
    const [nombrePostulante,setNombrePostulante] = useState("")
    const [correoPostulante,setCorreoPostulante] = useState("")
    const [observaciones,setObservaciones] = useState("");
    const [calificacionesPostulante,setCalificacionesPostulante] = useState([])
    const searchParams = useSearchParams(); // Obtener los parámetros de búsqueda
    const id = searchParams.get('id'); // Obtener el parámetro 'id' de la URL
    // Estado para almacenar los valores de cada criterio


    useEffect(() => {
        if (id) {
            const fetchPostulacion = async () => {
            try{
                const response = await fetch(`http://localhost:8080/postulaciones/${id}`)
                const data = await response.json();
                console.log('Datos obtenidos:', data);
                setNombrePostulante(data.nombrePostulante + " " + data.apelidoMaternoPostulante + " " + data.apelidoPaternoPostulante);
                setCorreoPostulante(data.correo);
                setObservaciones(data.observaciones);
            } catch (error){
                console.error('Error al obtener la solicitud:', error);
            }
        };
        fetchPostulacion();
    }
      },[id])

      useEffect(() => {
        if (id) {
            const fetchCalificaciones = async () => {
            try{
                const response = await fetch(`http://localhost:8080/calificaciones/listarPorPostulacion/${id}`)
                const data = await response.json();
                console.log('Datos obtenidos:', data);
                setCalificacionesPostulante(data);
            } catch (error){
                console.error('Error al obtener la solicitud:', error);
            }
        };
        fetchCalificaciones();
    }
      },[id])     


    return (
        <Box sx={{ backgroundColor: 'white', color: 'white', height: '100vh' }}>
            <Box
                sx={{
                    height: '100vh',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box>
                    <Typography variant="h4" sx={{ marginLeft:'220px', marginTop:'30px', fontWeight: '', color: 'black' }}>
                        PUNTUACIONES DE SEGUNDO FILTRO
                    </Typography>
                </Box>

                <CardMenu>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography sx={{ flex: `0 1 30%`, textAlign: 'left', alignSelf: 'flex-start' }}>
                    Nombre:
                </Typography>
                <TextField
                variant="outlined"
                type="text"
                disabled
                value= {nombrePostulante}
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
      <Typography sx={{ flex: `0 1 30%`, textAlign: 'left', alignSelf: 'flex-start',color: 'black' }}>
                    Correo:
                </Typography>
                <TextField
        variant="outlined"
        type="text"
        disabled
        value= {correoPostulante}
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
      
                    <Box sx={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', maxWidth: '2000px', margin: '0 auto',
                                                        borderTop: '10px solid #363581', // borde superior más grueso
                                                        borderBottom: '10px solid #363581', // borde inferior más grueso
                                                        borderLeft: '4px solid #363581', // borde izquierdo más delgado
                                                        borderRight: '4px solid #363581', // borde derecho más delgado
                                                        minWidth: '800px'
                     }}>
                    <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold', mb: 2 }}>
                    CALIFICACIÓN
                </Typography>
                {calificacionesPostulante.map((calificacion, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px'

                            }}>
                                <Typography sx={{ flex: 1, fontWeight: 'bold', color: '#2f2f2f',minWidth: '400px' }}>
                                    Puntuación sobre {calificacion.criterio.nombre}:
                                </Typography>

                                <Typography sx={{ fontWeight: 'bold', color: '#2f2f2f',minWidth: '40px' }}>
                                    {calificacion.puntos}/{calificacion.criterio.maximo_puntaje}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                    <Grid item xs={3}>
                    <Typography variant="body1" sx={{ color: 'black', fontWeight: 'bold',marginBottom: '32px',marginTop: '30px' }}>Comentarios:</Typography>
                </Grid>
                                        <Grid item xs={9}>
                    <TextField fullWidth multiline disabled rows={4} value={observaciones}  sx={{marginBottom: '32px'}} />
                </Grid>                                     
                                                                                    
                </CardMenu>

                <Box display="flex" justifyContent="space-between" mt={1} sx={{ width: '1000px',marginLeft:'300px' }}>
                    <Button variant="outlined" sx={{ position:'end', marginRight:'' }} onClick={() => router.back()}>Regresar</Button>
                </Box>
            </Box>
        </Box>
    );
}