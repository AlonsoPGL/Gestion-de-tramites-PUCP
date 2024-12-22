"use client";
import React from 'react';
import { TextField, Box, InputAdornment } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

const BarraBusqueda = ({ onSearch }) => { // Aceptamos la prop onSearch
  const handleChange = (event) => {
    if (onSearch) {
      onSearch(event.target.value); // Llamamos a la función onSearch cada vez que el usuario escribe algo
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
      <TextField
        variant="outlined"
        placeholder="Buscar..."
        size="small"
        sx={{
          width: '700px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px', // Bordes redondeados
            '& fieldset': {
              borderWidth: '2px', // Grosor del borde
              borderColor: '#dddddd', // Color del borde
            },
            '&:hover fieldset': {
              borderColor: '#363581', // Color al hacer hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#4a4f9a', // Color cuando está enfocado
            },
          },
        }}
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#A9A9A9' }} />
            </InputAdornment>
          ),
        }}
      />
    </Box>

  );
};

export default BarraBusqueda;
