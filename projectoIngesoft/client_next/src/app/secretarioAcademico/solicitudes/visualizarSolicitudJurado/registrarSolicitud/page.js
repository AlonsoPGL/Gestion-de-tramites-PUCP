"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Typography, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ErrorConDescripcion from '../../../../../../componentesGenerales/modales/ErrorConDescripcion';
import SearchIcon from '@mui/icons-material/Search';
import { usePersona } from '@/app/PersonaContext';
import EstaSeguroAccion from '../../../../../../componentesGenerales/modales/EstaSeguroAccion';
import TablaPersonaSolicitudJurado from '../../../../../../componentesDirectorDeCarrera/solicitudJurado/TablaPersonaSolicitudJurado';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
export default function BuscarAlumnoParaTerna() {

  const router=useRouter();
  const { persona } = usePersona();
  const [openAlumnoModal, setOpenAlumnoModal] = useState(false); //Modal para buscar Alumno
  
  const [alumnos, setAlumnos] = useState([]);
  const [asesor,setAsesor] = useState([]); // Para guardar el asesor 
  const [id,setId] = useState(0)
    const [titulo,setTitulo] = useState('');
  const [alumnoBuscado,setAlumnoBuscado] = useState({});//Estado del alumno buscado
  const [openModalSeguro, setOpenModalSeguro] = useState(false); //Estado del modal DE estas Seguro?
  const [openModalError,setOpenModalError] = useState(false);//Estado del modal de error?
//Estado para seleccionar un alumno a editar
const [personaSeleccionada, setPersonaSeleccionada] = useState(null);


         // Estados para la búsqueda de alumno
         const [nuevoNombre, setNuevoNombre] = useState('');
         const [nuevoApellidoPaterno, setNuevoApellidoPaterno] = useState('');
         const [nuevoApellidoMaterno, setNuevoApellidoMaterno] = useState('');
         const [nuevoCodigo, setNuevoCodigo] = useState('');


  //
  const [resultadosAlumnos, setResultadosAlumnos] = useState([]);
  const [alumnosFiltrados, setAlumnosFiltrados] = useState([]);
  const [tesis,setTesis] = useState({});
  const [solicitudTemaTesis,setSolicitudTemaTesis] = useState(null);
  const [hayError, setHayError] = useState(false);// se determina si hay error en el registro al no colocar alumno
  
  useEffect(() => {
    // Solo llama a handleBuscarTesis si alumnoBuscado tiene propiedades (no está vacío)
    if (Object.keys(alumnoBuscado).length > 0) {
      handleBuscarTesis();
    }
  }, [alumnoBuscado]); 
  
  
 /* const handleBuscarAlumno = async () => {
    try {
      const response = await axios.get('http://localhost:8080/rrhh/alumno/buscarPorParametros', {
        params: {
          nombre: nuevoNombre,
          apellidoPaterno:nuevoApellidoPaterno,
          apellidoMaterno: nuevoApellidoMaterno,
          codigo: nuevoCodigo
        },
      });
      console.log(response.data)
      setResultadosAlumnos(response.data);
    } catch (error) {
      console.error("Error en la búsqueda de alumnos", error);
      setResultadosAlumnos([]);
    }
  };*/

  const handleBuscarSolicitudes = async () => {
    try{
      const response = await fetch(`http://localhost:8080/solicitudes/solicitudTemaTesis/listar`)
      const data = await response.json();
      console.log('Datos obtenidos:', data);
      setResultadosAlumnos(data);
      
      const resultadosFiltrados = data.filter((solicitud) => 
        solicitud.estadoAprobacion === "APROBADA" && // Esta condición debe cumplirse para todos
        (
          (nuevoNombre && solicitud.emisor?.nombre.toLowerCase().includes(nuevoNombre.toLowerCase())) ||
          (nuevoApellidoMaterno && solicitud.emisor?.apellidoMaterno.toLowerCase().includes(nuevoApellidoMaterno.toLowerCase())) ||
          (nuevoApellidoPaterno && solicitud.emisor?.apellidoPaterno.toLowerCase().includes(nuevoApellidoPaterno.toLowerCase())) ||
          (nuevoCodigo && String(solicitud.emisor?.codigo).toLowerCase() === nuevoCodigo.toLowerCase())
        )
      );
      const resultadosFiltrados2 = data.filter((solicitud) => 
        solicitud.estadoAprobacion === "APROBADA");
      
      if(!nuevoNombre && !nuevoApellidoMaterno && !nuevoApellidoPaterno && !nuevoCodigo){
        setAlumnosFiltrados(resultadosFiltrados2)
      }
      else{
        setAlumnosFiltrados(resultadosFiltrados)
      }
      
    } catch (error){
      console.error('Error al obtener las solicitudes:', error);
      setResultadosAlumnos([]);
    }
  }
// Crear la solicitud Jurado
const solicitudData = {
  solicitud: {
    emisor: {
      id: persona.id
    },
    fechaCreacion: new Date().toISOString(),
    correo: persona.email,
    estado: "EN_PROCESO",
    tipo: "SOLICITUD_JURADOS"

  },
  solicitudJurado: {
    idTesis: id,
    jurado: [],
    
  }
}
  //para agregar el alumno buscado
  const handleEstablecerSolicitudTema = (solicitud) => {
    
    setTesis(solicitud.tesis)
    setTitulo(solicitud.tesis.titulo)
    setAsesor(solicitud.tesis.asesores)
    setSolicitudTemaTesis(solicitud)
    setAlumnos(solicitud.tesis.integrantes)
    handleCloseAlumnoModal(); // Cierra el diálogo
  };
  
  const handleBuscarTesis = async () => {
       try {
      const response = await axios.get(`http://localhost:8080/solicitudes/tesis/listarPorAlumno/${alumnoBuscado.id}`);
      console.log(response.data)
      if(response.data.length != 0){
        setTesis(response.data[0])
        setTitulo(response.data[0].titulo)
        setAsesor(Array.isArray(response.data[0].asesores) ? response.data[0].asesores : [response.data[0].asesores])
        setSolicitudTemaTesis(response.data[0].solicitudTemaTesis)

        
        setAlumnos(response.data[0].integrantes)
      }
      

    } catch (error) {
      console.error("Error en la obtencion de tesis", error);
      setTesis([]);

    } 


  };
  const handleCloseAlumnoModal = () => setOpenAlumnoModal(false);//Cierra modal de alumno
  const handleClickOpenAlumnoModal = () => setOpenAlumnoModal(true); //Abre  modal de alumno
  const handleGuardar = () =>{
    if(alumnos.length === 0){
      console.log("Error: debe colocar un alumno para obtener la informacion de tesis");
      setHayError(true)
      setOpenModalError(true);
    }else{
      setHayError(false)
      setOpenModalSeguro(true);
    }
  }
   
  const handleCloseModalSeguro = () => setOpenModalSeguro(false); //Cierra modal de "Estas seguro?"
  const handleCloseModalError = () => setOpenModalError(false); //Cierra el modal de error
  const redirigirASolicitudesJurado = async () => {
    const solicitudJurado = {
       
      asesor: {id: tesis.asesores[0].id},
      coAsesor: {id: tesis.asesores[1] ? tesis.asesores[1].id : null},
      emisor: persona?.id ? { id: persona.id } : null,
      receptor: null,
      correo: persona.email,
      motivo: "Peticion de la terna de jurado",
      estado: "EN_PROCESO",
      fechaCreacion: new Date().toISOString(),
      observacion: "",
      documento: null,
      tipo: "SOLICITUD_JURADOS",
      temaTesis: tesis.titulo,
      tesis: {id: tesis.id},
      jurados: [],
    };
    console.log("Datos enviados:", JSON.stringify(solicitudJurado));
    try {
      const response = await axios.post('http://localhost:8080/solicitudes/jurados/insertar2', solicitudJurado, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Solicitud insertada:', response.data);
      router.push('../listaSolicitudJurado');
    } catch (error) {
      console.error('Error al actualizar la solicitud:', error);
    }


    router.push('./');
  }

    //! Obteniendo el archivo de la solicitud
    
    const fetchArchivo = async () => {
        if (solicitudTemaTesis) { // Asegúrate de que la solicitud esté disponible
            try {
                const response = await fetch(`http://localhost:8080/solicitudes/solicitudTemaTesis/buscarDocumentoSolicitudTesis/${solicitudTemaTesis.id}`);
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



  return (
    <Box sx={{ backgroundColor: 'white', color: 'white', height: '100vh', marginBottom: '20px' }}>
      <Box
        sx={{
          marginLeft: '220px',
          height: '100vh',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
                {/* Título de la página */}
                <Typography variant="h4" sx={{ fontWeight: 'bold',marginLeft: '20px', color: 'black' }}>SOLICITUD DE ASIGNACIÓN DE JURADO</Typography>
        <Box sx={{ marginLeft: '20px', marginRight: '20px', marginTop: '20px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            {/* Seccion de Alumnos */}
          <Typography variant="h6" color="black" sx={{ fontWeight: 'bold', color: 'black' }}>Alumnos:</Typography>
          <Button sx={{ backgroundColor: '#363581' }} variant="contained" startIcon={<SearchIcon />}onClick={handleClickOpenAlumnoModal}>
          Buscar Alumno
        </Button>
        </Box>
        {/* Tabla de Alumnos */}

          <TablaPersonaSolicitudJurado personas={alumnos}></TablaPersonaSolicitudJurado>
        </Box>

        {/* Sección de Título */}
        <Box sx={{ marginTop: '20px', marginLeft: '20px' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
            Título
          </Typography>
          <TextField 
            variant="outlined" 
            disabled 
            defaultValue={titulo} 
            fullWidth
            sx={{ marginTop: '10px', marginBottom: '16px' }} 
          />
        </Box>
        <Box sx={{ display: "flex", marginBottom: '20px', alignItems: 'center' }}>
                  <Typography  sx={{ color: 'black', fontWeight: 'bold',marginLeft:'20px'}} >Tema de tesis: </Typography>
                  {solicitudTemaTesis && (
    <Button variant="contained" sx={{ marginLeft: '20px' }} onClick={handleDescargaPdf}>
      <PictureAsPdfIcon sx={{ marginRight: '10px' }} />
      Descargar
    </Button>
  )}
                  </Box>     
        <Box sx={{display:'flex'}}></Box>
        {/* Encabezado "Asesor" */}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', marginLeft: '20px' }}>
          <Typography variant="h6" color="black" sx={{ fontWeight: 'bold', color: 'black' }}>Asesor:</Typography>
        </Box>

        {/* Tabla de Asesor */}
        <Box sx={{ marginLeft: '20px', marginRight: '20px', marginTop: '10px' }}>
        <TablaPersonaSolicitudJurado personas={asesor}></TablaPersonaSolicitudJurado>
        </Box>
    <Dialog open={openAlumnoModal} onClose={handleCloseAlumnoModal} maxWidth="md" fullWidth>
    <DialogTitle>Buscar Alumno</DialogTitle>
    <DialogContent>
    <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Nombre"
            variant="outlined"
            fullWidth
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Apellido Paterno"
            variant="outlined"
            fullWidth
            value={nuevoApellidoPaterno}
            onChange={(e) => setNuevoApellidoPaterno(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Apellido Materno"
            variant="outlined"
            fullWidth
            value={nuevoApellidoMaterno}
            onChange={(e) => setNuevoApellidoMaterno(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Código"
            variant="outlined"
            fullWidth
            value={nuevoCodigo}
            onChange={(e) => setNuevoCodigo(e.target.value)}
          />
        </Grid>
        {/* Botón de búsqueda */}
        <Grid item xs={12} sx={{ marginBottom: '20px' }} textAlign="center">
            <Button variant="contained" color="primary" onClick={handleBuscarSolicitudes}>
              Buscar
            </Button>
          </Grid>
      </Grid>

      <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#3f51b5' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Código</TableCell>
                  <TableCell sx={{ color: 'white' }}>Nombre Completo</TableCell>
                  <TableCell sx={{ color: 'white' }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
        {alumnosFiltrados.length > 0 ? (
          alumnosFiltrados.map((solicitud, index) => (
            <TableRow key={index}>
              <TableCell>{solicitud.emisor.codigo}</TableCell>
              <TableCell>{solicitud.emisor.nombre+' '+solicitud.emisor.apellidoPaterno+' '+solicitud.emisor.apellidoMaterno}</TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEstablecerSolicitudTema(solicitud)}
                  size="small"
                  style={{ textTransform: 'none' }}
                >
                  Seleccionar
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} align="center">
              No se encontraron resultados
            </TableCell>
          </TableRow>
        )}
      </TableBody>
            </Table>
          </TableContainer>
        </Grid>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseAlumnoModal} color="primary">
        Cerrar
      </Button>
    </DialogActions>
  </Dialog>  
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <Button variant="outlined" color="secondary" onClick={() => router.back()}>
          Regresar
        </Button>
        <Button sx={{ backgroundColor: '#363581' }} variant="contained" color="primary" onClick={handleGuardar}>
        Guardar
      </Button>
      <EstaSeguroAccion 
  open={openModalSeguro} 
  onClose={handleCloseModalSeguro} 
  handleAceptar={redirigirASolicitudesJurado} 
/>
<ErrorConDescripcion 
  texto="Error: debe colocar un alumno para obtener la información de tesis" 
  open={openModalError} 
  onClose={handleCloseModalError} 
/>
      </Box>
      </Box>
      
    </Box>
    
    
  );
}