import React, { createContext, useState, useContext } from 'react';

// Crear el contexto
const AlumnoContext = createContext();

// Crear un proveedor del contexto
export const AlumnoProvider = ({ children }) => {
  const [alumno, setAlumno] = useState(null);  // Estado inicial del alumno

  return (
    <AlumnoContext.Provider value={{ alumno, setAlumno }}>
      {children}
    </AlumnoContext.Provider>
  );
};

// Crear un hook personalizado para usar el contexto de forma más sencilla
export const useAlumno = () => useContext(AlumnoContext);