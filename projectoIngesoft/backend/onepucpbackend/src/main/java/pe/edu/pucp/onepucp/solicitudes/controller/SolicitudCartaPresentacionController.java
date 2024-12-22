package pe.edu.pucp.onepucp.solicitudes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import pe.edu.pucp.onepucp.institucion.model.Curso;
import pe.edu.pucp.onepucp.institucion.model.Especialidad;
import pe.edu.pucp.onepucp.institucion.repository.CursoRepository;
import pe.edu.pucp.onepucp.institucion.repository.EspecialidadRepository;
import pe.edu.pucp.onepucp.rrhh.model.Alumno;
import pe.edu.pucp.onepucp.rrhh.model.Docente;
import pe.edu.pucp.onepucp.rrhh.model.Persona;
import pe.edu.pucp.onepucp.rrhh.repository.AlumnoRepository;
import pe.edu.pucp.onepucp.rrhh.repository.DocenteRepository;
import pe.edu.pucp.onepucp.rrhh.repository.PersonaRepository;
import pe.edu.pucp.onepucp.solicitudes.dto.SolicitudCartaPresentacionDTO;
import pe.edu.pucp.onepucp.solicitudes.model.EstadoSolicitud;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudCartaPresentacion;
import pe.edu.pucp.onepucp.solicitudes.service.SolicitudCartaPresentacionService;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/solicitudes/carta")
public class SolicitudCartaPresentacionController {
    @Autowired
    PersonaRepository personaRepository;

    @Autowired
    CursoRepository cursoRepository;

    @Autowired
    AlumnoRepository alumnoRepository;

    @Autowired
    DocenteRepository docenteRepository;

    @Autowired
    EspecialidadRepository especialidadRepository;

    @Autowired
    SolicitudCartaPresentacionService solicitudService;

    @PostMapping("/insertar")
    public ResponseEntity<?> insertarSolicitud(@RequestParam("unidadId") Long unidadId,@RequestBody Map<String, Object> solicitudData) {
        try {
            SolicitudCartaPresentacion solicitud = new SolicitudCartaPresentacion();
            solicitud.setFechaCreacion(new Date());
            solicitud.setEstado(EstadoSolicitud.EN_PROCESO);
            // Llenar los campos necesarios
            if (solicitudData.containsKey("emisor")) {
                Map<String, Object> emisorData = (Map<String, Object>) solicitudData.get("emisor");
                Long emisorId = obtenerLongDesdeMap(emisorData, "id");
                Persona emisor = personaRepository.findById(emisorId)
                    .orElseThrow(() -> new RuntimeException("Emisor no encontrado"));
                solicitud.setEmisor(emisor);
            }

            if (solicitudData.containsKey("curso")) {
                Map<String, Object> cursoData = (Map<String, Object>) solicitudData.get("curso");
                Long cursoId = obtenerLongDesdeMap(cursoData, "idCurso");
                Curso curso = cursoRepository.findById(cursoId)
                    .orElseThrow(() -> new RuntimeException("Curso no encontrado"));
                solicitud.setCurso(curso);
            }

            if (solicitudData.containsKey("profesor")) {
                Map<String, Object> profesorData = (Map<String, Object>) solicitudData.get("profesor");
                Long profesorId = obtenerLongDesdeMap(profesorData, "id");
                Docente profesor = docenteRepository.findById(profesorId)
                    .orElseThrow(() -> new RuntimeException("Profesor no encontrado"));
                solicitud.setProfesor(profesor);
            }

            // Agregar lógica para integrantes
            if (solicitudData.containsKey("integrantes")) {
                List<Map<String, Object>> integrantesData = (List<Map<String, Object>>) solicitudData.get("integrantes");
                List<Alumno> integrantes = convertirAAlumnos(integrantesData);
                for (Alumno alumno : integrantes) {
                    // Buscar el alumno existente por su ID
                    Alumno alumnoExistente = alumnoRepository.findById(alumno.getId())
                        .orElseThrow(() -> new RuntimeException("Alumno no encontrado: " + alumno.getEmail()));
                    solicitud.getIntegrantes().add(alumnoExistente);
                }
            }
            if (solicitudData.containsKey("especialidad")) {
                Map<String, Object> especialidadData = (Map<String, Object>) solicitudData.get("especialidad");
                Long especialidadId = obtenerLongDesdeMap(especialidadData, "id");
                Especialidad especialidad = especialidadRepository.findById(unidadId)
                    .orElseThrow(() -> new RuntimeException("Especialidad no encontrada"));
                solicitud.setEspecialidad(especialidad); // Asigna la especialidad a la solicitud
            }
            // Aquí puedes establecer otros campos de solicitud, como estado, fecha, etc.

            // Guardar la solicitud
            SolicitudCartaPresentacion nuevaSolicitud = solicitudService.insertarSolicitudCartaPresentacion(solicitud);
            return ResponseEntity.ok(nuevaSolicitud);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al guardar la solicitud: " + e.getMessage());
        }
    }


    private List<Alumno> convertirAAlumnos(List<Map<String, Object>> dataList) {
        List<Alumno> alumnos = new ArrayList<>();
        for (Map<String, Object> data : dataList) {
            Long id = obtenerLongDesdeMap(data, "id"); // Obtener el ID de cada alumno
            Alumno alumnoExistente = alumnoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alumno no encontrado: " + id));
            alumnos.add(alumnoExistente);
        }
        return alumnos;
    }

    // Método para obtener Long desde el mapa, manejando la conversión de Integer a Long
    private Long obtenerLongDesdeMap(Map<String, Object> data, String key) {
        Object idObj = data.get(key);
        if (idObj instanceof Long) {
            return (Long) idObj;
        } else if (idObj instanceof Integer) {
            return Long.valueOf((Integer) idObj); // Conversión de Integer a Long
        } else {
            throw new IllegalArgumentException("ID no válido para la clave: " + key);
        }
    }


    @GetMapping("/listar/{idAlumno}")
    public ResponseEntity<List<SolicitudCartaPresentacionDTO>> listarSolicitudesPorIdAlumno(@PathVariable Long idAlumno) {
        List<SolicitudCartaPresentacionDTO> solicitudes = solicitudService.listarPorIdAlumno(idAlumno);
        if (solicitudes.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(solicitudes);
    }

    @GetMapping("/listarPorEspecialidad/{id}")
    public ResponseEntity<List<SolicitudCartaPresentacionDTO>> listarSolicitudesPorId(@PathVariable Long id) {
        List<SolicitudCartaPresentacionDTO> solicitudes = solicitudService.listarPorId(id);
        if (solicitudes.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(solicitudes);
    }

    @GetMapping("/obtener/{id}")
    public ResponseEntity<SolicitudCartaPresentacionDTO> obtenerPorId(@PathVariable("id") Long id) {
        SolicitudCartaPresentacionDTO solicitud = solicitudService.obtenerPorIdDTO(id);
        if (solicitud == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(solicitud);
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<?> actualizarSolicitud(@PathVariable Long id, @RequestBody Map<String, Object> solicitudData) {
        try {
            Optional<SolicitudCartaPresentacion> solicitudOptional = solicitudService.obtenerPorId(id);
            
            if (!solicitudOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Solicitud no encontrada");
            }

            SolicitudCartaPresentacion solicitud = solicitudOptional.get();

            // Actualizar los campos según los datos proporcionados en solicitudData
            if (solicitudData.containsKey("estado")) {
                solicitud.setEstado(EstadoSolicitud.valueOf((String) solicitudData.get("estado")));
            }
            //dice observacion pero realmente es Actividades a desarrollar xd
            if (solicitudData.containsKey("observacion")) {
                solicitud.setActividadesDesarrollar((String) solicitudData.get("observacion"));
            }

            // Aquí puedes actualizar otros campos necesarios como fecha, actividades, etc.

            // Guardar la solicitud actualizada
            SolicitudCartaPresentacion solicitudActualizada = solicitudService.insertarSolicitudCartaPresentacion(solicitud);
            return ResponseEntity.ok(solicitudActualizada);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar la solicitud: " + e.getMessage());
        }
    }

    @PutMapping("/actualizar-documento/{idSolicitud}")
    public ResponseEntity<?> actualizarDocumento(@PathVariable Long idSolicitud, @RequestParam("file") MultipartFile file) {
        try {
            // Validar si el archivo es un PDF
            if (file.isEmpty() || !file.getContentType().equals("application/pdf")) {
                return ResponseEntity.badRequest().body("El archivo debe ser un PDF válido.");
            }
            // Obtener la solicitud por ID
            Optional<SolicitudCartaPresentacion> solicitudOptional = solicitudService.obtenerPorId(idSolicitud);
            
            if (!solicitudOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Solicitud no encontrada");
            }
            SolicitudCartaPresentacion solicitud = solicitudOptional.get();
            // Convertir el archivo a byte[]
            byte[] documentoBytes = file.getBytes();
            solicitud.setDocumento(documentoBytes); // Establecer el documento en la solicitud
            // Guardar la solicitud actualizada
            SolicitudCartaPresentacion solicitudActualizada = solicitudService.insertarSolicitudCartaPresentacion(solicitud);
            return ResponseEntity.ok("PDF actualizado exitosamente.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar el PDF: " + e.getMessage());
        }
    }
    @PutMapping("/actualizar-documento-director/{idSolicitud}")
    public ResponseEntity<?> actualizarDocumentoDirector(@PathVariable Long idSolicitud, @RequestParam("file") MultipartFile file) {
        try {
            // Validar si el archivo es un PDF
            if (file.isEmpty() || !file.getContentType().equals("application/pdf")) {
                return ResponseEntity.badRequest().body("El archivo debe ser un PDF válido.");
            }
            // Obtener la solicitud por ID
            Optional<SolicitudCartaPresentacion> solicitudOptional = solicitudService.obtenerPorId(idSolicitud);
            
            if (!solicitudOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Solicitud no encontrada");
            }
            SolicitudCartaPresentacion solicitud = solicitudOptional.get();
            // Convertir el archivo a byte[]
            byte[] documentoBytes = file.getBytes();
            solicitud.setDocumento(documentoBytes); // Establecer el documento en la solicitud
            solicitud.setEstado(EstadoSolicitud.ACEPTADA);
            // Guardar la solicitud actualizada
            SolicitudCartaPresentacion solicitudActualizada = solicitudService.insertarSolicitudCartaPresentacion(solicitud);
            return ResponseEntity.ok("PDF actualizado exitosamente.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar el PDF: " + e.getMessage());
        }
    }
}




