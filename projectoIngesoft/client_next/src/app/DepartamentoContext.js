import React, { createContext, useState, useContext } from 'react';

// Crear el contexto
const DepartamentoContext = createContext();

// Crear un proveedor del contexto
export const DepartamentoProvider = ({ children }) => {
  const [departamento, setDepartamento] = useState(null);  // Estado inicial del departamento

  return (
    <DepartamentoContext.Provider value={{ departamento, setDepartamento }}>
      {children}
    </DepartamentoContext.Provider>
  );
};

// Crear un hook personalizado para usar el contexto de forma más sencilla
export const useDepartamento = () => useContext(DepartamentoContext);
