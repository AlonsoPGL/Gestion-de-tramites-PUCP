"use client";
import { Box, Typography, TextField, Button } from '@mui/material';
import { useSearchParams, useRouter } from 'next/navigation'; // Asegúrate de importar useRouter
import { useEffect, useState } from 'react';
import Link from 'next/link';
import EstaSeguroAccion from '../../../../../componentesGenerales/modales/EstaSeguroAccion';
import { styled } from '@mui/material/styles';
import TablaResumenHorariosSeleccionados from '../../../../../componentesDirectorDeCarrera/matriculaAdicional/TablaResumenHorariosSeleccionados';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const ColorButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#363581',
  '&:hover': {
    backgroundColor: '#5D71BC',
  },
}));

export default function VisualizarSolicitud() {
  const searchParams = useSearchParams(); // Obtener los parámetros de búsqueda
  const id = searchParams.get('id'); // Obtener el parámetro 'id' de la URL
  const router = useRouter(); // Inicializa el enrutador

  const [solicitud, setSolicitud] = useState({}); // Cambiar a un objeto en lugar de un arreglo
  const [cursosAdicionales, setCursosAdicionales] = useState([]);
  const [openLocal, setOpen] = useState(false);  

  // Para validar que el campo de justificacion este lleno
  const [observacion, setObservacion] = useState(""); // Estado para la justificación
  const [hayError,setHayError]=useState(false);

  //! Validaciones con handle
  const handleCambioTexto = (nuevoValor)=>{
    setObservacion(nuevoValor);
    
    if(nuevoValor===""){
      console.log("Error debe agregar una justificacion"); //Esto deberia mostrarse como un mensaje en el front o helpText del textBox
      setHayError(true);
    }else{
      setHayError(false);
    }
  };

  const handleOpenRechazo = () =>{
   if(hayError===false){
    setNuevoEstado("RECHAZADA");
    setOpen(true);
   }
  }

  const handleOpenConfirmacion = () =>{
    if(hayError===false){
      setNuevoEstado("ACEPTADA");
      setOpen(true);
     }
   }

  const handleClose = () => setOpen(false);

  //! updateando la solicitud
  const [nuevoEstado,setNuevoEstado]=useState("");

  const agregarObservacionYCambiarEstado = async () => {
    const datos = {
      id: solicitud.emisor.id, // ID del emisor
      horariosId: solicitud.horariosSeleccionados.map(horario => horario.idHorario) // IDs de los horarios seleccionados
    };
    console.log(datos);
    try {
      const response = await fetch(`http://localhost:8080/solicitudes/matricula/solicitudMatricula/${id}?estado=${nuevoEstado}&observacion=${encodeURIComponent(observacion)}`, {
        method: 'PUT', // Cambia a POST si el endpoint espera POST
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos), // Cuerpo con el JSON
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar la solicitud');
      }
  
      console.log("Solicitud actualizada correctamente");
      router.push('./'); // Redirecciona a la página principal
    } catch (error) {
      console.error(error);
      alert(`El alumno ya se encuentra en este curso.`)
    }
  };

  useEffect(() => {
    const fetchSolicitud = async () => {
      if (id) {
        try {
          const response = await fetch(`http://localhost:8080/solicitudes/matricula/obtener/${id}`);
          if (!response.ok) {
            throw new Error('Error al obtener la solicitud');
          }
          const data = await response.json();
          setSolicitud(data); // Guarda la solicitud en el estado
          setCursosAdicionales(data.horariosSeleccionados); // Usar data en lugar de solicitud
          console.log(cursosAdicionales);
        } catch (err) {
          console.error(err); // Maneja cualquier error
        }
      }
    };

    fetchSolicitud(); // Llama a la función de fetch
  }, [id]); // El efecto depende del ID

  return (
    <Box sx={{ backgroundColor: 'white', height: '100vh', marginBottom: '20px' }}>
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
          <Typography variant="h4" sx={{ marginLeft: '20px', color: 'black' }}>
            Solicitud de Matricula Adicional
          </Typography>
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Typography variant="h6" sx={{ marginLeft: '20px', marginTop: '20px', color: 'black', fontWeight: 'bold' }}>
            Cursos seleccionados
          </Typography>
        </Box>

        <Box sx={{ marginLeft: '20px', marginRight: '20px', marginTop: '10px' }}>
          <TablaResumenHorariosSeleccionados horarioSeleccionado={cursosAdicionales} />
        </Box>

        <Box>
          <Typography variant="h6" sx={{ marginLeft: '20px', marginTop: '20px', color: 'black', fontWeight: 'bold' }}>
            Justificación de matrícula adicional
          </Typography>
        </Box>

        <Box sx={{ margin: '20px', marginTop: '5px', marginBottom: '5px' ,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <TextField
            label=""
            disabled
            multiline
            rows={7}
            variant="outlined"
            fullWidth
            inputProps={{ maxLength: 1000 }} // Limita a 1000 caracteres
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
              backgroundColor: "#EFEFEF"
            }}
            value={solicitud.motivo || ""} // Usa "" como valor por defecto
          />

          <KeyboardArrowRightIcon sx={{fontSize:'50px',color:'#c2c2c4'}}></KeyboardArrowRightIcon>

          <TextField
            label="Ingrese comentarios para el alumno"
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
            value={observacion}
            onChange={(e) => {
              //setJustificacion(e.target.value);
              const nuevoValor=e.target.value;
              handleCambioTexto(nuevoValor);
            }}
        />
        </Box>

        <Box display="flex" justifyContent="space-between" mt={1} sx={{ marginRight: '20px' ,marginLeft:'20px'}}>
          <Button variant="outlined" sx={{ position: 'start', marginRight: '20px' }} onClick={() => router.back()}>Regresar</Button>

          <Box>
            <ColorButton variant="contained" onClick={handleOpenRechazo}>Rechazar</ColorButton>
            <ColorButton sx={{marginLeft:'20px'}} variant="contained" onClick={handleOpenConfirmacion}>Aceptar</ColorButton>
            <EstaSeguroAccion open={openLocal} onClose={handleClose} handleAceptar={agregarObservacionYCambiarEstado} />
            {/*<Button onClick={imprimirHorariosSesiones}>Pruebita</Button>*/}
          </Box>
          
        </Box>
      </Box>
    </Box>
  );
}
