import React, { createContext, useState, useContext } from 'react';

// Crear el contexto
const EncuestaContext = createContext();

// Crear un proveedor del contexto
export const EncuestaProvider = ({ children }) => {
  const [encuestaEdit, setEncuesta] = useState(null);  // Estado inicial del rol

  return (
    <EncuestaContext.Provider value={{ encuestaEdit, setEncuesta }}>
      {children}
    </EncuestaContext.Provider>
  );
};

// Crear un hook personalizado para usar el contexto de forma más sencilla
export const useEncuesta = () => useContext(EncuestaContext);
