// src/app/FacultadContext.js
"use client";
import { createContext, useContext, useState } from 'react';

const HorarioxCursoContext = createContext();

export function HorarioxCursoProvider({ children }) {
    const [horarioxCurso, setHorarioxCurso] = useState(null);

    return (
        <HorarioxCursoContext.Provider value={{ horarioxCurso, setHorarioxCurso }}>
            {children}
        </HorarioxCursoContext.Provider>
    );
}

export function useHorarioxCurso() {
    const context = useContext(HorarioxCursoContext);
    if (!context) {
        throw new Error('useHorarioxCurso debe ser usado dentro de un HorarioxCursoProvider');
    }
    return context;
}