"use client";
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, MenuItem, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import InputField from '../../../../../componentesGenerales/inputs/InputField'; // Importa el componente
import EstaSeguroAccion from '../../../../../componentesGenerales/modales/EstaSeguroAccion';
import { useUsuario } from '../../../UsuarioContext' // Importa el contexto de Usuario
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RegistradoConExito from 'componentesGenerales/modales/RegistroConExito';

function NuevoUsuario() {
  const { usuario: usuarioEditar } = useUsuario();
  const { setUsuario } = useUsuario("");  // Agrega esta línea para obtener setRol del contexto
  const [nombres, setNombres] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [usuario, setUsuario2] = useState("");
  const [password, setPassword] = useState("");
  const [correo, setCorreo] = useState("");
  const [codigoUsuario, setCodigoUsuario] = useState("");
  const [especialidad, setEspecialidad] = useState({ id: '', nombre: '' });
  const [especialidades, setEspecialidades] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRolOpen, setModalRolOpen] = useState(false);
  const [modalExitoOpen, setModalExitoOpen] = useState(false);
  const [errores, setErrores] = useState({}); // Para rastrear campos incompletos
  const router = useRouter();
  const [erroresMensaje, setErroresMensaje] = useState({});
  const [ usuarioAsignarRolesUnidad, setUsuarioAsignarRolesUnidad] = useState();

  useEffect(() => {
    if (usuarioEditar) {
      setCodigoUsuario(usuarioEditar?.codigo);
      setNombres(usuarioEditar?.nombre);
      setApellidoPaterno(usuarioEditar?.apellidoPaterno);
      setApellidoMaterno(usuarioEditar?.apellidoMaterno);
      setTipoUsuario(usuarioEditar?.tipo);
      setUsuario2(usuarioEditar?.cuenta.usuario);
      setCorreo(usuarioEditar?.email);
      setPassword(usuarioEditar?.cuenta?.contrasenia);


    } else {
      // Si no se está editando, limpiar los campos
      setCodigoUsuario("");
      setNombres("");
      setApellidoPaterno("");
      setApellidoMaterno("");
      setTipoUsuario("");
      setUsuario2("");
      setCorreo("");
      setPassword("");
    }
  }, [usuarioEditar]);

  /*
  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const response = await axios.get('http://localhost:8080/institucion/especialidad/listar'); // Ajusta la URL según tu API
        setEspecialidades(response.data);
      } catch (error) {
        console.error("Error al cargar las especialidades:", error);
      }
    };

    fetchEspecialidades();
  }, []);
  */

  const mensajesError = {
    nombres: "El nombre debe contener solo letras y espacios, y tener entre 1 y 60 caracteres.",
    apellidoPaterno: "El apellido paterno debe contener solo letras y espacios, y tener entre 1 y 60 caracteres.",
    apellidoMaterno: "El apellido materno debe contener solo letras y espacios, y tener entre 1 y 60 caracteres.",
    tipoUsuario: "Debes seleccionar un tipo de usuario válido.",
    usuario: "El usuario debe tener entre 1 y 20 caracteres sin caracteres especiales.",
    //password: "La contraseña debe tener entre 8 y 14 caracteres, incluyendo mayúsculas, minúsculas, números y al menos un carácter especial (@, #, $, etc.).",
    password: "La contraseña debe tener entre 10 y 20 caracteres.",
    correo: "El correo debe ser un correo válido.",
    codigoUsuario: "El código de usuario debe contener entre 5 y 10 números.",
    //especialidad: "Debes seleccionar una especialidad válida." // Mensaje de error
  };


  const validarNombre = (nombres) => /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]{1,60}$/.test(nombres);
  const validarApellido = (apellido) => /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]{1,60}$/.test(apellido);
  const validarTipoUsuario = (tipoUsuario) => ["ADMINISTRADOR", "ALUMNO", "DOCENTE"].includes(tipoUsuario);
  const validarUsuario = (usuario) => /^[A-Za-záéíóúÁÉÍÓÚñÑ0-9\s]{1,20}$/.test(usuario);
  //const validarPassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,14}$/.test(password);
  const validarPassword = (password) => /^.{10,20}$/.test(password);
  const validarCorreo = (correo) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(correo);
  const validarCodigoUsuario = (codigoUsuario) => /^[0-9]{5,10}$/.test(codigoUsuario);



  const verificarUsuarioEnBD = async (usuario) => {
    try {
      const response = await axios.get(`http://localhost:8080/rrhh/persona/verificarUsuario?usuario=${usuario}`);
      return response.data; // Devuelve el valor de la respuesta
    } catch (error) {
      console.error("Error al verificar el usuario en la BD:", error);
      return false;
    }
  };

  const verificarCodigoEnBD = async (codigo) => {
    try {
      const response = await axios.get(`http://localhost:8080/rrhh/persona/verificarCodigo?codigo=${codigo}`);
      return response.data; // Devuelve el valor de la respuesta
    } catch (error) {
      console.error("Error al verificar el codigo en la BD:", error);
      return false;
    }
  };

  const verificarCorreoEnBD = async (correo) => {
    try {
      const response = await axios.get(`http://localhost:8080/rrhh/persona/verificarCorreo?email=${correo}`);
      return response.data; // Devuelve el valor de la respuesta
    } catch (error) {
      console.error("Error al verificar el correo en la BD:", error);
      return false;
    }
  };

  const handleClickInsertarUsuario = async (e) => {
    try {
      const persona = {
        nombre: nombres,
        apellidoPaterno: apellidoPaterno,
        apellidoMaterno: apellidoMaterno,
        tipo: tipoUsuario,
        email: correo,
        codigo: codigoUsuario, // Agregar el código de usuario
        cuenta: {
          usuario: usuario,
          contrasenia: password,
        },
      };
      
      if (usuarioEditar) {
        usuarioEditar.nombre = nombres;
        usuarioEditar.apellidoPaterno = apellidoPaterno;
        usuarioEditar.apellidoMaterno = apellidoMaterno;
        usuarioEditar.tipo = tipoUsuario;
        usuarioEditar.email = correo;
        usuarioEditar.codigo = codigoUsuario;  // Agregar el código de usuario
        if (usuarioEditar.cuenta != null) {
          usuarioEditar.cuenta.usuario = usuario;
          usuarioEditar.cuenta.contrasenia = password;
        }
      }

      console.log("EDITAR", persona);
      // Si el usuario a editar ya existe, hacemos un PUT en lugar de un POST
      const endpoint = usuarioEditar ? `http://localhost:8080/rrhh/persona/actualizar/${usuarioEditar.id}` : `http://localhost:8080/rrhh/persona/insertar`;
      const method = usuarioEditar ? 'put' : 'post';
      const response = await axios[method](endpoint, usuarioEditar ? usuarioEditar : persona);
      if (response != null) {
        console.log("Usuario guardado:", response.data);
        if(!usuarioEditar){
          setModalExitoOpen(true);
          setUsuarioAsignarRolesUnidad(response.data);
          setTimeout(() => {
            setModalExitoOpen(false);
            setModalRolOpen(true); // Abre el segundo modal después del retraso
        }, 900); // Ajusta el tiempo según sea necesario

        
        }else{
          router.push('/administrador/gestionUsuario/listadoUsuarios');
        }
        
        
      }

    } catch (error) {
      alert("ERROR al guardar usuario");
    }
  };

  const handleClickAsginarRolesUnidad = async (e) => {
    console.log(usuarioAsignarRolesUnidad);
    localStorage.removeItem('selectedUsuario');
    setUsuario(usuarioAsignarRolesUnidad);
    router.push('/administrador/asignacionPermisosyRolesUsuarios/asignacionRolyPermisos'); 
  }

  const handleCancelarAsginarRolesUnidad = async (e) => {
    router.push('/administrador/gestionUsuario/listadoUsuarios');
  }
  const handleChange = (setter, validator, field) => async (e) => {
    const value = e.target.value;
    setter(value);

    // Validación en tiempo real
    const nuevosErrores = { ...errores };
    const nuevosErroresMensaje = { ...erroresMensaje };
    if (!validator(value)) {
      nuevosErrores[field] = true;
      nuevosErroresMensaje[field] = mensajesError[field];
    } else {

      
      if (field === 'usuario') {
        const existe = await verificarUsuarioEnBD(value);
        if (existe) {
          nuevosErrores[field] = true;
          nuevosErroresMensaje[field] = "El usuario ya existe.";
        } else {
          delete nuevosErrores[field];
          delete nuevosErroresMensaje[field];
        }
      }else if(field == 'codigoUsuario'){
        const existe = await verificarCodigoEnBD(value);
        if (existe) {
          nuevosErrores[field] = true;
          nuevosErroresMensaje[field] = "El codigo ya existe.";
        } else {
          delete nuevosErrores[field];
          delete nuevosErroresMensaje[field];
        }
      } else if(field == 'correo'){
        const existe = await verificarCorreoEnBD(value);
        if (existe) {
          nuevosErrores[field] = true;
          nuevosErroresMensaje[field] = "El correo ya existe.";
        } else {
          delete nuevosErrores[field];
          delete nuevosErroresMensaje[field];
        }
      }else {
        delete nuevosErrores[field];
        delete nuevosErroresMensaje[field];
      }
    }
    setErrores(nuevosErrores);
    setErroresMensaje(nuevosErroresMensaje);
  };


  const validarFormulario = async () => {
    const nuevosErrores = {};
    const nuevosErroresMensaje = {};

    if (!validarNombre(nombres)) {
      nuevosErrores.nombres = true;
      nuevosErroresMensaje.nombres = mensajesError.nombres;
    }

    if (!validarApellido(apellidoPaterno)) {
      nuevosErrores.apellidoPaterno = true;
      nuevosErroresMensaje.apellidoPaterno = mensajesError.apellidoPaterno;
    }

    if (!validarApellido(apellidoMaterno)) {
      nuevosErrores.apellidoMaterno = true;
      nuevosErroresMensaje.apellidoMaterno = mensajesError.apellidoMaterno;
    }

    if (!validarTipoUsuario(tipoUsuario)) {
      nuevosErrores.tipoUsuario = true;
      nuevosErroresMensaje.tipoUsuario = mensajesError.tipoUsuario;
    }
    if (!validarCodigoUsuario(codigoUsuario)) {
      nuevosErrores.codigoUsuario = true;
      nuevosErroresMensaje.codigoUsuario = mensajesError.codigoUsuario;
    }else{
      const existe = await verificarCodigoEnBD(codigoUsuario);
      if (usuarioEditar && usuarioEditar.codigo != codigoUsuario) {

        if (existe) {
          nuevosErrores.codigoUsuario = true;
          nuevosErroresMensaje.codigoUsuario = "El codigo ya existe.";
        }
      } else if (!usuarioEditar) {

        if (existe) {
          nuevosErrores.codigoUsuario = true;
          nuevosErroresMensaje.codigoUsuario = "El codigo ya existe.";
        }
      }
    }
    
    if (!validarUsuario(usuario)) {
      nuevosErrores.usuario = true;
      nuevosErroresMensaje.usuario = mensajesError.usuario;
    } else {
      const existe = await verificarUsuarioEnBD(usuario);
      if (usuarioEditar && usuarioEditar.cuenta.usuario != usuario) {

        if (existe) {
          nuevosErrores.usuario = true;
          nuevosErroresMensaje.usuario = "El usuario ya existe.";
        }
      } else if (!usuarioEditar) {

        if (existe) {
          nuevosErrores.usuario = true;
          nuevosErroresMensaje.usuario = "El usuario ya existe.";
        }
      }

    }

    if (!validarPassword(password)) {
      nuevosErrores.password = true;
      nuevosErroresMensaje.password = mensajesError.password;
    }

    if (!validarCorreo(correo)) {
      nuevosErrores.correo = true;
      nuevosErroresMensaje.correo = mensajesError.correo;
    } else{
      const existe = await verificarCorreoEnBD(correo);
      if (usuarioEditar && usuarioEditar.email != correo) {

        if (existe) {
          nuevosErrores.correo = true;
          nuevosErroresMensaje.correo = "El correo ya existe.";
        }
      } else if (!usuarioEditar) {

        if (existe) {
          nuevosErrores.correo = true;
          nuevosErroresMensaje.correo = "El correo ya existe.";
        }
      }
    }


    setErrores(nuevosErrores);
    setErroresMensaje(nuevosErroresMensaje);

    // Si no hay errores, retorna true
    return Object.keys(nuevosErrores).length === 0;
  };


  const handleGuardar = async (e) => {
    e.preventDefault();

    // Validar el formulario antes de abrir el modal
    if (await validarFormulario()) {
      setModalOpen(true); // Si todo es válido, abrir el modal
    }
  };

  //! Cambios/Fujiki
  const [sePuedeVer, setSePuedeVer] = useState(false);

  //Visualizar contraseña
  const handleClickVerContrasenia = () => {
    setSePuedeVer(!sePuedeVer);
  }

  return (
    <Box sx={{ backgroundColor: 'white', minHeight: '100vh', paddingBottom: '10px' }}>

      <Box sx={{ ml: 29, padding: '10px' }}>
        <Typography variant="h4" sx={{ mb: '20px', color: '#191D23' }}>
          {usuarioEditar ? "Editar usuario" : "Registrar nuevo usuario"}
        </Typography>
      </Box>
      <Box
        sx={{
          marginLeft: '220px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >


        <Box
          sx={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #D9D9D9',
            borderRadius: 2,
            padding: 4,
            boxShadow: 2,
            width: '100%',
            maxWidth: 720,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, alignSelf: 'flex-start', fontWeight: 'bold' }}>
            Datos personales:
          </Typography>

          <InputField
            label="Código"
            value={codigoUsuario}
            onChange={handleChange(setCodigoUsuario, validarCodigoUsuario, "codigoUsuario")}
            required
            error={!!errores.codigoUsuario}
            helperText={erroresMensaje.codigoUsuario}
            height="30px"
          />


          <InputField
            label="Nombres"
            value={nombres}
            onChange={handleChange(setNombres, validarNombre, "nombres")}
            required
            error={!!errores.nombres}
            helperText={erroresMensaje.nombres}
            height="30px"
          />


          <InputField
            label="Apellido Paterno"
            value={apellidoPaterno}
            onChange={handleChange(setApellidoPaterno, validarApellido, "apellidoPaterno")}
            required
            error={!!errores.apellidoPaterno} // Si hay error, marcarlo
            helperText={erroresMensaje.apellidoPaterno}
            height="30px"
          />

          <InputField
            label="Apellido Materno"
            value={apellidoMaterno}
            onChange={handleChange(setApellidoMaterno, validarApellido, "apellidoMaterno")}
            required
            error={!!errores.apellidoMaterno} // Si hay error, marcarlo
            helperText={erroresMensaje.apellidoMaterno}
            height="30px"
          />

          <Typography variant="h6" sx={{ mt: 2, alignSelf: 'flex-start', marginBottom: '20px', fontWeight: 'bold' }}>
            Datos de la cuenta:
          </Typography>

          <InputField
            label="Tipo de Usuario"
            value={tipoUsuario}
            onChange={handleChange(setTipoUsuario, validarTipoUsuario, "tipoUsuario")}
            select
            required
            error={!!errores.tipoUsuario} // Si hay error, marcarlo
            helperText={erroresMensaje.tipoUsuario}
            height="30px"
          >
            <MenuItem value="ADMINISTRADOR">Administrador</MenuItem>
            <MenuItem value="ALUMNO">Alumno</MenuItem>
            <MenuItem value="DOCENTE">Docente</MenuItem>
          </InputField>
          {/*
            <InputField
              label="Especialidad"
              value={especialidad.nombre}
              onChange={handleChange(setEspecialidad, () => true, "especialidad")} // Ajusta según la validación
              select
              required
              error={!!errores.especialidad}
              helperText={erroresMensaje.especialidad}
              height="30px"
            >
              {especialidades.map((especialidad) => (
                <MenuItem key={especialidad.id} value={especialidad.nombre}>
                  {especialidad.nombre}
                </MenuItem>
              ))}
            </InputField>
              */}
          <InputField
            label="Usuario"
            value={usuario}
            onChange={handleChange(setUsuario2, validarUsuario, "usuario")}
            required
            error={!!errores.usuario} // Si hay error, marcarlo
            helperText={erroresMensaje.usuario}
            height="30px"
          />

          <Box sx={{ display: 'flex', mb: '16px' }}>
            <Typography sx={{ mr: '6px' }}>Contraseña</Typography>
            <Typography variant='subtitle' sx={{ color: 'red' }}>*</Typography>

            <Box>
              <TextField sx={{
                "& .MuiOutlinedInput-root": {
                  height: "30px",  // Ajusta la altura aquí
                  borderRadius: '7px',  // Redondea las esquinas
                  width: '457px'
                }, marginLeft: "100px"
              }}
                type={sePuedeVer ? "" : "password"}
                value={password}
                onChange={handleChange(setPassword, validarPassword, "password")}

                error={!!errores.password} // Si hay error, marcarlo
                helperText={erroresMensaje.password}
                autoComplete="new-password"  // Sugerencia de contraseña
              />
            </Box>

            <Box>

              {!usuarioEditar &&
                <button
                  style={{
                    marginLeft: '1px',
                    marginTop: '2px',
                    marginRight: '20px',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    color: '#363581', // Color base
                  }}
                  onClick={handleClickVerContrasenia}
                  onMouseDown={(e) => e.target.style.color = '#5D71BC'} // Color al presionar
                  onMouseUp={(e) => e.target.style.color = '#363581'} // Regresar al color base cuando se suelta
                >
                  {sePuedeVer ? <VisibilityOffIcon /> : <Visibility />}
                </button>
              }
            </Box>

          </Box>

          <InputField
            label="Correo"
            value={correo}
            onChange={handleChange(setCorreo, validarCorreo, "correo")}
            required
            error={!!errores.correo} // Si hay error, marcarlo
            helperText={erroresMensaje.correo}
            height="30px"
          />

        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button variant='outlined' onClick={() => router.back()} sx={{ width: '170px', marginRight: '20px' }}>
            Cancelar
          </Button>
          <Button variant='contained' onClick={handleGuardar} sx={{ width: '170px' }}>
            Guardar
          </Button>
        </Box>
      </Box>

      <EstaSeguroAccion
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        texto={`¿Está seguro de ${usuarioEditar ? "editar" : "guardar"} el usuario?`}
        handleAceptar={async () => {
          await handleClickInsertarUsuario();
          setModalOpen(false);
        }}
      />

        <RegistradoConExito
          open={modalExitoOpen}
          onClose={() => setModalExitoOpen(false)}
          texto={usuarioEditar ? `Usuario editado Con Éxito` : `Usuario Registrado Con Éxito`}
        />

      <EstaSeguroAccion
        open={modalRolOpen}
        onClose={async () => {
          await handleCancelarAsginarRolesUnidad()}}
        texto={`¿Deseas asignar roles y unidad al usuario?`}
        handleAceptar={async () => {
          await handleClickAsginarRolesUnidad();
          setModalRolOpen(false);
        }}
      />
    </Box>
  );
}

export default NuevoUsuario;
