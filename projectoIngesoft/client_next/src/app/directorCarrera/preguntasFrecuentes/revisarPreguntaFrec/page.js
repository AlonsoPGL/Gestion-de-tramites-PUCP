"use client";
import axios from 'axios';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePersona } from "@/app/PersonaContext";
import { Snackbar, Box, FormControl, Typography, Select, Button, MenuItem, TextField } from '@mui/material';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import SearchIcon from '@mui/icons-material/Search';
import TablaPreguntasFrecuentesEditar from "componentesDirectorDeCarrera/TablaPreguntasFrecuentes";
import { usePreguntaFrecuente } from '../../../PreguntaFrecuenteContext';
import EstaSeguroAccion from '../../../../../componentesGenerales/modales/EstaSeguroAccion';
import MuiAlert from '@mui/material/Alert';

function RevisaPreguntaFrec() {
  const { preguntaFrecuente: preguntaFrecuenteEditar } = usePreguntaFrecuente(); 
  const [pregunta, setPregunta] = useState(""); // Para el 
  const [respuesta, setRespuesta] = useState(""); // Para el 
  const [tema, setTema] = useState(preguntaFrecuenteEditar?.tema || "");
  const [modalOpen, setModalOpen] = useState(false); // Estado para el modal
  const router = useRouter();
  const [categoria, setCategorias] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  
  useEffect(() => {
    if ( preguntaFrecuenteEditar) {
      setPregunta(preguntaFrecuenteEditar?.pregunta);
      setRespuesta(preguntaFrecuenteEditar?.respuesta);
      setTema(preguntaFrecuenteEditar?.categoria);
    }
  }, [ preguntaFrecuenteEditar]);

  console.log(preguntaFrecuenteEditar);
  const handleTemaChange = (event) => {
    setTema(event.target.value);
  }; 

  const validateFields = () => {
    // Verifica si hay campos vacíos
    if (!pregunta) {
      setSnackbarMessage("Debe ingresar una pregunta.");
      setSnackbarOpen(true);
      return false;
    }  
    if (!tema) {
      setSnackbarMessage("Seleccione una categoría.");
      setSnackbarOpen(true);
      return false;
    }  
    return true; // Si todas las validaciones pasan
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (validateFields()) {
      setModalOpen(true);
    }
  };

  const handleClickInsertarPreguntaFrecuente = async (e) => {
    try {
      const preguntaFrecuente = {
        categoria: tema, // Agrega el tema
        pregunta: pregunta, // Usa la pregunta
        respuesta: respuesta,
        activo: true,
        fechaRegistro: new Date().toISOString()
      };

      console.log(preguntaFrecuente.id);
      const endpoint =  `http://localhost:8080/preguntas/preguntasFrecuentes/actualizar/${preguntaFrecuenteEditar.id}`;
      const method = 'put';
      const response = await axios[method](endpoint, preguntaFrecuente);
      console.log(preguntaFrecuente);
      console.log("Pregunta Frecuente guardada:", response.data);
      router.push('/directorCarrera/preguntasFrecuentes/gestionarPreguntaFrec');
    } catch (error) {
      console.error("Error al guardar la pregunta frecuente:", error);
    }
  };

  return (
    <Box sx={{ backgroundColor: 'white', minHeight: '100vh', paddingBottom: '10px' }}>
        <Box
          sx={{
            marginLeft: '220px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        > 
        <Box
          sx={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #D9D9D9',
            borderRadius: 2,
            padding: 4,
            boxShadow: 2,
            width: '100%',
            maxWidth: 700,
          }}
        > 
        <Box sx={{ display: 'flex', 
                   alignItems: 'center',
                   display: 'flex',
                   mb: 2, gap: 2, width: '100%' }}>
          <Typography variant="body1">Seleccione una categoría:</Typography>
          <FormControl sx={{ minWidth: '250px' }}> 
            <Select
              value={tema || ""}
              onChange={handleTemaChange}
              displayEmpty  
              sx={{ minWidth: '250px' }}
            >
              <MenuItem value="" disabled>
                Seleccione una categoría
              </MenuItem>
              <MenuItem value="MATRICULA">MATRICULA</MenuItem>
              <MenuItem value="CURSOS">CURSOS</MenuItem>
              <MenuItem value="PROFESORES">PROFESORES</MenuItem>
            </Select>                
          </FormControl>
        </Box>
        <Box>
          <Typography variant="h8">Escriba su pregunta</Typography>
        </Box>
        <Box> 
          <TextField
            variant="outlined"
            fullWidth
            multiline
            required
            value={pregunta || ""} 
            disabled 
            onChange={(e) => setPregunta(e.target.value)}  
            inputProps={{ maxLength: 200,
              style: {
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
              }
            }} // Limita a 200 caracteres
            sx={{
              '& .MuiInputBase-root': {
                maxHeight: '150px', // Tamaño máximo
                overflowY: 'auto', // Scroll vertical
              },
            }}
          />
        </Box> 
        <Box>
          <Typography variant="h8">Respuesta</Typography>
        </Box>
        <Box> 
        <TextField
            variant="outlined"
            fullWidth
            multiline
            required
            value={respuesta || ""} 
            onChange={(e) => setRespuesta(e.target.value)}  
            inputProps={{ maxLength: 200,
              style: {
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
              }
            }} // Limita a 200 caracteres
            sx={{
              '& .MuiInputBase-root': {
                maxHeight: '150px', // Tamaño máximo
                overflowY: 'auto', // Scroll vertical
              },
            }}
          />
        </Box>   
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button variant='outlined' onClick={() => router.back()} sx={{ width: '170px', marginRight: '20px' }}>Cancelar</Button>
          <Button variant='contained' onClick={handleGuardar} sx={{ width: '170px' }}>Responder Pregunta</Button>
        </Box>
      </Box>
      <EstaSeguroAccion
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        texto={`¿Está seguro de responder la pregunta?`}
        handleAceptar={async () => {
          await handleClickInsertarPreguntaFrecuente();
          setModalOpen(false);
        }}
      />
      {/* Snackbar para mostrar mensajes */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity="warning">
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}

export default RevisaPreguntaFrec;
