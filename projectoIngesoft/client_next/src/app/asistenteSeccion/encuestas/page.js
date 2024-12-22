// MENU DE ENCUESTAS
"use client";
import { useRouter } from 'next/navigation';
import BotonMenu from "../../../../componentesGenerales/botones/BotonMenu";
import CardMenu from "../../../../componentesGenerales/cards/CardMenu";

function MenuEncuestas() {
    const router = useRouter();  

    // Función para manejar el clic y redirigir a una página
    const redirectGestionEncuestaDocente=()=>{
      router.push('./encuestaDocente/gestionEncuestaDocente');
    }

    const redirectGestionEncuestaJP=()=>{
      router.push('./encuestaJP/gestionEncuestaJP');
    }

    return (
      <CardMenu>
        <BotonMenu texto="GESTIÓN DE ENCUESTA DOCENTE"
        manejarClic={redirectGestionEncuestaDocente}></BotonMenu>
        <BotonMenu texto="GESTIÓN DE ENCUESTA JEFE DE PRÁCTICA"
        manejarClic={redirectGestionEncuestaJP}></BotonMenu>
      </CardMenu>
    );
  }
  
  export default MenuEncuestas;