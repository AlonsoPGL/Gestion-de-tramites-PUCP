import React, { createContext, useState, useContext } from 'react';

// Crear el contexto
const UsuarioContext = createContext();

// Crear un proveedor del contexto
export const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);  // Estado inicial del usuario

  return (
    <UsuarioContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UsuarioContext.Provider>
  );
};

// Crear un hook personalizado para usar el contexto de forma más sencilla
export const useUsuario = () => useContext(UsuarioContext);
