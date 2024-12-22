"use client";
import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import Pagination from "@mui/material/Pagination";
import { useRouter } from "next/navigation";
import axios from "axios";
import { usePersona } from '../../PersonaContext';
import BarraBusqueda from "../../../../componentesAdministrador/BarraBusqueda";

const TablaListaHorario = () => {
  const { persona } = usePersona();
  const rowsPerPage = 6;
  const router = useRouter();
  const [horarios, setHorarios] = useState([]);
  const [page, setPage] = useState(1); // Página actual (empezamos desde 1)
  const [searchTerm, setSearchTerm] = useState(''); // Estado para almacenar el valor de búsqueda

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/institucion/horario/docente/${persona.id}`
      );
      setHorarios(response.data);
      console.log(response.data);
      console.log("response.data");
    } catch (error) {
      setError("Ocurrió un error al cargar los datos");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  },[]);
  
  const filteredHorarios = horarios.filter((horario) =>
    horario.nombreCurso?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    horario.codigoCurso?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    horario.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    horario.delegado.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    horario.delegado.apellidoPaterno?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    horario.delegado.apellidoMaterno?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSearch = (term) => {
    setSearchTerm(term); // Actualiza el estado con el valor de búsqueda
  };
  
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const editarDelegado = async (idHorario) => {
    router.push(`/docente/asignarDelegado/${idHorario}`);
  };

  const eliminarDelegado = async (idHorario) => {
    try {
      const response = await axios.put(`http://localhost:8080/institucion/horario/eliminarDelegado/${idHorario}`);

      console.log('Delegado eliminado:', response.data);
      fetchData();
      alert(`Se eliminó la selección del delegado.`);
      
    } catch (error) {
        console.error('Error al eliminar delegado.', error);
    }
  };

  return (
    <Box sx={{ backgroundColor: 'white', height: '100vh' }}>
      <Box
        sx={{
          marginLeft: '220px',
          height: '100vh',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h4" sx={{ color: "black", mb: '20px' }}>
          Listado de Cursos y Delegados
        </Typography>

        <Box sx={{ mb: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <BarraBusqueda onSearch={handleSearch}/>
        </Box>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#363581", color: "#FFFFFF" }}>
                <TableCell align="center" sx={{ color: "#FFFFFF" }}>Código del Curso</TableCell>
                <TableCell align="center" sx={{ color: "#FFFFFF" }}>Nombre del Curso</TableCell>
                <TableCell align="center" sx={{ color: "#FFFFFF" }}>Horario</TableCell>
                <TableCell align="center" sx={{ color: "#FFFFFF" }}>Delegado Asignado</TableCell>
                <TableCell align="center" sx={{ color: "#FFFFFF" }}>Acción</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredHorarios.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((row) => (
                <TableRow key={row.idHorario}>                  
                  <TableCell align="center">{row.codigoCurso}</TableCell>
                  <TableCell align="center">{row.nombreCurso}</TableCell>
                  <TableCell align="center">{row.codigo}</TableCell>
                  <TableCell align="center">{row.delegado?`${row.delegado.nombre} ${row.delegado.apellidoPaterno} ${row.delegado.apellidoMaterno}`:<strong>NO</strong>}</TableCell>  
                  <TableCell align='center'>
                    {/*
                    <Link href={`asignarDelegado/${row.idHorario}`} >
                      <EditIcon
                        sx={{ fontSize: 25, cursor: 'pointer', marginRight: '5px', color: '#363581' }}
                      />
                    </Link>
                    */}
                    <EditIcon
                      sx={{ fontSize: 25, cursor: 'pointer', marginRight: '5px', color: '#363581' }}
                      onClick={() => editarDelegado(row.idHorario)}
                    />
                    <DeleteIcon
                      sx={{ fontSize: 25, cursor: 'pointer', marginRight: '5px', color: '#363581' }}
                      onClick={() => {
                        if(row.delegado) {
                          eliminarDelegado(row.idHorario);
                        } else {
                          alert('No existe delegado asignado.')
                        }
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "flex-end", padding: "20px" }}>
          <Pagination
            count={Math.ceil(filteredHorarios.length / rowsPerPage)} // Número total de páginas
            page={page} // Página actual
            onChange={handleChangePage} // Manejador de cambio de página
            size="large"
            color="primary"
            //sx={estilosIndice()}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default TablaListaHorario;