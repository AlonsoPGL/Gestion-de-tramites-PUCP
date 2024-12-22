"use client";
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, MenuItem, Select, FormControl, InputLabel, IconButton, TableContainer, TableHead, TableRow, TableCell, Table, TableBody } from "@mui/material";
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import { useUsuario } from '../../../UsuarioContext';
import BarraBusqueda from '../../../../../componentesAdministrador/BarraBusqueda';
import InputField from '../../../../../componentesGenerales/inputs/InputField';
import EstaSeguroAccion from '../../../../../componentesGenerales/modales/EstaSeguroAccion';

export default function AsignacionRoles() {
  const [roles, setRoles] = useState([]);
  const [rolesActivosPersonas, setRolesActivosPersonas] = useState([]); // Roles asignados al usuario
  const [rolesDisponibles, setRolesDisponibles] = useState([]); // Roles disponibles para asignar
  const [unidadesDisponibles, setUnidadesDisponibles] = useState([]);
  const [rolSeleccionado, setRolSeleccionado] = useState('');
  const [unidadSeleccionada, setUnidadSeleccionada] = useState('');
  const [rolSeleccionadoNombre, setRolSeleccionadoNombre] = useState('');
  const [rolSeleccionadoId, setRolSeleccionadoId] = useState(''); // Estado para el ID del rol seleccionado
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { usuario } = useUsuario();
  const [storedUsuario, setStoredUsuario] = useState(null);
  const [rolError, setRolError] = useState(false);
  const [rolHelperText, setRolHelperText] = useState('');
  const [idRolEliminar, setIdRolEliminar] = useState('');
  const [unidadesCargando, setUnidadesCargando] = useState(false); // Nuevo estado
  const [modalOpen, setModalOpen] = useState(false); // Estado para controlar el modal
  const router = useRouter();

  const estilosEncabezado = () => {
    return { color: 'white', fontWeight: 'bold', backgroundColor: '#363581' };
  };

  useEffect(() => {

    const localStoredUsuario = JSON.parse(localStorage.getItem('selectedUsuario'));
    const currentUser = usuario || localStoredUsuario;
    console.log("LLEGO",currentUser);
    if (currentUser) {
      
      setStoredUsuario(currentUser);
      localStorage.setItem('selectedUsuario', JSON.stringify(currentUser));  // Actualiza el localStorage
      obtenerRolesActivosUsuario(currentUser.id); // Llamada a la API para obtener roles 
      obtenerRolesDisponibles();
    }
  }, [usuario]);

  const obtenerRolesActivosUsuario = async (usuarioId) => {
    try {
      console.log(usuarioId);
      const response = await axios.get(`http://localhost:8080/gestUsuario/personaRolUnidad/PersonaPorRoles?idPersona=${usuarioId}`);

      setRolesActivosPersonas(response.data);
    } catch (error) {
      console.error('Error al obtener roles activos:', error);
    }
  };

  const obtenerUnidadesPorTipo = async (tipo) => {
    setUnidadesCargando(true); // Marcar como cargando
    try {

      const response = await axios.get(`http://localhost:8080/gestionUnidad/unidad/listarUnidadSeleccionada?tipo=${tipo}`);
      setUnidadesDisponibles(response.data);
    } catch (error) {
      console.error("Error al cargar las unidades:", error);
    } finally {
      setUnidadesCargando(false); // Marcar como no cargando
    }
  };

  const obtenerRolesDisponibles = async () => {
    try {
      const response = await axios.get('http://localhost:8080/rrhh/rol/listarRoles');
      setRolesDisponibles(response.data);
    } catch (error) {
      console.error('Error al obtener roles disponibles:', error);
    }
  };

  const handleOpenModal = async (id) => {
    console.log("ERR", id);
    setIdRolEliminar(id);
    setModalOpen(true);
  };

  const handleAgregarRol = async () => {
    if (!rolSeleccionado || !unidadSeleccionada) {
      alert('Por favor seleccione un rol y una unidad antes de agregar.');
      return;
    }

    try {
      console.log("AQUI", storedUsuario.id);
      console.log("AQUI", unidadSeleccionada);
      console.log("AQUI", rolSeleccionado);
      const url = `http://localhost:8080/gestUsuario/personaRolUnidad/insertarPersonaRolUnidad?personaId=${storedUsuario.id}&rolId=${rolSeleccionado}&unidadId=${unidadSeleccionada}`;
      await axios.post(url);
      obtenerRolesActivosUsuario(storedUsuario.id); // Refrescar lista
      setRolSeleccionado('');
      setUnidadSeleccionada('');
    } catch (error) {
      console.error('Error al agregar rol:', error);
    }
  };

  const handleEliminarRol = async () => {
    try {

      console.log("AQIU", idRolEliminar);
      if (idRolEliminar) {
        await axios.delete(`http://localhost:8080/gestUsuario/personaRolUnidad/eliminar?id=${idRolEliminar}`);
        obtenerRolesActivosUsuario(storedUsuario?.id || usuario?.id); // Refrescar lista
      }
    } catch (error) {
      console.error('Error al eliminar rol:', error);
    }
  };

  const handleRolChange = (event) => {
    const selectedRol = event.target.value;
    setRolSeleccionado(selectedRol);
    setUnidadSeleccionada(''); // Limpiar unidad seleccionada
    setUnidadesDisponibles([]); // Limpiar unidades disponibles
    const tipo = rolesDisponibles.find(rol => rol.id === selectedRol)?.tipo;
    if (tipo) obtenerUnidadesPorTipo(tipo);
    
  };

  const handleUnidadChange = (event) => {
    const selectedUnidad = event.target.value;
    setUnidadSeleccionada(selectedUnidad);
  }
  const handleSearchChange = (busqueda) => {
    setSearchTerm(busqueda);
    const resultadosFiltrados = roles.filter((rol) =>
      rol.rolNombre.toLowerCase().includes(busqueda.toLowerCase())
    );
    setFilteredRoles(resultadosFiltrados);
  };

  const handleToggle = (rolId, nuevoEstado) => {
    const updatedRoles = roles.map(rol =>
      rol.rolId === rolId ? { ...rol, estado: nuevoEstado } : rol
    );
    setRoles(updatedRoles);
    setFilteredRoles(updatedRoles);
  };

  const handleGuardar = async () => {

    try {
      const rolesActualizados = roles.map(rol => ({
        rolId: rol.rolId,
        estado: rol.estado
      }));

      await axios.post(`http://localhost:8080/gestUsuario/personaRol/actualizarRolesPersona?idPersona=${storedUsuario.id}`,
        rolesActualizados, {
        headers: { 'Content-Type': 'application/json' },
      }
      );


      router.push('/administrador/asignacionPermisosyRolesUsuarios');
    } catch (error) {
      console.error("Error al guardar permisos y rol:", error.response ? error.response.data : error.message);
      alert("Error al guardar permisos y rol. Por favor, inténtelo de nuevo.");
    }
  };


  const handleClickGuardar = () => {

    setModalOpen(true); // Abrir el modal cuando se haga clic en guardar
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', height: '125vh', marginLeft: '120px', mt: 10, mb: 10 }}>

      <Box sx={{ width: '80%', border: '1px solid #A9A9A9', borderRadius: '5px' }}>
        <Box sx={{ backgroundColor: '#363581', color: 'white', padding: '20px', textAlign: 'left' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }} >{storedUsuario?.tipo} - {storedUsuario?.nombre || ''} {storedUsuario?.apellidoPaterno || ''} {storedUsuario?.apellidoMaterno || ''}</Typography>
        </Box>

        <Box sx={{ padding: '20px' }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Seleccionar Rol</InputLabel>
            <Select value={rolSeleccionado} onChange={handleRolChange}>
              {rolesDisponibles.map((rol) => (
                <MenuItem key={rol.id} value={rol.id}>{rol.nombre} - {rol.tipo}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Seleccionar Unidad</InputLabel>
            <Select
              value={unidadSeleccionada}
              onChange={handleUnidadChange}
              disabled={!rolSeleccionado || unidadesCargando}
            >
              {unidadesCargando ? (
                <MenuItem disabled>
                  <em>Cargando unidades...</em>
                </MenuItem>
              ) : (
                unidadesDisponibles.map((unidad) => (
                  <MenuItem key={unidad.id} value={unidad.id}>{unidad.nombre}</MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <Button variant="contained" color="primary" sx={{ mb: "50px", mt: "15px" }} onClick={handleAgregarRol}>
            Agregar Rol
          </Button>




          <TableContainer component={Paper} sx={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', overflow: 'auto' }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              {/* Encabezado de la tabla */}
              <TableHead sx={{ backgroundColor: '#363581' }}>
                <TableRow>
                  <TableCell align='center' sx={estilosEncabezado()}>Rol</TableCell>
                  <TableCell align='center' sx={estilosEncabezado()}>Tipo de Unidad</TableCell>
                  <TableCell align='center' sx={estilosEncabezado()}>Nombre Unidad</TableCell>
                  <TableCell align='center' sx={estilosEncabezado()}>Acciones</TableCell>
                </TableRow>
              </TableHead>

              {/* Cuerpo de la tabla */}
              <TableBody>
                {rolesActivosPersonas.map((rolPersonaUnidad) => (
                  <TableRow key={rolPersonaUnidad.id}>
                    {/* Muestra el número de página */}
                    <TableCell align='center' sx={{ padding: '11px' }}>{rolPersonaUnidad.rolNombre}</TableCell>
                    <TableCell align='center' sx={{ padding: '11px' }}>{rolPersonaUnidad.tipo}</TableCell>
                    <TableCell align='center' sx={{ padding: '11px' }}>{rolPersonaUnidad.unidadNombre}</TableCell>
                    <TableCell align='center'>
                      <DeleteIcon
                        sx={{ fontSize: 25, cursor: 'pointer', color: '#363581' }}
                        onClick={() => handleOpenModal(rolPersonaUnidad.id)}
                      />
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>


        </Box>

        <EstaSeguroAccion
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          texto={`¿Está seguro que desea eliminar el rol?`}
          handleAceptar={async () => {
            await handleEliminarRol();  // Ejecutar la función de guardado
            setModalOpen(false);    // Cerrar el modal después de guardar
          }}
        />

      </Box>
    </Box>
  );
}
