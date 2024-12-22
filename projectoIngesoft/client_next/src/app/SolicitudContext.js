"use client"; 
import React, { createContext, useContext, useState } from 'react';

// Renombrar el contexto a un nombre más simple:
const SolicitudContext = createContext();

export function useSolicitud() {
  return useContext(SolicitudContext);
}

export function SolicitudProvider({ children }) {
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

  return (
    <SolicitudContext.Provider value={{ solicitudSeleccionada, setSolicitudSeleccionada }}>
      {children}
    </SolicitudContext.Provider>
  );
}
