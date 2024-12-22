import React, { createContext, useState, useContext, useEffect } from 'react';

export const PersonaContext = createContext();

export const PersonaProvider = ({ children }) => {
  const [persona, setPersona] = useState(null);

  useEffect(() => {
    // Intenta cargar la persona desde localStorage al iniciar, solo en el cliente
    const savedPersona = localStorage.getItem('persona');
    setPersona(savedPersona ? JSON.parse(savedPersona) : null);
  }, []); // Dependencias vacías para que se ejecute solo una vez al montar

  useEffect(() => {
    // Guardar la persona en localStorage cuando cambie
    if (persona) {
      localStorage.setItem('persona', JSON.stringify(persona));
    }
  }, [persona]);

  // Función para cerrar sesión
  const logout = () => {
    setPersona(null); // Esto no eliminará el localStorage inmediatamente
    localStorage.removeItem('persona'); // Elimina solo cuando el usuario cierra sesión
  };

  return (
    <PersonaContext.Provider value={{ persona, setPersona, logout }}>
      {children}
    </PersonaContext.Provider>
  );
};

export const usePersona = () => {
  
  const context = useContext(PersonaContext);
  if (!context) {
    throw new Error('usePersona debe ser usado dentro de un PersonaProvider');
  }
  return context;
};
