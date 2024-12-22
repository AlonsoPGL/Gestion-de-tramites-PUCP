"use client";
import { useState, useEffect } from 'react';
import { Box, Typography, Pagination, PaginationItem } from "@mui/material";
import axios from 'axios';
import BarraBusqueda from '../../../../componentesAdministrador/BarraBusqueda';
import TablaAsignacionPermisosUsuarios from '../../../../componentesAdministrador/asignacionPermisosyRolesUsuario/TablaAsignacionPermisosUsuarios';

export default function AsignacionPermisos() {

  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [page, setPage] = useState(0); // Página actual
  const [rowsPerPage, setRowsPerPage] = useState(5); // Número de filas por página
  const [totalUsuarios, setTotalUsuarios] = useState(0); // Total de usuarios después de filtrar

  useEffect(() => {
    obtenerUsuarios();
  }, [page, rowsPerPage]);

  const obtenerUsuarios = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/rrhh/persona/listar?page=0&size=1000`); // Cambia la URL según tu configuración
      setUsuarios(response.data.content);
      setFilteredUsuarios(response.data.content);
      //setTotalUsuarios(response.data.totalElements);
    } catch (error) {
      console.error("Error al obtener la lista de usuarios:", error);
    }
  };

  const handleSearchChange  = async  (busqueda) => {
    const resultadosFiltrados = usuarios.filter((usuario) =>
      usuario.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.apellidoPaterno?.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.email?.toLowerCase().includes(busqueda.toLowerCase())
    );
    setFilteredUsuarios(resultadosFiltrados);
    setPage(0); // Reiniciar la página cuando se aplica una búsqueda

  };

  return (
    <Box sx={{ backgroundColor: 'white', minHeight: '100vh' }}>
      <Box sx={{ ml: 29, padding: '10px 0px 0px 10px' }}>
          <Typography variant="h4" sx={{  color: '#191D23' }}>
            Asignación de roles 
          </Typography>
        </Box>
      
      <Box
        sx={{
          marginLeft: '220px', // Espacio para la barra lateral
          padding: '10px 20px 20px 20px',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '90%', // Asegura que no choque con la barra lateral
        }}
      >
        

        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px', mb: 5 }}>
          <Box sx={{ width: '100%', border: '1px solid #A9A9A9', borderRadius: '5px' }}>
            
                
            <Box sx={{ padding: '20px' }}>
              <Typography variant="h4" sx={{ mb: '20px', color: '#191D23' }}>
                Usuarios
              </Typography>
              <BarraBusqueda onSearch={handleSearchChange} />

            
              <TablaAsignacionPermisosUsuarios usuarios={filteredUsuarios} />
             
                 
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
