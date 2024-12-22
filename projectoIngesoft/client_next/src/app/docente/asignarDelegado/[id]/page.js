"use client";
import { useState, useEffect } from "react";
import { Box, Typography, Button } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { useRouter } from "next/navigation";
import { useParams } from 'next/navigation';
import axios from "axios";
import BarraBusqueda from "../../../../../componentesAdministrador/BarraBusqueda";

{/*
const alumnos = [
  { id: 1, codigo: '20207899', nombre: 'Alonso Peter Gonzales Cruz', email: 'a20207899@pucp.edu.pe' },
  { id: 2, codigo: '20207900', nombre: 'Carlos Alberto Perez Ruiz', email: 'a20207900@pucp.edu.pe' },
  { id: 3, codigo: '20207901', nombre: 'Maria Fernanda Lopez Vega', email: 'a20207901@pucp.edu.pe' },
  // Add more alumno objects as needed
];
*/}

export default function DelegatePage() {
  const params = useParams();
  const idHorario = params.id;
  //const { idHorario } = params; // Get the dynamic 'id' from the URL
  const rowsPerPage = 7;
  const router = useRouter();
  const [alumnos, setAlumnos] = useState([]);
  const [selectedDelegado, setSelectedDelegado] = useState(null);
  const [page, setPage] = useState(1); // Página actual (empezamos desde 1)
  const [searchTerm, setSearchTerm] = useState(''); // Estado para almacenar el valor de búsqueda

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/rrhh/alumno/listarAlumnosHorario/${idHorario}`
        );
        console.log("response.data", response.data);
        setAlumnos(response.data);
      } catch (error) {
        setError("Ocurrió un error al cargar los datos");
        console.error(error);
      }
    };
    fetchData();
  }, [idHorario]);

  const handleSelect = (id) => {
    setSelectedDelegado(id);
  };

  const filteredAlumnos = alumnos.filter((alumno) =>
    String(alumno.codigo)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alumno.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alumno.apellidoPaterno?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alumno.apellidoMaterno?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alumno.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (term) => {
    setSearchTerm(term); // Actualiza el estado con el valor de búsqueda
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleGuardarDelegado= async () => {
    if(!selectedDelegado){
      alert('No ha seleccionado un delegado.')
    }
    else{ 
      try {
        //const idDelegado = selectedDelegado;
        console.log('Delegado seleccionado:', selectedDelegado);
        console.log('Horario (id):', idHorario);
        const response = await axios.post(`http://localhost:8080/institucion/horario/asignarDelegado/${idHorario}`,
          null, {params: {idDelegado: selectedDelegado}});

        console.log('Delegado asignado:', response.data);
        alert(`Se guardó la selección de delegado.`);
        //!al dar clik en aceptar, redirigir a la página de horarios
        //!redirigir a la página de horarios
        router.push('/docente/asignarDelegado');
      } catch (error) {
          console.error('Error al asignar delegado.', error);
      }
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
          Designar delegado
        </Typography>

        <Box sx={{ mb: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <BarraBusqueda onSearch={handleSearch}/>
        </Box>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#363581", color: "#FFFFFF" }}>
                <TableCell align="center" sx={{ color: "#FFFFFF" }}>Código</TableCell>
                <TableCell align="center" sx={{ color: "#FFFFFF" }}>Alumno</TableCell>
                <TableCell align="center" sx={{ color: "#FFFFFF" }}>Correo Electrónico</TableCell>
                <TableCell align="center" sx={{ color: "#FFFFFF" }}>Elegir</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredAlumnos.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((alumno) => (
                <TableRow key={alumno.id}>
                  <TableCell align="center">{alumno.codigo}</TableCell>
                  <TableCell align="center">{`${alumno.nombre} ${alumno.apellidoPaterno} ${alumno.apellidoMaterno}`}</TableCell>
                  <TableCell align="center">{alumno.email}</TableCell>  
                  <TableCell align='center'>
                    <input
                      type="radio"
                      name="selectedDelegado"
                      value={alumno.id}
                      checked={selectedDelegado === alumno.id}
                      onChange={() => handleSelect(alumno.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

        </TableContainer>

        <Box sx={{ display: "flex", justifyContent: "flex-end", padding: "20px" }}>
          <Pagination
            count={Math.ceil(filteredAlumnos.length / rowsPerPage)} // Número total de páginas
            page={page} // Página actual
            onChange={handleChangePage} // Manejador de cambio de página
            size="large"
            color="primary"
            //sx={estilosIndice()}
          />
        </Box>
        
        <Box sx={{width: '560px', padding: '40px', display: 'flex', flexDirection: 'row', justifyContent: "space-between" }}>
          
          <Button sx={{ width: '220px', backgroundColor: "#363581", color: "#FFFFFF" }}
            variant="outlined" onClick={() => handleGuardarDelegado()}>
            
              Guardar
          </Button>
          
          <div> </div>

          <Button sx={{ width: '220px', padding: '40 px'}}
            variant="outlined" onClick={() => router.back()}>
              Regresar
          </Button>
        </Box>

      </Box>
    </Box>
  );
};