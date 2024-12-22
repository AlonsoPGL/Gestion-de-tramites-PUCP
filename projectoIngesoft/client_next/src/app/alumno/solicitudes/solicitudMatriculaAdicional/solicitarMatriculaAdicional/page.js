"use client";
import BarraBusqueda from "../../../../../../componentesAdministrador/BarraBusqueda";
import { Button, Typography, Box } from '@mui/material';
import TablaSolicitudAdicional from "../../../../../../componentesAlumno/solicitudMatriculaAdicional/TablaSolicitudAdicional";
import { useRouter } from "next/navigation";
import { useEffect, useState, useContext } from "react";
import { CursosAdicionalesContext, useCursosAdicionales } from "@/app/CursosAdicionalesContext";
import ErrorConDescripcion from "../../../../../../componentesGenerales/modales/ErrorConDescripcion";
import { usePersona } from "@/app/PersonaContext";
import { useUnidad } from "@/app/UnidadContex";
import { useSemestre } from "@/app/SemestreContext";

export default function SolicitudCartaPresentacion() {

    const [cursosLocal,setCursosLocal]=useState([]); // TODO: Aqui deberia colocar la lista de cursos obtenida con axios

    const updateCursos=(newCursos)=>{
        setCursosLocal(newCursos);
    }

    //! Obtencion del arreglo de cursos (FIN) -----------------------------------------------
    //const [cursosSolicitud,setCursosSolicitud]=useState();
    const especialidad="Ingeniería de Sistemas";
    const { persona } = usePersona(); //obteniendo los datos de la persona
    const { semestreactual } = useSemestre();
    const { unidad } = useUnidad();

  

    //const especialidad=persona.unidad.nombre;

    const semestre="2024-1";
    console.log(persona)

    useEffect(() => {
      setCursosLocal([]); //limpiando buffer
      //if (persona && persona.id) { //! Colocarlo luego OWO
        const fetchCursosPorEspecialidadSemestre = async (especialidad,semestre) => {
          try {
            const response = await fetch(`http://localhost:8080/institucion/curso/buscarPorEspecialidad?especialidad=${unidad.unidadNombre}`);
            if(response){
              const data = await response.json();
              // Agregar el atributo 'seleccionado' a cada curso y horario
              const dataConSeleccion = data.map((curso) => ({
                ...curso,
                seleccionado: false, // Marcar el curso como no seleccionado
                horarios: curso.horarios.map((horario) => ({
                  ...horario,
                  seleccionado: false, // Marcar todos los horarios como no seleccionados
                })),
              }));
            
              setCursosLocal(dataConSeleccion);
            }
          } catch (error) {
            if (error instanceof SyntaxError) {
              console.warn(`No se encontraron solicitudes.`);
            } else {
              console.error(`Error al obtener las solicitudes:`, error);
              throw error; // Propaga otros errores
            }
          }
        };
  
        fetchCursosPorEspecialidadSemestre(especialidad,semestre);
        console.log(cursosLocal);
      //}
    }, []);


    //! Redireccionando a la pagina de envio y mandando el arreglo actualizado al context de Cursos
    const router=useRouter();
    const { setCursosAdicionales } = useContext(CursosAdicionalesContext);
    const {cursosAdicionales} = useCursosAdicionales();

    function eliminarCursosNoSeleccionados(cursos) {
      return cursos
          .map(curso => ({
              ...curso,
              horarios: curso.horarios.filter(horario => horario.seleccionado) // Filtra solo los horarios seleccionados
          }))
          .filter(curso => curso.horarios.length > 0); // Elimina los cursos que no tienen horarios seleccionados
    }
  

      //! useStates para abrir el modal o cerrarlo
      const [openLocal, setOpen] = useState(false);
      const handleClose = () => setOpen(false);

    //! Permisos/validaciones (Envio de solicitud)
    const [caseValidation,setCaseValidation]=useState(0);

    const handleClickEnviarSolicitud = () => {
        const cursosSeleccionados = eliminarCursosNoSeleccionados(cursosLocal);
        setCursosAdicionales(cursosSeleccionados); //Aqui deberia enviar solo aquellos que tienen true en la ultima columna

        //verificar que solo haya un horario seleccionado por curso
        const soloUnHorarioPorCurso = cursosSeleccionados.every(curso => curso.horarios.length === 1);

        console.log(cursosSeleccionados);
        console.log("Unidad:",unidad);
        console.log("Semestre:",semestreactual);
        //!  Descomentar luego de probar el console log
        if(!soloUnHorarioPorCurso||cursosSeleccionados.length===0){
          console.log("El arreglo esta vacio"); //En vez de esto deberia saltar un modal de error
          if(!soloUnHorarioPorCurso)setCaseValidation(0);
          //if(!existeCruceHorario)setCaseValidation(1); //!Falta completar esta validacion
          setOpen(!openLocal);
        }else{
          router.push('./solicitarMatriculaAdicional/resumenJustificacion');
        }
    }
    
    const handleTextValidation=()=>{
      if (caseValidation===0){
        return "Debe seleccionar al menos un horario y como máximo uno por cada curso.";
      }
      if (caseValidation===1){
        return "Existe cruce entre los horarios seleccionados";
      }
    }
    return (
        <Box sx={{ backgroundColor: 'white', color: 'white', height: '100vh' }}>
            <Box
            sx={{
                marginLeft: '220px',
                height: '100vh',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
            }}
            >
                <Box>
                <Typography variant="h4" sx={{ marginLeft:'20px', fontWeight: '', color: 'black' }}>Solicitud de Matricula Adicional</Typography>
                </Box>

                <Box sx={{padding:'20px',display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                    <Box sx={{flexGrow:'1'}}>
                    <BarraBusqueda ></BarraBusqueda>
                    </Box>
                    
                    <Button onClick={handleClickEnviarSolicitud} variant="contained" color="primary" sx={{ ml: 2, display: 'flex', alignItems: 'center', height: '40px', backgroundColor:'#363581'}}>
                        Enviar solicitud
                    </Button>
                    {/*<Button onClick={imprimePersona}>Pruebita</Button>*/}
                    <ErrorConDescripcion open={openLocal} onClose={handleClose} texto={handleTextValidation()}></ErrorConDescripcion>

                </Box>

                <Box sx={{marginLeft:'20px',marginRight:'20px'}}>
                    <TablaSolicitudAdicional cursos={cursosLocal} updateCursos={updateCursos}/>
                </Box>
            </Box>
          
        </Box>
    );
}