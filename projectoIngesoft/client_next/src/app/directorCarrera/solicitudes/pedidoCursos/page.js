"use client";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Box, Typography, Button, MenuItem } from '@mui/material';
import { useRouter } from 'next/navigation';
import InputField from '../../../../../componentesGenerales/inputs/InputField'; // Importa el componente
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EstaSeguroAccion from '../../../../../componentesGenerales/modales/EstaSeguroAccion';
import dayjs from 'dayjs';
import { usePedidoCurso } from '../../../PedidoCursoContext';
import { useConvocatoria } from '../../../convocatoriaContext';
import { useUnidad } from '../../../UnidadContex'; 
import ModalAnhadir from 'componentesSecretarioAcadémico/solicitudCursos/ModalAnhadir';
import Cardcursos from 'componentesSecretarioAcadémico/solicitudCursos/cardCursos';

function NuevoPedidoCurso() {
  const [isEditing, setIsEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenAddEdit, setModalOpenAddEdit] = useState(false);
  const [errores, setErrores] = useState({}); // Para rastrear campos incompletos
  const router = useRouter();
  const [erroresMensaje, setErroresMensaje] = useState({});
  const { convocatoria } = useConvocatoria('');
  const { pedidoCurso } = usePedidoCurso('');
  const [semestreSeleccionado, setSemestreSeleccionado] = useState({ idSemestre: '', nombre: '' });
  const [semestres, setSemestres] = useState([]);
  const [planDeEstudioxCurso , setPlanDeEstudioxCurso] = useState([]);
  const [horarios, setHorarios] = useState('');
  const { unidad } = useUnidad();
  const [facultades, setFacultades] = useState([]);
  const [motivo, setMotivo] = useState(""); // Estado para el motivo


  const mensajesError = {
    semestre: "Debe seleccionar un semestre.",
    facultad: "Debe seleccionar una facultad.",
    cursos: "Debe seleccionar almenos un curso",
  };

  /*
  const validarPuesto = (puesto) => /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]{1,300}$/.test(puesto);
  const validarArchivo = (archivo) => archivo && archivo.length > 0; // Validar si se ha subido un archivo
  const validarFrecuencia = (frecuencia) => frecuencia !== "";
  const validarModalidad = (modalidad) => modalidad !== "";
  const validarFechas = (fechaInicio, fechaFin) => {
    return fechaInicio && fechaFin && new Date(fechaInicio) < new Date(fechaFin);
  };
  const validarCriterios = (criteriosSeleccion) => criteriosSeleccion && criteriosSeleccion.length > 0;
  */

  useEffect(() => {

    const loadStoredPedidoCurso = async () => {

      // Primero intenta obtener la convocatoria desde el contexto
      if (pedidoCurso) {
        setSemestreSeleccionado(pedidoCurso.semestre);
        setMotivo(pedidoCurso.motivo);

        setIsEditing(true);
        // Guarda en localStorage para la próxima vez
        localStorage.setItem('selectedPedidoCurso', JSON.stringify(pedidoCurso));
        localStorage.setItem('editarPedidoCurso', JSON.stringify(true));

      } else {
        console.log("AAAAAA");
        // Si no hay convocatoria en el contexto, intenta obtenerla de localStorage
        const storedPedidoCurso = JSON.parse(localStorage.getItem('selectedPedidoCurso'));
        const storedIsEditing = JSON.parse(localStorage.getItem('editarPedidoCurso'));

        if (storedPedidoCurso && storedIsEditing) {
          //setValues(storedConvocatoria);
          setIsEditing(true);
        } else {
          setIsEditing(false);
          // Si no hay datos en localStorage, inicializa el estado como vacío o predeterminado
          console.log("No hay convocatoria almacenada en localStorage.");
        }
      }


    };
    obtenerSemestres();
    loadStoredPedidoCurso();

  }, [pedidoCurso]); // Solo ejecutar cuando 'convocatoria' cambie

  useEffect(() => {
    const obtenerCursosDeUnidad = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/institucion/planDeEstudioXCurso/obtenerPorIdUnidad/${unidad.idUnidad}`);
        if (response.data) {
          // Si obtienes los cursos, actualiza el estado
          setPlanDeEstudioxCurso(response.data);
        }
      } catch (error) {
        console.error('Error al obtener los cursos de la unidad:', error);
      }
    };
  
    if (unidad?.idUnidad) {
      obtenerCursosDeUnidad();
    }
  }, [unidad]); // Dependencia en unidad, para que se ejecute cada vez que la unidad cambie

  
  const obtenerSemestres = async () => {
    try {
      const response = await axios.get('http://localhost:8080/institucion/semestre/listar');
      setSemestres(response.data);
    } catch (error) {
      console.error('Error al obtener roles disponibles:', error);
    }
  };


  const handleInputChange = (setter, validator, field) => async (e) => {
    const value = e.target.value;
    // Si el campo es "Semestre" o "Facultad", busca el objeto completo
    if (field === "semestre" || field === "Especialidad") {
      const selectedItem = field === "semestre"
        ? semestres.find(semestre => semestre.nombre === value)
        : facultades.find(facultad => facultad.nombre === value);

      setter(selectedItem);  // Actualiza el estado con el objeto completo
    } else {
      setter(value);  // Para campos simples, solo actualiza con el valor
    }

    // Validación en tiempo real
    const nuevosErrores = { ...errores };
    const nuevosErroresMensaje = { ...erroresMensaje };
    if (!validator(value)) {
      nuevosErrores[field] = true;
      nuevosErroresMensaje[field] = mensajesError[field];
    } else {
      delete nuevosErrores[field];
      delete nuevosErroresMensaje[field];
    }
    setErrores(nuevosErrores);
    setErroresMensaje(nuevosErroresMensaje);
  };


  const validarFormulario = async () => {
    const nuevosErrores = {};
    const nuevosErroresMensaje = {};

    
    setErrores(nuevosErrores);
    setErroresMensaje(nuevosErroresMensaje);

    // Si no hay errores, retorna true
    return Object.keys(nuevosErrores).length === 0;
  };

  // Función para manejar la edición de un criterio
  const handleEditCriterio = (index) => {
    setEditingCriterioIndex(index);
    setModalOpenAddEdit(true);
  };

  const handleSaveCurso = (curso) => {
    console.log("CURSO", curso);
    // Crear el objeto SolicitudPedidoCurso con el curso y la cantidad de horarios
    const nuevoSolicitudPedidoCurso = {
      curso: curso,        // El objeto del curso
      cantHorarios: 0 // La cantidad de horarios
    };

    // Añadir el nuevo objeto SolicitudPedidoCurso al estado
    setValues(prevValues => ({
      ...prevValues,
      cursos: Array.isArray(prevValues.cursos) ? [...prevValues.cursos, nuevoSolicitudPedidoCurso] : [nuevoSolicitudPedidoCurso],
    }));


    setModalOpenAddEdit(false); // Cerrar el modal
  };



  const handleClickInsertarconvocatoria = async (e) => {
    // Datos a enviar
    const data = {
      ...(isEditing && { id: pedidoCurso?.id }),
      semestreNombre: semestreSeleccionado.nombre,
      especialidadId: unidad.idUnidad,
      motivo: motivo,
      solicitudPedidoCursos: planDeEstudioxCurso.map(plan => ({
        cursoId: plan.curso.idCurso,
        cantHorarios: plan.cantHorarios
      }))

    };
    console.log("AQUII", data);
    console.log("ISEDI", isEditing);
    try {
      const endpoint = isEditing ? `http://localhost:8080/SolicitudPedidosCursos/actualizar` : `http://localhost:8080/SolicitudPedidosCursos/insertar`;
      const method = isEditing ? 'put' : 'post';
      const response = await axios[method](endpoint, data);
      if (response != null) {
        router.push('/directorCarrera/solicitudes/listadoPedidoCursos');
      }

    } catch (error) {
      console.error('Error al enviar la convocatoia:', error);
    }
  };

  const handleEditCurso = (index, field, value) => {
    // Hacemos una copia de los cursos actuales
    const cursosActualizados = [...planDeEstudioxCurso];
  
    // Actualizamos la cantidad de horarios (cantHorarios) del curso
    if (field === 'cantHorarios') {
      cursosActualizados[index].cantHorarios = value; // Modificamos el campo específico
    }
  
    // Actualizamos el estado de `planDeEstudioxCurso` con los datos modificados
    setPlanDeEstudioxCurso(cursosActualizados);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    const formularioValido = await validarFormulario();

    if (formularioValido) {
      setModalOpen(true); // Si todo es válido, abrir el modal
    }
  };



  return (
    <Box sx={{ backgroundColor: 'white', minHeight: '100vh', paddingBottom: '10px' }}>

      <Box sx={{ ml: 29, padding: '10px' }}>
        <Typography variant="h4" sx={{ mb: '5px', color: '#191D23' }}>
          {isEditing ? "Editar solicitud de cursos" : "Nueva solicitud de  cursos"}
        </Typography>
      </Box>
      <Box
        sx={{
          marginLeft: '220px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >


        <Box
          sx={{

            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #D9D9D9',
            borderRadius: 2,
            boxShadow: 2,
            width: '100%',
          }}
        >

          <Box sx={{ padding: 4 }}>
            <Typography variant="h5" sx={{ mb: '20px', color: '#191D23', fontWeight: 'bold' }}>
              Detalle de solicitud
            </Typography>



            <InputField
              label="Semestre"
              value={semestreSeleccionado.nombre}
              onChange={handleInputChange(setSemestreSeleccionado, () => true, "semestre")} // Ajusta según la validación
              select
              required
              error={!!errores.semestre}
              helperText={erroresMensaje.semestre}
              height="30px"
              width="50%"
              mrLabel='132px'
            >
              {semestres.map((semestre, index) => (
                <MenuItem key={semestre.idSemestre || index} value={semestre.nombre}>
                  {semestre.nombre}
                </MenuItem>
              ))}
            </InputField>

          

            <InputField
              label="Motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)} // Actualiza el estado con el valor ingresado
              required
              error={!!errores.motivo} // Resalta en rojo si hay error
              helperText={erroresMensaje.motivo} // Mensaje de error
              height="30px"
              width="50%"
              mrLabel='132px'
              multiline // Para permitir varias líneas si es necesario
              rows={2} // Número de líneas visibles inicialmente
              sx={{
                '& .MuiInputBase-input': {
                  color: 'black', // Cambia el color del texto
                },
                '& .MuiInputLabel-root': {
                  color: 'black', // Cambia el color de la etiqueta
                },
              }}
            />


          </Box>
          <Box sx={{ borderBottom: '1px solid #A9A9A9', width: '100%', mb: 2 }} />

          <Box sx={{ padding: 4 }}>


            <Typography variant="h5" sx={{ color: '#191D23', fontWeight: 'bold', mb: 4 }}>
              Detalle de cursos de plan de estudio
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>


      
            </Box>


            <Cardcursos
              cursos={planDeEstudioxCurso|| []}
              onEdit={handleEditCurso}
            />
            {errores.cursos && (
              <Typography marginBottom="18px" color="error" variant="body2">{mensajesError.cursos}</Typography>  // Mensaje de error
            )}
          </Box>
        </Box>


        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button variant='outlined' onClick={() => router.back()} sx={{ width: '170px', marginRight: '20px' }}>
            Cancelar
          </Button>
          <Button variant='contained' onClick={handleGuardar} sx={{ width: '170px' }}>
            Guardar
          </Button>
        </Box>
      </Box>



      <EstaSeguroAccion
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        texto={`¿Está seguro de ${isEditing ? "editar" : "guardar"} la solicitud?`}
        handleAceptar={async () => {
          await handleClickInsertarconvocatoria();
          setModalOpen(false);
        }}
      />

    

    </Box>
  );
}

export default NuevoPedidoCurso;