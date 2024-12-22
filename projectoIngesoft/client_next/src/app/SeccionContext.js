import React, { createContext, useState, useContext } from 'react';

// Crear el contexto
const SeccionContext = createContext();

// Crear un proveedor del contexto
export const SeccionProvider = ({ children }) => {
  const [seccion, setSeccion] = useState(null);  // Estado inicial del seccion

  return (
    <SeccionContext.Provider value={{ seccion, setSeccion }}>
      {children}
    </SeccionContext.Provider>
  );
};

// Crear un hook personalizado para usar el contexto de forma más sencilla
export const useSeccion = () => useContext(SeccionContext);
