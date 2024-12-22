"use client";
import { useEffect, useState } from 'react';
import BarraBusqueda from '../../../../../componentesAdministrador/BarraBusqueda';
import { Typography, Box,FormControl,Select,InputLabel,MenuItem } from '@mui/material';
import { usePersona } from '@/app/PersonaContext';
import TablaAprobacionAsesor from 'componentesAsesor/TablaAprobacionTesis';
export default function ListadoSolicitudTesisAsesor() {
    const { persona } = usePersona();
    const [estadoSeleccionado,setEstadoSeleccionado] = useState("TODAS");
      const [SolicitudesTemaTesis,setSolicitudesTemaTesis] = useState([]);
      const [solicitudesFiltradas,setSolicitudesFiltradas] = useState([]);
        const estadoAprobacion = [{id:1,nombre:"EN_REVISION_POR_ASESOR"},
            {id:2,nombre:"OBSERVADO_POR_ASESOR"},
            {id:3,nombre:"EN_REVISION_POR_COORDINADOR"},
            {id:4,nombre:"OBSERVADO_POR_COORDINADOR"},
            {id:5,nombre:"EN_REVISION_POR_DIRECTOR"},
            {id:6,nombre:"OBSERVADO_POR_DIRECTOR"},
            {id:7,nombre:"APROBADA"},
            {id:8,nombre:"TODAS"}]
    
      useEffect(() => {
        if (persona?.id) { // Solo se ejecuta si persona.id está definido
        console.log('Id de persona:',persona.id);
        const fetchSolicitudesTemaTesis = async () => {
          try{
            const response = await fetch(`http://localhost:8080/solicitudes/solicitudTemaTesis/listarPorIdAsesor/${persona.id}`)
            const data = await response.json();
            console.log('Datos obtenidos:', data);
            const dataInvertida = data.reverse();
            setSolicitudesTemaTesis(dataInvertida);
            setSolicitudesFiltradas(dataInvertida);
          } catch (error){
            console.error('Error al obtener las solicitudes:', error);
          }

        };
        fetchSolicitudesTemaTesis();
      }
      },[])

      useEffect(() => {
        if (estadoSeleccionado && estadoSeleccionado != "TODAS") {
            const filtradas = SolicitudesTemaTesis.filter(
                (solicitud) => solicitud.estadoAprobacion === estadoSeleccionado
            );
            setSolicitudesFiltradas(filtradas);
        } else {
            setSolicitudesFiltradas(SolicitudesTemaTesis); // Mostrar todas si no hay estado seleccionado
        }
    }, [estadoSeleccionado, SolicitudesTemaTesis]);
    const handleRolChange = (event) => {
        const selectedEstado = event.target.value;
        setEstadoSeleccionado(selectedEstado);
        console.log("ESTSELEC", estadoSeleccionado);
        setSolicitudesFiltradas(estadoSeleccionado
        ? SolicitudesTemaTesis.filter((solicitud) => solicitud.estadoSolicitud === estadoSeleccionado)
        : SolicitudesTemaTesis);

      };
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
                <Typography variant="h4" sx={{ marginLeft:'20px', fontWeight: '', color: 'black' }}>Solicitud de Tema de Tesis</Typography>
                </Box>

                <Box sx={{padding:'20px',display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                    <Box sx={{flexGrow:'1'}}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Seleccionar Estado</InputLabel>
            <Select value={estadoSeleccionado} onChange={handleRolChange}>
              {estadoAprobacion.map((estado) => (
                <MenuItem key={estado.id} value={estado.nombre}>{estado.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
                    </Box>

                </Box>

                <Box sx={{marginLeft:'20px',marginRight:'20px'}}>
                    <TablaAprobacionAsesor solicitudesAprobacion={solicitudesFiltradas}></TablaAprobacionAsesor>

                </Box>
            </Box>
          
        </Box>        
    );
}