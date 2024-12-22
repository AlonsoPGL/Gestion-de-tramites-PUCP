"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Checkbox, FormControlLabel } from "@mui/material";

export default function SolicitudModificacionMatricula() {
  const [cursos, setCursos] = useState([]); // Lista de cursos
  const [cursosSeleccionados, setCursosSeleccionados] = useState([]);
  const [motivo, setMotivo] = useState(""); // Motivo de modificación
  const [error, setError] = useState("");

  // Simula la obtención de cursos desde un backend
  useEffect(() => {
    const fetchCursos = async () => {
      // Aquí puedes usar `fetch` o `axios` para obtener datos reales desde tu backend
      const cursosSimulados = [
        { id: 1, nombre: "Matemáticas Avanzadas" },
        { id: 2, nombre: "Historia Universal" },
        { id: 3, nombre: "Programación en Java" },
      ];
      setCursos(cursosSimulados);
    };
    fetchCursos();
  }, []);

  const handleCheckboxChange = (id) => {
    setCursosSeleccionados((prev) =>
      prev.includes(id)
        ? prev.filter((cursoId) => cursoId !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (cursosSeleccionados.length === 0 || motivo.trim() === "") {
      setError("Debe seleccionar al menos un curso y especificar un motivo.");
      return;
    }

    setError("");
    console.log("Cursos seleccionados:", cursosSeleccionados);
    console.log("Motivo:", motivo);

    // Aquí se enviaría la solicitud al backend
    alert("Solicitud enviada correctamente");
  };

  return (
    <Box sx={{ backgroundColor: "white", height: "100vh", padding: "20px" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
        Solicitud de Modificación de Matrícula
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Seleccione los cursos que desea modificar:
        </Typography>
        {cursos.map((curso) => (
          <FormControlLabel
            key={curso.id}
            control={
              <Checkbox
                checked={cursosSeleccionados.includes(curso.id)}
                onChange={() => handleCheckboxChange(curso.id)}
              />
            }
            label={curso.nombre}
          />
        ))}
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Motivo de la solicitud:
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          placeholder="Explique el motivo de la modificación de matrícula..."
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
        />
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ backgroundColor: "#1976d2" }}
      >
        Enviar Solicitud
      </Button>
    </Box>
  );
}

