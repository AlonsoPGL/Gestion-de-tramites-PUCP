"use client";
import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
//import EditIcon from "@mui/icons-material/Edit";
import Pagination from "@mui/material/Pagination";
import { useRouter } from "next/navigation";
import { usePersona } from '../../../PersonaContext';
import axios from "axios";
import BarraBusqueda from "../../../../../componentesAdministrador/BarraBusqueda";

const TablaEncuestaJP = () => {
  const { persona } = usePersona();
  const rowsPerPage = 7;
  const router = useRouter();
  const [horarios, setHorarios] = useState([]);
  const [page, setPage] = useState(1); // Página actual (empezamos desde 1)
  // Use an object to track which rows are selected (by horario ID)
  //const [selectedHorarios, setSelectedHorarios] = useState({});
  const [selectedHorario, setSelectedHorario] = useState(null);
  const [selectedJP, setSelectedJP] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para almacenar el valor de búsqueda

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/rrhh/alumno/${persona.id}/horario`
        );
        setHorarios(response.data);
        console.log("response.data", response.data);
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

  const filteredHorarios = horarios.filter((horario) =>
    horario.codigoCurso?.toLowerCase().includes(searchTerm.toLowerCase())||
    horario.nombreCurso?.toLowerCase().includes(searchTerm.toLowerCase())||
    horario.codigo?.toLowerCase().includes(searchTerm.toLowerCase())||
    horario.jps?.some((jp) => jp.nombre?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSearch = (term) => {
    setSearchTerm(term); // Actualiza el estado con el valor de búsqueda
  };

  const rendirEncuesta = () => {
    // Verificar si se ha seleccionado un horario
    if (!selectedHorario) {
      alert("Por favor, selecciona un horario.");
      return;
    }
  
    // Redirigir con el parámetro id del horario seleccionado
    router.push(`/alumno/encuestas/encuestaJP/${persona.id}?idHorario=${selectedHorario}&idJP=${selectedJP}`);
  };

  const handleRadioChange = (horarioId, jpId) => {
    setSelectedHorario(horarioId); // Almacenar solo el horario seleccionado
    setSelectedJP(jpId);
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
          Encuesta JP
        </Typography>
        
        <Box sx={{ mb: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <BarraBusqueda onSearch={handleSearch}/>
        </Box>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#363581", color: "#FFFFFF" }}>
                {/*<TableCell align="center" sx={{ color: "#FFFFFF" }}>Clave</TableCell>*/}
                <TableCell align="center" sx={{ color: "#FFFFFF" }}>Código del Curso</TableCell>
                <TableCell align="center" sx={{ color: "#FFFFFF" }}>Nombre del Curso</TableCell>
                <TableCell align="center" sx={{ color: "#FFFFFF" }}>Horario</TableCell>
                <TableCell align="center" sx={{ color: "#FFFFFF" }}>Jefe de Práctica</TableCell>
                <TableCell align="center" sx={{ color: "#FFFFFF" }}></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredHorarios.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((horario) =>
                horario.jps && Array.isArray(horario.jps) ? (
                  horario.jps.map((JP) => (
                    <TableRow key={`${horario.idHorario}-${JP.idJefeDePractica}`}>
                      <TableCell align="center">{horario.codigoCurso}</TableCell>
                      <TableCell align="center">{horario.nombreCurso}</TableCell>
                      <TableCell align="center">{horario.codigo}</TableCell>
                      <TableCell align="center">{JP.nombre}</TableCell>
                      <TableCell align="center">
                        <input
                          type="radio"
                          name="horario"
                          checked={selectedHorario === horario.idHorario && selectedJP === JP.idJefeDePractica}
                          onChange={() => handleRadioChange(horario.idHorario, JP.idJefeDePractica)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : null
              )}
            </TableBody>
          </Table>

        </TableContainer>

        <Box sx={{ display: "flex", justifyContent: "flex-end", padding: "20px" }}>
          <Pagination
            count={Math.ceil(horarios.length / rowsPerPage)} // Número total de páginas
            page={page} // Página actual
            onChange={handleChangePage} // Manejador de cambio de página
            size="large"
            color="primary"
            //sx={estilosIndice()}
          />
        </Box>
        
        <Box sx={{padding: '20px', display: 'flex', flexDirection: 'row', justifyContent: "flex-end" }}>
          
          <Button sx={{ width: '220px'}}
            variant="outlined" onClick={() => router.back()}>
              Regresar
          </Button>

          <Button sx={{ width: '220px', backgroundColor: "#363581", color: "#FFFFFF", ml:4}}
            variant="outlined" onClick={() => rendirEncuesta()}>
              Rendir encuesta
          </Button>
          
        </Box>

      </Box>
    </Box>
  );
};

export default TablaEncuestaJP;