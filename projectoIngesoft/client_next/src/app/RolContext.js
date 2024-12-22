import React, { createContext, useState, useContext, useEffect } from 'react';

// Crear el contexto
const RolContext = createContext();

// Crear un proveedor del contexto
export const RolProvider = ({ children }) => {
  const [rol, setRol] = useState(null);  // Estado inicial del rol

  useEffect(() => {
    // Intenta cargar la persona desde localStorage al iniciar, solo en el cliente
    const savedRol = localStorage.getItem('rol');
    setRol(savedRol ? JSON.parse(savedRol) : null);
  }, []); // Dependencias vacías para que se ejecute solo una vez al montar

  useEffect(() => {
    // Guardar la persona en localStorage cuando cambie
    if (rol) {
      localStorage.setItem('rol', JSON.stringify(rol));
    }
  }, [rol]);

  const logout = () => {
    setRol(null); // Esto no eliminará el localStorage inmediatamente
    localStorage.removeItem('rol'); // Elimina solo cuando el usuario cierra sesión
  };

  return (
    <RolContext.Provider value={{ rol, setRol, logout }}>
      {children}
    </RolContext.Provider>
  );
};

// Crear un hook personalizado para usar el contexto de forma más sencilla
export const useRol = () => useContext(RolContext);
