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
import { useUnidad } from '../../../UnidadContex'; 
import ModalAnhadir from 'componentesSecretarioAcadémico/solicitudCursos/ModalAnhadir';
import Cardcursos from 'componentesSecretarioAcadémico/solicitudCursos/cardCursos';

function NuevaConvocatoria() {
  const [isEditing, setIsEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenAddEdit, setModalOpenAddEdit] = useState(false);
  const [errores, setErrores] = useState({}); // Para rastrear campos incompletos
  const router = useRouter();
  const [erroresMensaje, setErroresMensaje] = useState({});
   const { pedidoCurso } = usePedidoCurso('');
  const [semestreSeleccionado, setSemestreSeleccionado] = useState({ idSemestre: '', nombre: '' });
  const [semestres, setSemestres] = useState([]);
  const [facultadSeleccionada, setFacultadSeleccionada] = useState({ id: '', nombre: '' });
  const [planDeEstudioxCurso , setPlanDeEstudioxCurso] = useState([]);
  const [storedConvocatoria, setStoredConvocatoria] = useState('');
  const [storedPedidoCurso, setStoredPedidoCurso] = useState('');
  const { unidad } = useUnidad();
  const [facultades, setFacultades] = useState([]);
  const [values, setValues] = useState({
    cursos: [],
  })




  useEffect(() => {

    const loadStoredSolicitud= async () => {
      console.log(pedidoCurso);
      // Primero intenta obtener la convocatoria desde el contexto
      if (pedidoCurso) {
        // Guarda en localStorage para la próxima vez
        localStorage.setItem('selectedPedidoCurso', JSON.stringify(pedidoCurso));
      } else {
        // Si no hay convocatoria en el contexto, intenta obtenerla de localStorage
        const stored = JSON.parse(localStorage.getItem('selectedPedidoCurso'));
        if (stored) {
          setStoredPedidoCurso(stored);
        } 
      }


    };

    loadStoredSolicitud();

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








  return (
    <Box sx={{ backgroundColor: 'white', minHeight: '100vh', paddingBottom: '10px' }}>

      <Box sx={{ ml: 29, padding: '10px' }}>
        <Typography variant="h4" sx={{ mb: '5px', color: '#191D23' }}>
          Visualizar detalle de solicitud
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
              value={pedidoCurso?.semestre.nombre || storedPedidoCurso?.semestre?.nombre || ''}
              disabled={true}
              height="30px"
              width="50%"
              mrLabel='132px'
            >
            </InputField>


            <InputField
              label="Motivo"
              value={pedidoCurso?.motivo || storedPedidoCurso?.motivo || ''}
              disabled={true}
              height="30px"
              width="50%"
              mrLabel='132px'
              multiline // Para permitir varias líneas si es necesario
              rows={2} // Número de líneas visibles inicialmente
            />


          </Box>
          <Box sx={{ borderBottom: '1px solid #A9A9A9', width: '100%', mb: 2 }} />

          <Box sx={{ padding: 4 }}>


            <Typography variant="h5" sx={{ color: '#191D23', fontWeight: 'bold', mb: 4 }}>
            Detalle de cursos de plan de estudio
            </Typography>



            <Cardcursos
              cursos={planDeEstudioxCurso|| []}
              disabled={true}
            />
            {errores.cursos && (
              <Typography marginBottom="18px" color="error" variant="body2">{mensajesError.cursos}</Typography>  // Mensaje de error
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', mt: 4 }}>
          <Button variant='outlined' onClick={() => router.back()} sx={{ width: '170px', marginRight: '20px' }}>
            Regresar
          </Button>

        </Box>
      </Box>

    </Box>
  );
}

export default NuevaConvocatoria;