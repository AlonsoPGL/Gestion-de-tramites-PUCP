"use client";

import { Typography, Box } from "@mui/material";
import TablaSeleccionFinalDocentes from "componentesComiteSeleccion/TablaSeleccionFinalDocentes";
import { useEffect, useState } from "react";

export default function SeleccionFinalDocente() {
    const [docentes, setDocentes] = useState([]);

    useEffect(() => {
        // Llamada a la API para obtener los docentes con estado PASO_SEGUNDO_FILTRO
        fetch("http://localhost:8080/postulaciones/listarEtapaFinal")
            .then(response => response.json())
            .then(data => {
                console.log("Datos obtenidos de la API:", data); // Verifica los datos aquí
                setDocentes(data); // Actualiza el estado con los datos obtenidos
            })
            .catch(error => console.error("Error al obtener los docentes:", error));
    }, []);

    console.log("Estado 'docentes':", docentes);


    return (
        <>
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
                    <Typography variant="h4">Proceso final selección docentes</Typography>
                </Box>
                <Box sx={{padding:'20px',display: 'flex', justifyContent: 'space-between', width: '100%'}}>

                </Box>
                <Box sx={{marginLeft:'20px',marginRight:'20px'}}>
                    <TablaSeleccionFinalDocentes docentes={docentes} />
                </Box>
            </Box>
        </>
    );
}
