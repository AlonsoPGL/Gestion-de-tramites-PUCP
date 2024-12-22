"use client";
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button, TextField, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';
import InputField from '../../componentesGenerales/inputs/InputField';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700, // Ancho del modal
  minHeight: '450px', // Asegura una altura mínima
  bgcolor: 'background.paper',
  boxShadow: 13,
  border: 'solid black 2px',
  p: 2,
};

const ModalAnhadirEditar = ({ open, onClose, handleAñadir, titulo, nombreInicial = '', descripcionInicial = '', tipoUnidadInicial = '' /*, unidadInicial =''*/ }) => {
  const [nombre, setNombre] = useState(nombreInicial);
  const [descripcion, setDescripcion] = useState(descripcionInicial);
  const [errores, setErrores] = useState({ nombre: '', descripcion: '', tipoUnidad: '', unidad: '' });
  const [tiposUnidades, setTiposUnidades] = useState([]);
  const [tipoUnidad, setTipoUnidad] = useState('');
  //const [unidades, setUnidades] = useState([]);
  //const [unidad, setUnidad] = useState({ id: '', nombre: '' });

  useEffect(() => {
    setNombre(nombreInicial);
    setDescripcion(descripcionInicial);
    //setUnidad(unidadInicial);
    setTipoUnidad(tipoUnidadInicial);
  }, [nombreInicial, descripcionInicial, /*unidadInicial ,*/ tipoUnidadInicial]);


  useEffect(() => {
    const fetchTiposUnidad = async () => {
      try {
        const response = await axios.get("http://localhost:8080/gestionUnidades/tipoUnidad/listarTipoUnidades");
        setTiposUnidades(response.data);
      } catch (error) {
        console.error("Error al cargar los tipos de unidad:", error);
      }
    };

    fetchTiposUnidad();
  }, []);

  /*
  useEffect(() => {
    const fetchUnidad = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/gestionUnidad/unidad/listarUnidadSeleccionada?tipo=${tipoUnidad}`);
        setUnidades(response.data);
      } catch (error) {
        console.error("Error al cargar las unidades:", error);
      }
    };

    if(tipoUnidad) fetchUnidad();
  }, [tipoUnidad]);
  */
  const validarNombre = (nombre) => {
    if (!nombre) return "El nombre no puede estar vacío.";
    if (nombre.length > 40) return "El nombre no puede tener más de 40 caracteres.";
    if (!/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) return "El nombre solo puede contener letras y espacios.";
    return '';
  };

  const validarDescripcion = (descripcion) => {
    if (!descripcion) return "La descripción no puede estar vacía.";
    if (descripcion.length > 255) return "La descripción no puede tener más de 255 caracteres.";
    return '';
  };

  const validarTipoUnidad = (tipoUnidad) => {
    if (!tipoUnidad) return "Debe ingresar un tipo de unidad.";
    return '';
  };

  /*
  const validarUnidad = (unidad) => {
    if (!unidad) return "Debe seleccionar una unidad válida.";
    return '';
  };
  */

  const handleNombreChange = (e) => {
    const newNombre = e.target.value;
    setNombre(newNombre);
    setErrores(prev => ({ ...prev, nombre: validarNombre(newNombre) }));
  };
  
  const handleTipoUnidad = (e) => {
    const newTipoUnidad = e.target.value;
    //setUnidades([]);
    setTipoUnidad(newTipoUnidad);
    setErrores(prev => ({ ...prev, tipoUnidad: validarTipoUnidad(newTipoUnidad) }));
  };

  const handleDescripcionChange = (e) => {
    const newDescripcion = e.target.value;
    setDescripcion(newDescripcion);
    setErrores(prev => ({ ...prev, descripcion: validarDescripcion(newDescripcion) }));
  };

  /*
  const handleUnidadChange = (e) => {
    const unidadSeleccionada = unidades.find((u) => u.nombre === e.target.value);
    console.log("selecciono",unidadSeleccionada);
    console.log("unidades",unidades);
    setUnidad(unidadSeleccionada || null);
    console.log("unidades",unidad);
    setErrores((prev) => ({ ...prev, unidad: validarUnidad(unidadSeleccionada || { id: '', nombre: '' }) }));
  };
  */
  
  const handleSubmit = () => {
    const nombreError = validarNombre(nombre);
    const descripcionError = validarDescripcion(descripcion);
    const tipoUnidadError = validarTipoUnidad(tipoUnidad);
    //const unidadError = validarUnidad(unidad);

    if (nombreError || descripcionError || tipoUnidadError /*|| unidadError*/) {
      setErrores({ nombre: nombreError, descripcion: descripcionError, tipoUnidad: tipoUnidadError /*, unidad: unidadError*/ });
      return;
    }
    console.log("TIPO", tipoUnidad);
    handleAñadir(nombre, descripcion, tipoUnidad/* unidad */);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography align="left" variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          {titulo}
        </Typography>

        <Box sx={{ backgroundColor: '#363581', color: 'white', p: 1, mb: 2, mx: -2 }}>
          <Typography align="left" variant="body1" sx={{ ml: 1 }}>
            Información
          </Typography>
        </Box>

        {/* Input de Nombre */}
        <InputField
          label="Nombre"
          value={nombre}
          onChange={handleNombreChange}
          width="100%"
          height="30px" // Altura consistente
          required
          helperText={errores.nombre} // Mensaje de error
          error={!!errores.nombre} // Indica si hay error
        />

        {/* Input de Tipo de unidad */}
        <InputField
          label="Tipo de Unidad"
          value={tipoUnidad || ''}
          onChange={handleTipoUnidad} // Ajusta según la validación
          select
          required
          helperText={errores.tipoUnidad}
          error={!!errores.tipoUnidad}
          height="30px"
        >
          {tiposUnidades.map((tipoUnidad) => (
            <MenuItem key={tipoUnidad} value={tipoUnidad}>
              {tipoUnidad}
            </MenuItem>
          ))}
        </InputField>
        {/*
        {tipoUnidad && (

          <InputField
            label={`${tipoUnidad}`}
            value={unidad.nombre || ''}
            onChange={handleUnidadChange} // Ajusta según la validación
            select
            required
            helperText={errores.unidad}
            error={!!errores.unidad}
            height="30px"
          >
            {unidades.map((unidad) => (
              <MenuItem key={unidad.id} value={unidad.nombre}>
                {unidad.nombre}
              </MenuItem>
            ))}
          </InputField>

        )}

      */}
        {/* Input de Descripción */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2, mt: 3 }}>
          <Typography sx={{ flex: '0 1 30%', textAlign: 'left', mt: '4px' }}>Descripción</Typography>
          <TextField
            value={descripcion}
            onChange={handleDescripcionChange}
            multiline
            rows={4}
            sx={{
              flex: '1',
              '& .MuiOutlinedInput-root': {
                width: '100%',
                height: '100%',
                borderRadius: 2,
              },
            }}
            helperText={errores.descripcion} // Mensaje de error
            error={!!errores.descripcion} // Indica si hay error
          />
        </Box>

        {/* Botones */}
        <Box sx={{ mt: '50px', ml: '10px', mr: '10px', display: 'flex', justifyContent: "center" }}>
          <Button variant='outlined' onClick={onClose} sx={{ width: '90px' }}>Cancelar</Button>
          <Button variant='contained' onClick={handleSubmit} sx={{ width: '90px', ml: '30px' }}>Añadir</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalAnhadirEditar;
