"use client";
import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { TextField, FormControlLabel, RadioGroup, Radio } from '@mui/material';
//import EditIcon from "@mui/icons-material/Edit";
//import Pagination from "@mui/material/Pagination";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import axios from "axios";

// Mapeo de etiquetas a valores
const notas = [
  { label: "Muy Malo", value: "1" },
  { label: "Malo", value: "2" },
  { label: "Regular", value: "3" },
  { label: "Bueno", value: "4" },
  { label: "Muy Bueno", value: "5" },
];

const PaginaEncuestaDocente = () => {
  //const rowsPerPage = 7;
  //const [page, setPage] = useState(1); // Página actual (empezamos desde 1)
  const searchParams = useSearchParams();
  const idHorario = searchParams.get("idHorario");
  const idDocente = searchParams.get("idDocente");
  const [encuesta, setEncuesta] = useState(null);
  const [respuestas, setRespuestas] = useState({});
  const [docente, setDocente] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/preguntas/encuesta/listarEncuestasProfesor/${idDocente}`
        );
        const encuestas = response.data;
        console.log("Encuestas:", response.data);
        if(encuestas){
          const encuestaFiltrada = encuestas.reverse().find(e => e.activo === true);
          setEncuesta(encuestaFiltrada);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.warn(`No se encontraron encuestas`);
          return []; // Retorna un array vacío si no hay encuestas
        } else {
          console.error(`Error al cargar encuestas:`, error);
          throw error; // Propaga otros errores
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [idDocente]);

  useEffect(() => {
    const fetchDataDocente = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/rrhh/docente/buscarPorId/${idDocente}`
        );
        console.log("Docente:", response.data);
        setDocente(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.warn(`No se encontraron docentes`);
          return [];
        } else {
          console.error(`Error al cargar docentes:`, error);
          throw error;
        }
      }
    };
    fetchDataDocente();
  }, [idDocente]);

  {/*
  const handleChangePage = (event, value) => {
    setPage(value);
  };
  */}

  // Maneja los cambios en las respuestas
  const handleRespuestaChange = (preguntaId, value) => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaId]: value
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);  // Crea un objeto Date a partir de la fecha ISO
    return date.toLocaleDateString('es-ES');  // Convierte la fecha al formato español (día/mes/año)
  };

  // Función para manejar la acción de guardar
  const handleSave = async () => {
    try {
      for (const [preguntaId, respuesta] of Object.entries(respuestas)) {
        if(respuesta){
          console.log(preguntaId);
          console.log(respuesta);
          await axios.post("http://localhost:8080/preguntas/pregunta/insertarRespuestaDocente",
            respuesta, // Enviar respuesta como "body"
            {
            params: {
              preguntaId: preguntaId,
              docenteId: idDocente
            },
            headers: {
              'Content-Type': 'text/plain',
            },
          });
        }
      }
      alert('Encuesta guardada');
      router.back();
    } catch (error) {
      console.error("Error al guardar respuestas:", error);
      alert('Ocurrió un error al guardar la encuesta');
    }
  };

  if(loading) return ;

  if(!encuesta){
    return <Box sx={{ marginLeft: '220px', marginTop: '40px', padding: '40px' }}>
      <Typography variant="h6">No se encontraron encuestas en curso.</Typography>
    </Box>
  }

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
          {encuesta.titulo}
        </Typography>
        
        <Box>
          {docente && 
            <Typography> <strong>Nombre del Docente:</strong> {`${docente.nombre} ${docente.apellidoPaterno} ${docente.apellidoMaterno}`} </Typography>
          }
          <Typography> <strong>Duración de la Encuesta:</strong> {`Del ${formatDate(encuesta.fechaInicio)} al ${formatDate(encuesta.fechaFin)}`} </Typography>
          <hr style={{ border: 'none', height: '2px', backgroundColor: '#39298b', margin: '20px 0' }} />
        </Box>

        {encuesta.preguntas.map((pregunta, index) => (
          <Box key={pregunta.id_Pregunta}>
            <Typography variant="h6" sx={{ color: '#363581', mb: '10px' }}> Pregunta #{index + 1}: </Typography>
            <p>{pregunta.descripcion}</p>
            {pregunta.tipo === "OpcionMultiple" ? (
              <Box sx={{marginTop: '10px'}}>
                <RadioGroup
                  row
                  name="nota"
                  value={respuestas[pregunta.id_Pregunta]? respuestas[pregunta.id_Pregunta] : null}
                  onChange={(e) => handleRespuestaChange(pregunta.id_Pregunta, e.target.value)}
                >
                  {notas.map((nota) => (
                    <FormControlLabel
                      key={nota.value}
                      value={nota.value}
                      control={<Radio />}
                      label={nota.label}
                    />
                  ))}
                </RadioGroup>
              </Box>
            ) : (
              <Box sx={{marginTop: '10px', maxWidth: '1000px'}}>
                <TextField
                  placeholder="Escriba su respuesta aquí..."
                  multiline
                  rows={6}
                  value={respuestas[pregunta.id_Pregunta] || ''}
                  onChange={(e) => handleRespuestaChange(pregunta.id_Pregunta, e.target.value)}
                  sx={{ width: '100%'}}
                />
              </Box>
            )}
            <hr style={{ border: 'none', height: '2px', backgroundColor: '#39298b', margin: '20px 0' }} />
          </Box>
        ))}

        {/* Paginación */}
        {/*
        <div style={{ marginTop: '20px' }}>
          <button disabled style={{ marginRight: '10px' }}>Prev</button>
          <button style={{ marginRight: '10px' }}>1</button>
          <button>2</button>
          <button>3</button>
          <button style={{ marginLeft: '10px' }}>Next</button>
        </div>
        */}
        
        <Box sx={{padding: '20px', display: 'flex', flexDirection: 'row', justifyContent: "flex-end" }}>
          
          <Button sx={{ width: '220px'}}
            variant="outlined" onClick={() => router.back()}>
              Regresar
          </Button>

          <Button sx={{ width: '220px', backgroundColor: "#363581", color: "#FFFFFF", ml:4}}
            variant="outlined" onClick={handleSave}>
              Guardar
          </Button>
          
        </Box>
      </Box>
    </Box>
  );
};

export default PaginaEncuestaDocente;