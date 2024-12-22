package pe.edu.pucp.onepucp.solicitudes.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

import pe.edu.pucp.onepucp.institucion.model.Especialidad;
import pe.edu.pucp.onepucp.institucion.model.Horario;
import pe.edu.pucp.onepucp.institucion.repository.EspecialidadRepository;
import pe.edu.pucp.onepucp.institucion.repository.HorarioRepository;
import pe.edu.pucp.onepucp.rrhh.model.Persona;
import pe.edu.pucp.onepucp.rrhh.repository.PersonaRepository;
import pe.edu.pucp.onepucp.solicitudes.dto.SolicitudMatriculaAdicionalDTO;
import pe.edu.pucp.onepucp.solicitudes.model.EstadoSolicitud;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudMatricula;
import pe.edu.pucp.onepucp.solicitudes.model.TipoSolicitud;
import pe.edu.pucp.onepucp.solicitudes.service.SolicitudMatriculaService;


@RestController
@RequestMapping("/solicitudes/matricula")
public class SolicitudMatriculaController {

    private final SolicitudMatriculaService solicitudMatriculaService;
    private static final Logger logger = LoggerFactory.getLogger(SolicitudMatriculaController.class);
    
    @Autowired
    private EspecialidadRepository especialidadRepository;

    @Autowired
    private HorarioRepository horarioRepository;

    @Autowired
    private PersonaRepository personaRepository;

    @Autowired
    public SolicitudMatriculaController(SolicitudMatriculaService solicitudMatriculaService) {
        this.solicitudMatriculaService = solicitudMatriculaService;
    }

    // Endpoint para obtener todas las solicitudes de matrícula
    @GetMapping("/listar")
    public ResponseEntity<List<SolicitudMatriculaAdicionalDTO>> listarSolicitudesPorId(Long id) {
        List<SolicitudMatriculaAdicionalDTO> solicitudes = solicitudMatriculaService.listarSolicitudesPorId(id);
        return ResponseEntity.ok(solicitudes);
    }

    //! Endpoint para obtener solicitudes del alumno
    @GetMapping("/listarPorPersona")
    public ResponseEntity<List<SolicitudMatriculaAdicionalDTO>> listarSolicitudesPorIdPersona(@RequestParam Long idPersona) {
        List<SolicitudMatriculaAdicionalDTO> solicitudes = solicitudMatriculaService.listarSolicitudesPorIdPersona(idPersona);
        return ResponseEntity.ok(solicitudes);
    }

    /*@PostMapping("/listar")
    public ResponseEntity<List<SolicitudMatricula>> listarSolicitudesPorId(@RequestBody Map<String, Long> request) {
        Long id = request.get("id"); // Extraer id del cuerpo de la solicitud
        List<SolicitudMatricula> solicitudes = solicitudMatriculaService.listarSolicitudesPorId(id);
        return ResponseEntity.ok(solicitudes);
    }*/

    // // Endpoint para guardar una nueva solicitud de matrícula
    // @PostMapping("/insertar")
    // public ResponseEntity<SolicitudMatricula> insertarSolicitudMatricula(@RequestBody SolicitudMatricula solicitudMatricula) {
    //     // Log para registrar los datos entrantes
    //     logger.info("Iniciando inserción de solicitud de matrícula: {}", solicitudMatricula);

    //     // Inserción de la nueva solicitud
    //     SolicitudMatricula nuevaSolicitud = solicitudMatriculaService.insertarSolicitudMatricula(solicitudMatricula);

    //     // Log para registrar el resultado
    //     logger.info("Solicitud de matrícula insertada con éxito: {}", nuevaSolicitud);

    //     // Devolver la respuesta con el estado 201
    //     return ResponseEntity.status(201).body(nuevaSolicitud);
    // }

    @PostMapping("/insertar")
    public ResponseEntity<?> insertarSolicitudMatricula(@RequestBody Map<String, Object> solicitudData) {
        try {
            // Procesar la solicitud general (ahora en la entidad SolicitudMatricula)
            Map<String, Object> solicitudGeneralData = (Map<String, Object>) solicitudData.get("solicitud");

            // Obtener y validar el emisor
            Long emisorId = Long.valueOf(((Map<String, Object>) solicitudGeneralData.get("emisor")).get("id").toString());
            Persona emisor = personaRepository.findById(emisorId)
                .orElseThrow(() -> new RuntimeException("Emisor no encontrado con ID: " + emisorId));

            // Obtener y validar el receptor (si existe)
            Persona receptor = null;
            if (solicitudGeneralData.containsKey("receptor")) {
                Long receptorId = Long.valueOf(((Map<String, Object>) solicitudGeneralData.get("receptor")).get("id").toString());
                receptor = personaRepository.findById(receptorId)
                    .orElseThrow(() -> new RuntimeException("Receptor no encontrado con ID: " + receptorId));
            }

            // Crear una nueva instancia de SolicitudMatricula y asignar los valores de la solicitud general
            SolicitudMatricula solicitudMatricula = new SolicitudMatricula();
            solicitudMatricula.setEmisor(emisor);
            solicitudMatricula.setReceptor(receptor);  // Receptor es opcional
            solicitudMatricula.setCorreo(solicitudGeneralData.get("correo").toString());
            solicitudMatricula.setMotivo(solicitudGeneralData.get("motivo").toString());
            solicitudMatricula.setEstado(EstadoSolicitud.valueOf(solicitudGeneralData.get("estado").toString()));
            solicitudMatricula.setTipo(TipoSolicitud.valueOf(solicitudGeneralData.get("tipo").toString()));

            // Procesar la fecha de creación
            String fechaCreacionString = solicitudGeneralData.get("fechaCreacion").toString();
            Date fechaCreacion = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").parse(fechaCreacionString);
            solicitudMatricula.setFechaCreacion(fechaCreacion);

            // Procesar observación (si existe)
            if (solicitudGeneralData.containsKey("observacion")) {
                solicitudMatricula.setObservacion(solicitudGeneralData.get("observacion").toString());
            }

            // Procesar la solicitud específica de matrícula
            Map<String, Object> solicitudMatriculaData = (Map<String, Object>) solicitudData.get("solicitudMatricula");

            // Asignar los valores específicos de la solicitud de matrícula
            solicitudMatricula.setCodigoAlumno(solicitudMatriculaData.get("codigoAlumno").toString());
            solicitudMatricula.setNombreAlumno(solicitudMatriculaData.get("nombreAlumno").toString());
            solicitudMatricula.setMotivo(solicitudMatriculaData.get("motivoSolicitud").toString());

            // Obtener y validar la especialidad
            Long especialidadId = Long.valueOf(((Map<String, Object>) solicitudMatriculaData.get("especialidad")).get("id").toString());
            Especialidad especialidad = especialidadRepository.findById(especialidadId)
                .orElseThrow(() -> new RuntimeException("Especialidad no encontrada con ID: " + especialidadId));
            solicitudMatricula.setEspecialidad(especialidad);

            // Procesar los horarios solicitados
            List<Map<String, Object>> horariosSolicitadosData = (List<Map<String, Object>>) solicitudMatriculaData.get("horariosSolicitados");
            List<Horario> horariosSolicitados = new ArrayList<>();
            for (Map<String, Object> horarioData : horariosSolicitadosData) {
                Long idHorario = Long.valueOf(horarioData.get("idHorario").toString());
                Horario horario = horarioRepository.findById(idHorario)
                    .orElseThrow(() -> new RuntimeException("Horario no encontrado con ID: " + idHorario));
                horariosSolicitados.add(horario);
            }
            solicitudMatricula.setHorariosSolicitados(horariosSolicitados);

            // Guardar la solicitud completa (SolicitudMatricula)
            solicitudMatriculaService.insertarSolicitudMatricula(solicitudMatricula);

            return ResponseEntity.ok("Solicitud guardada con éxito");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al guardar la solicitud: " + e.getMessage());
        }
    }

    @GetMapping("/obtener/{Id}")
    public Optional<SolicitudMatriculaAdicionalDTO> obtenerPorId(@PathVariable("Id") Long id) {
        Optional<SolicitudMatriculaAdicionalDTO> solicitud = solicitudMatriculaService.obtenerPorId(id);
        if (solicitud.isPresent()) {
            // Log si la solicitud fue encontrada
            return solicitud;
        } else {
            // Log si la solicitud no fue encontrada
            return Optional.empty();
        }
    }
    @PutMapping("/solicitudMatricula/{id}")
    public ResponseEntity<?> actualizarSolicitudMatriculaEstadoYObservacion(
            @PathVariable Long id,
            @RequestParam EstadoSolicitud estado,
            @RequestParam String observacion,
            @RequestBody Map<String, Object> datos) {
    
        Long emisorId = Long.valueOf(datos.get("id").toString());
        List<Long> horariosId = ((List<?>) datos.get("horariosId")).stream()
                .map(horario -> Long.valueOf(horario.toString()))
                .toList();
    
        // Llamar al servicio para registrar horarios
        List<Long> duplicados = solicitudMatriculaService.registrarHorariosParaAlumno(emisorId, horariosId);
    
        // Verificar si hubo duplicados y retornar error
        if (!duplicados.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "mensaje", "Algunos horarios ya estaban registrados.",
                            "duplicados", duplicados
                    ));
        }
    
        // Actualizar solicitud si no hubo duplicados
        SolicitudMatricula solicitudActualizada = solicitudMatriculaService
                .actualizarSolicitudMatricula_Estado_y_Obserbacion(id, estado, observacion);
    
        // Respuesta exitosa
        return ResponseEntity.ok(Map.of(
                "mensaje", "Todos los horarios se registraron correctamente.",
                "solicitudActualizada", solicitudActualizada
        ));
    }
    
    



}
