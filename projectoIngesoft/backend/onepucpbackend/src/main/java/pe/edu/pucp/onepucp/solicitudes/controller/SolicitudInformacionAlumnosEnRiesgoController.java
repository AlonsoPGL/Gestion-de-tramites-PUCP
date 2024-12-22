package pe.edu.pucp.onepucp.solicitudes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudCartaPresentacion;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudInformacionAlumnosEnRiesgo;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudJurados;
import pe.edu.pucp.onepucp.solicitudes.service.SolicitudInformacionAlumnosEnRiesgoService;

import java.util.List;

@RestController
@RequestMapping("/solicitudes/informacionAlumnosEnRiesgo")
public class SolicitudInformacionAlumnosEnRiesgoController {
    @Autowired
    private SolicitudInformacionAlumnosEnRiesgoService service;

    @GetMapping("/listar/{idDocente}")
    public ResponseEntity<List<SolicitudInformacionAlumnosEnRiesgo>> listarSolicitudesPorIdDocente(@PathVariable Long idDocente) {
        List<SolicitudInformacionAlumnosEnRiesgo> solicitudInformacionAlumnosEnRiesgos =
                service.listarSolicitudesPorIdDocente(idDocente);
        if (solicitudInformacionAlumnosEnRiesgos.isEmpty()) {
            return ResponseEntity.noContent().build();  // Si no hay solicitudes, responde con 204 No Content
        }
        return ResponseEntity.ok(solicitudInformacionAlumnosEnRiesgos);  // Responde 200 OK con la lista de solicitudes
    }
    @PostMapping("/insertar")
    public ResponseEntity<SolicitudInformacionAlumnosEnRiesgo> insertarSolicitudDeAlumnoEnRiesgo(
            @RequestBody SolicitudInformacionAlumnosEnRiesgo solicitud) {

        // Guardar o actualizar la solicitud. Si el ID existe, actualiza, si no, crea una nueva.
        SolicitudInformacionAlumnosEnRiesgo solicitudGuardada = service.guardarSolicitud(solicitud);

        return ResponseEntity.ok(solicitudGuardada);  // Responder con 200 OK y la solicitud guardada o actualizada
    }

    @PostMapping("/actualizar")
    public ResponseEntity<?> actualizarSolicitudDeAlumnoEnRiesgo(@RequestBody SolicitudInformacionAlumnosEnRiesgo solicitudInformacionAlumnosEnRiesgo) {
        SolicitudInformacionAlumnosEnRiesgo solicitud = service.guardarSolicitud(solicitudInformacionAlumnosEnRiesgo);


        // Si se actualizó una solicitud existente
        return ResponseEntity.status(HttpStatus.OK).build();
    }



    
}
