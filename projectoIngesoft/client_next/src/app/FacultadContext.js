// src/app/FacultadContext.js
import React, { createContext, useState, useContext } from 'react';

// Crear el contexto
const FacultadContext = createContext();

// Crear un proveedor del contexto
export const FacultadProvider = ({ children }) => {
  const [facultad, setFacultad] = useState(null);  // Estado inicial para la lista de facultades

  return (
    <FacultadContext.Provider value={{ facultad, setFacultad }}>
      {children}
    </FacultadContext.Provider>
  );
};

// Crear un hook personalizado para usar el contexto de forma más sencilla
export const useFacultad = () => useContext(FacultadContext);
