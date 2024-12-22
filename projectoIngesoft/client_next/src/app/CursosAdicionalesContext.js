// src/app/PersonaContext.js
import React, { createContext, useState,useContext } from 'react';

// Crear el contexto
export const CursosAdicionalesContext = createContext();

// Crear el proveedor
export const CursosAdicionalesProvider = ({ children }) => {
  const [cursosAdicionales, setCursosAdicionales] = useState([]);

  return (
    <CursosAdicionalesContext.Provider value={{ cursosAdicionales, setCursosAdicionales }}>
      {children}
    </CursosAdicionalesContext.Provider>
  );
};

// Hook personalizado para acceder al contexto
export const useCursosAdicionales = () => {
  const context = useContext(CursosAdicionalesContext);
  if (!context) {
    throw new Error('usePersona debe ser usado dentro de un PersonaProvider');
  }
  return context;
};