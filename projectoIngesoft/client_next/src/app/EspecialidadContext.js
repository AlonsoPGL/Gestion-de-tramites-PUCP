import React, { createContext, useState, useContext } from 'react';

// Crear el contexto
const EspecialidadContext = createContext();

// Crear un proveedor del contexto
export const EspecialidadProvider = ({ children }) => {
  const [especialidad, setEspecialidad] = useState(null);  // Estado inicial de la especialidad

  return (
    <EspecialidadContext.Provider value={{ especialidad, setEspecialidad }}>
      {children}
    </EspecialidadContext.Provider>
  );
};

// Crear un hook personalizado para usar el contexto de forma más sencilla
export const useEspecialidad = () => useContext(EspecialidadContext);
