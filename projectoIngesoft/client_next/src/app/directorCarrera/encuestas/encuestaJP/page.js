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

const ListaJPs = () => {
  const rowsPerPage = 7;
  const [page, setPage] = useState(1);
  const router = useRouter();
  const [JPs, setJPs] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para almacenar el valor de búsqueda

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/institucion/horario/listarJps`
        );
        const JPsData = response.data;
        console.log("response.data", response.data);
        const JPsFiltrados = JPsData.filter(e => e.activo === true);
        setJPs(JPsFiltrados);
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

  const filteredJPs = JPs.filter((JP) =>
    JP.nombre?.toLowerCase().includes(searchTerm.toLowerCase())||
    String(JP.calificacionAnual)?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (term) => {
    setSearchTerm(term); // Actualiza el estado con el valor de búsqueda
    setPage(1);
  };

  const handleVerDetallesJP = (id) => {
    router.push(`./encuestaJP/${id}`);
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
        <Typography variant="h4" sx={{ color: 'black', mb: '20px'}}>
          Resultados de Encuesta JP
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
                  <TableCell sx={{ backgroundColor: '#363581', color: 'white' }} align='center'>Nombre del Jefe de Práctica</TableCell>
                  <TableCell sx={{ backgroundColor: '#363581', color: 'white' }} align='center'>Calificacion Anual</TableCell>
                  <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center' }}></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredJPs ? (
                  filteredJPs.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((JP) => (
                    <TableRow key={JP.idJefeDePractica} sx={{ backgroundColor: '#F8F9FA' }}>
                      <TableCell align='center'>{JP.nombre}</TableCell>
                      <TableCell align='center'>{JP.calificacionAnual}</TableCell>
                      <TableCell align='center'>
                        <IconButton onClick={() => handleVerDetallesJP(JP.idJefeDePractica)}>
                          <VisibilityIcon sx={{ color: '#363581' }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                ))) : (
                  <TableRow>
                    <TableCell colSpan={6} align='center'>
                      <Typography variant='subtitle1' color='textSecondary'>
                        No se encontraron alumnos en riesgo para este JP.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {filteredJPs && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", padding: "20px" }}>
              <Pagination
                count={Math.ceil(filteredJPs.length / rowsPerPage)} // Número total de páginas
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

export default ListaJPs;