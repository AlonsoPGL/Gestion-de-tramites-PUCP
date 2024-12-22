"use client";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Box, Typography, Button, MenuItem } from '@mui/material';
import { useRouter, useSearchParams  } from 'next/navigation';
import InputField from '../../../../../componentesGenerales/inputs/InputField'; // Importa el componente
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EstaSeguroAccion from '../../../../../componentesGenerales/modales/EstaSeguroAccion';
import dayjs from 'dayjs';
import { usePedidoCurso } from '../../../PedidoCursoContext';
import { useConvocatoria } from '../../../convocatoriaContext';
import ModalAnhadir from 'componentesSecretarioAcadémico/solicitudCursos/ModalAnhadir';
import Cardcursos from 'componentesSecretarioAcadémico/solicitudCursos/cardCursos';

function NuevoPedidoCurso() {
  const [isEditing, setIsEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [errores, setErrores] = useState({}); // Para rastrear campos incompletos
  const router = useRouter();
  const [erroresMensaje, setErroresMensaje] = useState({});
  const { pedidoCurso } = usePedidoCurso(''); // Obtener datos del pedido de curso
  const [semestreSeleccionado, setSemestreSeleccionado] = useState({ idSemestre: '', nombre: '' });
  const [semestres, setSemestres] = useState([]);
  const [planDeEstudioxCurso , setPlanDeEstudioxCurso] = useState([]);
  const [motivo, setMotivo] = useState(""); // Estado para el motivo
  const searchParams = useSearchParams();
  const idEspecialidad = searchParams.get('idEspecialidad');


  const mensajesError = {
    semestre: "Debe seleccionar un semestre.",
    facultad: "Debe seleccionar una facultad.",
    cursos: "Debe seleccionar almenos un curso",
  };

  useEffect(() => {
    const loadStoredPedidoCurso = async () => {
      if (pedidoCurso) {
        setSemestreSeleccionado(pedidoCurso.semestre);
        setMotivo(pedidoCurso.motivo);
        setIsEditing(true);
        localStorage.setItem('selectedPedidoCurso', JSON.stringify(pedidoCurso));
        localStorage.setItem('editarPedidoCurso', JSON.stringify(true));
      } else {
        const storedPedidoCurso = JSON.parse(localStorage.getItem('selectedPedidoCurso'));
        const storedIsEditing = JSON.parse(localStorage.getItem('editarPedidoCurso'));

        if (storedPedidoCurso && storedIsEditing) {
          setSemestreSeleccionado(storedPedidoCurso.semestre);
          setMotivo(storedPedidoCurso.motivo);
          setIsEditing(true);
        } else {
          setIsEditing(false);
          console.log("No hay convocatoria almacenada en localStorage.");
        }
      }
    };
    obtenerSemestres();
    loadStoredPedidoCurso();
  }, [pedidoCurso]);

  useEffect(() => {
    const obtenerCursosDeUnidad = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/institucion/planDeEstudioXCurso/obtenerPorIdUnidad/${idEspecialidad}`);
        if (response.data) {
          setPlanDeEstudioxCurso(response.data);
        }
      } catch (error) {
        console.error('Error al obtener los cursos de la unidad:', error);
      }
    };
  
    if (idEspecialidad) {
      obtenerCursosDeUnidad();
    }
  }, [idEspecialidad]);

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
    if (field === "semestre" || field === "Especialidad") {
      const selectedItem = field === "semestre"
        ? semestres.find(semestre => semestre.nombre === value)
        : facultades.find(facultad => facultad.nombre === value);

      setter(selectedItem);
    } else {
      setter(value);
    }

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
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleClickEditarconvocatoria = async (e) => {
    const data = {
      id: pedidoCurso?.id, // Sólo actualiza, no inserta
      semestreNombre: semestreSeleccionado.nombre,
      especialidadId: idEspecialidad,
      motivo: motivo,
      solicitudPedidoCursos: planDeEstudioxCurso.map(plan => ({
        cursoId: plan.curso.idCurso,
        cantHorarios: plan.cantHorarios
      }))
    };
    console.log("EDITAR",data);
    try {
      const response = await axios.put(`http://localhost:8080/SolicitudPedidosCursos/actualizar`, data);
      if (response != null) {
        router.push('/secretarioAcademico/solicitudes/ListarSolicitudes');
      }
    } catch (error) {
      console.error('Error al editar la convocatoria:', error);
    }
  };

  const handleEditCurso = (index, field, value) => {
    const cursosActualizados = [...planDeEstudioxCurso];
    if (field === 'cantHorarios') {
      cursosActualizados[index].cantHorarios = value;
    }
    setPlanDeEstudioxCurso(cursosActualizados);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    const formularioValido = await validarFormulario();

    if (formularioValido) {
      setModalOpen(true);
    }
  };

  return (
    <Box sx={{ backgroundColor: 'white', minHeight: '100vh', paddingBottom: '10px' }}>

      <Box sx={{ ml: 29, padding: '10px' }}>
        <Typography variant="h4" sx={{ mb: '5px', color: '#191D23' }}>
          Editar solicitud de cursos
        </Typography>
      </Box>

      <Box sx={{
        marginLeft: '220px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
      }}>

        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #D9D9D9',
          borderRadius: 2,
          boxShadow: 2,
          width: '100%',
        }}>

          <Box sx={{ padding: 4 }}>
            <Typography variant="h5" sx={{ mb: '20px', color: '#191D23', fontWeight: 'bold' }}>
              Detalle de solicitud
            </Typography>

            <InputField
              label="Semestre"
              value={semestreSeleccionado.nombre}
              onChange={handleInputChange(setSemestreSeleccionado, () => true, "semestre")}
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
              onChange={(e) => setMotivo(e.target.value)}
              required
              error={!!errores.motivo}
              helperText={erroresMensaje.motivo}
              height="30px"
              width="50%"
              mrLabel='132px'
              multiline
              rows={2}
              sx={{
                '& .MuiInputBase-input': {
                  color: 'black',
                },
                '& .MuiInputLabel-root': {
                  color: 'black',
                },
              }}
            />
          </Box>

          <Box sx={{ borderBottom: '1px solid #A9A9A9', width: '100%', mb: 2 }} />

          <Box sx={{ padding: 4 }}>
            <Typography variant="h5" sx={{ color: '#191D23', fontWeight: 'bold', mb: 4 }}>
              Detalle de cursos de plan de estudio
            </Typography>

            <Cardcursos
              cursos={planDeEstudioxCurso || []}
              onEdit={handleEditCurso}
            />
            {errores.cursos && (
              <Typography marginBottom="18px" color="error" variant="body2">{mensajesError.cursos}</Typography>
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
        texto={`¿Está seguro de editar la solicitud?`}
        handleAceptar={async () => {
          await handleClickEditarconvocatoria();
          setModalOpen(false);
        }}
      />
    </Box>
  );
}

export default NuevoPedidoCurso;
