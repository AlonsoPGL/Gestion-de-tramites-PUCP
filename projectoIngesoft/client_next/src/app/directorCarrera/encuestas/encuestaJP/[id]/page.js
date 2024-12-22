"use client";
import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, TextField, CircularProgress } from "@mui/material";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

// Mapeo de etiquetas a valores
const notas = [
  { label: "Muy Malo", value: "1" },
  { label: "Malo", value: "2" },
  { label: "Regular", value: "3" },
  { label: "Bueno", value: "4" },
  { label: "Muy Bueno", value: "5" },
];

const PaginaEncuestaJP = () => {
  const surveyPerPage = 1; // Encuestas por página
  const [page, setPage] = useState(1); // Página actual (empezamos desde 1)
  const textPerPage = 1; // Respuestas por página
  const [textPages, setTextPages] = useState({}); // Paginado independiente por pregunta
  const params = useParams();
  const idJP = params.id;
  const [encuestas, setEncuestas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingAnswers, setLoadingAnswers] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEncuestas = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/preguntas/encuesta/listarEncuestasJP/${idJP}`
        );
        console.log("Encuestas:", response.data);
        const encuestasData = response.data;
        
         // Filtra las encuestas de tipo "DOCENTE"
        const encuestasDataFiltrada = encuestasData.filter(e => e.tipo === "JP" && e.activo === true);
        
        // Verifica que existan encuestas antes de continuar
        if (encuestasDataFiltrada.length > 0) {
          setEncuestas(encuestasDataFiltrada);
          cargarRespuestas(encuestasDataFiltrada);
        } else {
          console.warn("No se encontraron encuestas de tipo JP.");
          setEncuestas([]); // Vacía el estado si no hay encuestas disponibles
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.warn(`No se encontraron encuestas`);
        } else {
          console.error(`Error al cargar encuestas`, error);
          throw error; // Propaga otros errores
        }
      }
      setLoading(false);
    };

    const cargarRespuestas = async (encuestasData) => {
      try {
        const respuestasPromises = encuestasData.map(async (encuesta) => {
          try {
            const res = await axios.get(
              `http://localhost:8080/preguntas/pregunta/listarTodasLasRespuestasJp/${idJP}/${encuesta.id_Encuesta}`
            );
            return res.data; // Retorna los datos si la solicitud es exitosa
          } catch (error) {
            if (error.response && error.response.status === 404) {
              console.warn(`No se encontraron respuestas para la encuesta ${encuesta.id_Encuesta}`);
              return []; // Retorna un array vacío si no hay respuestas
            } else {
              console.error(`Error al cargar respuestas para la encuesta ${encuesta.id_Encuesta}:`, error);
              throw error; // Propaga otros errores
            }
          }
        });
    
        const respuestasData = await Promise.all(respuestasPromises);
        const respuestasMap = {};
    
        // Procesa solo las respuestas existentes
        respuestasData.flat().forEach(({ pregunta, respuesta }) => {
          if (!respuestasMap[pregunta.id_Pregunta]) {
            respuestasMap[pregunta.id_Pregunta] = [];
          }
          respuestasMap[pregunta.id_Pregunta].push(respuesta);
        });
    
        setRespuestas(respuestasMap);
        console.log("RespuestasMap", respuestasMap);
      } catch (error) {
        console.error("Error general al cargar las respuestas:", error);
      }
      setLoadingAnswers(false);
    };

    fetchEncuestas();
  }, [idJP]);

  const handleChangeSurveyPage = (event, value) => setPage(value);
  const handleChangeTextPage = (idPregunta, event, value) => {
    setTextPages((prev) => ({
      ...prev,
      [idPregunta]: value, // Actualiza la página para la pregunta específica
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);  // Crea un objeto Date a partir de la fecha ISO
    return date.toLocaleDateString('es-ES');  // Convierte la fecha al formato español (día/mes/año)
  };

  if (loading) return ;

  const encuestaActual = encuestas[(page - 1) * surveyPerPage];

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
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#39298b', mb: '20px' }}>
          Resultados del Jefe de Práctica en las Encuestas
        </Typography>
        
        {encuestaActual ? (
          <div>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1}}>{encuestaActual.titulo}</Typography>
            <Box>
              <Typography> <strong>Duración de la Encuesta:</strong> {`Del ${formatDate(encuestaActual.fechaInicio)} al ${formatDate(encuestaActual.fechaFin)}`} </Typography>
              <hr style={{ border: 'none', height: '2px', backgroundColor: '#39298b', margin: '20px 0' }} />
            </Box>
            <Box sx={{mb: 2}}>
              <Typography sx={{ color: '#39298b', fontWeight: 'bold' }}>Listado de Preguntas y Respuestas:</Typography>
            </Box>

            {loadingAnswers ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '10px' }}>
                <CircularProgress />
              </Box>
            ) : (
              encuestaActual.preguntas.map((pregunta) => (
                <div key={pregunta.id_Pregunta}>
                  <Box sx={{ display: "flex", flexFlow: 'column' }}>
                    <Typography variant="h6" sx={{ color: '#39298b' }}>Pregunta #{pregunta.numeracion}:</Typography>
                    <Typography>{pregunta.descripcion}</Typography>
                  </Box> 
                  {pregunta.tipo === "OpcionMultiple" ? (
                    <div>
                      {respuestas[pregunta.id_Pregunta] ? (
                        <div>
                          <Typography sx={{ fontStyle:'italic', mt: 2, mb: 1 }}>
                            Conteo de Respuestas:
                          </Typography>
                          <TableContainer component={Paper} sx={{ maxWidth: '1000px', borderRadius: '10px' }}>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  {notas.map(nota => (
                                    <TableCell sx={{ backgroundColor: '#363581', color: 'white' }} key={nota.value} align="center">{nota.label}</TableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  {["1", "2", "3", "4", "5"].map(opcion => (
                                    <TableCell key={opcion} align="center">
                                      {respuestas[pregunta.id_Pregunta]?.filter(resp => resp === opcion).length || 0}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </div>
                      ) : (
                        <Typography sx={{ fontStyle:'italic', mt:2, mb:2 }}>
                          No se registraron respuestas para esta pregunta.
                        </Typography>
                      )}
                    </div>
                  ) : (
                    <div>
                      {respuestas[pregunta.id_Pregunta] ? (
                        <div>
                          {respuestas[pregunta.id_Pregunta]?.slice(((textPages[pregunta.id_Pregunta] || 1) - 1) * textPerPage,
                            (textPages[pregunta.id_Pregunta] || 1) * textPerPage).map((respuesta, idx) => (
                            <Box key={idx} sx={{ maxWidth: '1000px', mt: 2, mb: 1 }}>
                              <TextField
                                multiline
                                value={respuesta}
                                InputProps={{
                                  readOnly: true,
                                  style: {
                                    backgroundColor: '#fafafa', // Fondo gris claro
                                    color: '#282828',           // Texto gris oscuro
                                  },
                                }}
                                sx={{ pointerEvents: 'none', width: '100%', borderRadius: '20px' }}
                              />
                            </Box>
                          ))}
                          <Pagination
                            count={Math.ceil((respuestas[pregunta.id_Pregunta]?.length || 0) / textPerPage)}
                            page={textPages[pregunta.id_Pregunta] || 1}
                            onChange={(event, value) => handleChangeTextPage(pregunta.id_Pregunta, event, value)}
                          />
                        </div>
                      ) : (
                        <Typography sx={{ fontStyle:'italic', mt:2, mb:2 }}>
                          No se registraron respuestas para esta pregunta.
                        </Typography>
                      )}
                    </div>
                  )}
                  <hr style={{ border: 'none', height: '2px', backgroundColor: '#39298b', margin: '20px 0' }} />
                </div>
              ))
            )}

            <Box sx={{ display: "flex", justifyContent: "flex-end", padding: "20px" }}>
              <Pagination
                count={Math.ceil(encuestas.length / surveyPerPage)} // Número total de páginas
                page={page} // Página actual
                onChange={handleChangeSurveyPage} // Manejador de cambio de página
                size="large"
                color="primary"
              />
            </Box>
          </div>
        ) : (
          <Typography variant="h6">No hay encuestas que mostrar.</Typography>
        )}

        <Box sx={{padding: '20px', display: 'flex', flexDirection: 'row', justifyContent: "flex-end" }}>
          
          <Button sx={{ width: '220px'}}
            variant="outlined" onClick={() => router.back()}>
              Regresar
          </Button>
          
        </Box>
      </Box>
    </Box>
  );
};

export default PaginaEncuestaJP;