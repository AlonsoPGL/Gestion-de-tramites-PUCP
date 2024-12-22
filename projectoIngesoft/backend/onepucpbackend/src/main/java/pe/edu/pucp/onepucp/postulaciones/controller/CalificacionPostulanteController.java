package pe.edu.pucp.onepucp.postulaciones.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pe.edu.pucp.onepucp.postulaciones.model.CalificacionPostulante;
import pe.edu.pucp.onepucp.postulaciones.service.CalificacionPostulanteService;

@RestController
@RequestMapping("/calificaciones")
public class CalificacionPostulanteController {

    @Autowired
    private CalificacionPostulanteService calificacionPostulanteService;

    // Endpoint para registrar una lista de calificaciones
    @PostMapping("/registrarListado")
    public ResponseEntity<List<CalificacionPostulante>> registrarCalificaciones(@RequestBody List<CalificacionPostulante> calificaciones) {
        List<CalificacionPostulante> calificacionesGuardadas = calificacionPostulanteService.registrarCalificaciones(calificaciones);
        return ResponseEntity.ok(calificacionesGuardadas);
    }

    @GetMapping("/listarPorPostulacion/{idPostulacion}")
    public ResponseEntity<List<CalificacionPostulante>> listarCalificacionesPorPostulacion(@PathVariable Long idPostulacion) {
        List<CalificacionPostulante> calificaciones = calificacionPostulanteService.listarCalificacionesPorPostulacion(idPostulacion);
        return ResponseEntity.ok(calificaciones);
    }
}

