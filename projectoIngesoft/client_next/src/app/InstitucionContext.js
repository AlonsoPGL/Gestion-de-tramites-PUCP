//institucion context
import React, { createContext, useState, useContext, useEffect } from 'react';

export const InstitucionContext = createContext();

export const InstitucionProvider = ({ children }) => {
  const [institucion, setInstitucion] = useState(null);

  useEffect(() => {
    // Intenta cargar la Institucion desde localStorage al iniciar, solo en el cliente
    const savedInstitucion = localStorage.getItem('institucion');
    setInstitucion(savedInstitucion ? JSON.parse(savedInstitucion) : null);
  }, []); // Dependencias vacías para que se ejecute solo una vez al montar

  useEffect(() => {
    // Guardar la Institucion en localStorage cuando cambie
    if (institucion) {
      localStorage.setItem('institucion', JSON.stringify(institucion));
    }
  }, [institucion]);

  // Función para cerrar sesión
  const logout = () => {
    setInstitucion(null); // Esto no eliminará el localStorage inmediatamente
    localStorage.removeItem('institucion'); // Elimina solo cuando el usuario cierra sesión
  };

    // Función asíncrona para cerrar sesión
    /*const logout = async () => {
      setInstitucion(null); // Eliminar la institución del estado
      await new Promise(resolve => setTimeout(resolve, 0)); // Pequeño retraso para asegurar sincronización
      localStorage.removeItem('institucion'); // Eliminar del localStorage inmediatamente después
    };*/

  return (
    <InstitucionContext.Provider value={{ institucion, setInstitucion, logout }}>
      {children}
    </InstitucionContext.Provider>
  );
};

export const useInstitucion = () => {
  const context = useContext(InstitucionContext);
  if (!context) {
    throw new Error('useInstitucion debe ser usado dentro de un InstitucionProvider');
  }
  return context;
};
