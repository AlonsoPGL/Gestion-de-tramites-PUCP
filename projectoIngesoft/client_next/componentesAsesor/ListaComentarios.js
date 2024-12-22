"use client";
import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

import Comentario from './Comentario';

const ListaComentarios = ({ comentarios }) => {
    return (
        <Box>
            <Typography variant="h5" sx={{ marginBottom: '20px' }}>Lista de Comentarios</Typography>
            {comentarios.map((comentario, index) => (
                <Comentario
                    key={index}
                    nombre={comentario.revisor.nombre + " " + comentario.revisor.apellidoPaterno + " " + comentario.revisor.apellidoMaterno}
                    comments={comentario.comentario}
                    fecha={new Date(comentario.fecha).toLocaleDateString('es-ES')}
                />
            ))}
        </Box>
    );
};

export default ListaComentarios;