"use client";
import BarraBusqueda from "../../../../../componentesAdministrador/BarraBusqueda";
import { Button, Typography, Box } from '@mui/material';
import TablaSolicitudAdicional from "../../../../../componentesAlumno/TablaSolicitudAdicional";
import Link from "next/link";
//import TablaSolicitudAdicional from '../../../../componentesAlumno/TablaSolicitudAdicional';  // Importa el componente de tabla


export default function SolicitudCartaPresentacion() {
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
                <Typography variant="h4" sx={{ marginLeft:'20px', fontWeight: '', color: 'black' }}>Solicitud de Matricula Adicional</Typography>
                </Box>

                <Box sx={{padding:'20px',display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                    <Box sx={{flexGrow:'1'}}>
                    <BarraBusqueda ></BarraBusqueda>
                    </Box>
                    
                    <Button 
                        component={Link}
                        href="solicitudMatriculaAdicional/resumenJustificacion"
                        variant="contained" 
                        color="primary" 
                        sx={{ ml: 2, display: 'flex', alignItems: 'center', height: '40px', backgroundColor:'#363581' }} // Ajusta la altura según sea necesario
                        
                    >
                        Enviar solicitud
                    </Button>

                </Box>

                <Box sx={{marginLeft:'20px'}}>
                    <TablaSolicitudAdicional/>
                </Box>
            </Box>
          
        </Box>
    );
}