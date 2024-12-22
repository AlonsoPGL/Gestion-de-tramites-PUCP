"use client";
import React, { useEffect, useState } from 'react';

import axios from 'axios';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import IconButton from '@mui/material/IconButton';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button , Typography, TablePagination} from '@mui/material'; // Importar Button
import { usePersona } from '@/app/PersonaContext';
import { useUnidad } from "@/app/UnidadContex";
import DownloadIcon from '@mui/icons-material/Download'; // Importar el icono de descarga
import jsPDF from 'jspdf'; // Importar jsPDF
import BarraBusqueda from "../../../../../componentesAdministrador/BarraBusqueda";
import CircularProgress from '@mui/material/CircularProgress';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Pagination from "@mui/material/Pagination";

export default function SolicitudCartaPresentacion() {
  const rowsPerPage = 7;
  const [solicitudes, setSolicitudes] = useState([]);
  const { persona } = usePersona();
  const [page, setPage] = useState(1); // Página actual (empezamos desde 1)
  const [loading, setLoading] = useState(true);
  // Barra de busqueda
  const { unidad } = useUnidad();
  const [searchTerm, setSearchTerm] = useState(''); // Estado para almacenar el valor de búsqueda
  useEffect(() => {
    setPage(1); // Reiniciar a la primera página cuando cambie el término de búsqueda
  }, [filteredSolicitudes]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        // Verifica si la unidad tiene un id válido antes de hacer la solicitud
        if (unidad && unidad.idUnidad) {
          const response = await fetch(
            `http://localhost:8080/solicitudes/carta/listarPorEspecialidad/${unidad.idUnidad}`
          );

          // Si la respuesta es 204 No Content, asignar un array vacío
          if (response.status === 204) {
            setSolicitudes([]);
          } else {
            const data = await response.json();
            setSolicitudes(data);
          }
        }
      } catch (error) {
        console.error("Error al obtener las solicitudes:", error);
      } finally {
        setLoading(false); // Finaliza el estado de carga
      }
    };

    // Ejecuta la función solo si unidad está definida
    if (unidad) {
      fetchSolicitudes();
    }
  }, [unidad]);
  
  const filteredSolicitudes = solicitudes.filter((solicit) =>
    String(solicit.emisor.codigo)?.toLowerCase().includes(searchTerm.toLowerCase())||
    solicit.emisor.nombre?.toLowerCase().includes(searchTerm.toLowerCase())||
    solicit.estado?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (term) => {
    setSearchTerm(term); // Actualiza el estado con el valor de búsqueda
  };

  // Función para manejar la subida de archivo PDF
  const handleFileUpload = async (e, solicitud) => {
    const file = e.target.files[0]; // Obtener el archivo del input
    if (file && file.type === "application/pdf") {
        console.log(`Subiendo archivo PDF para la solicitud ${solicitud.id}:`, file);

        const formData = new FormData();
        formData.append('file', file); // Añadir el archivo al FormData

        try {
            // Hacer una solicitud PUT a tu endpoint
            const response = await axios.put(`http://localhost:8080/solicitudes/carta/actualizar-documento-director/${solicitud.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Establecer el tipo de contenido adecuado
                }
            });
            solicitud.estado="FINALIZADO";
            console.log('Archivo subido exitosamente:', response.data);
            // Aquí podrías actualizar la UI para reflejar los cambios
            alert(`Archivo subido exitosamente.`);

        } catch (error) {
            console.error('Error al subir el archivo:', error);
        }
    } else {
        console.error("Por favor, selecciona un archivo PDF válido.");
    }
  };

  const handleDownloadClick = (solicitud) => {
    console.log(solicitud);
    const documentoBase64 = solicitud.documento;
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${documentoBase64}`;
    link.download = 'documento.pdf'; // Nombre del archivo a descargar
    link.click();
  };
  
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress size={100} />
      </Box>
    );
  }else{
    return (
      <Box sx={{ backgroundColor: 'white', height: '100vh' }}>
        <Box
          sx={{
            marginLeft: '220px',
            height: '100vh',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h4" sx={{ color: "black", mb: '20px' }}>
            Cartas de Presentación
          </Typography>
          
          <Box sx={{ mb: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <BarraBusqueda onSearch={handleSearch}/>
          </Box>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#363581", color: "#FFFFFF" }}>
                  <TableCell align="center" sx={{ color: "#FFFFFF" }}>Código</TableCell>
                  <TableCell align="center" sx={{ color: "#FFFFFF" }}>Alumno</TableCell>
                  <TableCell align="center" sx={{ color: "#FFFFFF" }}>Estado</TableCell>
                  <TableCell align="center" sx={{ color: "#FFFFFF" }}>Solicitud</TableCell>
                  <TableCell align="center" sx={{ color: "#FFFFFF" }}>Solicitud Firmada</TableCell>
                </TableRow>
              </TableHead>
  
              <TableBody>
                {filteredSolicitudes.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((solicitud) => (
                  <TableRow key = {solicitud.id}>
                    <TableCell align="center">{solicitud.emisor.codigo}</TableCell>
                    <TableCell align="center">{solicitud.emisor.nombre}</TableCell>
                    <TableCell align="center">{solicitud.estado}</TableCell>
                    <TableCell align='center'>
                      <FilePresentIcon aria-label="download"
                        sx={{ fontSize: 25, cursor: 'pointer', marginRight: '5px', color: '#363581' }}                 
                        onClick={() => handleDownloadClick(solicitud)}

                      />
                    </TableCell>
                    <TableCell align='center'>
                      <Button
                        color="primary"
                        variant="contained"
                        component="label"
                        startIcon={<CloudUploadIcon />}  // Agrega el icono aquí
                      >
                        Subir
                        <input
                          type="file"
                          hidden
                          accept="application/pdf"
                          onChange={(e) => handleFileUpload(e, solicitud)}
                        />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
  
          </TableContainer>

          <Box sx={{ display: "flex", justifyContent: "flex-end", padding: "20px" }}>
              <Pagination
                count={Math.ceil(filteredSolicitudes.length / rowsPerPage)} // Número total de páginas
                page={page} // Página actual
                onChange={handleChangePage} // Manejador de cambio de página
                size="large"
                color="primary"
                //sx={estilosIndice()}
              />
            </Box>
        </Box>
      </Box>
    );
  };
}