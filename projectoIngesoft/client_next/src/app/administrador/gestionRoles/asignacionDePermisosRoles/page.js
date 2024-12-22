"use client";
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from "@mui/material";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import TablaPermisos from '../../../../../componentesAdministrador/gestionRoles/asignacionDePermisosRoles/TablaPermisosDeRoles';
import { useRol } from '../../../RolContext'; 
import BarraBusqueda from '../../../../../componentesAdministrador/BarraBusqueda';
import EstaSeguroAccion from '../../../../../componentesGenerales/modales/EstaSeguroAccion';

export default function AsignacionPermisos() {
  const [permisos, setPermisos] = useState([]);
  const [filteredPermisos, setFilteredPermisos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { rol } = useRol();
  const [storedRol, setStoredRol] = useState(null); // Estado para el rol almacenado
  const [modalOpen, setModalOpen] = useState(false); // Estado para controlar el modal
  const router = useRouter();

  useEffect(() => {
    // Recuperar el rol de localStorage
    const localStoredRol = JSON.parse(localStorage.getItem('selectedRol'));
    
    if (localStoredRol) {
      setStoredRol(localStoredRol);
      obtenerPermisos(localStoredRol.id);
    } else if (rol) {
      setStoredRol(rol);
      obtenerPermisos(rol.id);
      // Almacenar el rol en localStorage
      localStorage.setItem('selectedRol', JSON.stringify(rol));
    }
  }, [rol]);
  

  const obtenerPermisos = async (rolId) => {
    try {
      console.log("Obteniendo permisos para el rol ID:", rolId);
      const response = await axios.get(`http://localhost:8080/gestUsuario/PermisoControl/permisosPorRol?id=${rolId}`);
      console.log("Permisos obtenidos:", response.data);
      setPermisos(response.data);
      setFilteredPermisos(response.data);
    } catch (error) {
      console.error("Error al obtener permisos:", error);
    }
  };

  const handleSearchChange = (busqueda) => {
    setSearchTerm(busqueda);
    const resultadosFiltrados = permisos.filter((permiso) =>
      permiso.permisoNombre.toLowerCase().includes(busqueda.toLowerCase())
    );
    setFilteredPermisos(resultadosFiltrados);
  };

  const handleToggle = (permisoId, nuevoEstado) => {
    const updatedPermisos = permisos.map(permiso =>
      permiso.permisoId === permisoId ? { ...permiso, estado: nuevoEstado } : permiso
    );
    setPermisos(updatedPermisos);
    setFilteredPermisos(updatedPermisos);
    console.log(updatedPermisos)
  };
  
  const handleGuardar = async () => {
    try {
      const permisosActualizados = permisos.map(permiso => ({
        permisoId: permiso.permisoId,
        estado: permiso.estado
      }));
      
      await axios.post(`http://localhost:8080/gestUsuario/PermisoControl/actualizarPermisos?rolId=${rol.id}`, 
        permisosActualizados, {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      
      alert("Permisos guardados exitosamente.");
      router.push('/administrador/gestionRoles');
    } catch (error) {
      console.error("Error al guardar permisos:", error.response ? error.response.data : error.message);
      alert("Error al guardar permisos. Por favor, inténtelo de nuevo.");
    }
  };

  useEffect(() => {
    if (rol) {
      localStorage.setItem('selectedRol', JSON.stringify(rol));
    }
  }, [rol]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', height: '100vh', marginLeft: '120px', mt: 10, mb: 5 }}>
      <Box sx={{ width: '80%', border: '1px solid #A9A9A9', borderRadius: '5px' }}>
        <Box sx={{ backgroundColor: '#363581', color: 'white', padding: '10px', textAlign: 'left' }}>
          <Typography variant="h6">Rol - {rol?.nombre || storedRol?.nombre || ''}</Typography>
        </Box>
        
        <Box sx={{ padding: '20px' }}>
          <Typography variant="h5" sx={{ mb: 2 }}>Asignación de Permisos</Typography>
          <BarraBusqueda value={searchTerm} onSearch={handleSearchChange} />

          <Box sx={{ maxHeight: '400px', overflow: 'auto', border: '1px solid #A9A9A9', borderRadius: '5px' }}>
            <TablaPermisos permisos={filteredPermisos} onToggle={handleToggle} />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="outlined" color="secondary" sx={{ marginRight: '10px' }} onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>
              Guardar
            </Button>
          </Box>
        </Box>


        <EstaSeguroAccion
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          texto={`¿Está seguro de guardar los cambios?`}
          handleAceptar={async () => {
            await handleGuardar();  // Ejecutar la función de guardado
            setModalOpen(false);    // Cerrar el modal después de guardar
          }}
        />
      </Box>
    </Box>
  );
}
