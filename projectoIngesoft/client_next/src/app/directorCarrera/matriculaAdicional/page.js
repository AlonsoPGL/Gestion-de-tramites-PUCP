"use client";
import BarraBusqueda from "../../../../componentesAdministrador/BarraBusqueda";
import { Table, Button, Typography, Box,FormControl,Select,InputLabel,MenuItem } from '@mui/material';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TablaSolicitudesAdicionalesDirector from "../../../../componentesDirectorDeCarrera/matriculaAdicional/TablaSolicitudesAdicionalesDirector";
import { usePersona } from "@/app/PersonaContext";
import { useUnidad } from "@/app/UnidadContex";
export default function ListarAlumnosMatriculaAdicional() {
    const [solicitudes, setSolicitudes] = useState([]);
    const {persona}=usePersona();
    const [solicitudesFiltradas,setSolicitudesFiltradas] = useState([]);
    const [tituloBusqueda, setTitulo] = useState(''); // Estado para almacenar el título de búsqueda
    const { unidad } = useUnidad();
    const solicitudes2 = [
        {
          id: 101001,
          emisor: {
            nombre: "Jaime",
            apellidoPaterno: "de la Cruz",
            apellidoMaterno: "Ramirez"
          },
          estadoSolicitud: "EN_PROCESO",
          fechaCreacion: "2024-12-01T10:30:00Z"
        },
        {
          id: 101002,
          emisor: {
            nombre: "Ana",
            apellidoPaterno: "Perez",
            apellidoMaterno: "Gomez"
          },
          estadoSolicitud: "ACEPTADA",
          fechaCreacion: "2024-11-30T09:20:00Z"
        },
        {
          id: 101003,
          emisor: {
            nombre: "Carlos",
            apellidoPaterno: "Ramirez",
            apellidoMaterno: "Torres"
          },
          estadoSolicitud: "RECHAZADA",
          fechaCreacion: "2024-11-29T14:15:00Z"
        },
        {
          id: 101004,
          emisor: {
            nombre: "Elena",
            apellidoPaterno: "Martinez",
            apellidoMaterno: "Lopez"
          },
          estadoSolicitud: "EN_PROCESO",
          fechaCreacion: "2024-11-28T12:45:00Z"
        },
        {
          id: 101005,
          emisor: {
            nombre: "Luis",
            apellidoPaterno: "Sanchez",
            apellidoMaterno: "Diaz"
          },
          estadoSolicitud: "ACEPTADA",
          fechaCreacion: "2024-11-27T16:00:00Z"
        },
        {
          id: 101006,
          emisor: {
            nombre: "Marta",
            apellidoPaterno: "Fernandez",
            apellidoMaterno: "Castro"
          },
          estadoSolicitud: "RECHAZADA",
          fechaCreacion: "2024-11-26T08:30:00Z"
        },
        {
          id: 101007,
          emisor: {
            nombre: "Jorge",
            apellidoPaterno: "Lopez",
            apellidoMaterno: "Hernandez"
          },
          estadoSolicitud: "EN_PROCESO",
          fechaCreacion: "2024-11-25T13:10:00Z"
        },
        {
          id: 101008,
          emisor: {
            nombre: "Sofia",
            apellidoPaterno: "Rojas",
            apellidoMaterno: "Vega"
          },
          estadoSolicitud: "ACEPTADA",
          fechaCreacion: "2024-11-24T11:00:00Z"
        },
        {
          id: 101009,
          emisor: {
            nombre: "Andres",
            apellidoPaterno: "Castillo",
            apellidoMaterno: "Ortiz"
          },
          estadoSolicitud: "RECHAZADA",
          fechaCreacion: "2024-11-23T15:25:00Z"
        },
        {
          id: 101010,
          emisor: {
            nombre: "Lucia",
            apellidoPaterno: "Gomez",
            apellidoMaterno: "Salas"
          },
          estadoSolicitud: "EN_PROCESO",
          fechaCreacion: "2024-11-22T17:40:00Z"
        }
      ];
      
    useEffect(() => {
        const id = unidad.idUnidad;
      
        const fetchSolicitudesPorEspecialidad = async (id) => {
            try {
                const response = await fetch(`http://localhost:8080/solicitudes/matricula/listar?id=${id}`);
                const data = await response.json();
                console.log('Datos obtenidos:', data);
                setSolicitudes(data);
                //setSolicitudes(solicitudes2)
                //console.log('Solicitudes actualizadas:', data);
            } catch (error) {
                console.error('Error al obtener las solicitudes:', error);
            }
        };
        fetchSolicitudesPorEspecialidad(id);
    }, []);

    // Filtrar solicitudes en base al título ingresado
    useEffect(() => {
        const filtrarSolicitudes = () => {
            if (tituloBusqueda.trim() === "") {
                // Si no hay texto de búsqueda, mostrar todas las solicitudes
                setSolicitudesFiltradas(solicitudes);
            } else {
                // Filtrar solicitudes que coincidan parcialmente con el título
                const filtradas = solicitudes.filter((solicitud) =>
                    (solicitud?.emisor?.nombre+" "+solicitud?.emisor?.apellidoPaterno+" "+solicitud?.emisor?.apellidoMaterno)
                        .toLowerCase()
                        .includes(tituloBusqueda.toLowerCase())
                );
                setSolicitudesFiltradas(filtradas);
            }
        };
  
        filtrarSolicitudes();
    }, [tituloBusqueda, solicitudes]);
    return (
        <Box sx={{ backgroundColor: 'white', color: 'white', height: '100vh' }}>
            <Box sx={{ marginLeft: '220px', height: '100vh', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <Box>
                    <Typography variant="h4" sx={{ marginLeft: '20px', fontWeight: '', color: 'black' }}>Lista de solicitudes de matrícula adicional</Typography>
                </Box>

                <Box sx={{ padding: '20px', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Box sx={{ flexGrow: '1' }}>
                    <BarraBusqueda onSearch={setTitulo} />
                    </Box>
                </Box>

                <Box sx={{ marginLeft: '20px', marginRight: '20px' }}>
                    <TablaSolicitudesAdicionalesDirector solicitudes={solicitudesFiltradas} />
                </Box>
            </Box>
        </Box>
    );
}