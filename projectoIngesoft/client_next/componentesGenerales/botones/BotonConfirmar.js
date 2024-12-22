"use client";

//COPIAR IMPORTS-------------------------------------------------------------------------------------------------
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

//NO ES ESCALABLE NO USAR COMPONENTE SOLO COPIARLO EN SU RESPECTIVA PAGINA

//COPIAR ESTA FUNCION------------------------------------------------------------------------------------
const ColorButton = styled(Button)(({ theme }) => ({
    //color: theme.palette.getContrastText(purple[500]),
    backgroundColor: '#363581',
    '&:hover': {
      backgroundColor: '#5D71BC',
    },
  }));
//---------------------------------------------------------------------------------------------------------

const BotonConfirmar = ({texto}) => {
    if(texto!=null){
        return(
            <ColorButton variant="contained">{texto}</ColorButton> 
        );
    }else{
        return(
            <ColorButton variant="contained">Confirmar</ColorButton> //*COPIAR ESTA LINEA*/
        );
    }
}

export default BotonConfirmar;