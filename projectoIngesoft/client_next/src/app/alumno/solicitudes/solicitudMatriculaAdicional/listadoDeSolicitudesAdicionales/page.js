"use client";
import { Button, Typography, Box,FormControl,Select,InputLabel,MenuItem} from '@mui/material';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePersona } from "@/app/PersonaContext";
import BarraBusqueda from '../../../../../../componentesAdministrador/BarraBusqueda';
import Link from 'next/link';
import TablaSolicitudesAdicionalesAlumno from '../../../../../../componentesAlumno/solicitudMatriculaAdicional/TablaSolicitudesAdicionalesAlumno';

export default function ListarAlumnosMatriculaAdicional() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [solicitudesFiltradas,setSolicitudesFiltradas] = useState([]);
    const { persona } = usePersona(); //obteniendo los datos de la persona
    const idPersona=persona.id;
    const [estadoSeleccionado,setEstadoSeleccionado] = useState("TODAS");
    const estadoAprobacion = [{id:1,nombre:"ACEPTADA"},
        {id:2,nombre:"EN_PROCESO"},
        {id:3,nombre:"RECHAZADA"},
        {id:4,nombre:"TODAS"}]

/*        const estadoAprobacion = [{id:1,nombre:EN_REVISION_POR_ASESOR},
            {id:2,nombre:OBSERVADO_POR_ASESOR},
            {id:3,nombre:EN_REVISION_POR_COORDINADOR},
            {id:4,nombre:OBSERVADO_POR_COORDINADOR},
            {id:5,nombre:EN_REVISION_POR_DIRECTOR},
            {id:6,nombre:OBSERVADO_POR_DIRECTOR},
            {id:7,nombre:APROBADA}]
  */  
    useEffect(() => {
        const fetchSolicitudesPorEspecialidad = async (idPersona) => {
            try {
                const response = await fetch(`http://localhost:8080/solicitudes/matricula/listarPorPersona?idPersona=${idPersona}`);
                const data = await response.json();
                console.log('Datos obtenidos:', data);
                setSolicitudes(data);
                //console.log('Solicitudes actualizadas:', data);
                setSolicitudesFiltradas(data);
            
            } catch (error) {
                console.error('Error al obtener las solicitudes:', error);
            }
        };
        fetchSolicitudesPorEspecialidad(idPersona);
    }, []);

    useEffect(() => {
        if (estadoSeleccionado && estadoSeleccionado != "TODAS") {
            const filtradas = solicitudes.filter(
                (solicitud) => solicitud.estadoSolicitud === estadoSeleccionado
            );
            setSolicitudesFiltradas(filtradas);
        } else {
            setSolicitudesFiltradas(solicitudes); // Mostrar todas si no hay estado seleccionado
        }
    }, [estadoSeleccionado, solicitudes]);
    const handleRolChange = (event) => {
        const selectedEstado = event.target.value;
        setEstadoSeleccionado(selectedEstado);
        console.log("ESTSELEC", estadoSeleccionado);
        setSolicitudesFiltradas(estadoSeleccionado
        ? solicitudes.filter((solicitud) => solicitud.estadoSolicitud === estadoSeleccionado)
        : solicitudes);

      };
    return (
        <Box sx={{ backgroundColor: 'white', color: 'white', height: '100vh' }}>
            <Box sx={{ marginLeft: '220px', height: '100vh', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <Box>
                    <Typography variant="h4" sx={{ marginLeft: '20px', fontWeight: '', color: 'black' }}>Lista de solicitudes de matricula adicional</Typography>
                </Box>

                <Box sx={{ padding: '20px', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Box sx={{ flexGrow: '1' }}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Seleccionar Estado</InputLabel>
            <Select value={estadoSeleccionado} onChange={handleRolChange}>
              {estadoAprobacion.map((estado) => (
                <MenuItem key={estado.id} value={estado.nombre}>{estado.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
                    </Box>
                    <Button 
                        component={Link} 
                        href="solicitarMatriculaAdicional/" 
                        variant="contained" 
                        color="primary" 
                        sx={{ ml: 2, display: 'flex', alignItems: 'center', height: '40px', backgroundColor:'#363581'}} // Ajusta la altura según sea necesario
                    >
                        Nueva solicitud
                    </Button>
                </Box>


                <Box sx={{ marginLeft: '20px', marginRight: '20px' }}>
                    <TablaSolicitudesAdicionalesAlumno solicitudes={solicitudesFiltradas} />
                </Box>
            </Box>
        </Box>
    );
}
