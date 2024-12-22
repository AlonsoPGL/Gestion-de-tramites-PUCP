// src/componentesHome/BarraBusqueda.js

import React, { useRef, useState }  from 'react';
import { TextField, Button, Box } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search'; // Importar el icono de lupa
import axios from 'axios';

const BarraBusqueda = ({onBuscarAlumnos }) => {
  const [nombre, setNombre] = useState("");
  const [actualizarTabla, setActualizarTabla] = useState(false);

  // Función para manejar la búsqueda
  const handleBuscar = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/rrhh/alumno/buscarEnRiesgoPorNombre`, {
        params: { nombre }  // parámetro de búsqueda
      });
      onBuscarAlumnos(response.data);
      //setActualizarTabla(true);
      console.log(response.data);

    } catch (error) {
      console.error("Error buscando alumnos:", error);
    }
  };

  return (
    <Box sx={{ display: 'flex',  alignItems: 'center', gap: 0 }}>
      <TextField 
        variant="outlined" 
        placeholder="Buscar alumno por nombre ..." 
        size="small" 
        sx={{ width: '300px' }} 
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        InputProps={{
          startAdornment: (
            <SearchIcon sx={{ color: '#A9A9A9', mr: 1 }} onClick={handleBuscar}/> // Icono de lupa ploma
          ),
        }}
      />
      <Button 
        variant="contained" 
        color="primary"
        onClick={handleBuscar}  // Manejar clic en el botón de búsqueda
        sx={{ ml: 2 }} //size="small"
      >
        Buscar
      </Button>
    </Box>
  );
};

export default BarraBusqueda;
