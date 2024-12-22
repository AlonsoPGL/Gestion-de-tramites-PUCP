//nueva pagina convocatoria
"use client";
import { Button } from "@mui/material";
import CardMenu from "../../../../componentesGenerales/cards/CardMenu";
import { useRouter } from "next/navigation";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useConvocatoria } from '../../convocatoriaContext';

export default function Solicitudes() {

    const { setConvocatoria } = useConvocatoria();

    const router=useRouter();

    const redirectRegistro=()=>{
        router.push('./convocatorias/nuevaConvocatoria');
        localStorage.removeItem('selectedConvocatoria');
        localStorage.removeItem('editarConvocatoria');
        setConvocatoria('');
    }

    const redirectListaConvocatorias=()=>{
        router.push('./convocatorias/listadoConvocatorias');
    }


    const estilosBotones = () =>({
        marginLeft: 3,border: 1, borderColor: 'black',
        mt: 1, mb: 1 ,textAlign: 'left', width: '732px',justifyContent: 'flex-start',
        fontWeight: 'SemiBold', fontFamily: 'Montserrat',color: '#363581', borderRadius: 3,
        '&:hover': {
                backgroundColor: '#6D6CD4', // Cambia el color de fondo
                color: '#FFFFFF', // Cambia el color del texto
                borderColor: '#363581', // Cambia el color del borde
                '& .MuiSvgIcon-root': {
                    color: '#FFFFFF', // Cambia el color del ícono al hacer hover
                }
            }
    })

    return (

        <CardMenu>
            <Button color='white 'fullWidth sx={estilosBotones()}
            startIcon={<InsertDriveFileIcon sx={{ color: '#6D6CD4', marginLeft:'5px'
             }}/>} onClick={redirectRegistro}> {/*ManejarClic es la funcion que debes pasar al boton para que sea eso lo que realiza con un clic*/}
             Registro de nueva convocatoria {/*Aqui va el texto para todos los botones del menu*/}
            </Button>


          <Button color='white 'fullWidth sx={estilosBotones()}
             startIcon={<InsertDriveFileIcon sx={{ color: '#6D6CD4', marginLeft:'5px'
             }}/>} onClick={redirectListaConvocatorias}> {/*ManejarClic es la funcion que debes pasar al boton para que sea eso lo que realiza con un clic*/}
             Listado de convocatorias {/*Aqui va el texto para todos los botones del menu*/}
            </Button>


        </CardMenu>

    );
}