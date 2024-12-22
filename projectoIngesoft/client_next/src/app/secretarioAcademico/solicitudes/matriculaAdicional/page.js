"use client";
import { Button, Typography, Box } from '@mui/material';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePersona } from "@/app/PersonaContext";
import { useRol } from '@/app/RolContext';
import { useUnidad } from '@/app/UnidadContex';
import BarraBusqueda from 'componentesAdministrador/BarraBusqueda';
import Link from 'next/link';
import TablaSolicitudesAdicionalesSecretarioAcademico from 'componentesSecretarioAcadémico/matriculaAdicional/TablaSolicitudesAdicionalesSecretarioAcademico';

export default function ListarAlumnosMatriculaAdicional() {
    const [solicitudes, setSolicitudes] = useState([]);
    const { persona } = usePersona(); //obteniendo los datos de la persona
    const { rol} = useRol();
    const { unidad} = useUnidad();
    const idPersona=persona.id;
    const [solicitudesFiltradas,setSolicitudesFiltradas] = useState([]);
    const [tituloBusqueda, setTitulo] = useState(''); // Estado para almacenar el título de búsqueda
    useEffect(() => {
        const id = unidad.idUnidad;
        const fetchSolicitudesPorEspecialidad = async (id) => {
            try {
                const response = await fetch(`http://localhost:8080/solicitudes/matricula/listar?id=${id}`);
                const data = await response.json();
                console.log("Rol:",rol)
                console.log("Unidad:",unidad)
                console.log('Datos obtenidos:', data);
                setSolicitudes(data);
                //console.log('Solicitudes actualizadas:', data);
            } catch (error) {
                console.error('Error al obtener las solicitudes:', error);
            }
        };
        fetchSolicitudesPorEspecialidad(id);
    }, []);
    // Filtrar solicitudes en base al nombre
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
                    <Typography variant="h4" sx={{ marginLeft: '20px', fontWeight: '', color: 'black' }}>Lista de solicitudes de matricula adicional</Typography>
                </Box>

                <Box sx={{ padding: '20px', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Box sx={{ flexGrow: '1' }}>
                    <BarraBusqueda onSearch={setTitulo} />
                    </Box>
                </Box>


                <Box sx={{ marginLeft: '20px', marginRight: '20px' }}>
                    <TablaSolicitudesAdicionalesSecretarioAcademico solicitudes={solicitudesFiltradas} />
                </Box>
            </Box>
        </Box>
    );
}
