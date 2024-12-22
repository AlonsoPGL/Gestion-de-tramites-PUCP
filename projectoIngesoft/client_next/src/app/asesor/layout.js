//layout de alumno y director 
"use client";
import { useState, useEffect } from "react";
import BarraLateral from "../../../componentesHome/BarraLateral";
import { usePersona } from '../PersonaContext';
import { useUnidad } from '../UnidadContex'; 
import { useInstitucion } from "../InstitucionContext";
import CircularProgress from '@mui/material/CircularProgress';

export default function Layout({ children }) {
    const { persona } = usePersona();
    const { unidad } = useUnidad();
    const { institucion } = useInstitucion();

    const [loadingPersona, setLoadingPersona] = useState(true);
    const [loadingInstitucion, setLoadingInstitucion] = useState(true);
    const [loadingUnidad, setLoadingUnidad] = useState(true);
    const [currentPersona, setCurrentPersona] = useState(null);
    const [currentInstitucion, setCurrentInstitucion] = useState(null);
    const [currentUnidad, setCurrentUnidad] = useState(null);

    useEffect(() => {
        console.log("UNIDAD",unidad);
        const loadPersona = async () => {
            if (persona) {
                setCurrentPersona(persona);
            } else {
                const savedPersona = localStorage.getItem('persona');
                if (savedPersona) {
                    setCurrentPersona(JSON.parse(savedPersona));
                }
            }
            setLoadingPersona(false);
        };

        const loadInstitucion = async () => {
            if (institucion) {
                setCurrentInstitucion(institucion);
            } else {
                const savedInstitucion = localStorage.getItem('institucion');
                if (savedInstitucion) {
                    setCurrentInstitucion(JSON.parse(savedInstitucion));
                }
            }
            setLoadingInstitucion(false);
        };

        const loadUnidad = async () => {
            if (unidad) {
                setCurrentUnidad(unidad);
            } else {
                const savedUnidad = localStorage.getItem('unidad');
                if (savedUnidad) {
                    setCurrentUnidad(JSON.parse(savedUnidad));
                }
            }
            setLoadingUnidad(false);
        };

        loadUnidad();
        loadPersona();
        loadInstitucion();
    }, [persona, institucion]);

    if (loadingPersona || loadingInstitucion || loadingUnidad) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}>
                <CircularProgress style={{ width: '100px', height: '100px' }} />
            </div>
        );
    }

    if (!currentPersona || !currentInstitucion || !currentUnidad) {
        return <div>Acceso denegado. Debes estar logueado.</div>;
    }

    return (
        <div>
            <BarraLateral idPersona={currentPersona.id} idRol={currentUnidad.idRol} />
            {children}
        </div>
    );
}
