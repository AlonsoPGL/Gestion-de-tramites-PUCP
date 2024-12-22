import React, { createContext, useState, useContext, useEffect } from 'react';

// Crear el contexto
const PedidoCursoContext = createContext();

// Crear un proveedor del contexto
export const PedidoCursoProvider = ({ children }) => {
  const [pedidoCurso, setPedidoCurso] = useState(null);  // Estado inicial del PedidoCurso

  return (
    <PedidoCursoContext.Provider value={{ pedidoCurso, setPedidoCurso }}>
      {children}
    </PedidoCursoContext.Provider>
  );
};

// Crear un hook personalizado para usar el contexto de forma más sencilla
export const usePedidoCurso = () => useContext(PedidoCursoContext);
