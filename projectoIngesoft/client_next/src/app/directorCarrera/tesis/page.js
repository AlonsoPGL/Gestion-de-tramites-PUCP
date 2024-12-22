"use client";
import React from "react";
import { FormGroup, FormControlLabel, Checkbox, Card, CardContent, Typography, TextField, Button, Box } from '@mui/material';
import { useUnidad } from '@/app/UnidadContex';
import { useRouter} from 'next/navigation';
import BotonMenu from "../../../../componentesGenerales/botones/BotonMenu";
import CardMenu from "../../../../componentesGenerales/cards/CardMenu";
function MenuTesis() {
    const router = useRouter();
    const manejarClic = () => {
        console.log('Clic')
    }
    const redirectListaSolicitudJurado = () => {

        router.push('./tesis/solicitudJurado/listaSolicitudJurado'); // Cambia '/nueva-pagina' por la ruta que desees


    }   
    
    const redirectAprobacionTesis = () => {

        router.push('./tesis/visualizarSolicitudesAprobacion'); // Cambia '/nueva-pagina' por la ruta que desees


    }      
    return (
        <CardMenu>
                <BotonMenu texto="SOLICITUDES DE APROBACION DE TEMA DE TESIS"
                manejarClic={redirectAprobacionTesis}></BotonMenu>
                <BotonMenu texto="SOLICITUD DE JURADO DE TESIS"
                manejarClic={redirectListaSolicitudJurado}></BotonMenu>
                                           
        </CardMenu>



      
      
    );
  }
  
  export default MenuTesis;

