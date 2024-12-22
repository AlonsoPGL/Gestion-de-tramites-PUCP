"use client";
import { useEffect, useState } from 'react';
import { Typography, TextField, Button, Box, Grid } from '@mui/material';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { usePersona } from '@/app/PersonaContext';
import CardMenu from "componentesGenerales/cards/CardMenu";
import EstaSeguroAccion from 'componentesGenerales/modales/EstaSeguroAccion';
import ErrorConDescripcion from 'componentesGenerales/modales/ErrorConDescripcion';
export default function registrarPuntuacion() {
    const router = useRouter();
    const { persona } = usePersona();
    const [nombrePostulante,setNombrePostulante] = useState("")
    const [correoPostulante,setCorreoPostulante] = useState("")
    const [observaciones,setObservaciones] = useState("");
    const [criteriosPostulacion,setCriteriosPostulacion] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalErrorOpen, setModalErrorOpen] = useState(false);
    const [apruebaTodo,setApruebaTodo] = useState(true)
    const searchParams = useSearchParams(); // Obtener los parámetros de búsqueda
    const id = searchParams.get('id'); // Obtener el parámetro 'id' de la URL
    useEffect(() => {
        if (id) {
            const fetchPostulacion = async () => {
            try{
                const response = await fetch(`http://localhost:8080/postulaciones/${id}`)
                const data = await response.json();
                console.log('Datos obtenidos:', data);
                setNombrePostulante(data.nombrePostulante + " " + data.apelidoMaternoPostulante + " " + data.apelidoPaternoPostulante);
                setCorreoPostulante(data.correo);
                setCriteriosPostulacion(data.procesoDeSeleccion.criteriosSeleccion)
            } catch (error){
                console.error('Error al obtener la solicitud:', error);
            }
        };
        fetchPostulacion();
    }
      },[id])

/*      useEffect(() => {
        if (persona?.id) { // Solo se ejecuta si persona.id está definido
        console.log('Id de persona:',persona.id);
        const fetchCriterios = async () => {
          try{
            const response = await fetch(`http://localhost:8080/criterios/proceso-activo`)
            const data = await response.json();
            console.log('Datos obtenidos:', data);
            setCriteriosPostulacion(data);
          } catch (error){
            console.error('Error al obtener las solicitudes:', error);
          }
  
        };
        fetchCriterios();
      }
      },[])*/
    // Estado para almacenar los valores de cada criterio
    const [puntuaciones, setPuntuaciones] = useState(
        criteriosPostulacion.reduce((acc, criterio) => {
            acc[criterio.nombre] = ""; // Inicializamos cada puntuación como una cadena vacía
            return acc;
        }, {})
    );

    // Estado para almacenar el arreglo combinado
    const [criteriosConPuntuaciones, setCriteriosConPuntuaciones] = useState([]);

    // Actualizar el arreglo combinado cada vez que cambie puntuaciones
    useEffect(() => {
        const nuevosCriteriosConPuntuaciones = criteriosPostulacion.map(criterio => ({
            ...criterio,
            puntuacion: puntuaciones[criterio.nombre] || 0 // Si no hay valor, usar 0 por defecto
        }));
        setCriteriosConPuntuaciones(nuevosCriteriosConPuntuaciones);
    }, [puntuaciones]);
//Para verificar que se ha aprobado todo
    useEffect(() => {
        const cumplePuntajeMinimo = criteriosPostulacion.every(criterio => {
            const puntos = puntuaciones[criterio.nombre] || 0;
            return puntos >= criterio.maximo_puntaje * 0.55;
        });
        setApruebaTodo(cumplePuntajeMinimo);
    }, [puntuaciones, criteriosPostulacion]);
    // Función para manejar cambios en cada campo de texto
    const handlePuntuacionChange = (nombre, valor, maximo_puntaje) => {
        if (valor === "" || (!isNaN(valor) && valor >= 0 && valor <= maximo_puntaje)) {
            setPuntuaciones((prevPuntuaciones) => ({
                ...prevPuntuaciones,
                [nombre]: valor === "" ? "" : parseInt(valor, 10) // Convertir el valor a número o mantener la cadena vacía
            }));
        }
    };

    const guardarCalificaciones = async () => {
        const calificaciones = criteriosPostulacion.map(criterio => ({
            criterio: { id: criterio.id },
            postulacion: { id: id },
            puntos: puntuaciones[criterio.nombre] || 0,
            fechaCreacion: new Date().toISOString()
        }));
        const sumaPuntuacionesIntroducidas = criteriosPostulacion.reduce(
            (acc, criterio) => acc + (puntuaciones[criterio.nombre] || 0),
            0
        );


        try {
            const response = await fetch(`http://localhost:8080/calificaciones/registrarListado`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(calificaciones)
            });
            const nuevoEstado = "PASO_SEGUNDO_FILTRO";
            console.log(nuevoEstado)

            await axios.put(`http://localhost:8080/postulaciones/${id}/actualizarPuntuacionPostulacion`, null, {
                params: {
                    nuevoPuntaje: sumaPuntuacionesIntroducidas,
                    nuevoEstado: nuevoEstado,
                    nuevaObservacion: observaciones
                },
              });   
            if (response.ok) {
                const data = await response.json();
                console.log('Calificaciones guardadas:', data);
                alert('Calificaciones registradas exitosamente');
                router.push('.'); // Redirigir o actualizar la página según el flujo de la aplicación
            } else {
                console.error('Error al guardar las calificaciones');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    };


    const verificarPuntuacionesCompletas = () => {
        // Verificar si todos los criterios tienen una puntuación asignada
        return criteriosPostulacion.every(criterio => puntuaciones[criterio.nombre] !== "" && puntuaciones[criterio.nombre] !== undefined);
    };
    
    const manejarGuardar = () => {
        if (verificarPuntuacionesCompletas()) {
            setModalOpen(true); // Abre el modal de confirmación
        } else {
            setModalErrorOpen(true); // Abre el modal de error
        }
    };

    const handleObservacionChange = (event) => {
        setObservaciones(event.target.value);
      };    
    return (
        <Box sx={{ backgroundColor: 'white', color: 'white', height: '100vh' }}>
            <Box
                sx={{
                    height: '100vh',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box>
                    <Typography variant="h4" sx={{ marginLeft:'220px', marginTop:'30px', fontWeight: '', color: 'black' }}>
                        APROBACIÓN DE SEGUNDO FILTRO
                    </Typography>
                </Box>

                <CardMenu>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography sx={{ flex: `0 1 30%`, textAlign: 'left', alignSelf: 'flex-start' }}>
                    Nombre:
                </Typography>
                <TextField
                variant="outlined"
                type="text"
                disabled
                value= {nombrePostulante}
                sx={{
                flex: '1',
                backgroundColor: 'white',
                
                '& .MuiOutlinedInput-root': {
                    height: '30px',
                    width: '100%',
                    borderRadius: 2,
                }
                }}
                >
                </TextField>
      
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Typography sx={{ flex: `0 1 30%`, textAlign: 'left', alignSelf: 'flex-start' }}>
                    Correo:
                </Typography>
                <TextField
        variant="outlined"
        type="text"
        disabled
        value= {correoPostulante}
        sx={{
          flex: '1',
          backgroundColor: 'white',
         
          '& .MuiOutlinedInput-root': {
            height: '30px',
            width: '100%',
            borderRadius: 2,
          }
        }}
      >
      </TextField>

      </Box>
      
                    <Box sx={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', maxWidth: '2000px', margin: '0 auto',
                                                        borderTop: '10px solid #363581', // borde superior más grueso
                                                        borderBottom: '10px solid #363581', // borde inferior más grueso
                                                        borderLeft: '4px solid #363581', // borde izquierdo más delgado
                                                        borderRight: '4px solid #363581', // borde derecho más delgado
                                                        minWidth: '800px'
                     }}>
                    <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold', mb: 2 }}>
                    CALIFICACIÓN
                </Typography>
                        {criteriosPostulacion.map((criterio, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px'

                            }}>
                                <Typography sx={{ flex: 1, fontWeight: 'bold', color: '#2f2f2f',minWidth: '400px' }}>
                                    Puntuación sobre {criterio.nombre}:
                                </Typography>
                                <TextField
                                    type="number"
                                    variant="outlined"
                                    size="small"
                                    sx={{ width: '60px' }}
                                    inputProps={{ min: 0, max: criterio.maximo_puntaje }}
                                    value={puntuaciones[criterio.nombre] || ""} // Aseguramos un valor predeterminado
                                    onChange={(e) => handlePuntuacionChange(criterio.nombre, e.target.value, criterio.maximo_puntaje)}
                                
                                />
                                <Typography sx={{ fontWeight: 'bold', color: '#2f2f2f',minWidth: '40px' }}>
                                    /{criterio.maximo_puntaje}
                                </Typography>
                            </Box>
                        ))}
                    </Box>    
                    <Grid item xs={3}>
                    <Typography variant="body1" sx={{ color: 'black', fontWeight: 'bold',marginBottom: '32px',marginTop: '30px' }}>Comentarios:</Typography>
                </Grid>
                                        <Grid item xs={9}>
                    <TextField fullWidth multiline rows={4} value={observaciones} onChange={handleObservacionChange} sx={{marginBottom: '32px'}} />
                </Grid>                                    
                </CardMenu>

                <Box display="flex" justifyContent="space-between" mt={1} sx={{ width: '1000px',marginLeft:'300px' }}>
                    <Button variant="outlined" sx={{ position:'end', marginRight:'' }} onClick={() => router.back()}>Regresar</Button>

                    <Button sx={{ backgroundColor: '#363581' }} variant="contained" color="primary" onClick={manejarGuardar}>
                        Guardar
                    </Button>
                </Box>
                        <EstaSeguroAccion
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                texto={`¿Está seguro de registrar las puntuaciones?`}
                handleAceptar={guardarCalificaciones}
            />
                    <ErrorConDescripcion 
          texto="Error: No se han registrado todas las puntuaciones" 
          open={modalErrorOpen} 
          onClose={() => setModalErrorOpen(false)} 
        />
            </Box>
        </Box>
    );
}