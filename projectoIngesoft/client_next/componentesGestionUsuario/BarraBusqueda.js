// src/componentesHome/BarraBusqueda.js

import React from 'react';
import { TextField, Button, Box } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search'; // Importar el icono de lupa

const BarraBusqueda = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
      <TextField 
        variant="outlined" 
        placeholder="Buscar usuario..." 
        size="small" 
        sx={{ width: '300px' }} 
        InputProps={{
          startAdornment: (
            <SearchIcon sx={{ color: '#A9A9A9', mr: 1 }} /> // Icono de lupa ploma
          ),
        }}
      />
      
    </Box>
  );
};

export default BarraBusqueda;
