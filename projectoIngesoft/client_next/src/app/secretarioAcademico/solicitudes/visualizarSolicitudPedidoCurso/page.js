"use client";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Box, Typography, Button, MenuItem } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import InputField from '../../../../../componentesGenerales/inputs/InputField'; // Importa el componente
import { usePedidoCurso } from '../../../PedidoCursoContext';
import Cardcursos from 'componentesSecretarioAcadémico/solicitudCursos/cardCursos';

function NuevaConvocatoria() {

  const [errores, setErrores] = useState({}); // Para rastrear campos incompletos
  const router = useRouter();
  const { pedidoCurso } = usePedidoCurso('');
  const [planDeEstudioxCurso, setPlanDeEstudioxCurso] = useState([]);
  const [storedPedidoCurso, setStoredPedidoCurso] = useState('');
  const searchParams = useSearchParams();
  const idEspecialidad = searchParams.get('idEspecialidad');

  useEffect(() => {

    const loadStoredSolicitud= async () => {

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
        const response = await axios.get(`http://localhost:8080/institucion/planDeEstudioXCurso/obtenerPorIdUnidad/${idEspecialidad}`);
        if (response.data) {
          // Si obtienes los cursos, actualiza el estado
          setPlanDeEstudioxCurso(response.data);
        }
      } catch (error) {
        console.error('Error al obtener los cursos de la unidad:', error);
      }
    };

    if (idEspecialidad) {
      obtenerCursosDeUnidad();
    }
  }, [idEspecialidad]); // Dependencia en unidad, para que se ejecute cada vez que la unidad cambie








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
              cursos={planDeEstudioxCurso || []}
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