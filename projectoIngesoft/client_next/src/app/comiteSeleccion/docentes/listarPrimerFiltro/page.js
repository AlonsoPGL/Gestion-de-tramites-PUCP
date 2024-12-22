"use client";
import { useEffect, useState } from 'react';
import BarraBusqueda from '../../../../../componentesAdministrador/BarraBusqueda';
import { Typography, Box } from '@mui/material';
import { usePersona } from '@/app/PersonaContext';
import TablaPrimerFiltro from 'componentesComiteSeleccion/tablaPrimerFiltro';
export default function ListadoPostulacionesPrimerFiltro() {
    const postulaciones = [
        {
          id: 1,
          dni: '12345678',
          nombrePostulante: 'Juan',
          apellidoPaternoPostulante: 'Pérez',
          apellidoMaternoPostulante: 'García',
          correoPostulante: 'juan.perez@example.com',
          estadoPostulacion: 'ESPERA_PASAR_PRIMER_FILTRO'
        },
        {
          id: 2,
          dni: '87654321',
          nombrePostulante: 'Ana',
          apellidoPaternoPostulante: 'Lopez',
          apellidoMaternoPostulante: 'Sánchez',
          correoPostulante: 'ana.lopez@example.com',
          estadoPostulacion: 'NO_PASO_PRIMER_FILTRO'
        },
        {
          id: 3,
          dni: '56781234',
          nombrePostulante: 'Carlos',
          apellidoPaternoPostulante: 'Hernandez',
          apellidoMaternoPostulante: 'Mendoza',
          correoPostulante: 'carlos.hernandez@example.com',
          estadoPostulacion: 'PASO_PRIMER_FILTRO'
        },
        {
          id: 4,
          dni: '23456789',
          nombrePostulante: 'María',
          apellidoPaternoPostulante: 'Castro',
          apellidoMaternoPostulante: 'Ríos',
          correoPostulante: 'maria.castro@example.com',
          estadoPostulacion: 'ESPERA_PASAR_PRIMER_FILTRO'
        }
      ];


    const { persona } = usePersona();

      const [postulacionesPrimerFiltro,setPostulacionesPrimerFiltro] = useState([]);

      useEffect(() => {
        const fetchPostulaciones = async () => {
          try{
            const response = await fetch(`http://localhost:8080/postulaciones/listarPrimeraEtapa`)
            const data = await response.json();
            console.log('Datos obtenidos:', data);
            setPostulacionesPrimerFiltro(data);
          } catch (error){
            console.error('Error al obtener las postulaciones:', error);
          }

        };
        fetchPostulaciones();
      
      },[])

    return (
        <Box sx={{ backgroundColor: 'white', color: 'white', height: '100vh' }}>
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
                <Typography variant="h4" sx={{ marginLeft:'20px', fontWeight: '', color: 'black' }}>Lista de postulaciones de primer filtro</Typography>
                </Box>

                <Box sx={{padding:'20px',display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                    <Box sx={{flexGrow:'1'}}>
                    <BarraBusqueda ></BarraBusqueda>
                    </Box>

                </Box>

                <Box sx={{marginLeft:'20px',marginRight:'20px'}}>
                    <TablaPrimerFiltro postulaciones={postulacionesPrimerFiltro}></TablaPrimerFiltro>

                </Box>
            </Box>
          
        </Box>        
    );
}