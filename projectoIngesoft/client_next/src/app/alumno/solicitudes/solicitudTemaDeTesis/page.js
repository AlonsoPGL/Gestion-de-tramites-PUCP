"use client";

import { Box, Typography, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';


export default function SolicitudTemaDeTesis() {
  //! Creacion de circulos de paso 1,2,3 con colores rojo, amarillo y verde en caso sean observados, en revision o aceptados
  const rojo="#eb6960";
  const amarillo="#f0d360";
  const verde="#83cc84";
  const gris="#b5b5b5";
  const [colorCirculo,setColorCirculo]=useState([gris,gris,gris]);

  const [mensajeEstado,setMensajeEstado]=useState("Enviado al Asesor para su revisión");

  //const [solicitudEnviada,setSolicitudEnviada]=useState(false);
  const [updateColor,setUpdateColor]=useState([]);

  let updateColorAux;

  //!Para redireccionar a la visualizacion
  //const { id } = router.query; // Obtener el 'id' de la query string

  const router=useRouter();
  const redirectVisualizar= () =>{
    router.push(`./solicitudTemaDeTesis/visualizar?id=${id}`);
  };

  //!Obteniendo el estado actual de la solicitud enviada
  const [estadoSolicitud,setEstadoSolicitud]=useState("");
  const searchParams = useSearchParams(); // Obtener los parámetros de búsqueda

  const id = searchParams.get('id'); // Obtener el parámetro 'id' de la URL

  const fetchEstado = async () => {
    try {
      const response = await fetch(`http://localhost:8080/solicitudes/solicitudTemaTesis/buscarEstadoSolicitud/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener el estado de la solicitud');
      }
      const data = await response.json();
      if (data) {
        setEstadoSolicitud(data);
      } else {
        setEstadoSolicitud(null); // Si no se encontró, establece solicitud como null
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    // Llama a fetchEstado al montar el componente
    fetchEstado();
  }, [id]);

  const actualizarColoresMensaje = (color, mensaje) => {
    const updateColorAux = color;
    setUpdateColor(updateColorAux);
    setColorCirculo(updateColorAux);
    setMensajeEstado(mensaje);
  };

  // Escuchar cambios en estadoSolicitud para ver el valor actualizado
  useEffect(() => {
    console.log("Estado de la solicitud:", estadoSolicitud);
    switch (estadoSolicitud) {
      case "EN_REVISION_POR_ASESOR":
        actualizarColoresMensaje([amarillo, gris, gris], "Enviado al Asesor para su revisión");
        break;
      case "OBSERVADO_POR_ASESOR":
        actualizarColoresMensaje([rojo, gris, gris], "Observado por el Asesor durante la revisión");
        break;
      case "EN_REVISION_POR_COORDINADOR":
        actualizarColoresMensaje([verde, amarillo, gris], "Enviado al Coordinador para su revisión");
        break;
      case "OBSERVADO_POR_COORDINADOR":
        actualizarColoresMensaje([verde, rojo, gris], "Observado por el Coordinador durante la revisión");
        break;
      case "EN_REVISION_POR_DIRECTOR":
        actualizarColoresMensaje([verde, verde, amarillo], "Enviado al Director de Carrera para su revisión");
        break;
      case "OBSERVADO_POR_DIRECTOR":
        actualizarColoresMensaje([verde, verde, rojo], "Observado por el Director de Carrera durante la revisión");
        break;
      case "APROBADA":
        actualizarColoresMensaje([verde, verde, verde], "Su solicitud ha sido aprobada con éxito :D");
        break;
      default:
        break;
    }
  }, [estadoSolicitud]);

  //!En caso la solicitud haya sido rechazada en alguno de los pasos el sistema debe permitir registrar una nueva solicitud
  const [mostrarBotonRegistro, setMostrarBotonRegistro] = useState(false); // Nuevo estado para controlar el botón

  useEffect(() => {
    const hayRojo = updateColor.includes(rojo);
    setMostrarBotonRegistro(hayRojo); // Actualizar el estado del botón
  }, [updateColor]);

  const handleRedirectRegistro = () =>{
    router.push('./solicitudTemaDeTesis/registrar');
  }

  return (
    <Box sx={{ backgroundColor: 'white', color: 'black', height: '100vh' }}>
        <Box
          sx={{
            marginLeft: '220px',
            height: '100vh',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant='h4'>Estado de la solicitud de tema de tesis</Typography>

          <Box sx={{display:'flex',justifyContent:'center',marginTop:'50px'}}>
            <Box sx={{display:'flex',justifyContent:'center',
              alignItems:'center', width:'60px', height:'60px', 
              borderRadius:"800px",borderColor:'black',border:"1px solid ",backgroundColor:colorCirculo[0] ,
              marginRight:'200px'}}>
              <Typography sx={{fontSize:'35px'}}>1</Typography>
            </Box>

            <Box sx={{display:'flex',justifyContent:'center',
              alignItems:'center', width:'60px', height:'60px', 
              borderRadius:"800px",borderColor:'black',border:"1px solid ",backgroundColor:colorCirculo[1] }}>
              <Typography sx={{fontSize:'35px'}}>2</Typography>
            </Box>

            <Box sx={{display:'flex',justifyContent:'center',
              alignItems:'center', width:'60px', height:'60px', 
              borderRadius:"800px",borderColor:'black',border:"1px solid ",backgroundColor:colorCirculo[2] ,
              marginLeft:'200px'}}>
              <Typography sx={{fontSize:'35px'}}>3</Typography>
            </Box>
          </Box>

          <Box sx={{margin:'100px',display:'flex',justifyContent:'center',
              alignItems:'center'}}>
            <Typography variant='h3'>{mensajeEstado}</Typography>
          </Box>
          
          <Button variant="contained" onClick={redirectVisualizar}>
            Visualizar detalle de la solicitud enviada
          </Button>

          {mostrarBotonRegistro && ( // Renderizar el botón solo si hay rojo en el arreglo
          <Button variant="contained" onClick={handleRedirectRegistro} sx={{marginTop:'20px'}}>
            Registrar nueva solicitud
          </Button>
        )}
        </Box>

      
    </Box>
  );
}
