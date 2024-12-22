"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import React from 'react';
import { useRouter } from "next/navigation";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Pagination,
} from "@mui/material";
import { usePersona } from "@/app/PersonaContext";
import { useUnidad } from "@/app/UnidadContex";
import DownloadIcon from "@mui/icons-material/Download";
import CircularProgress from "@mui/material/CircularProgress";
import CloudUploadIcon from "@mui/icons-material/CloudUpload"; 
const formatDate = (dateString) => {
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Fecha inválida";
    }
    return date.toLocaleDateString("es-ES", options);
  } catch (error) {
    return "Fecha inválida";
  }
};

export default function SolicitudCartaPresentacion() {
  const [solicitudes, setSolicitudes] = useState([]);
  const { persona } = usePersona();
  const { unidad } = useUnidad();
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [loading, setLoading] = useState(true);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
  

  const handleEditClick = (solicitud) => {
    const integrantes = JSON.stringify(solicitud.integrantes);
    router.push(
      `/secretariaEspecialidad/solicitudes/solicitudCartaPresentacion/editarCarta?id=${solicitud.id}&fechaCreacion=${solicitud.fechaCreacion}&cursoNombre=${solicitud.curso.nombre}&profesorNombre=${solicitud.profesor.nombre}&estado=${solicitud.estado}&observacion=${solicitud.actividadesDesarrollar}&integrantes=${encodeURIComponent(
        integrantes
      )}`
    );
  };

  const handleFileUpload = async (e, solicitud) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.put(
          `http://localhost:8080/solicitudes/carta/actualizar-documento/${solicitud.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Archivo subido exitosamente:", response.data);
        alert(`Archivo subido exitosamente.`);
      } catch (error) {
        console.error("Error al subir el archivo:", error);
      }
    } else {
      console.error("Por favor, selecciona un archivo PDF válido.");
    }
  };

  const handleDownloadClick = (solicitud) => {
    if (typeof window !== "undefined") {
      const { jsPDF } = require("jspdf");

      const doc = new jsPDF();
      doc.text("Solicitud de Carta de Presentación", 10, 10);
      doc.text(`ID Solicitud: ${solicitud.id}`, 10, 20);
      doc.text(`Fecha de creación: ${solicitud.fechaCreacion}`, 10, 30);
      doc.text(`Curso: ${solicitud.curso.nombre}`, 10, 40);
      doc.text(`Profesor: ${solicitud.profesor.nombre}`, 10, 50);
      doc.text(`Actividades a Desarrollar:`, 10, 70);
      doc.text(` ${solicitud.actividadesDesarrollar}`, 10, 80);
      doc.text("Integrantes:", 10, 90);
      solicitud.integrantes.forEach((integrante, index) => {
        doc.text(`${index + 1}. ${integrante.nombre}`, 10, 110 + index * 10);
      });
      doc.line(10, 260, 100, 260);
      doc.text("Firma del director", 10, 265);
      doc.save(`Solicitud_${solicitud.id}.pdf`);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress style={{ width: "100px", height: "100px" }} />
      </div>
    );
  } else {
    return (
      <Box
        sx={{
          backgroundColor: "white",
          color: "black",
          height: "100vh",
          paddingLeft: "220px",
          paddingRight: "120px",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ mb: "20px", marginLeft: "20px", color: "black" }}
          >
            Solicitudes de Carta de Presentación
          </Typography>
        </Box>
        <TableContainer
          component={Paper}
          sx={{ marginBottom: "20px", marginLeft: "20px" }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#363581", color: "white" }}>
              <TableRow>
                <TableCell sx={{ color: "white", minWidth: "150px" }}>
                  Fecha solicitud
                </TableCell>
                <TableCell sx={{ color: "white", minWidth: "150px" }}>
                  Curso
                </TableCell>
                <TableCell sx={{ color: "white", minWidth: "150px" }}>
                  Profesor
                </TableCell>
                <TableCell sx={{ color: "white", minWidth: "150px" }}>
                  Estado
                </TableCell>
                <TableCell sx={{ color: "white", minWidth: "150px" }}>
                  Acción
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {solicitudes.map((solicitud, index) => (
                <TableRow key={index}>
                  <TableCell>{formatDate(solicitud.fechaCreacion)}</TableCell>
                  <TableCell>{solicitud.curso.nombre}</TableCell>
                  <TableCell>{solicitud.profesor.nombre}</TableCell>
                  <TableCell>{solicitud.estado}</TableCell>
                  <TableCell>
                    {solicitud.estado === "EN_PROCESO" && (
                      <>
                        <IconButton
                          aria-label="edit"
                          onClick={() => handleEditClick(solicitud)}
                        >
                          <EditIcon color="primary" />
                        </IconButton>
                        <Button
                          color="primary"
                          variant="contained"
                          component="label"
                          startIcon={<CloudUploadIcon />}
                        >
                          Subir
                          <input
                            type="file"
                            hidden
                            accept="application/pdf"
                            onChange={(e) => handleFileUpload(e, solicitud)}
                          />
                        </Button>
                      </>
                    )}
                    <IconButton
                      aria-label="download"
                      onClick={() => handleDownloadClick(solicitud)}
                    >
                      <DownloadIcon color="primary" />
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
              "& .MuiPaginationItem-root": {
                borderRadius: "50%",
                color: "#363581",
                margin: "0px",
                width: "35px",
                height: "35px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
                "&.Mui-selected": {
                  backgroundColor: "#363581",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#303f9f",
                  },
                },
              },
              ul: { justifyContent: "right" },
            }}
          />
        </Box>
      </Box>
    );
  }
}

