
"use client";
import { Box, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";


const CardRol = ({ rol, tipoUnidad, unidadEspecifica, imagenRol, permisosRol, idRol, handleClick }) => {

    return (
        <>
            <Box sx={{
                cursor: "pointer",
                transition: "all 0.3s ease",
                backgroundColor: "#f9f9f9", // Fondo por defecto
                "&:hover": {
                    backgroundColor: "#e0e0e0", // Cambia el fondo al pasar el mouse
                },
                boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
                border: "solid 2px #d0d2d6",
                display: "flex", // Activar flexbox
                flexDirection: "column", // Colocar elementos en columna
                alignItems: "center", // Centrar horizontalmente
                justifyContent: "center", // Centrar verticalmente
                padding: "20px", // Añadir un poco de espacio interno
                textAlign: "center", // Centrar texto
            }}>
                <Box>
                    <Typography sx={{ marginBottom: "10px" }}>{rol}</Typography>
                    <Typography>{tipoUnidad}: {unidadEspecifica}</Typography>
                </Box>
                <Box  onClick={handleClick}>
                    <AccountCircleIcon
                        sx={{ fontSize: '130px', color: '#757575', margin: '20px' }} // Tamaño y estilo del ícono
                        
                    />
                </Box>
            </Box>
        </>
    );
}

export default CardRol;