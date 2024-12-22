// SolicitudInfoAlumnoEnRiesgoController.java
package pe.edu.pucp.onepucp.solicitudes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import pe.edu.pucp.onepucp.rrhh.model.AlumnoEnRiesgo_X_Horario;
import pe.edu.pucp.onepucp.solicitudes.dto.SolicitudInfoAlumnoEnRiesgoDTO;
import pe.edu.pucp.onepucp.solicitudes.dto.SolicitudInfoAlumnoEnRiesgoFullDTO;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudInfoAlumnoEnRiesgo;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudInformacionAlumnosEnRiesgo;
import pe.edu.pucp.onepucp.solicitudes.service.SolicitudInfoAlumnoEnRiesgoService;

import java.util.List;

@RestController
@RequestMapping("/solicitudes/infoAlumnosEnRiesgo")
public class SolicitudInfoAlumnoEnRiesgoController {

    @Autowired
    private SolicitudInfoAlumnoEnRiesgoService solicitudService;

    @PostMapping("/crearSolicitudInfoAlumnoEnRiesgo")
    public ResponseEntity<List<SolicitudInfoAlumnoEnRiesgoDTO>> crearSolicitudes(@RequestBody List<Long> idsAlumnoEnRiesgoXHorario) {
        List<SolicitudInfoAlumnoEnRiesgoDTO> solicitudes = solicitudService.crearSolicitudes(idsAlumnoEnRiesgoXHorario);
        return ResponseEntity.ok(solicitudes);
    }

    // Endpoint para actualizar una solicitud existente
    @PutMapping("/actualizarSolicitud")
    public ResponseEntity<SolicitudInfoAlumnoEnRiesgoDTO> actualizarSolicitud(
            @RequestParam Long idSolicitud,
            @RequestParam Long puntaje,
            @RequestParam String comentario) {
        SolicitudInfoAlumnoEnRiesgoDTO solicitudActualizada = solicitudService.actualizarSolicitud(idSolicitud, puntaje, comentario);
        return ResponseEntity.ok(solicitudActualizada);
    }

    // Endpoint para idAlumnoXHorario
    @GetMapping("/listarSolicitudesPorAlumnoEnRiesgoXHorario")
    public ResponseEntity<List<SolicitudInfoAlumnoEnRiesgoDTO>> listarSolicitudesPorAlumnoEnRiesgoXHorario(
            @RequestParam Long idAluxhor) {
        List<SolicitudInfoAlumnoEnRiesgoDTO> solicitudes = solicitudService.listarSolicitudesPorAlumnoEnRiesgoXHorario(idAluxhor);
        return ResponseEntity.ok(solicitudes);
    }

    // Endpoint para listar historial de solicitudes de un alumno en riesgo en un horario/curso específico
    @GetMapping("/listarSolicitudesPorAlumnoYHorario")
    public ResponseEntity<List<SolicitudInfoAlumnoEnRiesgo>> listarSolicitudesPorAlumnoYHorario(
            @RequestParam Long alumnoId,
            @RequestParam Long horarioId) {
        List<SolicitudInfoAlumnoEnRiesgo> solicitudes = solicitudService.listarSolicitudesPorAlumnoYHorario(alumnoId, horarioId);
        return ResponseEntity.ok(solicitudes);
    }

    // Endpoint para listar todos los alumnos en riesgo con puntajes
    @GetMapping("/listarAlumnosEnRiesgoConPuntajes")
    public ResponseEntity<List<AlumnoEnRiesgo_X_Horario>> listarAlumnosEnRiesgoConPuntajes() {
        List<AlumnoEnRiesgo_X_Horario> alumnosEnRiesgo = solicitudService.listarAlumnosEnRiesgoConPuntajes();
        return ResponseEntity.ok(alumnosEnRiesgo);
    }

    // Endpoint para obtener una solicitud de informacion
    @GetMapping("/obtenerInformacion")
    public ResponseEntity<SolicitudInfoAlumnoEnRiesgoDTO> obtenerInformacion(@RequestParam Long solicitudId) {
        SolicitudInfoAlumnoEnRiesgoDTO unaSolicitud = solicitudService.obtenerInformacion(solicitudId);
        return ResponseEntity.ok(unaSolicitud);
    }

    // Endpoint para obtener una listar de solicitudes de informacion incluido el DTO de AlumnoEnRiesgo_X_Horario
    @GetMapping("/listarInformacionFull")
    public ResponseEntity<List<SolicitudInfoAlumnoEnRiesgoFullDTO>> obtenerInformacionFull() {
        List<SolicitudInfoAlumnoEnRiesgoFullDTO> listado = solicitudService.listarInformacionFull();
        return ResponseEntity.ok(listado);
    }
    // Endpoint para obtener una listar de solicitudes de informacion incluido el DTO de AlumnoEnRiesgo_X_Horario
    @GetMapping("/listarInformacionxAlumnoFull")
    public ResponseEntity<List<SolicitudInfoAlumnoEnRiesgoFullDTO>> listarInformacionxAlumnoFull(@RequestParam Long idAluxhor) {
        List<SolicitudInfoAlumnoEnRiesgoFullDTO> listado = solicitudService.listarInformacionxAlumnoFull(idAluxhor);
        return ResponseEntity.ok(listado);
    }
    // Endpoint para obtener una solicitud de informacion
    @GetMapping("/obtenerInformacionFull")
    public ResponseEntity<SolicitudInfoAlumnoEnRiesgoFullDTO> listarInformacionFull(@RequestParam Long solicitudId) {
        SolicitudInfoAlumnoEnRiesgoFullDTO unaSolicitud = solicitudService.obtenerInformacionFull(solicitudId);
        return ResponseEntity.ok(unaSolicitud);
    }

    // Endpoint para obtener una solicitud de informacion
    @PutMapping("/revisionSolicitud")
    public Boolean revisionSolicitud(@RequestParam Long idSolicitud, @RequestParam Boolean leido) {
        Boolean actualizado = solicitudService.revisionSolicitud(idSolicitud, leido);
        return actualizado;
    }

    /* Listar por Docente
    @GetMapping("/listar/{idDocente}")
    public ResponseEntity<List<SolicitudInformacionAlumnosEnRiesgo>> listarSolicitudesPorIdDocente(@PathVariable Long idDocente) {
        List<SolicitudInformacionAlumnosEnRiesgo> solicitudInformacionAlumnosEnRiesgos =
                service.listarSolicitudesPorIdDocente(idDocente);
        if (solicitudInformacionAlumnosEnRiesgos.isEmpty()) {
            return ResponseEntity.noContent().build();  // Si no hay solicitudes, responde con 204 No Content
        }
        return ResponseEntity.ok(solicitudInformacionAlumnosEnRiesgos);  // Responde 200 OK con la lista de solicitudes
    } */
}