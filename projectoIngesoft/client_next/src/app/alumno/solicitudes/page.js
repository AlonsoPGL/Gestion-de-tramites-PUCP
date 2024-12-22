"use client";
import { Button } from "@mui/material";
import CardMenu from "../../../../componentesGenerales/cards/CardMenu";
import { useRouter } from "next/navigation";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { usePersona } from "@/app/PersonaContext";

export default function Solicitudes() {
    const router=useRouter();

    const redirectMatriculaAdicional=()=>{
        router.push('./solicitudes/solicitudMatriculaAdicional/solicitarMatriculaAdicional');
    }

    const redirectListaSolicitudes=()=>{
        router.push('./solicitudes/solicitudMatriculaAdicional/listadoDeSolicitudesAdicionales');
    }

    const {persona}=usePersona();

    const redirectTemaDeTesis = () => {
        fetchSolicitud(); // llama a la función de solicitud directamente al hacer clic
    };
    
    const redirectClick = (id) => {
        // Navegamos a la nueva página pasando el ID en la query string
        router.push(`/alumno/solicitudes/solicitudTemaDeTesis?id=${id}`);
      };

    const fetchSolicitud = async () => {
        try {
            const response = await fetch(`http://localhost:8080/solicitudes/solicitudTemaTesis/buscarPorIdAlumno/${persona.id}`);
            
            if (!response.ok) {
                throw new Error("Error al obtener la solicitud");
            }
    
            // Revisa si hay contenido en la respuesta
            const textData = await response.text(); // Obtiene la respuesta como texto
            if (textData) {
                const data = JSON.parse(textData); // Analiza el texto solo si no está vacío
                //router.push("./solicitudes/solicitudTemaDeTesis"); // Redirige al estado de la solicitud existente
                redirectClick(data.id);
                console.log(data);
            } else {
                // Redirige a la página de registro si no hay solicitud
                router.push("./solicitudes/solicitudTemaDeTesis/registrar");
                console.log("procede al registro");
            }
        } catch (err) {
            console.log(err.message);
        }
    };

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
    const redirectCartaPresentacion=()=>{
        router.push('./solicitudes/solicitudCartaPresentacion');
    }
    const redirectSolicitudModificacion=()=>{
        router.push('./solicitudes/solicitudModificacionDeMatricula');
    }

    return (

        <CardMenu>
            <Button color='white 'fullWidth sx={estilosBotones()}
             startIcon={<InsertDriveFileIcon sx={{ color: '#6D6CD4', marginLeft:'5px'
             }}/>} onClick={redirectMatriculaAdicional}> {/*ManejarClic es la funcion que debes pasar al boton para que sea eso lo que realiza con un clic*/}
             Registrar solicitud de matricula adicional {/*Aqui va el texto para todos los botones del menu*/}
            </Button>

            <Button color='white 'fullWidth sx={estilosBotones()}
             startIcon={<InsertDriveFileIcon sx={{ color: '#6D6CD4', marginLeft:'5px'
             }}/>} onClick={redirectListaSolicitudes}> {/*ManejarClic es la funcion que debes pasar al boton para que sea eso lo que realiza con un clic*/}
             Listado de solicitudes de matricula {/*Aqui va el texto para todos los botones del menu*/}
            </Button>

           <Button color='white 'fullWidth sx={estilosBotones()}
             startIcon={<InsertDriveFileIcon sx={{ color: '#6D6CD4', marginLeft:'5px'
             }}/>} onClick={redirectCartaPresentacion}> {/*ManejarClic es la funcion que debes pasar al boton para que sea eso lo que realiza con un clic*/}
             Solicitud Carta Presentacion {/*Aqui va el texto para todos los botones del menu*/}
           </Button>          


            <Button color='white 'fullWidth sx={estilosBotones()}
             startIcon={<InsertDriveFileIcon sx={{ color: '#6D6CD4', marginLeft:'5px'
             }}/>} onClick={redirectTemaDeTesis}> {/*ManejarClic es la funcion que debes pasar al boton para que sea eso lo que realiza con un clic*/}
             Registro y estado de tema de tesis {/*Aqui va el texto para todos los botones del menu*/}
            </Button>

        </CardMenu>

    );
}