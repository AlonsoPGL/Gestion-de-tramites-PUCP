"use client";
import { useEffect, useState } from 'react';
import { Box, Typography, Button, Pagination, PaginationItem } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// Importa el componente de tabla
import BarraBusqueda from '../../../../../componentesAdministrador/BarraBusqueda';
import Link from 'next/link';
import EstaSeguroAccion from '../../../../../componentesGenerales/modales/EstaSeguroAccion';
import TablaEncuestas from '../../../../../componentesSecretarioAcadémico/TablaEncuestas';
import axios from 'axios';
import { useEncuesta } from '../../../EncuestaContext';

export default function GestionEncuesta() {
  // Referencia para el campo input de archivos

  // Maneja el evento para abrir el cuadro de diálogo
  const [encuestas, setEncuestas] = useState([]);
  const [filteredEncuestas, setFilteredEncuestas] = useState([]); // Estado para encuestas filtradas
  const [modalOpen, setModalOpen] = useState(false);
  const [encuestaAEliminar, setEncuestaAEliminar] = useState(null);
  const { setEncuesta } = useEncuesta();
  const [page, setPage] = useState(0); // Página actual
  const [rowsPerPage, setRowsPerPage] = useState(5); // Número de filas por página
  const [totalEncuestas, setTotalEncuestas] = useState(0); // Total de encuestas después de filtrar

  useEffect(() => {
    const cargarEncuestas = async () => {
      try {
        console.log(page,rowsPerPage);
        const response = await axios.get(`http://localhost:8080/preguntas/encuesta/listarPaginacion?page=${page}&size=${rowsPerPage}&tipo=${"DOCENTE"}`);
        console.log('Respuesta del backend:', response.data); // Verifica la estructura aquí
        setEncuestas(response.data.content);
        setFilteredEncuestas(response.data.content);
        setTotalEncuestas(response.data.totalElements);
      } catch (error) {
        console.error("Error al cargar encuestas:", error);
      }
    };

    cargarEncuestas();
  }, [page, rowsPerPage]);


  const limpiarContexEncuesta = async () => {
    localStorage.removeItem('selectedEncuesta');
    localStorage.removeItem('editar');
    setEncuesta('');
  }
  const handleBuscarEnuesta = (busqueda) => {
    const resultadosFiltrados = encuestas.filter((encuesta) =>
      encuesta.titulo?.toLowerCase().includes(busqueda.toLowerCase())
    );
    setFilteredEncuestas(resultadosFiltrados);
  };

  const handleEliminarEncuesta = (id_Encuesta) => {
    setEncuestaAEliminar(id_Encuesta); // Guarda el ID de la encuesta a eliminar
    setModalOpen(true); // Abre el modal
  };

  const eliminarEncuesta = async () => {
    if (encuestaAEliminar) {
      try {
        await axios.delete(`http://localhost:8080/preguntas/encuesta/eliminar/${encuestaAEliminar}`); // Cambia la URL según tu configuración
        // Actualiza la lista de usuarios
        setEncuestas((prevEncuestas) => prevEncuestas.filter(encuesta => encuesta.id_Encuesta !== encuestaAEliminar));
        setFilteredEncuestas((prevFiltered) => prevFiltered.filter(encuesta => encuesta.id_Encuesta !== encuestaAEliminar));
        console.log(`Encuesta con código ${encuestaAEliminar} eliminado exitosamente.`);
        const nuevoTotal = totalEncuestas - 1; // Actualizar el total al eliminar un usuario
        setTotalEncuestas(nuevoTotal); // Actualiza el total

        // Verificar si la página actual excede el total de páginas
        const totalPages = Math.ceil(nuevoTotal / rowsPerPage);
        if (page >= totalPages && totalPages > 0) {
          setPage(totalPages - 1);
        }
      } catch (error) {
        console.error("Error al eliminar la encuesta:", error);
      }
    }
  };

  return (
    <Box sx={{ backgroundColor: 'white', height: '100vh' }}>

      {/*Aqui se llamaba explicitamente al componente barra lateral, pero esto no era necesario, ya que se esta usando un layout que es el archivo que esta en la raiz*/}

      <Box
        sx={{
          marginLeft: '220px',
          height: '100vh',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Título */}
        <Typography variant="h4" sx={{ mb: '20px', color: '#191D23' }}>
          Gestión de Encuestas de Docentes
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <BarraBusqueda onSearch={handleBuscarEnuesta} />
          </Box>
          <Button
            component={Link}
            href="./registrarEncuesta"
            variant="contained"
            color="primary"
            onClick={limpiarContexEncuesta}
            sx={{ ml: 2, display: 'flex', alignItems: 'center', height: '40px', backgroundColor: '#363581' }} // Ajusta la altura según sea necesario

          >
            Añadir
            <AddCircleOutlineIcon sx={{ ml: 1, color: 'white', borderRadius: '50%', backgroundColor: '#363581', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
          </Button>
        </Box>

        {/* Tabla de encuestas */}
        <TablaEncuestas encuestas={filteredEncuestas} onDelete={handleEliminarEncuesta} ></TablaEncuestas>

        <EstaSeguroAccion
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          texto={`¿Está seguro de eliminar la encuesta?`}
          handleAceptar={async () => {
            await eliminarEncuesta();
            setModalOpen(false);
          }}
        />

        <Pagination
          count={Math.ceil(totalEncuestas / rowsPerPage)}
          page={page + 1}
          onChange={(event, value) => setPage(value - 1)}
          variant="outlined"
          shape="rounded" // Este sigue aplicando a los botones de "Prev" y "Next"
          renderItem={(item) => (
            <PaginationItem
              {...item}
              components={{
                previous: (props) => <span>Prev</span>, // Asegura que "Prev" se renderice con las props
                next: (props) => <span>Next</span>,  // Asegura que "Next" se renderice con las props
              }}
            />
          )}
          sx={{
            mt: 3,
            '& .MuiPaginationItem-root': {
              border: '1px solid #D9D9D9', // Borde claro alrededor de los botones
              color: '#363581', // Color del texto en los botones
              margin: '0px', // Ajusta el espaciado entre los botones
              borderRadius: '0px', // Quita el borde redondeado de todos los botones
              '&:hover': {
                backgroundColor: '#f0f0f0', // Color al pasar el cursor
              },
              '&.Mui-selected': {
                backgroundColor: '#363581', // Color de fondo del botón seleccionado
                color: 'white', // Color de texto en el botón seleccionado
                '&:hover': {
                  backgroundColor: '#303f9f', // Color al pasar el cursor en el seleccionado
                },
              },
            },
            ul: {
              justifyContent: 'right', // Alinear los botones de paginación a la derecha
            },
          }}
        />

      </Box>
    </Box>
  );
}
