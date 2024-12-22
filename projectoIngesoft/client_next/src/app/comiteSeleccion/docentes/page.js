"use client";

import { useRouter } from 'next/navigation';
import BotonMenu from "componentesGenerales/botones/BotonMenu";
import CardMenu from "componentesGenerales/cards/CardMenu";
function MenuDocentesComiteSeleccion() {
    const router = useRouter();
    const redirectPrimerFiltro = () => {

        router.push('./docentes/listarPrimerFiltro'); 


    }      
    const redirectSegundoFiltro = () => {

        router.push('./docentes/listarSegundoFiltro'); 


    }          
    return (

        <CardMenu>
                <BotonMenu texto="APROBACIÓN DEL PRIMER FILTRO"
                manejarClic={redirectPrimerFiltro}></BotonMenu>
                <BotonMenu texto="APROBACIÓN DEL SEGUNDO FILTRO"
                manejarClic={redirectSegundoFiltro}></BotonMenu>                                                       
        </CardMenu>


        
      
      
    );
  }
  
  export default MenuDocentesComiteSeleccion;