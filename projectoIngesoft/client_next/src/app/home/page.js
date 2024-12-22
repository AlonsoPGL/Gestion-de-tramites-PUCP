"use client";
import { Container, Typography } from "@mui/material";
import BarraLateral from "../../../componentesHome/BarraLateral";
import CarouselHome from "../../../componentesHome/CarouselHome";
import { Box } from '@mui/material';
import { usePersona } from '../PersonaContext';
import { useInstitucion } from "../InstitucionContext";
import { useUnidad } from '../UnidadContex'; 
//Esta pagina no deberia renderizarse si el usuario no esta logueado, tal vez salte un error de acceso o web mejor

//Esta pagina se deberia renderizar segun el unidad o bueno su barra lateral
export default function Home() {

  const { unidad } = useUnidad();
  const { persona } = usePersona();
  const {institucion}=useInstitucion();

  if (!persona) {
    return <div>Acceso denegado. Debes estar logueado.</div>;
  }else{
    console.log(persona.id);
    console.log("idROL",unidad.idRol);
    console.log("idUnidad",unidad.idUnidad);
  }
  return (
    <>
      {/* Verificamos si persona está definida y pasamos el idPersona a la barra lateral */}
      <BarraLateral idPersona={persona.id} idRol={unidad.idRol} />
 
      <Box
        sx={{
          marginLeft: '220px', // Ajusta según el ancho de tu barra lateral
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" sx={{mb:'20px'}}>
          {institucion.nombre}
        </Typography>

        <Container>
          <CarouselHome />
        </Container>
        
      </Box>
  </>
  );
}
