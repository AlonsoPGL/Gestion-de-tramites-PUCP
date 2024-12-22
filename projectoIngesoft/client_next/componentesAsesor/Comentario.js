"use client";
import React, { useContext, useEffect, useState } from 'react';
import { Box, TextField, Typography,Grid} from '@mui/material';



const Comentario = ({nombre,comments,fecha}) => {
    const sizeFont=10; //tamaño de fuente
    // Función para manejar la descarga del archivo

    return (
        <Box sx={{ marginTop: '20px', padding: '20px', backgroundColor: '#f2f4ff', borderRadius: '8px' }}>
            <Grid container spacing={2} alignItems="center">
                {/* Nombre */}
                <Grid item xs={3}>
                    <Typography variant="body1" sx={{ color: 'black', fontWeight: 'bold' }}>Nombre:</Typography>
                </Grid>
                <Grid item xs={9}>
                    <TextField fullWidth value={nombre} disabled />
                </Grid>

                {/* Fecha */}
                <Grid item xs={3}>
                    <Typography variant="body1" sx={{ color: 'black', fontWeight: 'bold' }}>Fecha:</Typography>
                </Grid>
                <Grid item xs={9}>
                    <TextField fullWidth value={fecha} disabled />
                </Grid>


                {/* Comentarios */}
                <Grid item xs={3}>
                    <Typography variant="body1" sx={{ color: 'black', fontWeight: 'bold' }}>Comentarios:</Typography>
                </Grid>
                <Grid item xs={9}>
                    <TextField fullWidth multiline rows={4} value={comments} disabled />
                </Grid>

            </Grid>
      </Box>   
    );
  };
  
  export default Comentario;