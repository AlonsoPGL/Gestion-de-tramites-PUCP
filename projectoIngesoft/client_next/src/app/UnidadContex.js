import React, { createContext, useState, useContext, useEffect } from 'react';

// Crear el contexto
const UnidadContext = createContext();

// Crear un proveedor del contexto
export const UnidadProvider = ({ children }) => {
  const [unidad, setUnidad] = useState(null);  // Estado inicial del unidad

  useEffect(() => {
    // Intenta cargar la persona desde localStorage al iniciar, solo en el cliente
    const savedUnidad = localStorage.getItem('unidad');
    setUnidad(savedUnidad ? JSON.parse(savedUnidad) : null);
  }, []); // Dependencias vacías para que se ejecute solo una vez al montar

  useEffect(() => {
    // Guardar la persona en localStorage cuando cambie
    if (unidad) {
      localStorage.setItem('unidad', JSON.stringify(unidad));
    }
  }, [unidad]);

  const logout = () => {
    setUnidad(null); // Esto no eliminará el localStorage inmediatamente
    localStorage.removeItem('unidad'); // Elimina solo cuando el usuario cierra sesión
  };

  return (
    <UnidadContext.Provider value={{ unidad, setUnidad, logout }}>
      {children}
    </UnidadContext.Provider>
  );
};

// Crear un hook personalizado para usar el contexto de forma más sencilla
export const useUnidad = () => useContext(UnidadContext);
