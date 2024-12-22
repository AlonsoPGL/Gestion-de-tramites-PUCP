"use client";
import React, { useEffect, useState } from 'react';
import BarraBusqueda from '../../../../../componentesAdministrador/BarraBusqueda';
import { Table,Button, Typography, TableBody, TableCell, TableContainer, TableHead, TableRow, MenuItem, Select, Box,FormControl,InputLabel } from '@mui/material';
import { useUnidad } from '@/app/UnidadContex';
import { usePersona } from '@/app/PersonaContext';
import { useRol } from '@/app/RolContext'; 
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TablaAprobacionDirector from 'componentesDirectorDeCarrera/aprobacionTesis/TablaAprobacionDirector';
export default function ListadoSolicitudTesisDirectorCarrera() {
  const { persona } = usePersona();

  const { unidad } = useUnidad();

  const { rol } = useRol();
  const [estadoSeleccionado,setEstadoSeleccionado] = useState("TODAS");

      //const [solicitudesAprobacion, setSolicitudesAprobacion] = useState([]);

     /* useEffect(() => {
        const fetchSolicitudesTesis = async () => {
            try{
                const response = await fetch(`http://localhost:8080/solicitudes/jurados/listar`);
                const data = await response.json();
                console.log('Datos obtenidos:', data);
                setSolicitudes(data);
            } catch (error){
                console.error('Error al obtener las solicitudes:', error);
            }
        };
        fetchSolicitudesTesis();
      },[])*/
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
        if (unidad?.id) { // Solo se ejecuta si persona.id está definido
        console.log('Id de persona:',unidad);
        const fetchSolicitudesTemaTesis = async () => {
          try{
            const response = await fetch(`http://localhost:8080/solicitudes/solicitudTemaTesis/listarPorIdEspecialidad/${unidad.idUnidad}`)
            const data = await response.json();
            console.log('Datos obtenidos:', data);
            const dataInvertida = data.reverse();
            setSolicitudesTemaTesis(dataInvertida);
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
    const handleStateChange = (event) => {
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
                <Typography variant="h4" sx={{ marginLeft:'20px', fontWeight: 'bold', color: 'black' }}>Solicitud de tema de tesis</Typography>
                </Box>

                <Box sx={{padding:'20px',display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                    <Box sx={{flexGrow:'1'}}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Seleccionar Estado</InputLabel>
            <Select value={estadoSeleccionado} onChange={handleStateChange}>
              {estadoAprobacion.map((estado) => (
                <MenuItem key={estado.id} value={estado.nombre}>{estado.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
                    </Box>

                </Box>

                <Box sx={{marginLeft:'20px',marginRight:'20px'}}>
                    <TablaAprobacionDirector solicitudesAprobacion={solicitudesFiltradas}></TablaAprobacionDirector>

                </Box>
            </Box>
          
        </Box>        
    );
}