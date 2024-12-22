"use client";
import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useRouter } from "next/navigation";
import axios from "axios";
import BarraBusqueda from "../../../../../componentesAdministrador/BarraBusqueda";

const ListaDocentes = () => {
  const rowsPerPage = 7;
  const [page, setPage] = useState(1);
  const router = useRouter();
  const [docentes, setDocentes] = useState([]);
  const [docentesFiltrados, setDocentesFiltrados] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para almacenar el valor de búsqueda

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/rrhh/docente/listar`
        );
        const docentesData = response.data.reverse();
        console.log("response.data", response.data);
        setDocentes(docentesData.filter(e => e.activo === true));
      } catch (error) {
        setError("Ocurrió un error al cargar los datos");
        console.error(error);
      }
    };
    fetchData();
  }, []);
  
  const handleChangePage = (event, value) => {
    setPage(value);
  };
    // Filtrar solicitudes en base al título ingresado
    useEffect(() => {
      const filtrarDocentes = () => {
          if (searchTerm.trim() === "") {
              // Si no hay texto de búsqueda, mostrar todas las solicitudes
              setDocentesFiltrados(docentes);
          } else {
              // Filtrar solicitudes que coincidan parcialmente con el título
              const filtradas = docentes.filter((docente) =>
                docente.nombre?.toLowerCase().includes(searchTerm.toLowerCase())||
                docente.apellidoPaterno?.toLowerCase().includes(searchTerm.toLowerCase())||
                docente.apellidoMaterno?.toLowerCase().includes(searchTerm.toLowerCase())||
                String(docente.codigo)?.toLowerCase().includes(searchTerm.toLowerCase())||
                docente.email?.toLowerCase().includes(searchTerm.toLowerCase())
              );
              setDocentesFiltrados(filtradas);
          }
          setPage(1);
      };

      filtrarDocentes();
  }, [searchTerm, docentes]);

  const handleSearch = (term) => {
    setSearchTerm(term); // Actualiza el estado con el valor de búsqueda
  };

  const handleVerDetallesDocente = (id) => {
    router.push(`./encuestaDocente/${id}`);
  };

  return (
    <Box sx={{ backgroundColor: 'white', height: '100vh'}}>
      <Box
        sx={{
          marginLeft: '220px',
          height: '100vh',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#363581', mb: '20px'}}>
          Resultados de Encuesta Docente
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: '20px' }}>
          <Box sx={{ mb: "10px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <BarraBusqueda onSearch={handleSearch}/>
          </Box>
        </Box>

        <Box>
          <TableContainer component={Paper} sx={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', overflow: 'auto' }}>
            <Table sx={{ borderCollapse: 'collapse' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ backgroundColor: '#363581', color: 'white' }} align='center'>Código del Docente</TableCell>
                  <TableCell sx={{ backgroundColor: '#363581', color: 'white' }} align='center'>Nombre del Docente</TableCell>
                  <TableCell sx={{ backgroundColor: '#363581', color: 'white' }} align='center'>Contacto</TableCell>
                  <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center' }}></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {docentesFiltrados ? (
                  docentesFiltrados.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((docente) => (
                    <TableRow key={docente.id} sx={{ backgroundColor: '#F8F9FA' }}>
                      <TableCell align='center'>{docente.codigo}</TableCell>
                      <TableCell align='center'>{`${docente.nombre} ${docente.apellidoPaterno} ${docente.apellidoMaterno}`}</TableCell>
                      <TableCell align='center'>{docente.email}</TableCell>
                      <TableCell align='center'>
                        <IconButton onClick={() => handleVerDetallesDocente(docente.id)}>
                          <VisibilityIcon sx={{ color: '#363581' }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                ))) : (
                  <TableRow>
                    <TableCell colSpan={6} align='center'>
                      <Typography variant='subtitle1' color='textSecondary'>
                        No se encontraron alumnos en riesgo para este docente.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {docentesFiltrados && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", padding: "20px" }}>
              <Pagination
                count={Math.ceil(docentesFiltrados.length / rowsPerPage)} // Número total de páginas
                page={page} // Página actual
                onChange={handleChangePage} // Manejador de cambio de página
                size="large"
                color="primary"
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ListaDocentes;