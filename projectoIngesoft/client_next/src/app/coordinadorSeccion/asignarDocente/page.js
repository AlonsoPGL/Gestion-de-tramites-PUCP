"use client";
import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import BarraBusqueda from "../../../../componentesAdministrador/BarraBusqueda";

import axios from "axios";
import { useRouter } from "next/navigation";
import Pagination from "@mui/material/Pagination";

const tabla = () => {
  const rowsPerPage = 4;
  const router = useRouter(); // Usar el hook de Next.js para navegación
 // const currentPath = usePathname();
  const [cursos, setCursos] = useState([]);
  const [page, setPage] = useState(1); // Página actual (empezamos desde 1)
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCursos,setfilteredCursos] =useState([]);
  const [number,setNumber] =useState(1);

  // Estado para almacenar el valor de búsqueda
 const handleChangePage = (event, value) => {
    setPage(value);
  };
 
  useEffect(() => {
    //console.log("entro.data");
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/institucion/curso/listar?page=${page-1}&size=${rowsPerPage}`
        ); 
        setNumber(response.data.totalElements);
        setCursos(response.data.content);

        setfilteredCursos(response.data.content);
       
        console.log(response.data);
        console.log("esponse.data");
      } catch (error) {
        setError("Ocurrió un error al cargar los datos");
        console.error(error);
      }
    };
    fetchData();
  }, [page]);
 
  const handleSearch = (term) => {
    const data = cursos.filter((curso) =>
      curso.nombre.toLowerCase().includes(term.toLowerCase())
    );
    setfilteredCursos(data); // Actualiza el estado con el valor de búsqueda
  };
 
  
  const handleEditClick = (idHorario,docentes) => {
    localStorage.setItem('docentes', JSON.stringify(docentes));
    console.log(docentes);
    router.push(`/coordinadorSeccion/asignarDocente/designarDocente?idHorario=${idHorario}` );


  };
  return (
    <>
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
      <Typography
        variant="h4"
        sx={{marginLeft: "20px",fontWeight: "",color: "black", }}
      >
        Designar docentes a los cursos y horario
      </Typography>

      <Box
        sx={{
          padding: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <BarraBusqueda onSearch={handleSearch}/>
        {/* Barra de búsqueda y botón juntos   <Button 
          sx={{ backgroundColor: '#363581' }}
          component={Link}
          href="./solicitudCartaPresentacion/registrarCarta"
          variant="contained" color="primary" startIcon={<AddCircleOutlineIcon />}>
            
          Generar
        </Button>*/}
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow
              sx={{ backgroundColor: "#363581",color: "#FFFFFF" }}
            >
              <TableCell align="center" sx={{ color: "#FFFFFF" }}>
                 Curso
              </TableCell>
              <TableCell align="center" sx={{ color: "#FFFFFF" }}>
                Horario
              </TableCell>
              <TableCell align="center" sx={{ color: "#FFFFFF" }}>
                Profesor Designado
              </TableCell>
              <TableCell align="center" sx={{ color: "#FFFFFF" }}>
                Acciones Profesor
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(Array.isArray(filteredCursos) ? filteredCursos : []).map((row) => (
                <TableRow
                  key={row.idCurso}
                //  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{row.codigo+" - "+row.nombre}</TableCell>

                  <TableCell colSpan={3}>
                    <Table size="small">
                    <TableBody>
                  {row.horarios && row.horarios.length > 0 ? (
                    row.horarios.map((horario) => (
                      <TableRow key={horario.idHorario}>
                        <TableCell align="center" sx={{ width: "18%" }}>
                          {horario?.codigo ?? "sin codigo" + "Vac." + horario.cantAlumnos}
                        </TableCell>

                        <TableCell align="center" sx={{ width: "45%" }}>
                          {horario.docentes[0]?.nombre ? "SI" : "NO"}
                        </TableCell>

                        <TableCell align="center">
                          <IconButton onClick={() => handleEditClick(horario.idHorario, horario.docentes)}>
                            <EditIcon sx={{ color: "#363581" }} />
                            {/* Ícono de lápiz */}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ color: "#FF0000" }}>
                        No hay horarios disponibles
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                    </Table>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <Box sx={{ display: "flex", justifyContent: "flex-end", padding: "20px" }}>
        <Pagination
          count={Math.ceil(number / rowsPerPage)} // Número total de páginas
          page={page} // Página actual
          onChange={handleChangePage} // Manejador de cambio de página
          size="large"
          color="primary"
          //sx={estilosIndice()}
        />
        </Box>
      </TableContainer>
      </Box>
      </Box>
    </>
  );
};

export default tabla;
