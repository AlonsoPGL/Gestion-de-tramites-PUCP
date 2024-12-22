"use client";

import { useRouter } from 'next/navigation';
import BotonMenu from "componentesGenerales/botones/BotonMenu";
import CardMenu from "componentesGenerales/cards/CardMenu";
function MenuPostulante() {
    const router = useRouter();

    const redirectConvocatorias = () => {
        router.push('./postulacion/convocatorias'); // Cambia '/nueva-pagina' por la ruta que desees
    }      
    return (
        <CardMenu>
                <BotonMenu texto="LISTADO DE CONVOCATORIAS"
                manejarClic={redirectConvocatorias}></BotonMenu>                        
        </CardMenu>
    );
  }
  
  export default MenuPostulante;