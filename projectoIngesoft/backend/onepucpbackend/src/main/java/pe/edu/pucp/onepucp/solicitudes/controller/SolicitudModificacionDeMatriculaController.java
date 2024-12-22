package pe.edu.pucp.onepucp.solicitudes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudModificacionDeMatricula;
import pe.edu.pucp.onepucp.solicitudes.service.SolicitudModificacionDeMatriculaService;

import pe.edu.pucp.onepucp.solicitudes.dto.solicitudModificacionDeMatriculaDTO;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/solicitudes/modificacion")
public class SolicitudModificacionDeMatriculaController {

    @Autowired
    private SolicitudModificacionDeMatriculaService service;

    @GetMapping("/listar")
    public ResponseEntity<List<SolicitudModificacionDeMatricula>> getAllSolicitudes() {
        return ResponseEntity.ok(service.findAll());
    }
    @GetMapping("/obtenerPorId/{id}")
    public ResponseEntity<solicitudModificacionDeMatriculaDTO> obtenerSolicitudPorId(@PathVariable Long id) {
    try {
        Optional<SolicitudModificacionDeMatricula> solicitudOpt = service.findById(id);

        if (solicitudOpt.isPresent()) {
            SolicitudModificacionDeMatricula solicitud = solicitudOpt.get();
            solicitudModificacionDeMatriculaDTO dto = service.convertirAFormatoDTO(solicitud);
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
}



    @PutMapping("/actualizar/{id}")
    public ResponseEntity<String> actualizarSolicitud(@PathVariable Long id, @RequestBody solicitudModificacionDeMatriculaDTO solicitudDTO) {
    try {
        service.updateSolicitud(id, solicitudDTO);
        return ResponseEntity.ok("Solicitud actualizada exitosamente");
    } catch (RuntimeException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al actualizar la solicitud: " + e.getMessage());
    }
}


    @PostMapping("/crear")
    public ResponseEntity<String> crearSolicitud(@RequestBody solicitudModificacionDeMatriculaDTO solicitudDTO) {
        try {
            service.createSolicitud(solicitudDTO);
            return ResponseEntity.ok("Solicitud creada exitosamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al crear la solicitud: " + e.getMessage());
        }
    }

    @GetMapping("/todas")
    public List<solicitudModificacionDeMatriculaDTO> obtenerTodasLasSolicitudes() {
        // Devuelve la lista de solicitudes como DTOs
        return service.obtenerTodasLasSolicitudes();
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSolicitud(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/listarPorEmisor")
    public ResponseEntity<List<solicitudModificacionDeMatriculaDTO>> listarSolicitudesPorIdEmisor(@RequestParam Long idEmisor) {
        try {
            List<solicitudModificacionDeMatriculaDTO> solicitudes = service.obtenerSolicitudesPorIdEmisor(idEmisor);
            return ResponseEntity.ok(solicitudes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @GetMapping("/obtenerPorEspecialidad/{especialidadId}")
    public ResponseEntity<List<solicitudModificacionDeMatriculaDTO>> listarPorEspecialidad(@PathVariable Long especialidadId) {
    try {
        List<solicitudModificacionDeMatriculaDTO> solicitudes =
                service.obtenerSolicitudesPorEspecialidad(especialidadId);

        if (solicitudes.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        return ResponseEntity.ok(solicitudes);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }


}

}

