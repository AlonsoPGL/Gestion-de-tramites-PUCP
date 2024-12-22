"use client";

import { useRouter } from 'next/navigation';
import BotonMenu from "componentesGenerales/botones/BotonMenu";
import CardMenu from "componentesGenerales/cards/CardMenu";
function MenuTesisAsesor() {
    const router = useRouter();
    const manejarClic = () => {
        console.log('Clic')
    }
    const redirectAprobacionTesis = () => {

        router.push('./solicitudes/visualizarSolicitudesAprobacion'); // Cambia '/nueva-pagina' por la ruta que desees


    }      
    return (
        <CardMenu>
                <BotonMenu texto="SOLICITUDES DE APROBACIÓN DE TEMA DE TESIS"
                manejarClic={redirectAprobacionTesis}></BotonMenu>
                                           
        </CardMenu>



      
      
    );
  }
  
  export default MenuTesisAsesor;