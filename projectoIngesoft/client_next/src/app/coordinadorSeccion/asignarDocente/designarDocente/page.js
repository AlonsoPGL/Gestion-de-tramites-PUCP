"use client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Pagination from "@mui/material/Pagination";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import axios from "axios";
import ModalSuperior from "componentesGenerales/modales/ModalSuperior";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import BarraBusqueda from "../../../../../componentesAdministrador/BarraBusqueda";
import RegistradoConExito from "../../../../../componentesGenerales/modales/RegistroConExito";

const TablaAsignarDocente = () => {
  const rowsPerPage = 7;
  const router = useRouter();
  const [docentes, setDocente] = useState([]);
  const [seleccionados, setseleccionados] = useState([]);
  const [page, setPage] = useState(1); // Página actual (empezamos desde 1)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [docentesAnt, setDocenteAnt] = useState([]);
  const [openModal, setOpenModal] = useState(false);  // Estado para controlar el modal
  const [searchTerm, setSearchTerm] = useState(''); // Estado para almacenar el valor de búsqueda



  // Función para abrir el modal
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleOpenModalW = () => {
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const handleCloseModalW = () => {
    setIsModalOpen(false);
  };
  const handleConfirm = () => {
    console.log('Advertencia confirmada.');
    setIsModalOpen(false); // Cerrar el modal después de confirmar
  };
  // Función para cerrar el modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleSearch = (term) => {
    setSearchTerm(term); // Actualiza el estado con el valor de búsqueda
  };
  
  const searchParams = useSearchParams();
  const idHorario = searchParams.get('idHorario')
  const filteredDocentes = docentes.filter((docente) =>
    docente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSelect = (row) => {
    // Mover la lógica de isSelected aquí
    const nuevosSeleccionado = seleccionados.includes(row.id)
      ? seleccionados.filter((id) => id !== row.id) // Si está seleccionado, lo eliminamos
      : [...seleccionados, row.id]; // Si no está seleccionado, lo agregamos

    setseleccionados(nuevosSeleccionado); // Actualizamos el estado
    console.log("rwerwer");
  };
  const handleChangePage = (event, value) => {
    setPage(value);
  };
  const handleAccept = async () => {

    // Verificamos que haya un idCurso y que haya usuarios seleccionados
    if (seleccionados.length === 0) {
      console.log("hola"+idHorario +"essss"+seleccionados.length);
      handleOpenModalW(); // Abre el modal de advertencia

      console.error("El curso o los usuarios seleccionados no están disponibles.");
      return;
    }
  
     console.log("hola"+idHorario +"essss"+seleccionados.length);
  
    try {
      // Hacemos una solicitud POST enviando el array de IDs de usuarios
      const response = await axios.post(`http://localhost:8080/institucion/horario/asignarDocente/${idHorario}`, seleccionados, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log('los selciondo son',seleccionados);
      // Aquí puedes redirigir o realizar alguna acción después de la asignación
  
    } catch (error) {
      console.error('Error al hacer la solicitud', error);
    }
  
    handleOpenModal();
  };

  const handleBack = () => {
    // Regresar a la página anterior
    router.back(); // Esto hace que vuelva a la página anterior
  }
  // Maneja el cambio de página en el componente de paginación

  useEffect(() => {
    //console.log("entro.data");
    //setDocenteAnt(localStorage.getItem('docentes'));
    const datos=JSON.parse(localStorage.getItem('docentes'));
    //console.log("esssss"+datos[0].id);
    const idsSeleccionados = datos.map(docente => docente.id);
    setseleccionados(idsSeleccionados); 
    
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/rrhh/docente/listar");
        setDocente(response.data);
        //  console.log(response.data);
        console.log("esponse.data");
      } catch (error) {
        setError("Ocurrió un error al cargar los datos");
        console.error(error);
      }
    };
    fetchData();
  }, []);
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
      <Typography variant="h4" sx={{ marginLeft: "20px", color: "black" }}>
        Designar docente
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
            <TableRow sx={{ backgroundColor: "#363581", color: "#FFFFFF" }}>
              <TableCell align="center" sx={{ color: "#FFFFFF" }}>
                Codigo
              </TableCell>
              <TableCell align="center" sx={{ color: "#FFFFFF" }}>
                Profesor
              </TableCell>
              <TableCell align="center" sx={{ color: "#FFFFFF" }}>
                Correo Electronico
              </TableCell>
              <TableCell align="center" sx={{ color: "#FFFFFF" }}>
                elegir
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDocentes.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((row) => (
              <TableRow key={row.id}>
                <TableCell align="center">{row.codigo}</TableCell>
                <TableCell align="center">{row.nombre + row.apellidoPaterno}</TableCell>
                <TableCell align="center">{row.email}</TableCell>

                <TableCell align="center">
                  <Checkbox
                  
                  checked={seleccionados.includes(row.id)} // Comprueba si el profesor ya está seleccionado
                    onChange={() => handleSelect(row)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box sx={{ display: "flex", justifyContent: "flex-end", padding: "20px" }}>
        <Pagination
          count={Math.ceil(docentes.length / rowsPerPage)} // Número total de páginas
          page={page} // Página actual
          onChange={handleChangePage} // Manejador de cambio de página
          size="large"
          color="primary"
          //sx={estilosIndice()}
        />
        </Box>
      </TableContainer>
      
      <Box
  sx={{
    width: '100%', maxWidth: '100%', padding: '40px', 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
  }}
>
  <Button 
    sx={{ 
      width: '220px',  padding: '10px' // Ajusta el espacio interno del botón
    }}
    variant="outlined" 
    onClick={() => router.back()}
  >
    Regresar
  </Button>

  <Button 
    sx={{ 
      width: '220px', backgroundColor: "#363581", color: "#FFFFFF",  padding: '10px'
    }}
    variant="outlined" 
    onClick={() => handleAccept()}
  >
    Guardar
  </Button>
</Box>



      <RegistradoConExito
        open={openModal} 
        onClose={handleCloseModal} 
        texto="¡Registro  exitoso!">

      </RegistradoConExito>
      </Box>
      <ModalSuperior
        open={isModalOpen}              // Controla si el modal está abierto o cerrado
        handleClose={handleCloseModalW}   // Función para cerrar el modal
        title="No hay seleccionados"     // Título del modal
        onConfirm={handleConfirm}        // Función para manejar la confirmación
      />
      </Box>

    </>
  );
};

export default TablaAsignarDocente;
