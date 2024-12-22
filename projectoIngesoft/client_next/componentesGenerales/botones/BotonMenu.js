import React from 'react'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import { FormGroup, FormControlLabel, Checkbox, Card, CardContent, Typography, TextField, Button, Box } from '@mui/material';
//Este es el boton que se usará para los menús en cada sección del usuario de algún rol
function BotonMenu({texto,manejarClic}){
    return(
        <Button color='white 'fullWidth sx={{ marginLeft: 3,border: 1, borderColor: 'black',
            mt: 1, mb: 1 ,textAlign: 'left', width: '732px',justifyContent: 'flex-start',
            fontWeight: 'SemiBold', fontFamily: 'Montserrat',color: '#363581', borderRadius: 3,
            '&:hover': {
                    backgroundColor: '#6D6CD4', // Cambia el color de fondo
                    color: '#FFFFFF', // Cambia el color del texto
                    borderColor: '#363581', // Cambia el color del borde
                    '& .MuiSvgIcon-root': {
                        color: '#FFFFFF', // Cambia el color del ícono al hacer hover
                    }
                }}}
             startIcon={<InsertDriveFileIcon sx={{ color: '#6D6CD4', marginLeft:'5px'
             }}/>} onClick={manejarClic}> {/*ManejarClic es la funcion que debes pasar al boton para que sea eso lo que realiza con un clic*/}
             {texto} {/*Aqui va el texto para todos los botones del menu*/}
           </Button>
    );

}
export default BotonMenu;