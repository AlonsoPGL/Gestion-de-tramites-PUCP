package pe.edu.pucp.onepucp.solicitudes.controller;
import org.springframework.web.bind.annotation.RestController;

import pe.edu.pucp.onepucp.solicitudes.dto.ComentarioTesisDTO;
import pe.edu.pucp.onepucp.solicitudes.model.ComentarioTesis;
import pe.edu.pucp.onepucp.solicitudes.repository.ComentarioTesisRepository;
import pe.edu.pucp.onepucp.solicitudes.service.ComentarioTesisService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import java.util.List;
@RestController
@RequestMapping("/solicitudes/comentarios")
public class ComentarioTesisController {
    @Autowired
    private ComentarioTesisService comentarioTesisService;


    @GetMapping("/buscar/{solicitudId}")
    public ResponseEntity<List<ComentarioTesisDTO>> listarComentariosPorSolicitud(@PathVariable Long solicitudId) {
        List<ComentarioTesisDTO> comentarios = comentarioTesisService.listarComentariosPorSolicitud(solicitudId);
        if (comentarios.isEmpty()) {
            return ResponseEntity.noContent().build(); // 204 No Content si no hay comentarios
        }
       
        return ResponseEntity.ok(comentarios); // 200 OK con los comentarios
    }


    @PostMapping("/insertar")
    public ResponseEntity<ComentarioTesis> insertarComentario(@RequestBody ComentarioTesisDTO comentario) {
        try {
            // Lógica para insertar el comentario
            ComentarioTesis nuevoComentario = comentarioTesisService.crearComentario(comentario);
            return ResponseEntity.ok(nuevoComentario);
        } catch (Exception e) {
            // Manejo de errores (puedes personalizar el mensaje de error)
            return ResponseEntity.status(500).body(null); // o ResponseEntity.badRequest().body(null);
        }
    }
}
