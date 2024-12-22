"use client";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { usePersona } from "@/app/PersonaContext";
import TablaAlumnosParticipantesTesis from "componentesAlumno/solicitudDeTemaTesis/TablaAlumnosParticipantesTesis";
import { useRouter } from "next/navigation";
import {useUnidad} from "@/app/UnidadContex";
import BusquedaAlumno from "componentesGenerales/modales/BusquedaAlumno";
import BusquedaDocente from "componentesGenerales/modales/BusquedaDocente";


export default function RegistrarSolicitud() {
  const { unidad } = useUnidad();
const router=useRouter();

const handleClickRetroceder = () =>{
  router.back();
}

const [existeArchivo, setExisteArchivo] = useState(false);
const [archivo, setArchivo] = useState(null); // Estado para almacenar el archivo
const fileInputRef = useRef(null); // Referencia al input de archivo

const handleFileChange = (event) => {
  const file = event.target.files[0]; // Obtén el archivo seleccionado
  if (file) {
    setArchivo(file); // Actualiza el archivo en el estado
    setExisteArchivo(true); // Marca que ya existe un archivo
  }
};

const handleButtonClick = () => {
  fileInputRef.current.click(); // Simula el clic en el input oculto
};

const lblArchivo = () => {
  return existeArchivo ? archivo.name : "Suba un archivo";
};

//!Onclick y Modales del alumno

const [openLocal, setOpen] = useState(false);

const handleAgregarAlumno = () =>{
  setOpen(true);
}
const handleClose = () => setOpen(false);
//!useState para manejar alumnos en modal
const [alumnos,setAlumnos]=useState([]);

//!Onclick y Modales del docente

const [openLocalDocente, setOpenDocente] = useState(false);

const handleAgregarDocente=()=>{
  setOpenDocente(true);
}

const handleCloseDocente = () => setOpenDocente(false);
//!useState para manejar docentes en modal
const [docentes,setDocentes]=useState([]);

//! Registro de la solicitud
  //Construccion de objetos 
  const [temaTesis, setTemaTesis] = useState("");

  const handleChangeTemaTesis = (event) => {
    setTemaTesis(event.target.value); // Actualiza el estado con el valor del input
  };

  const EstadoAprobacion = {
    EN_REVISION_POR_ASESOR: "EN_REVISION_POR_ASESOR",
    OBSERVADO_POR_ASESOR: "OBSERVADO_POR_ASESOR",
    EN_REVISION_POR_COORDINADOR: "EN_REVISION_POR_COORDINADOR",
    OBSERVADO_POR_COORDINADOR: "OBSERVADO_POR_COORDINADOR",
    EN_REVISION_POR_DIRECTOR: "EN_REVISION_POR_DIRECTOR",
    OBSERVADO_POR_DIRECTOR: "OBSERVADO_POR_DIRECTOR",
    APROBADA: "APROBADA"
  };

  const { persona } = usePersona(); //obteniendo los datos de la persona


  //! obteniedno la ultima solicitud (si es que existe, sino retornara null)
  const [solicitud,setSolicitud]=useState(null);

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
              //setSocilitud(data);
              console.log("procede al editado");
              setSolicitudEnviada(true);
              console.log(data);
            } else {
              //setSocilitud(null); // Si no se encontró, establece solicitud como null
              console.log("procede al registro");
            }
        } catch (err) {
            console.log(err.message); // Maneja el error
        }
    };
    

    fetchSolicitud();
}, []); // Dependencia: se ejecuta cuando alumnoId cambia


const handleClickAceptar = async () => {
  console.log(solicitud);
  if (solicitud == null) {
    // Creando la solicitud
    let archivoBase64 = null;
    if (archivo) {
      const reader = new FileReader();
      reader.onload = () => {
        archivoBase64 = reader.result.split(',')[1]; // Obtener solo los datos Base64
      };
      reader.readAsDataURL(archivo);
      await new Promise((resolve) => (reader.onloadend = resolve)); // Espera a que se complete la conversión
    }

    const Tesis = {
      titulo: temaTesis,
      integrantes: alumnos,
      asesores: docentes,
    };

    const solicitudData = {
      emisor: {
        id: persona.id,
      },
      fechaCreacion: new Date().toISOString(),
      correo: persona.email,
      estado: "EN_PROCESO",
      tipo: "SOLICITUD_TEMA_TESIS",
      estadoAprobacion: EstadoAprobacion.EN_REVISION_POR_ASESOR,
      tesis: { ...Tesis },
      documento: archivoBase64,
    };

    console.log("Datos de la solicitud:", solicitudData); // Verifica los datos enviados
    console.log(unidad);
    try {
      console.log(unidad.idUnidad);
      const response = await fetch(`http://localhost:8080/solicitudes/solicitudTemaTesis/insertar?unidadId=${unidad.idUnidad}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(solicitudData),
      });

      if (!response.ok) {
        const errorText = await response.text(); // Lee la respuesta del servidor para obtener más detalles
        throw new Error(`Error: ${response.statusText} - ${errorText}`);
      }

      const text = await response.text();
      console.log('Respuesta del servidor:', text);

      // Redirigir a la página de listado de solicitudes si es necesario
      router.push('/alumno/solicitudes');
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
    }
  } else {
    // si la solicitud ya existe o fue inicializada se procede a cargar los datos
  }
};

    return(
        <Box
          sx={{
            marginLeft: '220px',
            height: '100vh',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h5" sx={{ marginLeft: '15px' }}>
            Registrar solicitud de tema de tesis
          </Typography>
          <Box
            sx={{
              marginLeft: '15px',
              marginTop: '20px',
              display: "flex",
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: '10px' }}>1. Registro de alumnos</Typography>
            <Button variant="contained" sx={{ marginLeft: '15px', marginBottom: '10px' }} onClick={handleAgregarAlumno}>
              Agregar
            </Button>
            <BusquedaAlumno open={openLocal} onClose={handleClose} alumnos={alumnos} setAlumnos={setAlumnos} />
          </Box>
          <Box sx={{ marginLeft: '15px' }}>
            <TablaAlumnosParticipantesTesis alumnos={alumnos} />
          </Box>

          <Box sx={{ marginLeft: '15px' }}>
            <Typography variant="h6" sx={{ marginBottom: '10px' }}>2. Información sobre el tema de tesis</Typography>
            <Box sx={{ display: "flex", marginBottom: '20px', alignItems: 'center' }}>
              <Typography>Título: </Typography>
              <TextField
                size="small"
                label="Ingrese el nombre de su tema de tesis..."
                value={temaTesis} // Asigna el valor actual del estado al TextField
                onChange={handleChangeTemaTesis} // Llama a la función cuando cambia el valor
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
              <Button variant="contained" sx={{ marginLeft: '20px' }} onClick={handleButtonClick}>
                Examinar
              </Button>
              <TextField
                size="small"
                disabled
                label={lblArchivo()}
                sx={{
                  '& .MuiInputBase-root': {
                    height: '39px', // Ajusta la altura
                  },
                  fontSize: '15px', // Ajusta el tamaño del texto dentro del TextField
                }}
              />
              {/* Input file oculto */}
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </Box>

            <Box sx={{ marginTop: '20px', display: "flex", alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ marginBottom: '10px' }}>3. Registro de asesores</Typography>
              <Button variant="contained" sx={{ marginLeft: '20px', marginBottom: '10px' }} onClick={handleAgregarDocente}>
                Agregar
              </Button>
              <BusquedaDocente open={openLocalDocente} onClose={handleCloseDocente} alumnos={docentes} setAlumnos={setDocentes} />
            </Box>
            <TablaAlumnosParticipantesTesis alumnos={docentes} />
          </Box>

          <Box sx={{ mt: '20px', ml: '10px', mr: '10px', display: 'flex', justifyContent: "center" }}>
            <Button variant='outlined' onClick={handleClickRetroceder} sx={{ width: '170px' ,marginRight:'20px'}}>Cancelar</Button>
            <Button variant='contained' onClick={handleClickAceptar} sx={{ width: '170px' }}>Registrar</Button>
          </Box>

        </Box>
    );
}