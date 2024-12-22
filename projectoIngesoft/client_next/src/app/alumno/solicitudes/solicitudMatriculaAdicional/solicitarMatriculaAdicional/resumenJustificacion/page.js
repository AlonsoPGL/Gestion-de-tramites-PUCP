
"use client";
import { Button, Typography, Box, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TablaResumenCursosSeleccionados from '../../../../../../../componentesAlumno/solicitudMatriculaAdicional/TablaResumenCursosSeleccionados';
import EstaSeguroAccion from '../../../../../../../componentesGenerales/modales/EstaSeguroAccion';
import { useCursosAdicionales } from '@/app/CursosAdicionalesContext';
import { usePersona } from "@/app/PersonaContext";
import { useRol } from '@/app/RolContext';
import { useUnidad } from "@/app/UnidadContex";

const ColorButton = styled(Button)(({ theme }) => ({
    //color: theme.palette.getContrastText(purple[500]),
    backgroundColor: '#363581',
    '&:hover': {
      backgroundColor: '#5D71BC',
    },
  }));

export default function ResumenJustificacion() {
  

  const [openLocal, setOpen] = useState(false);
  const { unidad } = useUnidad();
  const handleOpen = () =>{
    /*if(justificacion===""){
      console.log("Error debe agregar una justificacion"); //Esto deberia mostrarse como un mensaje en el front o helpText del textBox
      setHayError(true);
    }else{
      setHayError(false);
      setOpen(true);
    }*/
   if(hayError===false)setOpen(true);
  }
  const handleClose = () => setOpen(false);

  //!Datos recibidos desde la pagina anterior (seleccion de cursos/horarios checkboxes)
  const {cursosAdicionales} =useCursosAdicionales();

  useEffect(() => {
    // Se ejecuta cuando los datos de cursosAdicionales cambien
    if (cursosAdicionales.length > 0) {
      console.log('Cursos cargados:', cursosAdicionales);
    }
  }, [cursosAdicionales]);  // Se ejecuta cuando cursosAdicionales cambia
  
  const router=useRouter();

  // Para validar que el campo de justificacion este lleno
  const [justificacion, setJustificacion] = useState('');
  const [hayError,setHayError]=useState(false);

  //! Validaciones con handle
  const handleCambioTexto = (nuevoValor)=>{
    setJustificacion(nuevoValor);
    
    if(nuevoValor===""){
      console.log("Error debe agregar una justificacion"); //Esto deberia mostrarse como un mensaje en el front o helpText del textBox
      console.log(rol);
      setHayError(true);
    }else{
      setHayError(false);
    }
  };

  //! Insercion de la solicitud y redireccionamiento a pagina de listado
  const { persona } = usePersona(); //obteniendo los datos de la persona
  const { rol } = useRol();

  const redirigirPaginaSolicitudes = async () => {
    // Extraer los idHorario en un nuevo array
    const horariosSolicitados = cursosAdicionales.flatMap(curso => 
      curso.horarios.map(horario => horario.idHorario)
    );
  
    const horariosSolicitadosFormateados = horariosSolicitados.map(idHorario => ({ idHorario }));
  
    // Creando la solicitud
    const solicitudData = {
      solicitud: {
        emisor: {
          id: persona.id // Cambia este valor según el ID del emisor
        },
        fechaCreacion: new Date().toISOString(), // Fecha de creación actual
        correo: persona.email, // Correo del emisor
        motivo: justificacion, // Motivo de la solicitud
        estado: "EN_PROCESO", // Estado de la solicitud
        tipo: "SOLICITUD_MATRICULA" // Tipo de solicitud
      },
      solicitudMatricula: {
        codigoAlumno: persona.codigo, // Código del alumno
        correo: persona.email, // Correo del alumno
        motivoSolicitud: justificacion, // Motivo de la solicitud de matrícula
        nombreAlumno: `${persona.nombre} ${persona.apellidoPaterno}`, // Nombre del alumno
        especialidad: {
          id: unidad.idUnidad // ID de la especialidad
        },
        horariosSolicitados: horariosSolicitadosFormateados // Asignar el array formateado aquí
      }
    };
  
    console.log(solicitudData);
  
    try {
      const response = await fetch('http://localhost:8080/solicitudes/matricula/insertar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(solicitudData), // Convertir el objeto a JSON
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const text = await response.text(); // Obtén la respuesta como texto
      //console.log('Respuesta del servidor:', text); // Imprime la respuesta
  
      // Redirigir a la página de listado de solicitudes
      router.push('../listadoDeSolicitudesAdicionales');
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
    }
  };
  

  const imprimeCurso = () =>{
    console.log(cursosAdicionales);
    console.log("hoola");
  };
  
    return (
        <Box sx={{ backgroundColor: 'white', color: 'white', height: '100vh',marginBottom:'20px' }}>
            <Box
            sx={{
                marginLeft: '220px',
                height: '100vh',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
            }}
            >
                <Box>
                <Typography variant="h4" sx={{ marginLeft:'20px', fontWeight: '', color: 'black' }}>Solicitud de Matricula Adicional</Typography>
                </Box>
                <Box sx={{display:'flex'}}>
                <Typography variant="h6" sx={{ marginLeft:'20px', marginTop:'20px',fontWeight: '', color: 'black' ,fontWeight:'bold'}}>Cursos seleccionados</Typography>
                <Typography variant='h6' >Fecha:</Typography>
                </Box>

                <Box sx={{marginLeft:'20px',marginRight:'20px', marginTop:'10px'}}>
                    <TablaResumenCursosSeleccionados cursosSeleccionados={cursosAdicionales}></TablaResumenCursosSeleccionados>
                </Box>

                <Box>
                    <Typography variant="h6" sx={{ marginLeft:'20px', marginTop:'20px',fontWeight: '', color: 'black' ,fontWeight:'bold'}}>Justificacion de matricula adicional *</Typography>
                </Box>

                <Box sx={{ margin: '20px',marginTop:'5px',marginBottom:'5px'}}>
                    <TextField
                        label="Ingrese su justificación"
                        multiline
                        rows={7} // Número de filas visibles
                        variant="outlined"
                        error={hayError}
                        helperText={hayError ? "Este campo es obligatorio." : ""}
                        fullWidth // Ancho completo
                        inputProps={{ maxLength: 1000 }} // Limita a 1000 caracteres
                        sx={{ 
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px', // Personaliza el borde si es necesario
                        }
                        }}
                        //Datos para validar que el textField tenga informacion
                        value={justificacion}
                        onChange={(e) => {
                          //setJustificacion(e.target.value);
                          const nuevoValor=e.target.value;
                          handleCambioTexto(nuevoValor);
                        }}
                    />
                    {/*<form noValidate autoComplete="off">
                      <FormControl sx={{ width: '25ch' }}>
                        <OutlinedInput placeholder="Please enter text"/>
                        <MyFormHelperText />
                      </FormControl>
                    </form>*/}
                </Box>
                <Box display="flex" justifyContent="flex-end" mt={1} sx={{marginRight:'20px'}}>
                    <Button variant="outlined" sx={{position:'end', marginRight:'20px'}} onClick={() => router.back()}>Regresar</Button>
                    <ColorButton variant="contained" onClick={handleOpen}>Confirmar</ColorButton> 
                    <EstaSeguroAccion open={openLocal} onClose={handleClose} handleAceptar={redirigirPaginaSolicitudes}></EstaSeguroAccion>
                    {/*<Button onClick={imprimeCurso}>Pruebita</Button>*/}
                </Box>        
            </Box>
        </Box>
    );
}
