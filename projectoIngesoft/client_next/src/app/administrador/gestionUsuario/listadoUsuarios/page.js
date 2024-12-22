"use client";
import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, InputAdornment } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TablaUsuarios from '../../../../../componentesAdministrador/gestionUsuario/TablaUsuarios';
import BarraBusqueda from '../../../../../componentesAdministrador/BarraBusqueda';
import Link from 'next/link';
import { useUsuario } from '../../../UsuarioContext';
import Papa from 'papaparse';
import axios from 'axios';
import ModalSuperior from 'componentesGenerales/modales/ModalSuperior';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation';
import RegistradoConExito from 'componentesGenerales/modales/RegistradoConExito';


export default function GestionUsuario() {
  const fileInputRef = useRef(null);
  const [confirmacionOpen, setConfirmacionOpen] = useState(false);
  const [personaEliminar, setPersonaEliminar] = useState(null);
  const [usuarios, setUsuarios] = useState([]); // Estado para almacenar los usuarios
  const [filteredUsuarios, setFilteredUsuarios] = useState([]); // Estado para usuarios filtrados
  const [page, setPage] = useState(0); // Página actual
  const [rowsPerPage, setRowsPerPage] = useState(5); // Número de filas por página
  const [totalUsuarios, setTotalUsuarios] = useState(0); // Total de usuarios después de filtrar
  const { setUsuario } = useUsuario();
  const [searchTerm, setSearchTerm] = useState("");
  const [modalExitoOpen, setModalExitoOpen] = useState(false);
  const router = useRouter();

  const validarNombre = (nombres) => /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]{1,60}$/.test(nombres);
  const validarApellido = (apellido) => /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]{1,60}$/.test(apellido);
  const validarTipoUsuario = (tipoUsuario) => ["ADMINISTRADOR", "ALUMNO", "DOCENTE"].includes(tipoUsuario);
  const validarUsuario = (usuario) => /^[A-Za-záéíóúÁÉÍÓÚñÑ0-9\s]{1,20}$/.test(usuario);
  // const validarPassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,14}$/.test(password);
  const validarPassword = (password) => /^.{10,20}$/.test(password);
  const validarCorreo = (correo) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(correo);
  const validarCodigoUsuario = (codigoUsuario) => /^[A-Za-z0-9]{5,10}$/.test(codigoUsuario);

  useEffect(() => {
    cargarUsuarios();
  }, [page, rowsPerPage]);
  const generateTemplateCSV = () => {
    // Template data
    const templateData = [
      {
        codigo: "324535435",
        nombre: "Juan sandro",
        apellidoPaterno: "Gimenez",
        apellidoMaterno: "Sanchez",
        usuario: "G345345345",
        contrasenia: "Gimenez123dsd",
        tipo: "DOCENTE",
        email: "juan343@hotmail.com"
      },
      {
        codigo: "32432434",
        nombre: "Juan sandro",
        apellidoPaterno: "Gimenez",
        apellidoMaterno: "Sanchez",
        usuario: "safdsdaf32",
        contrasenia: "Gimenez123dsd",
        tipo: "ADMINISTRADOR",
        email: "juan434@hotmail.com"
      },
      {
        codigo: "234234334",
        nombre: "Juan sandro",
        apellidoPaterno: "Gimenez",
        apellidoMaterno: "Sanchez",
        usuario: "safsdfds23",
        contrasenia: "Gimenez123dsd",
        tipo: "ALUMNO",
        email: "juan123@hotmail.com"
      }
    ];

    // Convert data to CSV string
    const headers = ["codigo", "nombre", "apellidoPaterno", "apellidoMaterno", "usuario", "contrasenia", "tipo", "email"];
    const csvContent = [
      headers.join(";"),
      ...templateData.map(row =>
        headers.map(header => row[header]).join(";")
      )
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "PlantillaUsuarios.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const cargarUsuarios = async () => {
    const response = await axios.get(`http://localhost:8080/rrhh/persona/listar?page=0&size=1000`);
    setUsuarios(response.data.content);
    setFilteredUsuarios(response.data.content);
    //setTotalUsuarios(response.data.totalElements);
  };

  const limpiarUsuarioContext = async () => {
    setUsuario('');
  }

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

  const handleBuscarUsuario = async (busqueda) => {
    if (busqueda.trim() !== "") {

      const resultadosFiltrados = usuarios.filter((usuario) =>
        usuario.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        usuario.apellidoPaterno?.toLowerCase().includes(busqueda.toLowerCase()) ||
        usuario.email?.toLowerCase().includes(busqueda.toLowerCase())
      );
      setFilteredUsuarios(resultadosFiltrados);

    } else {
      await cargarUsuarios();
      // Si la búsqueda está vacía, recargar los usuarios desde la API
      setFilteredUsuarios(usuarios); // Asegurarte de que filteredUsuarios sea igual a usuarios
    }
  };

  const handleSearch = (event) => {
    const busqueda = event.target.value.toLowerCase(); // Convertir la búsqueda a minúsculas
    setSearchTerm(busqueda);

    // Filtrar las preguntas frecuentes
    const resultadosFiltrados = usuarios.filter((usuario) =>
      usuario.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.apellidoPaterno?.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.email?.toLowerCase().includes(busqueda.toLowerCase())
    );
    setFilteredUsuarios(resultadosFiltrados);
  };

  const handleUploadClick = () => {
    alert("Se recomienda usar la plantilla para la carga masiva de usuarios");
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          const erroresUsuarios = [];
          const nuevosUsuarios = [];

          // Filtrar filas vacías o inválidas antes de procesarlas
          const filasValidas = results.data.filter((row) => {
            // Filtramos las filas vacías (si la fila está completamente vacía, la eliminamos)
            return row.codigo && row.nombre && row.apellidoPaterno && row.usuario && row.email;
          });

          for (const [index, row] of filasValidas.entries()) {
            const errores = {};

            // Validaciones
            const existeCodigo = await verificarCodigoEnBD(row.codigo);
            if (existeCodigo) {
              errores.codigo = "Codigo ya existe en el sistema";
            } else if (!validarCodigoUsuario(row.codigo)) {
              errores.codigo = "codigo inválido (debe ser alfanumérico y entre 5 y 10 digitos)";
            }

            if (!validarNombre(row.nombre)) {
              errores.nombre = "Nombre inválido (máximo 60 caracteres, solo letras y espacios)";
            }

            if (!validarApellido(row.apellidoPaterno)) {
              errores.apellidoPaterno = "Apellido paterno inválido (máximo 60 caracteres, solo letras y espacios)";
            }

            if (!validarTipoUsuario(row.tipo)) {
              errores.tipo = "Tipo de usuario inválido (debe ser ADMINISTRADOR, ALUMNO o DOCENTE)";
            }

            const existeUsuario = await verificarUsuarioEnBD(row.usuario);
            if (existeUsuario) {
              errores.usuario = "Usuario ya existe en el sistema";
            } else if (!validarUsuario(row.usuario)) {
              errores.usuario = "Usuario inválido (máximo 20 caracteres, solo letras, números y espacios)";
            }

            if (!validarPassword(row.contrasenia)) {
              errores.contrasenia = "Contraseña inválida (debe tener entre 10 y 20 caracteres)";
            }

            const existeEmail = await verificarCorreoEnBD(row.email);
            if (existeEmail) {
              errores.email = "Email ya existe en el sistema";
            } else if (!validarCorreo(row.email)) {
              errores.email = "Correo inválido (debe ser un correo electrónico válido)";
            }

            // Si hay errores, guardarlos
            if (Object.keys(errores).length > 0) {
              erroresUsuarios.push({
                fila: index + 1, // Guardar la fila para referencia
                errores,
              });
              continue; // Usuario inválido, no lo añadimos
            }

            // Si pasa las validaciones, añadir el usuario válido
            nuevosUsuarios.push({
              codigo: row.codigo,
              nombre: row.nombre,
              apellidoPaterno: row.apellidoPaterno,
              apellidoMaterno: row.apellidoMaterno,
              cuenta: {
                usuario: row.usuario,
                contrasenia: row.contrasenia,
              },
              tipo: row.tipo,
              email: row.email,
            });
          }

          // Mostrar errores si hay
          if (erroresUsuarios.length > 0) {
            let mensajeErrores = "Errores encontrados:\n";
            erroresUsuarios.forEach((error) => {
              mensajeErrores += `Fila ${error.fila}:\n`;
              Object.entries(error.errores).forEach(([campo, mensaje]) => {
                mensajeErrores += ` - ${campo}: ${mensaje}\n`;
              });
            });
            alert(mensajeErrores); // Mostrar el mensaje en una alerta del navegador
          }

          // Insertar usuarios válidos
          // Verificar si hay usuarios válidos
          if (nuevosUsuarios.length === 0) {
            alert('No se encontraron usuarios válidos en el archivo. Por favor, revisa los datos.');
          } else {
            try {
              const response = await axios.post(
                'http://localhost:8080/rrhh/persona/insertarCSV',
                nuevosUsuarios,
                {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                }
              );
              console.log("CORRECTO");
              setUsuarios((prevUsuarios) => [...prevUsuarios, ...nuevosUsuarios]);
              setFilteredUsuarios((prevFiltered) => [...prevFiltered, ...nuevosUsuarios]);
              setTotalUsuarios((prevTotal) => prevTotal + nuevosUsuarios.length); // Actualiza el total de usuarios
              await cargarUsuarios();
              setModalExitoOpen(true);
            } catch (error) {
              alert('Error al realizar la solicitud: ' + error.message);
            }
          }
        },
        error: (error) => {
          alert('Error al analizar el archivo: ' + error.message);
        },
      });
    }
  };





  const handleEliminarPersona = (personaId) => {
    setPersonaEliminar(personaId);
    setConfirmacionOpen(true);
  };

  const confirmarEliminacion = async () => {
    try {

      await axios.delete(`http://localhost:8080/rrhh/persona/eliminar/${personaEliminar}`);
      setUsuarios((prevUsuarios) => prevUsuarios.filter(usuario => usuario.id !== personaEliminar));
      setFilteredUsuarios((prevFiltered) => prevFiltered.filter(usuario => usuario.id !== personaEliminar));
      const nuevoTotal = totalUsuarios - 1; // Actualizar el total al eliminar un usuario
      setTotalUsuarios(nuevoTotal); // Actualiza el total

      // Verificar si la página actual excede el total de páginas
      const totalPages = Math.ceil(nuevoTotal / rowsPerPage);
      if (page >= totalPages && totalPages > 0) {
        setPage(totalPages - 1);
      }
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    } finally {
      setConfirmacionOpen(false);
      setPersonaEliminar(null);
    }
  };

  //!Para manejar la plantilla
  const handleDownloadFile = (filePath) => {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = filePath.split('/').pop(); // Obtiene el nombre del archivo automáticamente
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ backgroundColor: 'white', height: '100vh' }}>
      <Box
        sx={{
          marginLeft: '220px',
          height: '100vh',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h4" sx={{ mb: '20px', color: '#191D23' }}>
          Gestión de Usuarios
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
          <Box sx={{ flexGrow: 1, mr: 2 }}>
            <TextField
              placeholder="Buscar..."
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              style={{ width: '100%', marginBottom: '20px' }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '40px', // Altura total del TextField
                  minWidth: '150px',
                  display: 'flex',
                  alignItems: 'center', // Alineación vertical del contenido interno
                }
              }}
            />
          </Box>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          <Button
            variant="contained"
            color="primary"
            sx={{ ml: 2, display: 'flex', alignItems: 'center', height: '40px', backgroundColor: '#363581' }}
            onClick={handleUploadClick}
          >
            Subir
            <CloudUploadIcon sx={{ ml: 1, color: 'white', width: '20px', height: '20px' }} />
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ ml: 2, display: 'flex', alignItems: 'center', height: '40px', backgroundColor: '#363581' }}
            onClick={generateTemplateCSV}
          >
            Plantilla
            <DownloadIcon
              sx={{
                ml: 1,
                color: 'white',
                borderRadius: '50%',
                backgroundColor: '#363581',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          </Button>

          <Button
            component={Link}
            href="./nuevoUsuario"
            variant="contained"
            color="primary"
            onClick={limpiarUsuarioContext}
            sx={{ ml: 2, display: 'flex', alignItems: 'center', height: '40px', backgroundColor: '#363581' }}
          >
            Añadir
            <AddCircleOutlineIcon sx={{ ml: 1, color: 'white', width: '20px', height: '20px' }} />
          </Button>
        </Box>
        <TablaUsuarios
          usuarios={filteredUsuarios}
          listar={cargarUsuarios}
        />
      </Box>

      <RegistradoConExito
        open={modalExitoOpen}
        onClose={() => setModalExitoOpen(false)}
        texto={`Usuarios Registrados Con Éxito`}
      />

    </Box>
  );
}