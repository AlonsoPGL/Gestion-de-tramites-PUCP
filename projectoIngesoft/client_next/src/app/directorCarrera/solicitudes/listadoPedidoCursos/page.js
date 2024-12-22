"use client";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useContext } from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useRouter } from 'next/navigation';
import axios from "axios";
import Visibility from "@mui/icons-material/Visibility";
import { useConvocatoria } from '../../../convocatoriaContext';
import { usePedidoCurso } from "@/app/PedidoCursoContext";
import EstaSeguroAccion from 'componentesGenerales/modales/EstaSeguroAccion';
import { useUnidad } from '../../../UnidadContex'; 


export default function ListadoSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]); // Estado para almacenar las solicitudes
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]); // Estado para solicitudes filtradas
  const [page, setPage] = useState(0); // Página actual
  const [rowsPerPage, setRowsPerPage] = useState(5); // Número de filas por página
  const [totalSolicitudes, setTotalSolicitudes] = useState(0);
  const { setConvocatoria } = useConvocatoria();
  const { setPedidoCurso } = usePedidoCurso();
  const [pedidoCursosSeleccionado, setPedidoCursosSeleccionado] = useState('');
  const [openModalAprobar, setOpenModalAprobar] = useState(false); //Estado del modal DE estas Seguro?
  const [openModalRechazar, setOpenModalRechazar] = useState(false); //Estado del modal DE estas Seguro?
  const { unidad } = useUnidad();
  const router = useRouter();
  const handleCloseModalAprobar = () => setOpenModalAprobar(false); //Cierra modal de "Estas seguro?"
  const handleCloseModalRechazar = () => setOpenModalRechazar(false); //Cierra modal de "Estas seguro?"

  //console.log(persona);
  // Cargar solicitudes
  useEffect(() => {
    cargarSolicitudes();
  }, [page, rowsPerPage]);

  const cargarSolicitudes = async () => {
    try {
      const params = {
        page: page,
        size: 5,
        especialidadId: unidad.idUnidad,  // Enviar el id de la especialidad si está seleccionado

      };
      const response = await axios.get(
        `http://localhost:8080/SolicitudPedidosCursos/listar`, { params });
      setSolicitudes(response.data.content);
      setFilteredSolicitudes(response.data.content);
      setTotalSolicitudes(response.data.totalElements);
      //console.log(response.data.content);

    } catch (error) {
      console.error("Error cargando las solicitudes:", error);
    }
  };

  const handleAprobar = async () => {
    try {
      await axios.put(
        `http://localhost:8080/SolicitudPedidosCursos/${pedidoCursosSeleccionado.id}/estado`,
        "ACEPTADA",
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error al actualizar la postulacion:", error);
    }
  };

  const handleRechazar = async () => {
    try {
      await axios.put(
        `http://localhost:8080/SolicitudPedidosCursos/${pedidoCursosSeleccionado.id}/estado`,
        "RECHAZADA",
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error al actualizar la solicitud:", error);
    }
  };

  const visualizarSolic = (solicitud) => {
    setPedidoCurso(solicitud);
    router.push('/directorCarrera/solicitudes/visualizarSolicitudPedidoCurso');
  };

  const handleEstaSeguroAprobar = (solicitud) => {
    setPedidoCursosSeleccionado(solicitud);
    setOpenModalAprobar(true);
  };

  const handleEstaSeguroRechazar = (solicitud) => {
    setPedidoCursosSeleccionado(solicitud)
    setOpenModalRechazar(true)
  }

  const redirectPedidos = () => {
    localStorage.removeItem('selectedPedidoCurso');
    localStorage.setItem('editarPedidoCurso', JSON.stringify(false));
    setPedidoCurso('');
    router.push('./solicitudes/pedidoCursos');
  }

 
  

  // 3. Filtrar las solicitudes por especialidad además de por motivo
  const handleSearchChange = (data) => {
    console.log("lo q " + data);
    // setSelectedEspecialidad(String(data));
    console.log("lo q " + selectedEspecialidad);  // Solo actualizamos el estado de especialidad
    //  cargarSolicitudes();  // Luego volvemos a cargar las solicitudes con los filtros aplicados

  };

  return (
    <Box sx={{ backgroundColor: "white", height: "100vh" }}>
      <Box sx={{ marginLeft: "220px", height: "100vh", padding: "20px", display: "flex", flexDirection: "column" }}>
        <Typography variant="h4" sx={{ mb: "70px", color: "#191D23" }}>
          Listado de Solicitudes de Pedidos de Cursos
        </Typography>

        {/* Tabla */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center' }}>Código</TableCell>
                <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center' }}>Descripción</TableCell>
                <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center' }}>Especialidad</TableCell>
                <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center' }}>Estado</TableCell>
                <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSolicitudes.map((solicitud) => (
                <TableRow key={solicitud.id}>
                  <TableCell sx={{ textAlign: 'center' }}>{solicitud.id}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{solicitud.motivo}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{solicitud?.especialidad?.nombre}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{solicitud.estado}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <IconButton
                      onClick={() => visualizarSolic(solicitud)}
                      color="primary"
                      sx={{
                        "&:hover": {
                          color: "#3F51B5",
                        },
                      }}
                    >
                      <Visibility />
                    </IconButton>
                  </TableCell>
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Paginación */}
        <Box>
          <Pagination
            count={Math.ceil(totalSolicitudes / rowsPerPage)}
            page={page + 1}
            onChange={(event, value) => setPage(value - 1)}
            size="large"
            color="primary"
            sx={{
              mt: 3,
              "& .MuiPaginationItem-root": {
                borderRadius: "50%",
                color: "#363581",
                margin: "0px",
                width: "35px",
                height: "35px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
                "&.Mui-selected": {
                  backgroundColor: "#363581",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#303f9f",
                  },
                },
              },
              ul: { justifyContent: "right" },
            }}
          />
        </Box>
      </Box>

      <EstaSeguroAccion
        open={openModalAprobar}
        onClose={handleCloseModalAprobar}
        handleAceptar={handleAprobar}
        texto="Seguro quiere aprobar a esta solicitud?"
      />
      <EstaSeguroAccion
        open={openModalRechazar}
        onClose={handleCloseModalRechazar}
        handleAceptar={handleRechazar}
        texto="Seguro quiere rechazar a este solicitud?"
      />
    </Box>
  );
}
