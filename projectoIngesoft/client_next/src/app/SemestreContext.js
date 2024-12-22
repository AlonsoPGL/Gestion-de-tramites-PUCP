import React, { createContext, useState, useContext } from 'react';

// Crear el contexto
const SemestreContext = createContext();

// Crear un proveedor del contexto
export const SemestreProvider = ({ children }) => {
  const [semestre, setSemestre] = useState(null);  // Estado inicial del semestre

  return (
    <SemestreContext.Provider value={{ semestre, setSemestre }}>
      {children}
    </SemestreContext.Provider>
  );
};

// Crear un hook personalizado para usar el contexto de forma más sencilla
export const useSemestre = () => useContext(SemestreContext);
