// src/app/FacultadContext.js
"use client";
import { createContext, useContext, useState } from 'react';

const CursoxPlanDeEstudioContext = createContext();

export function CursoxPlanDeEstudioProvider({ children }) {
    const [cursoxPlanDeEstudio, setCursoxPlanDeEstudio] = useState(null);

    return (
        <CursoxPlanDeEstudioContext.Provider value={{ cursoxPlanDeEstudio, setCursoxPlanDeEstudio }}>
            {children}
        </CursoxPlanDeEstudioContext.Provider>
    );
}

export function useCursoxPlanDeEstudio() {
    const context = useContext(CursoxPlanDeEstudioContext);
    if (!context) {
        throw new Error('useCursoxPlanDeEstudio debe ser usado dentro de un CursoxPlanDeEstudioProvider');
    }
    return context;
}