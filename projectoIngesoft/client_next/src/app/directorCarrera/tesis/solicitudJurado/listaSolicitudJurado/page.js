"use client";
import BarraBusqueda from "../../../../../../componentesAdministrador/BarraBusqueda";
import { Table,Button, Typography, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import Link from "next/link";
import TablaDeSolicitudesJuradoEnviadas from "../../../../../../componentesDirectorDeCarrera/solicitudJurado/TablaDeSolicitudesJuradoEnviadas";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
export default function ListadoDeSolicitudesJurado() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [solicitudesFiltradas,setSolicitudesFiltradas] = useState([]);
      const [tituloBusqueda, setTitulo] = useState(''); // Estado para almacenar el título de búsqueda
      const solicitudesTemaTesis = [
        {
          id: 1,
          emisor: {
            codigo: "20231001",
            nombre: "Juan",
            apellidoPaterno: "Pérez",
            apellidoMaterno: "García",
          },
          tesis: {
            titulo: "Optimización de Algoritmos de Búsqueda en Inteligencia Artificial",
          },
          fechaCreacion: "2024-12-01T10:30:00Z",
          estado: "COMPLETADO",
        },
        {
          id: 2,
          emisor: {
            codigo: "20231002",
            nombre: "María",
            apellidoPaterno: "López",
            apellidoMaterno: "Hernández",
          },
          tesis: {
            titulo: "Análisis de Sistemas Distribuidos para Computación Cuántica",
          },
          fechaCreacion: "2024-12-02T12:45:00Z",
          estado: "EN_PROCESO",
        },
        {
          id: 3,
          emisor: {
            codigo: "20231003",
            nombre: "Luis",
            apellidoPaterno: "Ramírez",
            apellidoMaterno: "Martínez",
          },
          tesis: {
            titulo: "Desarrollo de Interfaces Inteligentes para Dispositivos Móviles",
          },
          fechaCreacion: "2024-12-03T09:00:00Z",
          estado: "COMPLETADO",
        },
        {
          id: 4,
          emisor: {
            codigo: "20231004",
            nombre: "Ana",
            apellidoPaterno: "Gómez",
            apellidoMaterno: "Torres",
          },
          tesis: {
            titulo: "Aplicaciones de Machine Learning en la Detección de Enfermedades",
          },
          fechaCreacion: "2024-12-04T08:15:00Z",
          estado: "PENDIENTE",
        },
        {
          id: 5,
          emisor: {
            codigo: "20231005",
            nombre: "Carlos",
            apellidoPaterno: "Díaz",
            apellidoMaterno: "Vargas",
          },
          tesis: {
            titulo: "Impacto de los Videojuegos en la Educación Moderna",
          },
          fechaCreacion: "2024-12-05T11:20:00Z",
          estado: "COMPLETADO",
        },
        {
          id: 6,
          emisor: {
            codigo: "20231006",
            nombre: "Lucía",
            apellidoPaterno: "Sánchez",
            apellidoMaterno: "Reyes",
          },
          tesis: {
            titulo: "Optimización de Bases de Datos en la Nube",
          },
          fechaCreacion: "2024-12-06T14:30:00Z",
          estado: "EN_PROCESO",
        },
        {
          id: 7,
          emisor: {
            codigo: "20231007",
            nombre: "Diego",
            apellidoPaterno: "Ortega",
            apellidoMaterno: "Núñez",
          },
          tesis: {
            titulo: "Sistemas Autónomos para Logística en E-Commerce",
          },
          fechaCreacion: "2024-12-07T16:00:00Z",
          estado: "COMPLETADO",
        },
        {
          id: 8,
          emisor: {
            codigo: "20231008",
            nombre: "Elena",
            apellidoPaterno: "Castro",
            apellidoMaterno: "Morales",
          },
          tesis: {
            titulo: "Desarrollo de Aplicaciones de Realidad Aumentada para Turismo",
          },
          fechaCreacion: "2024-12-08T18:10:00Z",
          estado: "PENDIENTE",
        },
        {
          id: 9,
          emisor: {
            codigo: "20231009",
            nombre: "Fernando",
            apellidoPaterno: "Vega",
            apellidoMaterno: "Ruiz",
          },
          tesis: {
            titulo: "Evaluación de Seguridad en Sistemas de IoT",
          },
          fechaCreacion: "2024-12-09T20:45:00Z",
          estado: "COMPLETADO",
        },
        {
          id: 10,
          emisor: {
            codigo: "20231010",
            nombre: "Gabriela",
            apellidoPaterno: "Mendoza",
            apellidoMaterno: "Rojas",
          },
          tesis: {
            titulo: "Implementación de Redes Neuronales para Predicción Climática",
          },
          fechaCreacion: "2024-12-10T15:35:00Z",
          estado: "EN_PROCESO",
        },
      ];
      useEffect(() => {
      const fetchSolicitudesJurado = async () => {
        try{
          const response = await fetch(`http://localhost:8080/solicitudes/jurados/listar2`, {
            params: {
              titulo: tituloBusqueda
            },
          })
            const data = await response.json();
            console.log('Datos obtenidos:', data);
            const dataInvertida = data.reverse();
            setSolicitudes(dataInvertida);
            //setSolicitudes(solicitudesTemaTesis);
        } catch (error){
            console.error('Error al obtener las solicitudes:', error);
        }
    };
        fetchSolicitudesJurado();
    },[])
    // Filtrar solicitudes en base al título ingresado
    useEffect(() => {
      const filtrarSolicitudes = () => {
          if (tituloBusqueda.trim() === "") {
              // Si no hay texto de búsqueda, mostrar todas las solicitudes
              setSolicitudesFiltradas(solicitudes);
          } else {
              // Filtrar solicitudes que coincidan parcialmente con el título
              const filtradas = solicitudes.filter((solicitud) =>
                  solicitud.tesis.titulo
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
                <Typography variant="h4" sx={{ marginLeft:'20px', fontWeight: 'bold', color: 'black' }}>Lista de solicitudes de jurado</Typography>
                </Box>

                <Box sx={{padding:'20px',display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                    <Box sx={{flexGrow:'1'}}>
                    <BarraBusqueda onSearch={setTitulo} />
                    </Box>
                    


                </Box>

                <Box sx={{marginLeft:'20px',marginRight:'20px'}}>
                    <TablaDeSolicitudesJuradoEnviadas solicitudesJurado={solicitudesFiltradas}/>
                </Box>
            </Box>
          
        </Box>        
    );
}