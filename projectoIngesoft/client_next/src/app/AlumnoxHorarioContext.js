// src/app/FacultadContext.js
"use client";
import { createContext, useContext, useState } from 'react';

const AlumnoxHorarioContext = createContext();

export function AlumnoxHorarioProvider({ children }) {
    const [cursoxHorario, setAlumnoxHorario] = useState(null);

    return (
        <AlumnoxHorarioContext.Provider value={{ cursoxHorario, setAlumnoxHorario }}>
            {children}
        </AlumnoxHorarioContext.Provider>
    );
}

export function useAlumnoxHorario() {
    const context = useContext(AlumnoxHorarioContext);
    if (!context) {
        throw new Error('useAlumnoxHorario debe ser usado dentro de un AlumnoxHorarioProvider');
    }
    return context;
}