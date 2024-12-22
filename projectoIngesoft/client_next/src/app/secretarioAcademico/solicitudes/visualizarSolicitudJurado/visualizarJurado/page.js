"use client";
import { Button, Typography, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams,useRouter } from 'next/navigation';
import TablaPersonaSolicitudJurado from '../../../../../../componentesDirectorDeCarrera/solicitudJurado/TablaPersonaSolicitudJurado';




export default function visualizarSolicitudJurado() {
    const searchParams = useSearchParams(); // Obtener los parámetros de búsqueda
    const id = searchParams.get('id'); // Obtener el parámetro 'id' de la URL
    const [ternaJurado, setTernaJurado] = useState([]);
    const [solicitudObtenida, setSolicitud] = useState({});
      const router=useRouter();
    useEffect(() => {
        if (id) {
            const fetchSolicitud = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/solicitudes/jurados/obtenerSolicitud/${id}`)
                    const data = await response.json();
                    console.log('Datos obtenidos:', data);
                    setSolicitud(data);
                    setTernaJurado(data.jurados);
                } catch (error) {
                    console.error('Error al obtener la solicitud:', error);
                }
            };
            fetchSolicitud();
        }
    }, [id])

    return (
        <Box sx={{ backgroundColor: 'white', color: 'white', height: '100vh', marginBottom: '20px' }}>
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
                    <Typography variant="h4" sx={{ marginLeft: '20px', fontWeight: '', color: 'black', fontWeight: 'bold' }}>SOLICITUD DE JURADO</Typography>
                </Box>
                <Box sx={{ display: 'flex' }}>
                    <Typography variant="h6" sx={{ marginLeft: '20px', marginTop: '20px', fontWeight: '', color: 'black', fontWeight: 'bold' }}>Terna de Jurado</Typography>
                </Box>

                <Box sx={{ marginLeft: '20px', marginRight: '20px', marginTop: '10px' }}>
                    <TablaPersonaSolicitudJurado personas={ternaJurado}></TablaPersonaSolicitudJurado>
                </Box>
                <Box display="flex" justifyContent="flex-end" mt={1} sx={{ marginRight: '20px' }}>

                    <Button variant="outlined" sx={{ position: 'end', marginRight: '' }} onClick={() => router.back()}>Regresar</Button>

                </Box>
            </Box>
        </Box>
    );
}