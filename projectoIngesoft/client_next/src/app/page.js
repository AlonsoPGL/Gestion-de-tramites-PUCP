//page principal
"use client";
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Box } from '@mui/material';
import './globals.css';
import { useRouter } from 'next/navigation';
import { PersonaContext } from './PersonaContext.js';
import { InstitucionContext, useInstitucion } from './InstitucionContext';
import CircularProgress from '@mui/material/CircularProgress';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import ErrorConDescripcion from 'componentesGenerales/modales/ErrorConDescripcion';

//import { InstitucionContext } from './InstitucionContext';

const sizeLabel = 13;

///Aqui se configuraria o modificaria el valor del logo y nombre esto dependera de la pagina de configuracion
const nombreInstitucion = "ONE-PUCP";
//
const logoInstitucion = "https://d9hhrg4mnvzow.cloudfront.net/fabricum.pucp.edu.pe/landing/diseno-de-sistemas-de-riego/db44e0cf-logo-pucp-blanco-mesa-de-trabajo-1-mesa-de-trabajo-1_1000000000000000000028.png"; //cambiar por link o bytes[] del logo

function App() {
  const [institucionBD, setInstitucionBD] = useState({}); // Estado para la institución
  const [isLoading,setIsLoading]=useState(true);

  const { setInstitucion }=useContext(InstitucionContext);
  
  const {logout}=useInstitucion();
  const [openModalError,setOpenModalError] = useState(false);
  const handleCloseModalError = () => setOpenModalError(false);

  useEffect(() => {
    logout(); // Limpia la sesión al iniciar
    obtenerInstitucion();
  }, []);


  const obtenerInstitucion = async () => {
    try {
      const response = await axios.get('http://localhost:8080/institucion/institucion/obtener/1');
      logout();
      const responseInsitucionAxios = response.data; // Guardamos la data de la persona en una variable local 
      setInstitucionBD(responseInsitucionAxios); // Almacenar la institución
      setInstitucion(responseInsitucionAxios);
      setIsLoading(false);
      console.log(responseInsitucionAxios); // Verifica los datos recibidos
    } catch (error) {
      console.error('Error al obtener institución:', error);
    }
  };

    

  //UseStates para almacenar la información de campos: usuario y password
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const { setPersona } = useContext(PersonaContext);

  //const { institucion, setInstitucion } = useContext(InstitucionContext); // Utilizamos el contexto de Institucion

  const [dataPersonaLocal, setDataPersonaLocal] = useState(null);

  const actualizarUsuario = (event) => {
    setUsuario(event.target.value); // Actualizamos la variable de estado con el valor del input
  };

  const actualizarPassword = (event) => {
    setPassword(event.target.value); // Actualizamos la variable de estado con el valor del input
  };

  //useEffect (logica para redigir a otra página):
  const [estaLogeado, setEstaLogeado] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    // Si la condición se cumple, redirige a otra página
    if (estaLogeado) { //if para ver si esta logeado

      router.push('/seleccionPerfil'); // Redirige al home, donde ahi cargarán los permisos de esa persona

    }
  }, [estaLogeado]);

  // Función para manejar el envío de usuario y contraseña al back, retornara una persona con cuenta
  const handleClickLogin = async (e) => {
    //e.preventDefault();
    try {
      // Hacemos una solicitud POST a la API Spring Boot (Este endPoint varia, cuidado aun no se revisa)
      const response = await axios.get('http://localhost:8080/rrhh/persona/verificarDTO', {
        params: {
          usuario: usuario,
          contrasenia: password
        }
      });
      // Si la autenticación es exitosa, actualizamos el estado con los datos de la persona
      //setPersona(response.data); //este data es la persona

      //*! La persona se envia a las paginas heredadas utilizando el PersonaContext

      //*! mandar esta data al layout de donde se rediriga

      const responseAxios = response.data; // Guardamos la data de la persona en una variable local 
      if (responseAxios.id === 0) {
        // Si el ID es igual a 0, activamos el modal de error
        setOpenModalError(true);
      } else {
      setDataPersonaLocal(responseAxios);
      setPersona(responseAxios); // Actualizamos el estado de persona
      setEstaLogeado(true); // Cambiamos el estado de estaLogeado a true para asi redirigir a otra pagina
      //console.log(dataPersonaLocal.tipo);
      //soy gozzu
      console.log(responseAxios);
      }
    } catch (error) {
      console.error("Error al autenticar:", error);
    }

  };

  //! Dar enter loguea:
  // Función que se ejecuta al presionar una tecla
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      // Simula un clic en el botón si la tecla presionada es "Enter"
      handleClickLogin();
    }
  };

  const handleSuccess = async (e) => {
    console.log("Token:", e.credential);
    // Puedes decodificar el token JWT si es necesario
    try {
      // Hacemos una solicitud POST a la API Spring Boot (Este endPoint varia, cuidado aun no se revisa)
      const response = await axios.get('http://localhost:8080/rrhh/persona/verificarDTO', {
        params: {
          usuario: 'administrador',
          contrasenia: 'administrador'
        }
      });
      // Si la autenticación es exitosa, actualizamos el estado con los datos de la persona
      //setPersona(response.data); //este data es la persona

      //*! La persona se envia a las paginas heredadas utilizando el PersonaContext

      //*! mandar esta data al layout de donde se rediriga

      const responseAxios = response.data; // Guardamos la data de la persona en una variable local 
      if (responseAxios.id === 0) {
        // Si el ID es igual a 0, activamos el modal de error
        setOpenModalError(true);
      } else {
      setDataPersonaLocal(responseAxios);
      setPersona(responseAxios); // Actualizamos el estado de persona
      setEstaLogeado(true); // Cambiamos el estado de estaLogeado a true para asi redirigir a otra pagina
      //console.log(dataPersonaLocal.tipo);
      //soy gozzu
      console.log(responseAxios);
      }
    } catch (error) {
      console.error("Error al autenticar:", error);
    }

  };

  const handleError = () => {
    console.log("Error al iniciar sesión");
  };

  return (
    <>
    {isLoading?(<div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh', // Ajusta esto según el tamaño deseado
  }}>
      <CircularProgress style={{ width: '100px', height: '100px' }} /> {/* Cambia los valores según el tamaño deseado */}
  </div>):(

    <Box sx={{ height: '100vh', display: 'flex', backgroundColor: '#FFFFF' }}>
      {/* Lado Izquierdo: Card con Título */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFF' }}>
        <Typography variant="h4" sx={{ mb: 3, color: '#06152B' }}>
        {institucionBD.nombre || "..."}
        </Typography>
        <Card sx={{ maxWidth: 350, padding: 1.5, border: 'none', boxShadow: 'none' }}>
          <CardContent>
            <GoogleOAuthProvider clientId="589128802388-kba12ki6hspf7kcm5742c3bi0d3id1si.apps.googleusercontent.com">
              <div>
                <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
              </div>
            </GoogleOAuthProvider>
            <Typography variant="subtitle1" sx={{ fontSize: sizeLabel - 2, fontFamily: 'Montserrat' }} color='gray'>
              ———————————— or ————————————
            </Typography>
            <TextField
              label="Usuario"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, fontFamily: 'Montserrat' }}
              onChange={actualizarUsuario}
            />
            <TextField
              label="Contraseña"
              variant="outlined"
              type="password"
              size="small"
              fullWidth
              sx={{ mt: 1, fontFamily: 'Montserrat' }}
              onChange={actualizarPassword}
              onKeyDown={handleKeyDown}
          />
            {/*<Typography sx={{ fontSize: sizeLabel - 2,fontFamily: 'Montserrat', textAlign: 'center',paddingTop: '10px',paddingBottom: '10px',color: "#363581" }}>
              <strong style={{ textDecoration: 'underline' }}> ¿Olvidaste tu contraseña?</strong>
            </Typography>*/}
            {/*<FormGroup>
              <FormControlLabel control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }} />} label="Recordar contraseña"
                sx={{ '& .MuiFormControlLabel-label': { fontSize: 13 } }} />
            </FormGroup>*/}

            {/*Boton de Login*/}
            <Button onClick={handleClickLogin} disableElevation variant="contained" color="primary" fullWidth sx={{ border: 1, borderColor: 'gray', mt: 2, mb: 1, fontSize: sizeLabel }}>
              Ingresar
            </Button>

            <Button onClick={() => router.push('/postulante/postulacion/')} disableElevation variant="contained" color='white ' fullWidth sx={{ border: 1, borderColor: 'gray', mt: 1, mb: 1, fontSize: sizeLabel }}>
              Postular a docente
            </Button>
            {/*<Typography sx={{ fontSize: sizeLabel - 2 }}>
              ¿No tienes cuenta?
              <strong style={{ textDecoration: 'underline' }}> Registrate</strong>
            </Typography>*/}
          </CardContent>
        </Card>
      </Box>

      {/* Lado Derecho: Bienvenido al sistema de ONE PUCP */}
      <Box sx={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#363581' }}>
        {/* Logo en la parte superior derecha */}
        <Box sx={{ position: 'absolute', top: '20px', right: '20px' }}>
          <img src={`data:image/jpeg;base64,${institucionBD.logo}`} alt="Logo Institucion" style={{ width: '200px', height: 'auto' }} /> {/* Ajusta el tamaño según sea necesario */}
        </Box>

        <Box>
          <Typography variant='h2' color='#FFFFFF' sx={{ fontWeight: 'bold', marginLeft: '80px' }}>{"BIENVENIDO AL SISTEMA"}<br />
          {institucionBD.nombre || "..."}</Typography>
        </Box>

        <ErrorConDescripcion 
          texto="Error: Los datos de acceso son incorrectos" 
          open={openModalError} 
          onClose={handleCloseModalError} 
        />

      </Box>
    </Box>
  )}
  </>
  );
}

export default App;