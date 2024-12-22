"use client";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useRouter,useParams } from 'next/navigation';
import axios from "axios";
import Link from "next/link";
import Visibility from "@mui/icons-material/Visibility";
import { useConvocatoria } from '../../../convocatoriaContext';
import { usePedidoCurso  } from "@/app/PedidoCursoContext";
import { useUnidad } from "@/app/UnidadContex";
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import EstaSeguroAccion from 'componentesGenerales/modales/EstaSeguroAccion';

export default function ListadoSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]); // Estado para almacenar las solicitudes
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]); // Estado para solicitudes filtradas
  const [page, setPage] = useState(0); // Página actual
  const [rowsPerPage, setRowsPerPage] = useState(5); // Número de filas por página
  const [totalSolicitudes, setTotalSolicitudes] = useState(0);
  const { setConvocatoria } = useConvocatoria();
  const { setPedidoCurso } = usePedidoCurso();
  const { unidad } = useUnidad();
  const [openModalAprobar, setOpenModalAprobar] = useState(false); //Estado del modal DE estas Seguro?
  const [openModalRechazar, setOpenModalRechazar] = useState(false); //Estado del modal DE estas Seguro?
  const [searchTerm, setSearchTerm] = useState("");  // Estado para el término de búsqueda
  const [especialidades, setEspecialidades] = useState([]); // Lista de especialidades
  const [selectedEspecialidad, setSelectedEspecialidad] = useState(""); // Especialidad seleccionada ("" por defecto)
  const [pedidoCursosSeleccionado, setPedidoCursosSeleccionado] = useState("");
  const handleCloseModalAprobar = () => setOpenModalAprobar(false); //Cierra modal de "Estas seguro?"
  const handleCloseModalRechazar = () => setOpenModalRechazar(false); //Cierra modal de "Estas seguro?"
  const router = useRouter();

  // Cargar solicitudes
  useEffect(() => {
    cargarSolicitudes(selectedEspecialidad);
  }, [page, rowsPerPage, selectedEspecialidad]);
  

  const handleEstaSeguroAprobar = (solicitud) => {
    setPedidoCursosSeleccionado(solicitud);
    setOpenModalAprobar(true);
  };

  const handleEstaSeguroRechazar = (solicitud) => {
    setPedidoCursosSeleccionado(solicitud)
    setOpenModalRechazar(true)
  }

  const handleAprobar = async () => {
    try {
      await axios.put(
        `http://localhost:8080/SolicitudPedidosCursos/${pedidoCursosSeleccionado.id}/${selectedEspecialidad}/estado`,
        "ACEPTADA",
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );
      alert(`Se aprobó la solicitud y se crearon los horarios solicitados`);v

    } catch (error) {
      console.error("Error al actualizar la postulacion:", error);
    }
  };
  const handleRechazar = async () => {
    try {
      await axios.put(
        `http://localhost:8080/SolicitudPedidosCursos/${pedidoCursosSeleccionado.id}/${selectedEspecialidad}/estado`,
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
  const cargarSolicitudes = async (selectedEspecialidad) => {
    try {
      const params = {
        page: page,
        size: 5,
        especialidadId: selectedEspecialidad ,  // Enviar el id de la especialidad si está seleccionado
      };
      if(selectedEspecialidad){
        const response = await axios.get(
          `http://localhost:8080/SolicitudPedidosCursos/listar`, { params });
          console.log("dataseelcts es :"+selectedEspecialidad);
          setSolicitudes(response.data.content);
          setFilteredSolicitudes(response.data.content);
          setTotalSolicitudes(response.data.totalElements);
      }
      
    } catch (error) {
      console.error("Error cargando las solicitudes:", error);
    }
  };

  // Enviar solicitud para visualizar
  const enviarSolic = (solicitud) => {
    setPedidoCurso(solicitud);
    router.push(`/secretarioAcademico/solicitudes/visualizarSolicitudPedidoCurso?idEspecialidad=${selectedEspecialidad}`);
  };
  
  // Enviar solicitud para editar
  const enviarSolicEdit = (solicitud) => {
    setPedidoCurso(solicitud);
    router.push(`/secretarioAcademico/solicitudes/editarPedidoCursos?idEspecialidad=${selectedEspecialidad}`);
  };


  // 2. Cargar las especialidades de la facultad del secretario academico
  useEffect(() => {
    const cargarEspecialidades = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/institucion/facultad/listarEspecialidadesDeFacultad/${unidad.idUnidad}`);
        setEspecialidades(response.data); // Asumimos que la respuesta tiene la lista de especialidades
  
        // Si hay especialidades, cargar las solicitudes de la primera especialidad
        if (response.data.length > 0) {
          setSelectedEspecialidad(response.data[0].id); // Seleccionar la primera especialidad
        }
      } catch (error) {
        console.error("Error cargando las especialidades:", error);
      }
    };
  
    cargarEspecialidades();
  }, [unidad.idUnidad]); // Dependencia en unidad.idUnidad
  
  
  // 3. Filtrar las solicitudes por especialidad además de por motivo
  const handleSearchChange = (searchValue) => {
    const busqueda = searchValue.target.value.toLowerCase(); // Convertir la búsqueda a minúsculas
    setSearchTerm(busqueda); // Actualizar el término de búsqueda
  
    // Aplicar el filtro basado en el término de búsqueda
    const filtered = solicitudes.filter((solicitud) => {
      // Verificar si el motivo o el nombre de la especialidad contienen el término de búsqueda
      const motivoMatch = solicitud.motivo
        .toLowerCase()
        .includes(busqueda.toLowerCase());
  
      const especialidadMatch = solicitud?.especialidad?.nombre
        ?.toLowerCase()
        .includes(busqueda.toLowerCase());
  
      return motivoMatch || especialidadMatch;
    });
  
    setFilteredSolicitudes(filtered); // Actualizar las solicitudes filtradas
  };
  
  return (
    <Box sx={{ backgroundColor: "white", height: "100vh" }}>
      <Box sx={{ marginLeft: "220px", height: "100vh", padding: "20px", display: "flex", flexDirection: "column" }}>
        <Typography variant="h4" sx={{ mb: "20px", color: "#191D23" }}>
          Listado de Solicitudes de Pedidos de Cursos
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2, alignItems: "center" }}>
          
        <Box sx={{ flexGrow: 1, mr: 2 }}>
            <TextField
              placeholder="Buscar..."
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={handleSearchChange}
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


          <FormControl sx={{ mb: 2, minWidth: 400 }}>
            <InputLabel id="especialidad-label"  >Especialidad</InputLabel>
            <Select
              labelId="especialidad-label"
              value={selectedEspecialidad}
              onChange={(e) => setSelectedEspecialidad(e.target.value)}
              label="Especialidad"
              sx={{
                fontSize: "0.875rem", // Reducir el tamaño de la fuente en el select
              }}
            >
              {especialidades.map((especialidad, index) => (
                <MenuItem key={index} value={especialidad.id}>
                  {especialidad.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

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
                <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center' }}>Aprobación</TableCell>
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
                      onClick={() => enviarSolic(solicitud)}
                      color="primary"
                      sx={{
                        "&:hover": {
                          color: "#3F51B5",
                        },
                      }}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      onClick={() => enviarSolicEdit(solicitud)}
                      color="primary"
                      sx={{
                        "&:hover": {
                          color: "#3F51B5",
                        },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center" >
                    {solicitud.estado === 'NO_APROBADA' ? (
                      <>
                        <IconButton onClick={() => handleEstaSeguroAprobar(solicitud)} color="primary" sx={{
                          "&:hover": {
                            color: "#3F51B5",
                          },
              
                        }}>
                          <CheckCircleIcon />
                        </IconButton>
                        
                      </>
                    ) : solicitud?.estado === 'ACEPTADA' ? (
                      <span>Aprobada</span>
                    ) : (
                      <span>Rechazada</span>
                    )}
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
        texto="Seguro quiere aprobar esta solicitud?"
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
