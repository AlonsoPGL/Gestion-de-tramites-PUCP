"use client";
import React from 'react';
import { Box, Typography, TextField } from '@mui/material';

const InputField = ({
  label,
  disabled = false,
  name,
  labelFontSize,
  value,
  onChange,
  fullWidth = false,
  type = "text",
  select = false,
  width = '100%',
  height = '40px',
  required = false,
  helperText = "",  // Nuevo parámetro para mostrar el texto de ayuda
  error = false,
  mrLabel = '30%',
  children
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2}}>
      <Typography sx={{ flex: `0 1 ${mrLabel}`, textAlign: 'left', fontSize: labelFontSize, alignSelf: 'flex-start', pt: 0.5 }}>
        {label}  {required && <span style={{ color: 'red' }}>*</span>} {/* Asterisco si es obligatorio */}
      </Typography>

      <TextField
        name={name}
        fullWidth={fullWidth}
        variant="outlined"
        type={type}
        value={value}
        onChange={onChange}
        select={select}
        error={error} 
        disabled={disabled}
        sx={{
          flex: '1',
          backgroundColor: 'white',
          '& .MuiOutlinedInput-root': {
            height: height,
            width: width,
            borderRadius: 2,
          }
        }}
        
        helperText={helperText}  // Muestra el texto de ayuda o error debajo del campo
        FormHelperTextProps={{ sx: { color: error ? 'red' : 'inherit' } }}
      >
        {children}
      </TextField>
    </Box>
  );
};

export default InputField;

