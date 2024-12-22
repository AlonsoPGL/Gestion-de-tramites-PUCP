"use client";
import { Box,Typography ,TextField,Button} from "@mui/material";
import { useState,useEffect } from "react";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { usePersona } from "@/app/PersonaContext";
import TablaAlumnosParticipantesTesis from "componentesAlumno/solicitudDeTemaTesis/TablaAlumnosParticipantesTesis";
import { useRouter ,useSearchParams} from "next/navigation";
import ListaComentarios from "componentesAsesor/ListaComentarios";

export default function VisualizarSolicitud() {
    //! obteniedno la ultima solicitud (si es que existe, sino retornara null)
  const [solicitud,setSolicitud]=useState(null);
  const { persona } = usePersona(); //obteniendo los datos de la persona
  const [comentarios,setComentarios] = useState([]);

    if (solicitud && solicitud.tesis.documento) {
        const url = URL.createObjectURL(solicitud.tesis.documento);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'documento_tesis.pdf'; // Cambia el nombre del archivo si es necesario
        a.click();
        URL.revokeObjectURL(url); // Libera el objeto URL después de la descarga
    } else {
        console.log('No hay documento disponible para descargar.');
    }

    const router=useRouter();
    const searchParams = useSearchParams(); // Obtener los parámetros de búsqueda
    const id = searchParams.get('id'); // Obtener el parámetro 'id' de la URL

    const handleClickRetroceder = () =>{
      if (id) {
        // Redirigir a la página anterior con el mismo parámetro 'id'
        router.push(`/alumno/solicitudes/solicitudTemaDeTesis?id=${id}`);
      } else {
        console.error("El parámetro 'id' no está disponible.");
      }
    }

      //Aca se conseguira la solicitud sin su archivo, ya que este pesa demasiado
  useEffect(() => {
    const fetchSolicitud = async () => {
        try {
            const response = await fetch(`http://localhost:8080/solicitudes/solicitudTemaTesis/buscarPorIdAlumno/${persona.id}`);
            
            if (!response.ok) {
                throw new Error('Error al obtener la solicitud');
            }
            
            const data = await response.json();
            
            // Verifica si se encontró una solicitud
            if (data) {
            setSolicitud(data);
            setComentarios(data.comentarios);
              console.log("procede al editado");
              console.log(data);
            } else {
            setSolicitud(null); // Si no se encontró, establece solicitud como null
              console.log("procede al registro");
            }
        } catch (err) {
            console.log(err.message); // Maneja el error
        }
    };
    

    fetchSolicitud();
}, []); // Dependencia: se ejecuta cuando alumnoId cambia

//! Obteniendo el archivo de la solicitud

const fetchArchivo = async () => {
    if (solicitud) { // Asegúrate de que la solicitud esté disponible
        try {
            const response = await fetch(`http://localhost:8080/solicitudes/solicitudTemaTesis/buscarDocumentoSolicitudTesis/${solicitud.id}`);
            if (!response.ok) {
                throw new Error('Error al obtener el archivo de la solicitud');
            }

            // Obtén el blob directamente de la respuesta
            const blob = await response.blob();
            if (blob) {
                const url = URL.createObjectURL(blob); // Crea un objeto URL para el blob
                const a = document.createElement('a');
                a.href = url;
                a.download = 'documento_tesis.pdf'; // Cambia el nombre del archivo si es necesario
                a.click();
                URL.revokeObjectURL(url); // Libera el objeto URL después de la descarga
                console.log("Archivo listo para descargar.");
            } else {
                console.log("El archivo no se pudo obtener.");
            }
        } catch (err) {
            console.log(err.message);
        }
    } else {
        console.log('No se puede obtener el archivo sin una solicitud válida.');
    }
};

const handleDescargaPdf = () => {
    fetchArchivo(); // Llama a la función para obtener y descargar el archivo
};

    return(
        <Box sx={{ backgroundColor: 'white', color: 'black', height: '100vh' }}>
        {solicitud ? (  
          <Box
            sx={{
              marginLeft: '220px',
              height: '100vh',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            
            {/*Aqui se realiza la visualizacion detallada por parte del alumno*/}
            <Box>
              <Typography variant='h5'>Resumen de la solicitud enviada</Typography>
              <Box
            sx={{
  
            }}
          >
            <Box
              sx={{
              }}
            >
              <Typography variant="h6" sx={{ marginBottom: '10px' }}>1. Lista de alumnos</Typography>
              <Box sx={{ marginLeft: '15px' }}>
                <TablaAlumnosParticipantesTesis alumnos={solicitud.tesis.integrantes} />
              </Box>
  
              <Box sx={{ marginLeft: '15px' }}>
                <Typography variant="h6" sx={{ marginBottom: '10px' }}>2. Información sobre el tema de tesis</Typography>
                <Box sx={{ display: "flex", marginBottom: '20px', alignItems: 'center' }}>
                  <Typography>Título: </Typography>
                  <TextField
                    size="small"
                    disabled
                    value={solicitud.tesis.titulo} // Asigna el valor actual del estado al TextField
                    //onChange={handleChangeTemaTesis} // Llama a la función cuando cambia el valor
                    sx={{
                      width: "400px",
                      marginLeft: '20px',
                      '& .MuiInputBase-root': {
                        height: '39px', // Ajusta la altura
                      },
                      fontSize: '15px', // Ajusta el tamaño del texto dentro del TextField
                    }}
                  />
                </Box>
  
                <Box sx={{ display: "flex", marginBottom: '20px', alignItems: 'center' }}>
                  <Typography>Tema de tesis: </Typography>
                    <Button variant="contained" sx={{ marginLeft: '20px' }} onClick={handleDescargaPdf}>
                      <PictureAsPdfIcon sx={{marginRight:'10px'}}></PictureAsPdfIcon>
                      Descargar
                    </Button>
                  </Box>
  
                  <Box sx={{ marginTop: '20px', display: "flex", alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ marginBottom: '10px' }}>3. Registro de asesores</Typography>
                  </Box>
                  <TablaAlumnosParticipantesTesis alumnos={solicitud.tesis.asesores} />

                  <Box sx={{marginLeft:'20px',marginRight:'20px'}}>
                    <ListaComentarios comentarios={comentarios} ></ListaComentarios>
                </Box> 

                  <Box sx={{ mt: '20px', ml: '10px', mr: '10px', display: 'flex', justifyContent: "center" }}>
                    <Button variant='outlined' onClick={handleClickRetroceder} sx={{ width: '170px' ,marginRight:'20px'}}>Atrás</Button>
                </Box>
                </Box>
              </Box>
            </Box>
            
          </Box>
      </Box>):(
        <Typography>Cargando...</Typography>
      )}
      )
    </Box>
    );
}
