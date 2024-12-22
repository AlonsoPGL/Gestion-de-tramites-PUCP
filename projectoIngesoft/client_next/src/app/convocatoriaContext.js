import React, { createContext, useState, useContext } from 'react';

// Crear el contexto
const convocatoriaContext = createContext();

// Crear un proveedor del contexto
export const ConvocatoriaProvider = ({ children }) => {
  const [convocatoria, setConvocatoria] = useState(null);  // Estado inicial del usuario

  return (
    <convocatoriaContext.Provider value={{ convocatoria, setConvocatoria }}>
      {children}
    </convocatoriaContext.Provider>
  );
};

// Crear un hook personalizado para usar el contexto de forma más sencilla
export const useConvocatoria = () => useContext(convocatoriaContext);
