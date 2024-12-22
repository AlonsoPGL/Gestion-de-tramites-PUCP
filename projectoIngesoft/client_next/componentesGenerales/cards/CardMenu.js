import React from 'react'
import { FormGroup, FormControlLabel, Checkbox, Card, CardContent, Typography, TextField, Button, Box } from '@mui/material';
//Este es el card que se usará para los menús en cada sección del usuario de algún rol
function CardMenu({children}){
    return(
        <Card sx={{ maxWidth: 1000 , border: 1 ,borderColor: 'black', marginLeft: '300px',marginTop: '80px', 
            display: 'flex', minHeight: 600, height: 'auto',flexDirection: 'column',}}>
                <CardContent  sx={{ paddingTop: '30px', height: 'auto',overflowY: 'auto', }}>        
                    {children} {/*Aqui va todo lo que se quiera poner dentro del card*/}       
                </CardContent>
            </Card>
    );

}
export default CardMenu;
