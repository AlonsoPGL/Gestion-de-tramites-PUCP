"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import { usePersona } from "@/app/PersonaContext";

export default function CartaPresentacion() {
  const router = useRouter();
  const [curso, setCurso] = useState("");
  const [actividades, setActividades] = useState(""); // Estado para actividades
  const [openAlumnoModal, setOpenAlumnoModal] = useState(false);
  const { persona } = usePersona();
  const [alumnos, setAlumnos] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState("");
  const [profesor, setProfesor] = useState("");
  const [fechaCreacionz, setFechaCreacionz] = useState("");
  const [solicitud, setSolicitud] = useState({
    id: "",
    fechaCreacion: "",
    cursoNombre: "",
    profesorNombre: "",
    estado: "",
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    const fecha = searchParams.get("fechaCreacion");
    const cursoNombre = searchParams.get("cursoNombre");
    const profesorNombre = searchParams.get("profesorNombre");
    const estado = searchParams.get("estado");
    const integrantes = searchParams.get("integrantes");
    const observacion = searchParams.get("observacion"); // Obtener la observación

    setSolicitud({
      id: id || "",
      fechaCreacion: fecha || "",
      cursoNombre: cursoNombre || "",
      profesorNombre: profesorNombre || "",
      estado: estado || "",
    });

    setCurso(cursoNombre);
    setProfesor(profesorNombre);

    if (integrantes) {
      const parsedIntegrantes = JSON.parse(decodeURIComponent(integrantes));
      setAlumnos(parsedIntegrantes);
    }

    if (observacion && observacion !== "null") {
      setActividades(observacion); // Si la observación no es null, úsala
    } else {
      setActividades(""); // De lo contrario, establece una cadena vacía
    }

    if (fecha) {
      const cleanedFecha = fecha.replace(" ", "+");
      const date = new Date(cleanedFecha);

      if (!isNaN(date.getTime())) {
        const formattedFecha = date.toISOString().split("T")[0];
        setFechaCreacionz(formattedFecha);
      } else {
        console.error("Fecha inválida:", cleanedFecha);
        setFechaCreacionz("");
      }
    }
  }, [router.isReady]);

  const handleGuardar = async () => {
    try {
      const dataToSend = {
        estado: solicitud.estado,
        observacion: actividades,
      };

      const solicitudId = solicitud.id;

      const response = await axios.put(
        `http://localhost:8080/solicitudes/carta/actualizar/${solicitudId}`,
        JSON.stringify(dataToSend),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Solicitud actualizada:", response.data);
      router.back();
    } catch (error) {
      console.error("Error al actualizar la solicitud:", error);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        color: "black",
        height: "100vh",
        paddingLeft: "240px",
        paddingTop: "20px",
      }}
    >
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", color: "black", marginBottom: "20px" }}
      >
        CARTA DE PRESENTACION
      </Typography>

      <Box>
        <Grid container spacing={2} sx={{ marginBottom: "20px" }}>
          <Grid item xs={9}>
            <TextField
              label="Curso"
              variant="outlined"
              value={curso}
              InputProps={{
                readOnly: true,
              }}
              sx={{ width: "500px" }}
            />
          </Grid>

          <Grid item xs={3}>
            <TextField
              label="Fecha"
              type="date"
              value={fechaCreacionz}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ width: "100%" }}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Profesor"
              variant="outlined"
              value={profesor}
              InputProps={{
                readOnly: true,
              }}
              sx={{ width: "500px" }}
            />
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <Typography variant="h6">Alumnos:</Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#363581" }}>
            <TableRow>
              <TableCell sx={{ color: "white" }}>Codigo</TableCell>
              <TableCell sx={{ color: "white" }}>Nombre Completo</TableCell>
              <TableCell sx={{ color: "white" }}>Correo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alumnos.map((alumno, index) => (
              <TableRow key={index}>
                <TableCell>{alumno.codigo}</TableCell>
                <TableCell>{alumno.nombre}</TableCell>
                <TableCell>{alumno.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" sx={{ marginTop: "20px" }}>
        Actividades que se desarrollarán:
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        value={actividades} // Mostrar el valor limpio de actividades
        onChange={(e) => setActividades(e.target.value)}
        sx={{ marginTop: "10px" }}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        <Button variant="outlined" color="secondary" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button
          sx={{ backgroundColor: "#363581" }}
          variant="contained"
          color="primary"
          onClick={handleGuardar}
        >
          Guardar
        </Button>
      </Box>
    </Box>
  );
}
