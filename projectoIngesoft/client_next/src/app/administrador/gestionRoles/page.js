"use client";
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Pagination, PaginationItem } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BarraBusqueda from '../../../../componentesAdministrador/BarraBusqueda';
import TablaRoles from "../../../../componentesAdministrador/gestionRoles/TablaRoles";
import ModalAnhadirEditar from '../../../../componentesAdministrador/gestionRoles/ModalAnhadirEditar';
import axios from 'axios';
import ModalSuperior from '../../../../componentesGenerales/modales/ModalSuperior';
import { useRouter } from 'next/navigation';
import { useRol } from '../../RolContext'; // Importar el contexto

export default function GestionRoles() {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmacionOpen, setConfirmacionOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [modalData, setModalData] = useState({ nombre: '', descripcion: '', isEdit: false, rolId: null,/* unidad: ''*/ tipoUnidad: '' });
  const [rolAEliminar, setRolAEliminar] = useState(null);
  const [page, setPage] = useState(0); // Página actual
  const [rowsPerPage, setRowsPerPage] = useState(5); // Número de filas por página
  const [totalRoles, setTotalRoles] = useState(0); // Total de roles después de filtrar
  const { setRol } = useRol(); // Obtener el setRol del contexto
  const router = useRouter();

  useEffect(() => {
    obtenerRoles();
  }, [page, rowsPerPage]);

  const obtenerRoles = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/rrhh/rol/listarPaginacion?page=${page}&size=${rowsPerPage}`);
      setRoles(response.data.content);
      setFilteredRoles(response.data.content);
      setTotalRoles(response.data.totalElements);
    } catch (error) {
      console.error("Error al obtener la lista de roles:", error);
    }
  };

  const handleBuscarRoles = async (busqueda) => {

    if(busqueda.trim() !== ""){
      const resultadosFiltrados = roles.filter((rol) =>
        rol.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        rol.descripcion.toLowerCase().includes(busqueda.toLowerCase())
      );
      setFilteredRoles(resultadosFiltrados);
      setPage(0);
    }else{
      await obtenerRoles();
      setFilteredRoles(roles);
    }
  };

  const handleChangePage = (event, newPage) => {
    const totalPages = Math.ceil(totalRoles / rowsPerPage);
    if (newPage < totalPages) {
      setPage(newPage);
    }
  };


  const handleGuardar = () => {
    setModalData({ nombre: '', descripcion: '', isEdit: false, rolId: null,/*, unidad: '',*/tipoUnidad:'' });
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
  };

  const handleAñadirRol = async (nombre, descripcion, /*unidad, */ tipo) => {
    try {
      await axios.post('http://localhost:8080/rrhh/rol/insertarRol', { nombre, descripcion, tipo });
      obtenerRoles();
    } catch (error) {
      console.error('Error al añadir rol:', error);
    }
  };

  const handleEditarRol = async (nombre, descripcion, rolId, /*unidad, */ tipo) => {
    try {
      console.log("TIPO",tipo);
      await axios.put(`http://localhost:8080/rrhh/rol/actualizarRol/${rolId}`, { nombre, descripcion, tipo });
      obtenerRoles();
    } catch (error) {
      console.error('Error al editar rol:', error);
    }
  };

  const handleEliminarRol = (rolId) => {
    setRolAEliminar(rolId);
    setConfirmacionOpen(true);
  };

  const confirmarEliminacion = async () => {
    try {
      await axios.delete(`http://localhost:8080/rrhh/rol/eliminarRol/${rolAEliminar}`);
      setRoles((prevRol) => prevRol.filter(rol => rol.id !== rolAEliminar));
      setFilteredRoles((prevFiltered) => prevFiltered.filter(rol => rol.id !== rolAEliminar));
      const nuevoTotal = totalRoles- 1; // Actualizar el total al eliminar un rol
      setTotalRoles(nuevoTotal); // Actualiza el total
    } catch (error) {
      console.error('Error al eliminar rol:', error);
    } finally {
      setConfirmacionOpen(false);
      setRolAEliminar(null);
    }
  };

  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reiniciar a la primera página si se cambia el número de filas
  };

  const handleEditRole = (rol) => {
    console.log("ROL:",rol);
    setModalData({ nombre: rol.nombre, descripcion: rol.descripcion, isEdit: true, rolId: rol.id,/* unidad: rol.unidad,*/ tipoUnidad: rol.tipo });
    setModalOpen(true);
  };

  const handleAñadirYCerrarModal = async (nombre, descripcion, /* unidad,*/ tipoUnidad) => {
    if (modalData.isEdit) {
      await handleEditarRol(nombre, descripcion, modalData.rolId, /* unidad,*/ tipoUnidad);
    } else {
      await handleAñadirRol(nombre, descripcion, /* unidad,*/ tipoUnidad);
    }
    cerrarModal();
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
          Gestión de roles
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <BarraBusqueda onSearch={handleBuscarRoles} />
          </Box>

          <Button
            onClick={handleGuardar}
            variant="contained"
            color="primary"
            sx={{ ml: 2, display: 'flex', alignItems: 'center', height: '40px', backgroundColor: '#363581' }}
          >
            Añadir
            <AddCircleOutlineIcon sx={{ ml: 1, color: 'white', borderRadius: '50%', backgroundColor: '#363581', width: '20px', height: '20px' }} />
          </Button>
        </Box>

        <TablaRoles roles={filteredRoles} onEditRole={handleEditRole} onDeleteRole={handleEliminarRol}  />
        <Box>
          <Pagination
            count={Math.ceil(totalRoles / rowsPerPage)}
            page={page + 1}
            onChange={(event, value) => setPage(value - 1)}
            size="large"
            color="primary"
            sx={{ 
              mt: 3,
              '& .MuiPaginationItem-root': {
                borderRadius: '50%',
                color: '#363581',
                margin: '0px',
                width: '35px', // Ancho del círculo
                height: '35px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center', // Centrar el texto dentro del círculo
                '&:hover': {
                  backgroundColor: '#f0f0f0', // Hover color
                },
                '&.Mui-selected': {
                  backgroundColor: '#363581',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#303f9f',
                  },
                },
              },
              ul: { justifyContent: 'right' },
            }}
          />
        </Box>
      </Box>
      <ModalAnhadirEditar
        open={modalOpen}
        onClose={cerrarModal}
        handleAñadir={handleAñadirYCerrarModal}
        titulo={modalData.isEdit ? "Editar Rol" : "Añadir Rol"}
        nombreInicial={modalData.nombre}
        descripcionInicial={modalData.descripcion}
        tipoUnidadInicial={modalData.tipoUnidad}
        unidadInicial={modalData.unidad}

      />

      <ModalSuperior
        open={confirmacionOpen}
        handleClose={() => setConfirmacionOpen(false)}
        title="¿Está seguro de que deseas eliminar el rol?"
        onConfirm={confirmarEliminacion}
      />

        
    </Box>
  );
}
