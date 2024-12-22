"use client";
import { useEffect, useState } from 'react';
import BarraBusqueda from '../../../../../componentesAdministrador/BarraBusqueda';
import { Typography, Box } from '@mui/material';

import TablaSegundoFiltro from 'componentesComiteSeleccion/tablaSegundoFiltro';
export default function ListadoPostulacionesSegundoFiltro() {

  const [postulacionesSegundoFiltro,setPostulacionesSegundoFiltro] = useState([]);
    useEffect(() => {
      const fetchPostulaciones = async () => {
        try{
          const response = await fetch(`http://localhost:8080/postulaciones/listarSegundaEtapa`)
          const data = await response.json();
          console.log('Datos obtenidos:', data);
          setPostulacionesSegundoFiltro(data);
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
                <Typography variant="h4" sx={{ marginLeft:'20px', fontWeight: '', color: 'black' }}>Lista de postulaciones de segundo filtro</Typography>
                </Box>

                <Box sx={{padding:'20px',display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                    <Box sx={{flexGrow:'1'}}>
                    <BarraBusqueda ></BarraBusqueda>
                    </Box>

                </Box>

                <Box sx={{marginLeft:'20px',marginRight:'20px'}}>
                    <TablaSegundoFiltro postulaciones={postulacionesSegundoFiltro}></TablaSegundoFiltro>

                </Box>
            </Box>
          
        </Box>        
    );
}