"use client";
import { Button, Typography } from "@mui/material";
import CardMenu from "../../../../componentesGenerales/cards/CardMenu";
import { useRouter } from "next/navigation";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import { usePedidoCurso  } from "@/app/PedidoCursoContext";
import { useUnidad } from "@/app/UnidadContex";
import axios from "axios";

export default function Solicitudes() {
    const router=useRouter();
    const { setPedidoCurso } = usePedidoCurso();
    const { unidad } = useUnidad();

    const verificarEstadoHabilitarEnvio = async () => {
        try {

            const response = await axios.get(
                `http://localhost:8080/institucion/especialidad/estadoHabilitarEnvioSolicitudCursos/${unidad.idUnidad}`
            );
            return response.data; // true o false
        } catch (error) {
            console.error("Error verificando estado:", error);
            return false; // Manejo por defecto en caso de error
        }
    };
    
    const redirectCartaPresentacion=()=>{
        router.push('./solicitudes/cartaPresentacion');
    }

    const redirectMatriculaAdicional=()=>{
        router.push('./matriculaAdicional/')
    }

    const redirectListaPedidoCursos=()=>{
        localStorage.removeItem('selectedPedidoCurso');
        localStorage.setItem('editarPedidoCurso', JSON.stringify(false));
        setPedidoCurso('');
        router.push('./solicitudes/listadoPedidoCursos')
    }

    const redirectRealizarPedidoCursos = async () => {

        
        const estadoHabilitado = await verificarEstadoHabilitarEnvio();
        if (estadoHabilitado) {
            localStorage.removeItem("selectedPedidoCurso");
            localStorage.setItem("editarPedidoCurso", JSON.stringify(false));
            setPedidoCurso("");
            router.push("./solicitudes/pedidoCursos");
        } else {
            alert("El secretario académico todavía no ha solicitado un pedido de cursos.");
        }
    }

    return (

        <CardMenu>
                
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
             }}/>} onClick={redirectCartaPresentacion}> {/*ManejarClic es la funcion que debes pasar al boton para que sea eso lo que realiza con un clic*/}
             Solicitudes de Carta de Presentación {/*Aqui va el texto para todos los botones del menu*/}
           </Button>

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
             }}/>} onClick={redirectMatriculaAdicional}> {/*ManejarClic es la funcion que debes pasar al boton para que sea eso lo que realiza con un clic*/}
             Solicitudes de Matricula Adicional {/*Aqui va el texto para todos los botones del menu*/}
           </Button>       

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
             }}/>} onClick={redirectListaPedidoCursos}> {/*ManejarClic es la funcion que debes pasar al boton para que sea eso lo que realiza con un clic*/}
             Listar Pedido de Cursos {/*Aqui va el texto para todos los botones del menu*/}
           </Button>          

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
             }}/>} onClick={redirectRealizarPedidoCursos}> {/*ManejarClic es la funcion que debes pasar al boton para que sea eso lo que realiza con un clic*/}
             Enviar Pedido de Cursos {/*Aqui va el texto para todos los botones del menu*/}
           </Button>            

        </CardMenu>

    );
}