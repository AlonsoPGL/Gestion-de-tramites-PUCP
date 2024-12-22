"use client";

import { Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import axios from 'axios';
import CardRol from "componentesSeleccionPerfil/CardRol";
import { usePersona } from '../PersonaContext';
import { useUnidad } from '../../../src/app/UnidadContex'; 
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

//! Esta pantalla recibira una lista de los roles del usuario y evaluara que se debe o no renderizar

export default function SeleccionPerfil() {
  const router = useRouter();
  const { persona } = usePersona();
  const [roles, setRoles] = useState([]); // Guardar los roles obtenidos de la API
  const { setUnidad } = useUnidad();  // Agrega esta línea para obtener setRol del contexto
  /*
  const [esDocente, setEsDocente] = useState(true);
  const [esDirector, setEsDirector] = useState(false);
  const [esSecretarioAcademico, setEsSecretarioAcademico] = useState(false);
  const [esAlumno, setEsAlumno] = useState(false);
  const [esComiteSeleccion, setEsComiteSeleccion] = useState(false);
  const [esCoordinadorSeccion, setEsCoordinadorSeccion] = useState(false);
  const [esCoordinadorArea, setEsCoordinadorArea] = useState(false);
  const [esSecretariaEspecialidad, setEsSecretariaEspecialidad] = useState(false);

  const [permisosDocente, setPermisosDocente] = useState([]);
  const [permisosDirector, setPermisosDirector] = useState([]);
  const [permisosSecretarioAcademico, setPermisosAcademico] = useState([]);
  const [permisosAlumno, setPermisosAlumno] = useState([]);
  const [permisosComiteSeleccion, setPermisosComiteSeleccion] = useState([]);
  const [permisosCoordinadorSeccion, setPermisosCoordinadorSeccion] = useState([]);
  const [permisosCoordinadorArea, setPermisosCoordinadorArea] = useState([]);
  const [permisosSecretariaEspecialidad, setPermisosSecretariaEspecialidad] = useState([]);
*/
  useEffect(() => {
    // Verificar que la persona exista antes de realizar el fetch
    if (persona && persona.id) {
      const fetchRoles = async () => {
        try {
          console.log("IDDD",persona.id);
          const response = await axios.get(`http://localhost:8080/gestUsuario/personaRolUnidad/PersonaPorRoles?idPersona=${persona.id}`);
          
          setRoles(response.data);
        } catch (error) {
          console.error('Error al obtener roles activos:', error);
        }
      };

      fetchRoles();
    }
  }, [persona]);

  const handleRoleClick = (rol) => {
      setUnidad(rol);  // Establecemos el rol seleccionado en el contexto
      //!aqui se podria obtener los permisos en un arreglo y guardarlo en un context, para que la barra lateral simplemente consulte el context
      router.push('./home'); //Se manda id de rol al home
  };

  /*useEffect=()=>{
      //!Aqui se hace fetch para conseguir los permisos del rol o roles que tenga el usuario.
      if(esDocente){
          //!fetch permisos 
      }
      if(esDirector){
          //!fetch permisos 
      }
      if(esSecretarioAcademico){
          //!fetch permisos 
      }
      if(esAlumno){
          //!fetch permisos 
      }
      if(esComiteSeleccion){
          //!fetch permisos 
      }
      if(esCoordinadorSeccion){
          //!fetch permisos 
      }
      if(esCoordinadorArea){
          //!fetch permisos 
      }
      if(esSecretariaEspecialidad){
          //!fetch permisos 
      }
      
      
  },[]*/

  const [imagenDocente, setImagenDocente] = useState(null);

  if (!persona) {
    return <div>Acceso denegado. Debes estar logueado.</div>;
  }

  return (
    <>
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: '70px',
            justifyContent: 'center',
            marginTop: '0px',
            marginBottom: '50px',
            backgroundColor: '#363581',
          }}
        >
          <Button
            onClick={() => router.push('./')}
            sx={{
              color: 'white',
              marginRight: '20px',
              minWidth: 'auto',
            }}
          >
            <ArrowBackIcon />
          </Button>
          <Typography variant="h3" color="white">
            ¿Qué perfil desea utilizar?
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            margin: "40px",
            marginTop: "70px",
            justifyContent: "center",
            justifyItems: "center",
            flexWrap: "wrap", // Para que los roles se ajusten si hay más de uno
          }}
          
        >
          {roles.map((rolPersonaUnidad) => (
            <Box key={rolPersonaUnidad.id} sx={{ margin: "10px" }} onClick={() => handleRoleClick(rolPersonaUnidad)}>
              <CardRol
                rol={rolPersonaUnidad.rolNombre} // Mostrar el nombre del rol
                tipoUnidad = {rolPersonaUnidad.tipo}
                unidadEspecifica = {rolPersonaUnidad.unidadNombre}
                
              />
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}