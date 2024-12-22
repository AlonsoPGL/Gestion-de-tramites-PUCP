"use client";
import { useState, useEffect } from 'react';
import { Box, Typography, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import InputField from '../../../../../componentesGenerales/inputs/InputField'; // Importa el componente
import CardCriterios from '../../../../../componentesAsistenteSeccion/convocatorias/CardCriterios';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FileUpload from '../../../../../componentesGenerales/inputs/FileUpload'; // Importa el componente
import dayjs from 'dayjs';
import { useConvocatoria } from '../../../convocatoriaContext';

function NuevaConvocatoria() {
  const [isEditing, setIsEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenAddEdit, setModalOpenAddEdit] = useState(false);
  const [editingCriterioIndex, setEditingCriterioIndex] = useState(null); // Para saber si estamos editando un criterio
  const [errores, setErrores] = useState({}); // Para rastrear campos incompletos
  const router = useRouter();
  const [erroresMensaje, setErroresMensaje] = useState({});
  const { convocatoria } = useConvocatoria('');
  const [values, setValues] = useState({
    fechaInicio: null,
    fechaFin: null,
    puesto: "",
    requisitos: [],
    frecuencia: "",
    modalidad: "",
    criteriosSeleccion: [],
    activo: true

  })


  useEffect(() => {
    const loadStoredConvocatoria = async () => {
      // Primero intenta obtener la convocatoria desde el contexto
      if (convocatoria) {
        setValues(convocatoria);
        setIsEditing(true);
        // Guarda en localStorage para la próxima vez
        localStorage.setItem('selectedConvocatoria', JSON.stringify(convocatoria));
        localStorage.setItem('editarConvocatoria', JSON.stringify(true));

      } else {
        // Si no hay convocatoria en el contexto, intenta obtenerla de localStorage
        const storedConvocatoria = JSON.parse(localStorage.getItem('selectedConvocatoria'));
        const storedIsEditing = JSON.parse(localStorage.getItem('editarConvocatoria'));

        if (storedConvocatoria) {
          setValues(storedConvocatoria);
          setIsEditing(storedIsEditing || false);
        } else {
          setIsEditing(false);
          // Si no hay datos en localStorage, inicializa el estado como vacío o predeterminado
          console.log("No hay convocatoria almacenada en localStorage.");
        }
      }
    };

    loadStoredConvocatoria();
  }, [convocatoria]); // Solo ejecutar cuando 'convocatoria' cambie




  return (
    <Box sx={{ backgroundColor: 'white', minHeight: '100vh', paddingBottom: '10px' }}>

      <Box sx={{ ml: 29, padding: '10px' }}>
        <Typography variant="h4" sx={{ mb: '5px', color: '#191D23' }}>
          Detalles de convocatoria
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
              Detalle de convocatoria
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mt: 2, mb: 3 }}>
                <Typography sx={{ mb: 2, mr: '80px' }}>Fechas</Typography>
                <Box sx={{ display: 'flex', gap: 5, mb: 2 }}>
                  <DatePicker
                    label="Fecha Inicio"
                    name="fechaInicio"
                    variant="outlined"
                    value={values.fechaInicio ? dayjs(values.fechaInicio) : null}
                    disabled={true}
                  />

                  <DatePicker
                    label="Fecha Fin"
                    name="fechaFin"
                    size="small"
                    value={values.fechaFin ? dayjs(values.fechaFin) : null}
                    disabled={true}
                  />
       
                </Box>
              </Box>

            </LocalizationProvider>


            <InputField
              label="Puesto"
              name="puesto"
              value={values.puesto}
              height="30px"
              width='75%'
              mrLabel="131px"
              disabled={true}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mt: 4 }}>
              <Typography sx={{ mb: 2, mr: '55px' }}>Requisitos</Typography>
              <Box sx={{ mb: 2, width: '100%' }}>
                <FileUpload
                  file={isEditing && values.requisitos != null ? values.requisitos[0] : null}
                  name="requisitos"
                  width='75%'
                  isEditing={isEditing}
                  convocatoriaId={values.id}
                  disabled={true}
                >
                </FileUpload>
              </Box>

            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mt: 2 }}>
              <Typography sx={{ mb: 2, width: '150px' }}>Frecuencia</Typography>
              <RadioGroup
                row
                name="frecuencia"
                value={values.frecuencia}
                sx={{ marginBottom: 2, ml: -2 }}
                aria-label="Tipo de Frecuencia"
              >
                <FormControlLabel value="TIEMPO_COMPLETO" control={<Radio />} label="Tiempo completo" disabled={true} />
                <FormControlLabel value="TIEMPO_PARCIAL" control={<Radio />} label="Tiempo parcial" disabled={true}/>
              </RadioGroup>
             
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mt: 2 }}>
              <Typography sx={{ mb: 2, width: '150px' }}>Modalidad</Typography>
              <RadioGroup
                row
                name="modalidad"
                value={values.modalidad}
                sx={{ marginBottom: 2, ml: -2 }}
                aria-label="Tipo de Modalidad"
              >
                <FormControlLabel value="PRESENCIAL" control={<Radio />} label="Presencial" disabled={true}/>
                <FormControlLabel sx={{ ml: 5 }} value="REMOTO" control={<Radio />} label="Remoto" disabled={true}/>
              </RadioGroup>
            </Box>

          </Box>
          <Box sx={{ borderBottom: '1px solid #A9A9A9', width: '100%', mb: 2 }} />

          <Box sx={{ padding: 4 }}>


            <Typography variant="h5" sx={{ color: '#191D23', fontWeight: 'bold', mb: 4 }}>
              Detalle de criterios  de evaluación
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>

            </Box>


            <CardCriterios criterios={values.criteriosSeleccion || [] }  disabled={true}/>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'left', mt: 4 }}>
          <Button variant='outlined' onClick={() => router.push('./listadoConvocatorias')} sx={{ width: '170px', marginRight: '20px' }}>
            Regresar
          </Button>
        </Box>

      </Box>


    </Box>
  );
}

export default NuevaConvocatoria;
