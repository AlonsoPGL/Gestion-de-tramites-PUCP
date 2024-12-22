"use client";
import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, InputAdornment, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TablaEspecialidades from '../../../../../componentesAdministrador/gestionEspecialidad/TablaEspecialidades';
import BarraBusqueda from '../../../../../componentesAdministrador/BarraBusqueda';
import Link from 'next/link';
import SearchIcon from '@mui/icons-material/Search';
import { usePersona } from '@/app/PersonaContext';
import Papa from 'papaparse';
import axios from 'axios';
import { useUnidad } from "@/app/UnidadContex";
import ModalSuperior from 'componentesGenerales/modales/ModalSuperior';

export default function GestionEspecialidad() {
  const [especialidad, setEspecialidad] = useState(null);
  const fileInputRef = useRef(null);
  const [confirmacionOpen, setConfirmacionOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [especialidades, setEspecialidades] = useState([]);
  const [filteredEspecialidads, setFilteredEspecialidads] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalEspecialidads, setTotalEspecialidads] = useState(0);
  const [error, setError] = useState('');
  const { unidad } = useUnidad();
  const [solicitudEspecialidadAprobar, setSolicitudEspecialidadAprobar] = useState('');
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const cargarEspecialidades = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/institucion/facultad/listarEspecialidadesDeFacultad/${unidad.idUnidad}`);
        setEspecialidades(response.data); // Asumimos que la respuesta tiene la lista de especialidades
      } catch (error) {
        console.error("Error cargando las especialidades:", error);
      }
    };
    cargarEspecialidades();
  }, []);
  const estilosEncabezado = () => {
    return { color: 'white', fontWeight: 'bold', backgroundColor: '#363581' };
  };

  const confirmarSolicitud = async () => {
    try {
      await axios.put(`http://localhost:8080/institucion/especialidad/habilitarEnvioSolicitudCursos/${solicitudEspecialidadAprobar}`);
      setConfirmacionOpen(false);
    } catch (error) {
      console.error('Error al confirmar solicitud:', error);
    }
  };

  const handleOpenModal = (idEspecialidad) => {
    setSolicitudEspecialidadAprobar(idEspecialidad);
    setConfirmacionOpen(true);
  };

  return (
    <Box sx={{ backgroundColor: 'white', height: '100vh' }}>
      <Box
        sx={{
          marginLeft: '220px',
          height: '100vh',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h4" sx={{ mb: '20px', color: '#191D23' }}>
          Solicitud de Pedido Cursos
        </Typography>

        <TableContainer component={Paper} sx={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', overflow: 'auto' }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            {/* Encabezado de la tabla */}
            <TableHead sx={{ backgroundColor: '#363581' }}>
              <TableRow>
                <TableCell align='center' sx={estilosEncabezado()}>Especialidad</TableCell>
                <TableCell align='center' sx={estilosEncabezado()}>Acciones</TableCell>
              </TableRow>
            </TableHead>

            {/* Cuerpo de la tabla */}
            <TableBody>
              {especialidades.map((especialidad) => (
                <TableRow key={especialidad.id}>
                  {/* Nombre de la especialidad */}
                  <TableCell align="center" sx={{ padding: '11px' }}>
                    {especialidad.nombre}
                  </TableCell>

                  {/* Acciones */}
                  <TableCell align="center">
                    {especialidad.habilitarEnvioSolicitudCursos ? (
                      <Typography sx={{ color:"primary", fontWeight: 'bold' }}>
                        Aprobado
                      </Typography>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleOpenModal(especialidad.id)}
                      >
                        Solicitar Pedido Cursos
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <ModalSuperior
          open={confirmacionOpen}
          handleClose={() => setConfirmacionOpen(false)}
          title="¿Está seguro que desea solicitar pedido de cursos?"
          onConfirm={confirmarSolicitud}
        />
      </Box>
    </Box>
  );
}