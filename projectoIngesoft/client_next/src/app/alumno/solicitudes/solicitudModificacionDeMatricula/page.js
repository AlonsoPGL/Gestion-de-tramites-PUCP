
"use client";
import React, { useEffect, useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, Typography, IconButton } from '@mui/material';
import BarraBusqueda from '../../../../../componentesAdministrador/BarraBusqueda';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePersona } from '@/app/PersonaContext';
const logoInstitucion = "https://d9hhrg4mnvzow.cloudfront.net/fabricum.pucp.edu.pe/landing/diseno-de-sistemas-de-riego/db44e0cf-logo-pucp-blanco-mesa-de-trabajo-1-mesa-de-trabajo-1_1000000000000000000028.png";
import CircularProgress from '@mui/material/CircularProgress';

export default function SolicitudCartaPresentacion() {
  const [solicitudes, setSolicitudes] = useState([]);
  const { persona } = usePersona(); // Extraer persona del contexto
  const [page, setPage] = useState(0); // Página inicial
  const rowsPerPage = 7; // Número de filas por página (7)
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true)
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
 
  const handleViewClick = (solicitud) => {
    const integrantes = JSON.stringify(solicitud.integrantes); // Convierte el array de objetos a un string JSON
    router.push(`/alumno/solicitudes/solicitudModificacionDeMatricula/visualizarSolicitud?id=${solicitud.id}&fechaCreacion=${solicitud.fechaCreacion}&cursoNombre=${solicitud.curso.nombre}&observacion=${solicitud.actividadesDesarrollar}&profesorNombre=${solicitud.profesor.nombre}&estado=${solicitud.estado}&integrantes=${encodeURIComponent(integrantes)}`);
};
  const handleDownloadClick = (solicitud) => {
    if (typeof window !== 'undefined') {
      const { jsPDF } = require('jspdf');


      const doc = new jsPDF();


      // Añadir información de la solicitud
      doc.text('Solicitud de Carta de Presentación', 10, 10);
      doc.text(`ID Solicitud: ${solicitud.id}`, 10, 20);
      doc.text(`Fecha de creación: ${solicitud.fechaCreacion}`, 10, 30);
      doc.text(`Curso: ${solicitud.curso.nombre}`, 10, 40);
      doc.text(`Profesor: ${solicitud.profesor.nombre}`, 10, 50);
      //doc.line(10, 60, 100, 60); // Dibujar una línea para la firma
      doc.text(`Actividades a Desarrollar:`, 10, 70);
      doc.text(` ${solicitud.actividadesDesarrollar}`, 10, 80);
      // Mostrar los integrantes
      doc.text('Integrantes:', 10, 90);
      doc.line(10, 100, 100, 100); // Dibujar una línea para la firma
      solicitud.integrantes.forEach((integrante, index) => {
        doc.text(`${index + 1}. ${integrante.nombre}`, 10, 110 + index * 10);
      });


      // Espacio para firma
     
      doc.line(10, 260, 100, 260); // Dibujar una línea para la firma
      doc.text('Firma del director', 10, 265); // Añadir el texto "Firma" cerca del final del documento


      // Guardar el archivo PDF
      doc.save(`Solicitud_${solicitud.id}.pdf`);
    }
  };


  useEffect(() => {
    // Verificamos que persona y persona.id existan
    if (persona && persona.id) {
      const fetchSolicitudes = async (idPersona) => {
        try {
          const response = await fetch(`http://localhost:8080/solicitudes/modificacion/listar/${idPersona}`);
  
          // Manejar el caso en que la respuesta es 204 No Content
          if (response.status === 204) {
            setSolicitudes([]); // Asignar un array vacío si no hay solicitudes
            setLoading(false); // Dejar de cargar
          } else {
            const data = await response.json();
            setSolicitudes(data); // Guarda los resultados en el estado
            setLoading(false); // Dejar de cargar
          }
  
        } catch (error) {
          console.error('Error al obtener las solicitudes:', error);
          setLoading(false); // Asegurarse de dejar de cargar en caso de error
        }
      };
  
      fetchSolicitudes(persona.id); // Llamar al método pasándole el idPersona
    }
  }, [persona]);
  
  if(loading){
   return <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh', // Ajusta esto según el tamaño deseado
    }}>
      <CircularProgress style={{ width: '100px', height: '100px' }} /> {/* Cambia los valores según el tamaño deseado */}
    </div>
      
  }else{
    return (
      <Box sx={{ backgroundColor: 'white', color: 'black', height: '100vh', paddingLeft: '220px' }}>
       
        {/* Contenedor principal */}
        <Box sx={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
         
          {/* Título */}
          <Typography variant="h4" sx={{ marginLeft:'20px', fontWeight: '', color: 'black' }}>
            Solicitudes de Modificacion de Matricula
          </Typography>
  
  
          {/* Barra de búsqueda y botón juntos */}
          <Box sx={{ padding:'20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <BarraBusqueda />
            <Button
              sx={{ backgroundColor: '#363581' }}
              component={Link}
              href="./solicitudModificacionDeMatricula/registrarSolicitudModificacion"
              variant="contained" color="primary" startIcon={<AddCircleOutlineIcon />}>
              Generar
            </Button>
          </Box>
  
  
          <TableContainer component={Paper} sx={{ marginBottom: '20px' }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#363581', color: 'white' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Fecha solicitud</TableCell>
                  <TableCell sx={{ color: 'white' }}>Codigo</TableCell>
                  <TableCell sx={{ color: 'white' }}>Alumno</TableCell>
                  <TableCell sx={{ color: 'white' }}>Estado</TableCell>
                  <TableCell sx={{ color: 'white' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
    {solicitudes
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Paginación
      .map((solicitud, index) => (
        <TableRow key={index}>
          <TableCell>
            {new Date(solicitud.fechaCreacion).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </TableCell>
          <TableCell>{solicitud.emisor.nombre}</TableCell>
          <TableCell>{solicitud.emisor.codigo}</TableCell>
          <TableCell>{solicitud.estado}</TableCell>
          <TableCell>
            {/* Mostrar el ícono de PDF solo si el estado es ACEPTADO */}
            {solicitud.estado === 'ACEPTADA' && (
              <IconButton aria-label="download" onClick={() => handleDownloadClick(solicitud)}>
                <DownloadIcon color="primary" />
              </IconButton>
            )}
            <IconButton aria-label="view" onClick={() => handleViewClick(solicitud)}>
              <VisibilityIcon color="primary" />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
  </TableBody>
            </Table>
          </TableContainer>
          <Box>
          <Pagination
            count={Math.ceil(solicitudes.length / rowsPerPage)}
            page={page + 1}
            onChange={(event, value) => setPage(value - 1)}
            size="large"
            color="primary"
            sx={{ 
              mt: 3,
              '& .MuiPaginationItem-root': {
                borderRadius: '50%',
                color: '#363581',
                margin: '0px',
                width: '35px', // Ancho del círculo
                height: '35px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center', // Centrar el texto dentro del círculo
                '&:hover': {
                  backgroundColor: '#f0f0f0', // Hover color
                },
                '&.Mui-selected': {
                  backgroundColor: '#363581',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#303f9f',
                  },
                },
              },
              ul: { justifyContent: 'right' },
            }}
          />
        </Box>
          {/* Imagen del logo */}
          <Box
            component="img"
            src={logoInstitucion}
            alt="Logo de la Institución"
            sx={{
              width: '200px',
              height: 'auto',
              marginTop: '20px',
              alignSelf: 'center',
            }}
          />
        </Box>
      </Box>
    );
  }
  }
  

