"use client";
import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
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
import Button from "@mui/material/Button";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import * as XLSX from "xlsx";
import DownloadIcon from '@mui/icons-material/Download';

const TablaListaDelegados = () => {
  const rowsPerPage = 7;
  const router = useRouter();
  const [delegados, setDelegados] = useState([]);
  const [page, setPage] = useState(1); // Página actual (empezamos desde 1)
  const [searchTerm, setSearchTerm] = useState(''); // Estado para almacenar el valor de búsqueda
  useEffect(() => {
    setPage(1); // Reiniciar a la primera página cuando cambie el término de búsqueda
  }, [filteredDelegados]);
  useEffect(() => {
    //console.log("entro.data");
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/institucion/horario/delegados"
        );
        setDelegados(response.data);
        console.log(response.data);
        console.log("esponse.data");
        //exportToExcel();
      } catch (error) {
        setError("Ocurrió un error al cargar los datos");
        console.error(error);
      }
    };
    fetchData();
  }, []);
  const handleSearch = (term) => {
    setSearchTerm(term); // Actualiza el estado con el valor de búsqueda
  };
  const filteredDelegados = delegados.filter((delegado) =>
    delegado?.delegado?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleChangePage = (event, value) => {
    setPage(value);
  };
  const exportToExcel = () => {
    if (delegados.length === 0) {
      console.error("No hay datos para exportar");
      return;
    }

    // Aplanar los datos para incluir información del delegado
    const dataToExport = filteredDelegados.map(delegado => ({
      codigo: delegado?.delegado?.codigo||'',
      delegadoNombre: delegado?.delegado?.nombre||'',
      horario: delegado?.codigo||'',
      semestres: delegado?.semestres||'2024-1',
     delegadoEmail: delegado?.delegado?.email||'',
     cursoNombre: delegado?.cursoNombre||'',
    }));

    // Crear una nueva hoja de cálculo con los datos aplanados
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    // Crear un nuevo libro de trabajo y agregar la hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    // Cambiar el nombre del archivo Excel aquí
    const fileName = "delegados.xlsx"; // Cambia esto por el nombre que desees

    // Generar el archivo Excel y crear un enlace temporal para descargarlo
    XLSX.writeFile(workbook, fileName);
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
      <Typography variant="h4" sx={{ marginLeft: "20px", fontWeight: "", color: "black" }}>
        Lista Delegados
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
        <Button 
      sx={{ backgroundColor: '#363581' }}
      variant="contained" 
      color="primary"
      onClick={exportToExcel} // Llama a la función de exportación al hacer clic
      startIcon={<DownloadIcon />} // Añade el ícono de descarga al botón
    >
        Descargar
      </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#363581", color: "#FFFFFF" }}>
              <TableCell align="center" sx={{ color: "#FFFFFF" }}> Codigo</TableCell>
              <TableCell align="center" sx={{ color: "#FFFFFF" }}> Nombre </TableCell>
              <TableCell align="center" sx={{ color: "#FFFFFF" }}> Horario</TableCell>
              <TableCell align="center" sx={{ color: "#FFFFFF" }}>Semestre</TableCell>
              <TableCell align="center" sx={{ color: "#FFFFFF" }}>Correo Electronico</TableCell>
              <TableCell align="center" sx={{ color: "#FFFFFF" }}>Nombre Curso  </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDelegados.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((row) => (
        <TableRow
          key={row.idCurso}
          
        >
          <TableCell align="center">{row.delegado?.codigo??"falra codigo dele"}</TableCell>
          <TableCell align="center">{row.delegado?.nombre}</TableCell>
          <TableCell align="center">{row.codigo}</TableCell>
          <TableCell align="center">2024-1</TableCell>
         {/*<TableCell align="center">{row?.semestre[0]}</TableCell>*/ } 
          <TableCell align="center">{row.delegado?.email}</TableCell>
          <TableCell align="center">{row.cursoNombre}</TableCell>

      
        </TableRow>
      ))}
          </TableBody>
        </Table>
        <Box sx={{ display: "flex", justifyContent: "flex-end", padding: "20px" }}>

        <Pagination
          count={Math.ceil(filteredDelegados.length / rowsPerPage)} // Número total de páginas
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

export default TablaListaDelegados;
