package pe.edu.pucp.onepucp.institucion.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import pe.edu.pucp.onepucp.institucion.dto.AgregarAlumnosDTO;
import pe.edu.pucp.onepucp.institucion.dto.AlumnoHorarioDTO;
import pe.edu.pucp.onepucp.institucion.dto.HorarioDTO;
import pe.edu.pucp.onepucp.institucion.dto.HorarioDelegadoDTO;
import pe.edu.pucp.onepucp.institucion.dto.HorarioInsertDTO;
import pe.edu.pucp.onepucp.institucion.dto.JefeDePracticaDTO;
import pe.edu.pucp.onepucp.institucion.dto.RespuestaAlumnoHorario;
import pe.edu.pucp.onepucp.institucion.model.Horario;
import pe.edu.pucp.onepucp.institucion.service.HorarioService;
import pe.edu.pucp.onepucp.rrhh.dto.AlumnoDTO;
import pe.edu.pucp.onepucp.rrhh.dto.AlumnoDTOInsert;
import pe.edu.pucp.onepucp.rrhh.dto.DocenteDTO;
import pe.edu.pucp.onepucp.rrhh.dto.RespuestaAlumnoDTOInsert;
import pe.edu.pucp.onepucp.rrhh.service.AlumnoService;

@RestController
@RequestMapping("/institucion/horario")
public class HorarioController {

    @Autowired
    private AlumnoService alumnoService;
    private static final Logger logger = LoggerFactory.getLogger(HorarioController.class);
    //! LISTAR HORARIOS ACTIVOS POR CURSO

    @GetMapping("/listarHorariosActivosPorCurso/{idCurso}")
    public ResponseEntity<List<HorarioDTO>> listarHorariosActivosPorCurso(@PathVariable Long idCurso) {
        try {
            // Llamar al servicio para obtener los horarios activos del curso especificado
            List<HorarioDTO> horariosActivos = horarioService.listarHorariosActivosPorCurso(idCurso);

            // Verificar si hay horarios activos para el curso
            if (horariosActivos.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(horariosActivos);
            }

            return ResponseEntity.status(HttpStatus.OK).body(horariosActivos);
        } catch (Exception e) {
            // Manejar errores si el curso no existe o algo falla
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
    //! CONTAR HORARIOS ACTIVOS Y VISIBLES DEL CURSO

    @Autowired
    private HorarioService horarioService;

    @GetMapping("/contarHorariosActivosYVisibles/{idCurso}")
    public ResponseEntity<Integer> contarHorariosActivosYVisibles(@PathVariable Long idCurso) {
        try {
            // Llamar al servicio para contar los horarios activos y visibles del curso
            int cantidadHorarios = horarioService.contarHorariosActivosYVisibles(idCurso);
            return ResponseEntity.status(HttpStatus.OK).body(cantidadHorarios);
        } catch (Exception e) {
            // Manejo de errores si el curso no existe o algo falla
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    //! INSERTAR HORARIO
    @PostMapping("/insertar")
    public ResponseEntity<HorarioDTO> insertarHorario(@RequestBody HorarioInsertDTO horarioInsertDTO) {
        try {
            // Llamar al servicio para insertar el horario y devolver el HorarioDTO creado
            HorarioDTO horarioCreado = horarioService.insertarHorario(horarioInsertDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(horarioCreado);
        } catch (Exception e) {
            // Manejo de errores si el curso no existe o algo falla
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
    //! ACTUALIZAR HORARIO

    @PutMapping("/actualizar/{idHorario}")
    public ResponseEntity<HorarioDTO> actualizarHorario(@PathVariable Long idHorario, @RequestBody HorarioInsertDTO horarioInsertDTO) {
        try {
            // Llamar al servicio para actualizar el horario y devolver el HorarioDTO actualizado
            HorarioDTO horarioActualizado = horarioService.actualizarHorario(idHorario, horarioInsertDTO);
            return ResponseEntity.status(HttpStatus.OK).body(horarioActualizado);
        } catch (Exception e) {
            // Manejo de errores si el horario no existe o algo falla
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    //! LISTAR
    //? Listar horarios por curso
    @GetMapping("/curso/{idCurso}")
    public ResponseEntity<List<HorarioDTO>> obtenerHorariosPorCurso(@PathVariable int idCurso) {
        logger.info("Solicitud para obtener horarios del curso con ID: {}", idCurso);
        List<HorarioDTO> horarios = horarioService.obtenerHorariosPorCurso(idCurso);

        if (horarios.isEmpty()) {
            logger.warn("No se encontraron horarios para el curso con ID: {}", idCurso);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(horarios);
        }

        logger.info("Se encontraron {} horarios para el curso con ID: {}", horarios.size(), idCurso);
        return ResponseEntity.ok(horarios);
    }

    //? Listar horarios por especialidad y semestre
    @GetMapping("/buscarPorEspecialidadSemestre")
    public ResponseEntity<?> buscarPorEspecialidadSemestre(@RequestParam String especialidad, @RequestParam String semestre) {
        logger.info("Buscando horarios para la especialidad: {} y semestre: {}", especialidad, semestre);
        List<Horario> horarios = horarioService.buscarPorEspecialidadSemestre(especialidad, semestre);

        if (horarios.isEmpty()) {
            logger.warn("No se encontraron horarios para especialidad: {} y semestre: {}", especialidad, semestre);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontraron horarios para este semestre y especialidad");
        }

        logger.info("Se encontraron {} horarios para especialidad: {} y semestre: {}", horarios.size(), especialidad, semestre);
        return ResponseEntity.ok(horarios);
    }

    //? Listar delegados
    @GetMapping("/delegados")
    public List<HorarioDelegadoDTO> listarDelegados() {
        logger.info("Solicitud para listar todos los delegados de horarios");
        List<HorarioDelegadoDTO> delegados = horarioService.obtenerTodosLosDelegados();
        logger.info("Se encontraron {} delegados", delegados.size());
        return delegados;
    }

    //! ASIGNAR
    //? Asignar docentes a un horario
    @PostMapping("/asignarDocente/{idHorario}")
    public ResponseEntity<?> asignarDocenteAHorario(@PathVariable Long idHorario, @RequestBody List<Long> idDocentes) {
        logger.info("Asignando docentes al horario con ID: {}", idHorario);
        horarioService.asignarDocenteAHorario(idHorario, idDocentes);
        logger.info("Asignación realizada correctamente para el horario con ID: {}", idHorario);
        return ResponseEntity.ok("Asignación realizada correctamente para el curso " + idHorario);
    }

    //? Asignar delegado a un horario
    @PostMapping("/asignarDelegado/{idHorario}")
    public ResponseEntity<?> asignarDelegadoAHorario(@PathVariable Long idHorario, @RequestParam Long idDelegado) {
        logger.info("Asignando delegado con ID: {} al horario con ID: {}", idDelegado, idHorario);
        horarioService.asignarDelegadoAHorario(idHorario, idDelegado);
        logger.info("Delegado asignado correctamente al horario con ID: {}", idHorario);
        return ResponseEntity.ok("Asignación realizada correctamente para el curso " + idHorario);
    }

    //! LISTAR POR PERSONA
    //? Listar horarios por docente
    @GetMapping("/docente/{idPersona}")
    public ResponseEntity<List<HorarioDTO>> listarHorariosPorDocenteId(@PathVariable Long idPersona) {
        logger.info("Listando horarios para el docente con ID: {}", idPersona);
        List<HorarioDTO> horarios = horarioService.listarHorariosPorPersonaId(idPersona);
        logger.info("Se encontraron {} horarios para el docente con ID: {}", horarios.size(), idPersona);
        return ResponseEntity.ok(horarios);
    }

    //! ELIMINAR
    //? Eliminar delegado de un horario
    @PutMapping("/eliminarDelegado/{idHorario}")
    public ResponseEntity<String> eliminarDelegadoDeHorario(@PathVariable Long idHorario) {
        logger.info("Eliminando delegado del horario con ID: {}", idHorario);
        horarioService.eliminarDelegadoDeHorario(idHorario);
        logger.info("Delegado eliminado correctamente del horario con ID: {}", idHorario);
        return ResponseEntity.ok("Delegado eliminado del horario con id: " + idHorario);
    }

    //! LISTAR JPS
    //? Listar Jefes de Práctica por horario
    @GetMapping("/jps/{id}")
    public ResponseEntity<List<JefeDePracticaDTO>> listarJpsPorHorario(@PathVariable Long id) {
        logger.info("Listando Jefes de Práctica para el horario con ID: {}", id);
        List<JefeDePracticaDTO> jps = horarioService.listarJpsPorHorario(id);
        logger.info("Se encontraron {} Jefes de Práctica para el horario con ID: {}", jps.size(), id);
        return ResponseEntity.ok(jps);
    }

    //? Listar todos los Jefes de Práctica
    @GetMapping("/listarJps")
    public ResponseEntity<List<JefeDePracticaDTO>> listarTodosJPs() {
        logger.info("Listando todos los Jefes de Práctica");
        List<JefeDePracticaDTO> jps = horarioService.listarTodosJPs();
        logger.info("Se encontraron {} Jefes de Práctica en total", jps.size());
        return ResponseEntity.ok(jps);
    }

    @GetMapping("/ObtenerJp/{id}")
    public ResponseEntity<JefeDePracticaDTO> obtenerJpPorId(@PathVariable Long id) {
        logger.info("Buscando Jefe de Práctica con ID: {}", id);
        JefeDePracticaDTO jp = horarioService.obtenerJpPorId(id);
        if (jp == null) {
            logger.warn("No se encontró Jefe de Práctica con ID: {}", id);
            return ResponseEntity.notFound().build(); // Si no se encuentra, devuelve un 404
        }
        logger.info("Se encontró Jefe de Práctica con ID: {}", id);
        return ResponseEntity.ok(jp);
    }

    //! LISTAR DOCENTES
    //? Listar docentes por horario
    @GetMapping("/listarDocentes/{id}")
    public ResponseEntity<List<DocenteDTO>> listarDocentesPorHorario(@PathVariable Long id) {
        logger.info("Listando docentes para el horario con ID: {}", id);
        List<DocenteDTO> docentes = horarioService.listarDocentesPorHorario(id);
        logger.info("Se encontraron {} docentes para el horario con ID: {}", docentes.size(), id);
        return ResponseEntity.ok(docentes);
    }

    //! DETALLES
    //? Obtener horario por ID
    @GetMapping("/{id}")
    public ResponseEntity<HorarioDTO> obtenerHorarioPorId(@PathVariable Long id) {
        logger.info("Obteniendo horario con ID: {}", id);
        HorarioDTO horario = horarioService.obtenerHorarioPorId(id);
        logger.info("Horario con ID: {} obtenido correctamente", id);
        return ResponseEntity.ok(horario);
    }

    //! ELIMINAR HORARIO (SOFT DELETE)
    @DeleteMapping("/eliminar/{idHorario}")
    public ResponseEntity<String> eliminarHorario(@PathVariable Long idHorario) {
        try {
            logger.info("Iniciando eliminación lógica del horario con ID: {}", idHorario);
            horarioService.eliminarHorario(idHorario);
            return ResponseEntity.status(HttpStatus.OK).body("Horario eliminado correctamente.");
        } catch (Exception e) {
            logger.error("Error al eliminar el horario con ID: {}: {}", idHorario, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al eliminar el horario: " + e.getMessage());
        }
    }

    @PostMapping("/insertarAlumnoHorarioCSV")
    public RespuestaAlumnoHorario insertarAlumnoHorarioCsv(@RequestBody List<AlumnoHorarioDTO> alumnosHorariosDTO) {
        logger.info("Iniciando inserción de múltiples relaciones alumno-horario. Total: {}", alumnosHorariosDTO.size());

        List<AlumnoHorarioDTO> relacionesGuardadas = new ArrayList<>();
        List<String> errores = new ArrayList<>();

        for (AlumnoHorarioDTO alumnoHorarioDTO : alumnosHorariosDTO) {
            boolean allDatosValid = true;
            StringBuilder error = new StringBuilder("Para el alumno con código: ")
                    .append(alumnoHorarioDTO.getAlumno().getCodigo())
                    .append(", en el horario con código: ")
                    .append(alumnoHorarioDTO.getHorario().getCodigo())
                    .append(" ");

            logger.info("Procesando relación alumno-horario: Alumno {}, Horario {}",
                    alumnoHorarioDTO.getAlumno().getCodigo(),
                    alumnoHorarioDTO.getHorario().getCodigo());

            try {
                //Validar que el  codigo del alumno no sea negativo
                AlumnoDTO alumnoDTO = null;
                Optional<HorarioInsertDTO> horarioDTO = null;
                if (alumnoHorarioDTO.getAlumno().getCodigo() < 0) {
                    logger.warn("Código de alumno inválido: {}", alumnoHorarioDTO.getAlumno().getCodigo());
                    errores.add(error.append("Código de alumno inválido.").toString());
                    allDatosValid = false;


                }
                else{
                    //VALIDAR QUE EL ALUMNO EXISTA ANTES DE OBTENERLO
                    if (!alumnoService.existePorCodigo(alumnoHorarioDTO.getAlumno().getCodigo())) {
                        logger.warn("Alumno no encontrado: {}", alumnoHorarioDTO.getAlumno().getCodigo());
                        errores.add(error.append("Alumno no encontrado.").toString());
                        allDatosValid = false;
                    } else {
                        alumnoDTO = alumnoService.obtenerAlumnoActivoPorCodigo((alumnoHorarioDTO.getAlumno().getCodigo()));

                    }
                }
                //Validar que el codigo del horario no  contenga caracteres especiales
                if (!horarioService.existePorCodigoCursoYTipo(alumnoHorarioDTO.getHorario().getCodigo(), alumnoHorarioDTO.getHorario().getCodigoCurso(), alumnoHorarioDTO.getHorario().getTipoHorario())) {
                    logger.warn("Horario no encontrado: {}", alumnoHorarioDTO.getHorario().getCodigo());
                    errores.add(error.append("Horario no encontrado.").toString());
                    allDatosValid = false;
                } else {
                    horarioDTO = horarioService.obtenerPorCodigoCursoYTipo(alumnoHorarioDTO.getHorario().getCodigo(), alumnoHorarioDTO.getHorario().getCodigoCurso(), alumnoHorarioDTO.getHorario().getTipoHorario());

                }

                // Crear Relación si todos los datos son válidos
                if (allDatosValid) {
                    AlumnoHorarioDTO relacionGuardada = horarioService.insertarRelacionAlumnoHorario(alumnoDTO, horarioDTO.get());
                    relacionesGuardadas.add(relacionGuardada);
                    logger.info("Relación alumno-horario insertada con éxito: Alumno {}, Horario {}",
                            alumnoDTO.getCodigo(), horarioDTO.get().getCodigo());
                } else {
                    logger.error("Datos inválidos para la relación alumno-horario.");
                }
            } catch (Exception e) {
                logger.error("Error inesperado al procesar la relación alumno-horario: Alumno {}, Horario {}",
                        alumnoHorarioDTO.getAlumno().getCodigo(),
                        alumnoHorarioDTO.getHorario().getCodigo(), e);
                errores.add(error.append("Error inesperado: ").append(e.getMessage()).toString());
            }
        }

        return new RespuestaAlumnoHorario(relacionesGuardadas, errores);
    }
    
    //!AGREGAR ALUMNOS
    @PostMapping("/agregar-alumnos")
    public ResponseEntity<HorarioInsertDTO> agregarAlumnos(@RequestBody AgregarAlumnosDTO agregarAlumnosDTO) {
        logger.info("Iniciando validación de múltiples alumnos para el horario. ID Horario: {}", agregarAlumnosDTO.getIdHorario());
        HorarioInsertDTO horarioActualizado = horarioService.agregarAlumnosAHorario(
            agregarAlumnosDTO.getIdHorario(),
            agregarAlumnosDTO.getAlumnos()
        );
        return ResponseEntity.ok(horarioActualizado);
    }
    @PostMapping("/insertarCSV")
    public RespuestaAlumnoDTOInsert insertarAlumnosCsv(@RequestBody AgregarAlumnosDTO agregarAlumnosDTO) {
        logger.info("Iniciando validación de múltiples alumnos para el horario. ID Horario: {}", agregarAlumnosDTO.getIdHorario());
    
        // Listas para almacenar alumnos válidos y errores
        List<AlumnoDTOInsert> alumnosValidos = new ArrayList<>();
        List<String> errores = new ArrayList<>();
    
        // Validación de los datos de los alumnos
        for (AlumnoDTOInsert alumnoDTO : agregarAlumnosDTO.getAlumnos()) {
            StringBuilder error = new StringBuilder("Para el alumno con ID: " + alumnoDTO.getId() + " ");
            boolean datosValidos = true;
    
            logger.info("Procesando alumno con ID: {}", alumnoDTO.getId());
    
            // Verificar si el alumno existe en el sistema
            if (!alumnoService.existePorCodigo(alumnoDTO.getCodigo())) {
                logger.warn("Alumno no existe con ID: {}", alumnoDTO.getId());
                errores.add(error.append("Alumno no existe en el sistema.").toString());
                datosValidos = false;
            }
    
            // Verificar que el nombre no sea nulo o vacío
            if (alumnoDTO.getNombre() == null || alumnoDTO.getNombre().isEmpty()) {
                logger.error("Nombre inválido para el alumno con ID: {}", alumnoDTO.getId());
                errores.add(error.append("El nombre del alumno es inválido.").toString());
                datosValidos = false;
            }
            //Verificar que se obtiene el alumno por codigo
            AlumnoDTO alumno = alumnoService.obtenerAlumnoActivoPorCodigo(alumnoDTO.getCodigo());
            if(alumno == null){
                logger.error("Alumno no encontrado con código: {}", alumnoDTO.getCodigo());
                errores.add(error.append("Alumno no encontrado.").toString());
                datosValidos = false;
            }
            if(alumno != null && alumnoDTO.getId() != null){
                alumnoDTO.setId(alumno.getId());
            }
            // Si los datos son válidos, agregar a la lista de alumnos válidos
            if (datosValidos) {
                alumnosValidos.add(alumnoDTO);
                logger.info("Alumno validado con éxito. ID: {}", alumnoDTO.getId());
            } else {
                logger.error("Datos inválidos para el alumno con ID: {}", alumnoDTO.getId());
            }
        }
    
        // Si hay alumnos válidos, asociarlos al horario
        List<AlumnoDTOInsert> alumnosGuardados = new ArrayList<>();
        if (!alumnosValidos.isEmpty()) {
            try {
                logger.info("Iniciando la asociación de alumnos válidos al horario. Total: {}", alumnosValidos.size());
                
                // Llamar al servicio para agregar los alumnos al horario
                HorarioInsertDTO horarioActualizado = horarioService.agregarAlumnosAHorario(
                    agregarAlumnosDTO.getIdHorario(), 
                    alumnosValidos
                );
    
                // Convertir los alumnos del horario actualizado a DTOInsert para la respuesta
                alumnosGuardados = horarioActualizado.getAlumnos();
                logger.info("Asociación de alumnos completada con éxito.");
            } catch (Exception e) {
                logger.error("Error al asociar alumnos válidos al horario con ID: {}", agregarAlumnosDTO.getIdHorario(), e);
                errores.add("Error general al asociar alumnos al horario.");
            }
        } else {
            logger.warn("No hay alumnos válidos para asociar al horario.");
        }
    
        // Construir la respuesta
        RespuestaAlumnoDTOInsert respuesta = new RespuestaAlumnoDTOInsert();
        respuesta.setAlumnoGuardados(alumnosGuardados);
        respuesta.setErrores(errores);
        return respuesta;
    }

}
