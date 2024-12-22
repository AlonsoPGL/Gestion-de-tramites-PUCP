package pe.edu.pucp.onepucp.rrhh.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import pe.edu.pucp.onepucp.institucion.dto.HorarioDTO;
import pe.edu.pucp.onepucp.institucion.model.Horario;
import pe.edu.pucp.onepucp.rrhh.dto.AlumnoDTO;
import pe.edu.pucp.onepucp.rrhh.dto.AlumnoDTOInsert;
import pe.edu.pucp.onepucp.rrhh.dto.AlumnoEnRiesgo_X_HorarioDTO;
import pe.edu.pucp.onepucp.rrhh.dto.RespuestaAlumnoDTOInsert;
import pe.edu.pucp.onepucp.rrhh.model.Alumno;
import java.util.List;
import pe.edu.pucp.onepucp.rrhh.service.AlumnoService;
import pe.edu.pucp.onepucp.institucion.dto.HorarioDTO;
import java.util.Map;
@RestController
@RequestMapping("/rrhh/alumno")
public class AlumnoController {


    private static final Logger logger = LoggerFactory.getLogger(AlumnoController.class);
    @Autowired
    AlumnoService alumnoService;
    @GetMapping("/{id}")
    public ResponseEntity<AlumnoDTO> obtenerAlumnoActivoPorId(@PathVariable Long id) {
        logger.info("Solicitando información del alumno activo con ID: {}", id);

        try {
            AlumnoDTO alumnoDTO = alumnoService.obtenerAlumnoActivoPorId(id);
            logger.info("Alumno activo encontrado y retornado correctamente.");
            return ResponseEntity.ok(alumnoDTO);
        } catch (NoSuchElementException e) {
            logger.warn("Alumno activo con ID {} no encontrado: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error inesperado al procesar la solicitud para el alumno activo con ID: {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<AlumnoDTO> obtenerAlumnoActivoPorCodigo(@PathVariable int codigo) {
        logger.info("Solicitando información del alumno activo con código: {}", codigo);

        try {
            AlumnoDTO alumnoDTO = alumnoService.obtenerAlumnoActivoPorCodigo(codigo);
            logger.info("Alumno activo encontrado y retornado correctamente.");
            return ResponseEntity.ok(alumnoDTO);
        } catch (NoSuchElementException e) {
            logger.warn("Alumno activo con código {} no encontrado: {}", codigo, e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error inesperado al procesar la solicitud para el alumno activo con código: {}", codigo, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    @GetMapping("/buscar")
    public ResponseEntity<?> buscarAlumno(
        @RequestParam String nombre,
        @RequestParam String apellidoPaterno,
        @RequestParam String apellidoMaterno,
        @RequestParam int codigo) {
        
        Optional<Alumno> alumno = alumnoService.buscarPorNombreApellidoYCodigo(nombre,apellidoPaterno, apellidoMaterno, codigo);
        
        if (alumno.isPresent()) {
            return ResponseEntity.ok(alumno);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Alumno no encontrado");
        }
    }
    
    
    // Listar Alumnos en riesgo para el director de carrera
    @GetMapping("/listarEnRiesgo")
    public List<AlumnoEnRiesgo_X_HorarioDTO> obtenerAlumnosEnRiesgoConHorario() {
        return alumnoService.obtenerAlumnosEnRiesgoDTO();
    }

    // Listar Alumnos en riesgo para un docente
    @GetMapping("/listarAlumnoEnRiesgoxDocente/{idDocente}")
    public List<AlumnoEnRiesgo_X_HorarioDTO> obtenerAlumnosEnRiesgoDTOxDocente(@PathVariable Long idDocente) {
        return alumnoService.obtenerAlumnosEnRiesgoDTOxDocente(idDocente);
    }

    // Obtener un alumno en riesgo
    @GetMapping("/obtenerAlumnoEnRiesgo")
    public AlumnoEnRiesgo_X_HorarioDTO obtenerAlumnoEnRiesgo(@RequestParam Long id) {
        return alumnoService.obtenerUnAlumnoEnRiesgo_X_HorarioDTO(id);
    }

    // Registrar un alumno en riesgo
    @PostMapping("/registrar")
    public Alumno registrarAlumnoEnRiesgo(@RequestBody Alumno alumno) {
        return alumnoService.registrarAlumnoEnRiesgo(alumno);
    }

    // Buscar un alumno por código
    @GetMapping("/buscarPorCodigo/{codigo}")
    public ResponseEntity<Alumno> buscarPorCodigo(@PathVariable Long codigo) {
        Optional<Alumno> alumno = alumnoService.buscarPorCodigo(codigo);
        return alumno.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Buscar alumnos por nombre    
    @GetMapping("/buscarPorNombre")
    public ResponseEntity<List<Alumno>> buscarPorNombre(@RequestParam(required = false) String nombre) {
        List<Alumno> alumnos;
        
        // Si el nombre está vacío o es nulo, obtener todos los alumnos
        if (nombre == null || nombre.trim().isEmpty()) {
            nombre="";
        }
        // Obteniendo alumnos
        alumnos = alumnoService.buscarAlumnosPorNombre(nombre);
        // Retornando resultado de busqueda
        return ResponseEntity.ok(alumnos);
    }

    // Buscar alumnos en riesgo por nombre
    @GetMapping("/buscarEnRiesgoPorNombre")
    public ResponseEntity<List<Alumno>> buscarEnRiesgoPorNombre(@RequestParam(required = false) String nombre) {
        List<Alumno> alumnos;
        
        // Si el nombre está vacío o es nulo, obtener todos los alumnos
        if (nombre == null || nombre.trim().isEmpty()) {
            System.out.println("Es caso de cadena vacía, devolviendo todos los alumnos");
            nombre="";
        }
        //System.out.println("La cadena a buscar es: "+nombre);
        alumnos = alumnoService.buscarAlumnosEnRiesgoPorNombre(nombre);

        return ResponseEntity.ok(alumnos);
    }
    

    // Subir archivo Excel para registrar alumnos en riesgo
    @PostMapping("/subirExcel")
    public ResponseEntity<ExcelProcessingResult> subirExcel(@RequestParam("file") MultipartFile file) {
        System.out.println("\nNombre de archivo " + file.getName());
        ExcelProcessingResult result = alumnoService.procesarExcel(file);
        if (result.isSuccess()) {
            return new ResponseEntity<>(result, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }
    }

    // Agregar a la tabla AlumnoEnRiesgo_X_Horario
    @PutMapping("/agregarRiesgo")
    public ResponseEntity<String> agregarRiesgo(@RequestParam Long codigo, @RequestParam String codigoHorario, @RequestParam String codigoCurso,
    @RequestParam Long vez, @RequestParam String motivo) {
        boolean actualizado = alumnoService.agregarAlumnoEnRiesgo(codigo, codigoHorario, codigoCurso, vez, motivo);
        if (actualizado) {
            return ResponseEntity.ok("Alumno actualizado correctamente.");
        } else {
            return ResponseEntity.badRequest().body("No se pudo actualizar el estado del alumno.");
        }
    }

    // Actualizar elemento de la tabla AlumnoEnRiesgo_X_Horario
    @PutMapping("/actualizarAlumnoRiesgo")
    public ResponseEntity<String> actualizarAlumnoRiesgo(@RequestParam Long id, @RequestParam Long vez, @RequestParam String motivo) {
        boolean actualizado = alumnoService.actualizarAlumnoRiesgo(id, vez, motivo);
        if (actualizado) {
            return ResponseEntity.ok("Alumno actualizado correctamente.");
        } else {
            return ResponseEntity.badRequest().body("No se pudo actualizar el estado del alumno.");
        }
    }

    // Actualizar el estado de un alumno a 'fuera de riesgo'
    @PutMapping("/eliminarRiesgo/{idAluXH}")
    public ResponseEntity<String> eliminarRiesgo(@PathVariable Long idAluXH) {

        
        boolean actualizado = alumnoService.eliminarAlumnoEnRiesgoXHorario(idAluXH);
        if (actualizado) {
            return ResponseEntity.ok("Alumno actualizado correctamente.");
        } else {
            return ResponseEntity.badRequest().body("No se pudo actualizar el estado del alumno.");
        }
    }

    @GetMapping("/listar")
    public List<AlumnoDTO> listarPersona() {
        // logger.info("Listando todas las personas...");
        List<AlumnoDTO> alumnos = alumnoService.obtenerTodosLosAlumnos();
        return alumnos;
        //  logger.info("Se encontraron {} personas", personas.size()); // Log con el tamaño de la lista


      //  logger.info("Se encontraron {} personas", personas.size()); // Log con el tamaño de la list

    }               

    @GetMapping("/buscarPorParametros")
    public ResponseEntity<?> buscarAlumnos(
            @RequestParam(required = false) String apellidoPaterno,
            @RequestParam(required = false) String apellidoMaterno,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) Integer codigo) {

        // Mensajes de consola con System.out.println()
        System.out.println("Iniciando búsqueda de alumnos con los siguientes parámetros:");
        System.out.println("Apellido Paterno: " + apellidoPaterno);
        System.out.println("Apellido Materno: " + apellidoMaterno);
        System.out.println("Nombre: " + nombre);
        System.out.println("Código: " + codigo);

        try {
            // Realizar la búsqueda
            List<AlumnoDTO> alumnos = alumnoService.buscarAlumnosPorCriterios(
                    apellidoPaterno,
                    apellidoMaterno,
                    nombre,
                    codigo
            );

            // Si no se encuentran alumnos, devolver un 404
            if (alumnos.isEmpty()) {
                System.out.println("No se encontraron alumnos con los criterios proporcionados.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontraron alumnos con los criterios proporcionados.");
            }

            System.out.println("Se encontraron " + alumnos.size() + " alumnos.");
            // Devolver la lista de alumnos encontrados
            return ResponseEntity.ok(alumnos);

        } catch (Exception e) {
            System.out.println("Error interno del servidor al buscar alumnos.");
            e.printStackTrace();  // Para ver el stack trace en consola
            // Cualquier otro error inesperado, devolver un 500
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno del servidor.");
        }
    }
    

    @GetMapping("/{alumnoId}/horario")
    public ResponseEntity<List<HorarioDTO>> obtenerHorariosPorAlumno(@PathVariable Long alumnoId) {
        List<HorarioDTO> horarios = alumnoService.obtenerHorariosPorAlumno(alumnoId);        
        //return horarios.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(horarios);
        return horarios.isEmpty() ? null : ResponseEntity.ok(horarios);
    }

    @GetMapping("/listarAlumnosHorario/{idHorario}")
    public ResponseEntity<List<AlumnoDTO>> buscarAlumnos(@PathVariable Long idHorario) {
        // Buscar alumnos usando el servicio
        List<AlumnoDTO> alumnos = alumnoService.obtenerTodosLosAlumnosXHorario(idHorario);
        
        if (alumnos.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Devuelve 404 si no hay resultados
        }
        
        return ResponseEntity.ok(alumnos); // Devuelve 200 y la lista de alumnos
    }
    @GetMapping("/horario/{idHorario}/activos")
    public ResponseEntity<?> listarAlumnosActivosPorHorario(@PathVariable Long idHorario) {
        try {
            logger.info("Recibida solicitud para listar alumnos activos del horario ID: {}", idHorario);
            
            List<AlumnoDTO> alumnosActivos = alumnoService.listarAlumnosActivosPorHorario(idHorario);
            
            Map<String, Object> response = new HashMap<>();
            response.put("alumnos", alumnosActivos);
            response.put("cantidad", alumnosActivos.size());
            
            logger.info("Retornando {} alumnos activos del horario ID: {}", alumnosActivos.size(), idHorario);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            logger.error("Error de validación al listar alumnos activos: {}", e.getMessage());
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "Error de validación", "mensaje", e.getMessage()));
                    
        } catch (Exception e) {
            logger.error("Error al listar alumnos activos del horario {}: {}", idHorario, e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno del servidor", "mensaje", "Error al procesar la solicitud"));
        }
    }

}