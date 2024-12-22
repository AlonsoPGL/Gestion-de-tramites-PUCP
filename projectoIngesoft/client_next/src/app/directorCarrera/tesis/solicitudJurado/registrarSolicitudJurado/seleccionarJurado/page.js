"use client";
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter,useSearchParams} from 'next/navigation';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Typography, IconButton, MenuItem, Select, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { usePersona } from '@/app/PersonaContext';
import TablaPersonaSolicitudJurado from '../../../../../../../componentesDirectorDeCarrera/solicitudJurado/TablaPersonaSolicitudJurado';
import EstaSeguroAccion from '../../../../../../../componentesGenerales/modales/EstaSeguroAccion';
import ErrorConDescripcion from '../../../../../../../componentesGenerales/modales/ErrorConDescripcion';
import BusquedaDocente from 'componentesGenerales/modales/BusquedaDocente';
export default function seleccionarJurado() {
  const router=useRouter();
  const [ternaJurado,setTernaJurado] = useState([]);
  const { persona } = usePersona(); //obteniendo los datos de la persona
  //Estados para buscar docentes
  const [nuevoNombreDocente, setNuevoNombreDocente] = useState('');
  const [nuevoApellidoPaternoDocente, setNuevoApellidoPaternoDocente] = useState('');
  const [nuevoApellidoMaternoDocente, setNuevoApellidoMaternoDocente] = useState('');
  const [nuevoCodigoDocente, setNuevoCodigoDocente] = useState('');  
  

  const [openDocenteModal, setOpenDocenteModal] = useState(false); //Modal para buscarJurado
  const [openModalSeguro, setOpenModalSeguro] = useState(false); //Estado del modal DE estas Seguro?
  const [openModalError,setOpenModalError] = useState(false);//Estado del modal de error?


  const [resultadosDocente, setResultadosDocente] = useState([]);//Para almacenar los resultados de la busqueda
  const [indexDocenteSeleccionado, setIndexDocenteSeleccionado] = useState(null);
  const [hayError, setHayError] = useState(false);// se determina si hay error en el registro al no tener 3 jurados
  useEffect(() => {
    console.log("Actualizado ternaJurado:", ternaJurado);
  }, [ternaJurado]);

  const handleBuscarDocente = async () => {
    try {
      const response = await axios.get('http://localhost:8080/rrhh/docente/buscarPorParametros', {
        params: {
          nombre: nuevoNombreDocente,
          apellidoPaterno:nuevoApellidoPaternoDocente,
          apellidoMaterno: nuevoApellidoMaternoDocente,
          codigo: nuevoCodigoDocente
        },
      });
      console.log(response.data)
      setResultadosDocente(response.data);
    } catch (error) {
      console.error("Error en la búsqueda de docentes", error);
      setResultadosDocente([]);
    }
  };

  const handleGuardar = () =>{
    if(ternaJurado.length !== 3){
      console.log("Error: los jurados seleccionados deben ser 3");
      setHayError(true)
      setOpenModalError(true);
    }else{
      setHayError(false)
      setOpenModalSeguro(true);
    }
  }



//abre el modal de docente
  const handleClickOpenDocenteModal = () => {
    setOpenDocenteModal(true);
  };   
    //Cierra modal de docente
    const handleCloseDocenteModal = () => {
      setOpenDocenteModal(false);
    }; 
    const handleCloseModalSeguro = () => setOpenModalSeguro(false); //Cierra modal de "Estas seguro?"
    const handleCloseModalError = () => setOpenModalError(false); //Cierra el modal de error
    const handleCloseModalDocente = () => setOpenDocenteModal(false); //Cierra el modal de error

    const redirigirASolicitudesJurado = async () =>{


    // Creando la solicitud
    /*
    const solicitudJurados = {
      solicitud: {
        id: solicitudObtenida.id,
        asesor: {
          id: solicitudObtenida.asesor.id
        },
        coAsesor: {
          id: solicitudObtenida.coAsesor.id
        },
        emisor: {
          id: persona.id // Cambia este valor según el ID del emisor
        },
        fechaCreacion: new Date().toISOString(), // Fecha de creación actual
        correo: persona.email, // Correo del emisor
        estado: "ACEPTADA", // Estado de la solicitud
        tipo: "SOLICITUD_JURADOS", // Tipo de solicitud
        temaTesis: solicitudObtenida.temaTesis,
      },
      solicitudJurados: {
        tesis: {
          id: solicitudObtenida.tesis.id
        },
        jurados: ternaJurado
      }
    };*/
    const solicitudJurados = {
      id: solicitudObtenida.id, 
      receptor: { id: persona.id},
      estado: "ACEPTADA",
      jurados: ternaJurado,
    };
    console.log("Datos enviados:", JSON.stringify(solicitudJurados));
    try {
      const response = await axios.put(`http://localhost:8080/solicitudes/jurados/actualizar2/${solicitudObtenida.id}`, solicitudJurados, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Solicitud actualizada:', response.data);
      router.push('../listaSolicitudJurado');
    } catch (error) {
      console.error('Error al actualizar la solicitud:', error);
    }
    }

    const [solicitudObtenida,setSolicitud] = useState({});
    const searchParams = useSearchParams(); // Obtener los parámetros de búsqueda
    const id = searchParams.get('id'); // Obtener el parámetro 'id' de la URL
    useEffect(() => {
      if (id) {
          const fetchSolicitud = async () => {
          try{
              const response = await fetch(`http://localhost:8080/solicitudes/jurados/obtenerSolicitud/${id}`)
              const data = await response.json();
              console.log('Datos obtenidos:', data);
              setSolicitud(data);
          } catch (error){
              console.error('Error al obtener la solicitud:', error);
          }
      };
      fetchSolicitud();
  }
    },[id])

    return(
      <Box sx={{ backgroundColor: 'white', color: 'black', height: '100vh', paddingLeft: '240px', paddingTop: '20px' }}>

      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black', marginBottom: '20px' }}>
        SOLICITUD DE JURADO
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', marginLeft: '20px' }}>
          <Typography variant="h6" color="black" sx={{ fontWeight: 'bold', color: 'black' }}>Terna de jurado:</Typography>

        </Box>
        
      <Box sx={{marginLeft:'20px',marginRight:'20px', marginTop:'10px'}}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
    <Button sx={{ backgroundColor: '#363581' }} variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleClickOpenDocenteModal}>
      Agregar jurado
    </Button>
  </Box>
            <TablaPersonaSolicitudJurado personas={ternaJurado}></TablaPersonaSolicitudJurado>
        </Box>

<BusquedaDocente open={openDocenteModal} onClose={handleCloseModalDocente} 
  alumnos={ternaJurado} setAlumnos={setTernaJurado}/>

      <Box display="flex" justifyContent="space-between" mt={1} sx={{marginRight:'20px'}}>


    <Button variant="outlined" sx={{position:'end', marginRight:''}} onClick={() => router.back()}>Regresar</Button>


<Button sx={{ backgroundColor: '#363581'}} variant="contained" color="primary" onClick={handleGuardar}>
  Guardar
</Button>
<EstaSeguroAccion 
  open={openModalSeguro} 
  onClose={handleCloseModalSeguro} 
  handleAceptar={redirigirASolicitudesJurado} 
/>
<ErrorConDescripcion 
  texto="Error: la cantidad de jurados deben ser 3" 
  open={openModalError} 
  onClose={handleCloseModalError} 
/>
</Box>
      </Box>
    );
}