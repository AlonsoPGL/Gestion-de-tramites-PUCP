import React, { createContext, useState, useEffect, useContext } from 'react';

// Crear el contexto
const PreguntaFrecuenteContext = createContext();

// Crear un proveedor del contexto
export const PreguntaFrecuenteProvider = ({ children }) => {
  const [preguntaFrecuente, setPreguntaFrecuente] = useState(null);  // Estado inicial para la lista de facultades

  return (
    <PreguntaFrecuenteContext.Provider value={{ preguntaFrecuente, setPreguntaFrecuente }}>
      {children}
    </PreguntaFrecuenteContext.Provider>
  );
};

// Crear un hook personalizado para usar el contexto de forma más sencilla
export const usePreguntaFrecuente = () => {
  const context = useContext(PreguntaFrecuenteContext);
  if (!context) {
    throw new Error('usePreguntaFrecuente debe ser usado dentro de un PreguntaFrecuenteProvider');
  }
  return context;
};
