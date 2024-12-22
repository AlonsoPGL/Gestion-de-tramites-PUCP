//src/app/administrador/gestionFacultad/listadoFacultades/page.js
"use client";
import React, {
  useRef, useEffect, useState
} from 'react';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Box, Typography, Button, TextField, InputAdornment, Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SearchIcon from '@mui/icons-material/Search';
import TablaFacultades from '../../../../../componentesAdministrador/gestionFacultad/TablaFacultades';
import DownloadIcon from '@mui/icons-material/Download';
import BarraBusqueda from '../../../../../componentesAdministrador/BarraBusqueda';
import Link from 'next/link';
import { usePersona } from '@/app/PersonaContext';
import Papa from 'papaparse';
import axios from 'axios';
import ModalSuperior from 'componentesGenerales/modales/ModalSuperior';

const ModalErrores = ({ open, handleClose, errores }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const texto = errores.join('\n');
    navigator.clipboard.writeText(texto);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Errores encontrados en el CSV
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            onClick={copyToClipboard}
            startIcon={<ContentCopyIcon />}
          >
            {copied ? 'Copiado!' : 'Copiar todos los errores'}
          </Button>
        </Box>
        <List>
          {errores.map((error, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <ErrorOutlineIcon color="error" />
              </ListItemIcon>
              <ListItemText primary={error} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
// Agregar esta función junto a las otras funciones del componente
const descargarPlantilla = () => {
  // Datos de ejemplo para la plantilla
  const templateData = [
    {
      codigo: "FACI",
      nombre: "Facultad de Ciencias e Ingeniería",
      telefonoContacto: "999888777",
      correoContacto: "faci@universidad.edu.pe",
      direccionWeb: "www.faci.universidad.edu.pe",
      secretario_academico_nombre: "Juan Pérez Martínez",
      secretario_academico_codigo: "12345678"
    },
    {
      codigo: "LETRAS",
      nombre: "Facultad de Letras y Humanidades",
      telefonoContacto: "999777666",
      correoContacto: "letras@universidad.edu.pe",
      direccionWeb: "www.letras.universidad.edu.pe",
      secretario_academico_nombre: "María García López",
      secretario_academico_codigo: "87654321"
    },
    {
      codigo: "",
      nombre: "Formato: texto (máx 10 caracteres)",
      telefonoContacto: "9 dígitos numéricos",
      correoContacto: "correo válido",
      direccionWeb: "URL válida",
      secretario_academico_nombre: "texto (nombres y apellidos)",
      secretario_academico_codigo: "8 dígitos numéricos"
    }
  ];

  // Definir headers con nombres más amigables
  const headers = [
    "codigo",
    "nombre",
    "telefonoContacto",
    "correoContacto", 
    "direccionWeb",
    "secretario_academico_nombre",
    "secretario_academico_codigo"
  ];

  // Convertir a CSV usando punto y coma como separador para mejor compatibilidad con Excel
  const csvContent = [
    headers.join(";"),
    ...templateData.map(row =>
      headers.map(header => row[header]).join(";")
    )
  ].join("\n");

  // Agregar BOM para correcta visualización de caracteres especiales en Excel
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], { 
    type: "text/csv;charset=utf-8;" 
  });

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", "PlantillaFacultades.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
export default function GestionFacultad() {
  const { facultad, setFacultad } = usePersona();
  const fileInputRef = useRef(null);
  const [confirmacionOpen, setConfirmacionOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // Nuevo estado para el archivo
  const [facultades, setFacultades] = useState([]);
  const [filteredFacultades, setFilteredFacultades] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalFacultades, setTotalFacultades] = useState(0);
  const [error, setError] = useState(''); // Estado para manejar errores
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Nuevo estado para controlar la carga
  // Agregar estos estados junto a los otros useState al inicio del componente
  const [erroresServidor, setErroresServidor] = useState([]);
  const [modalErroresOpen, setModalErroresOpen] = useState(false);
  useEffect(() => {
    cargarFacultades();
  }, [page, rowsPerPage]);

  const cargarFacultades = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/institucion/facultad/listar`);
      const data = response.data || []; // Si response.data es null, usa array vacío
      setFacultades(data);
      setFilteredFacultades(data);
    } catch (error) {
      console.error('Error al cargar facultades:', error);
      setError('Error al cargar las facultades');
      setFacultades([]); // En caso de error, establecer como array vacío
      setFilteredFacultades([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuscarFacultad = async (busqueda) => {
    if (busqueda.trim() !== "") {
      const resultadosFiltrados = facultades.filter((facultad) =>
        facultad.codigo?.toLowerCase().includes(busqueda.toLowerCase()) ||
        facultad.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        facultad.correoContacto?.toLowerCase().includes(busqueda.toLowerCase())
      );
      setFilteredFacultades(resultadosFiltrados);
    } else {
      await cargarFacultades();
      setFilteredFacultades(facultades);
    }
  };

  const handleSearch = (event) => {
    const busqueda = event.target.value.toLowerCase(); // Convertir la búsqueda a minúsculas
    setSearchTerm(busqueda);

    // Filtrar las preguntas frecuentes
    const resultadosFiltrados = facultades.filter((facultad) =>
      facultad.nombre?.toLowerCase().includes(busqueda) ||
      facultad.codigo?.toLowerCase().includes(busqueda) ||
      facultad.correoContacto?.toLowerCase().includes(busqueda) ||
      facultad.telefonoContacto?.includes(busqueda)
    );
    setFilteredFacultades(resultadosFiltrados);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const limpiarFacultad = () => {
    setFacultad({
      codigo: '',
      nombre: '',
      telefonoContacto: '',
      correoContacto: '',
      direccionWeb: '',
      jefe: null,
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setError('Por favor, sube un archivo CSV válido');
      return;
    }

    setSelectedFile(file);
    setConfirmacionOpen(true);
  };

  const confirmarSubidaCSV = async () => {
    if (!selectedFile) {
      setError('No se ha seleccionado ningún archivo');
      setConfirmacionOpen(false);
      return;
    }

    Papa.parse(selectedFile, {
      header: true,
      complete: async (results) => {
        const nuevosFacultades = results.data
          .filter(row => row.codigo && row.nombre)
          .map(row => ({
            codigo: row.codigo,
            nombre: row.nombre,
            telefonoContacto: row.telefonoContacto || '',
            correoContacto: row.correoContacto || '',
            direccionWeb: row.direccionWeb || '',
            secretarioAcademico: row.secretario_academico_nombre ? {
              nombre: row.secretario_academico_nombre,
              codigo: row.secretario_academico_codigo,
            } : null,
          }));

        if (nuevosFacultades.length > 0) {
          try {
            const response = await axios.post('http://localhost:8080/institucion/facultad/insertarCSV', nuevosFacultades, {
              headers: {
                'Content-Type': 'application/json',
              },
            });

            // Verificar si hay errores en la respuesta
            if (response.data.errores && response.data.errores.length > 0) {
              setErroresServidor(response.data.errores);
              setModalErroresOpen(true);
            } else {
              setError('');
              await cargarFacultades();
            }

          } catch (error) {
            console.error('Error al realizar la solicitud:', error.message);
            setError('Error al subir las facultades');
          }
        } else {
          setError('No se encontraron facultades válidas en el archivo');
        }
        setConfirmacionOpen(false);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      },
      error: (error) => {
        console.error('Error al analizar el archivo:', error);
        setError('Error al leer el archivo CSV');
        setConfirmacionOpen(false);
      }
    });
  };

  const eliminarFacultad = async (codigo, id) => {
    try {
      await axios.delete(`http://localhost:8080/institucion/facultad/eliminar/${id}`);
      const nuevoTotal = totalFacultades - 1;
      setTotalFacultades(nuevoTotal);

      const totalPages = Math.ceil(nuevoTotal / rowsPerPage);
      if (page >= totalPages && totalPages > 0) {
        setPage(totalPages - 1);
      }

      await cargarFacultades();
    } catch (error) {
      console.error("Error al eliminar la facultad:", error);
      setError('Error al eliminar la facultad');
    }
  };

  return (
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
        <Typography variant="h4" sx={{ mb: '20px', color: '#191D23' }}>
          Gestión de Facultades
        </Typography>

        {error && (
          <Box sx={{ mb: 2, p: 2, bgcolor: '#ffebee', color: '#c62828', borderRadius: 1 }}>
            {error}
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
          <Box sx={{ flexGrow: 1, mr: 2 }}>
            <TextField
              placeholder="Buscar..."
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={handleSearch}
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

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            accept=".csv"
          />

          <Button
            variant="contained"
            color="primary"
            sx={{ ml: 2, display: 'flex', alignItems: 'center', height: '40px', backgroundColor: '#363581' }}
            onClick={handleUploadClick}
          >
            Subir
            <CloudUploadIcon sx={{ ml: 1, color: 'white', width: '20px', height: '20px' }} />
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={descargarPlantilla}
            sx={{
              ml: 2,
              display: 'flex',
              alignItems: 'center',
              height: '40px',
              backgroundColor: '#363581',
              '&:hover': {
                backgroundColor: '#2a2a6d' // Un tono más oscuro para el hover
              }
            }}
          >
            Plantilla
            <DownloadIcon
              sx={{
                ml: 1,
                color: 'white',
                borderRadius: '50%',
                backgroundColor: '#363581',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            />
          </Button>
          <Button
            component={Link}
            href="./nuevoFacultad"
            variant="contained"
            color="primary"
            onClick={limpiarFacultad}
            sx={{ ml: 2, display: 'flex', alignItems: 'center', height: '40px', backgroundColor: '#363581' }}
          >
            Añadir
            <AddCircleOutlineIcon sx={{ ml: 1, color: 'white', width: '20px', height: '20px' }} />
          </Button>

        </Box>

        {isLoading ? (
          // Puedes mostrar un loader aquí si lo deseas
          <Box className="w-full p-8 text-center">
            <Typography>Cargando...</Typography>
          </Box>
        ) : (
          <TablaFacultades
            facultades={filteredFacultades}
            eliminarFacultad={eliminarFacultad}
          />
        )}



        <ModalErrores
          open={modalErroresOpen}
          handleClose={() => setModalErroresOpen(false)}
          errores={erroresServidor}
        />

        <ModalSuperior
          open={confirmacionOpen}
          handleClose={() => {
            setConfirmacionOpen(false);
            setSelectedFile(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }}
          title="¿Está seguro de insertar el CSV de facultades?"
          onConfirm={confirmarSubidaCSV}
        />
      </Box>




    </Box>
  );
}