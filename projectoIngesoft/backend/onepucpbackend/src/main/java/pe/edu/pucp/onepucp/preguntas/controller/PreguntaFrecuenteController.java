package pe.edu.pucp.onepucp.preguntas.controller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import pe.edu.pucp.onepucp.preguntas.model.PreguntaFrecuente;
import pe.edu.pucp.onepucp.preguntas.service.PreguntaFrecuenteService;
import pe.edu.pucp.onepucp.preguntas.service.PreguntaService;

import java.util.List;

@RestController
@RequestMapping("/preguntas/preguntasFrecuentes")
public class PreguntaFrecuenteController {
    private static final Logger logger = LoggerFactory.getLogger(PreguntaControler.class);

    @Autowired
    PreguntaFrecuenteService preguntaFrecuenteService;
    // Crear una nueva PreguntaFrecuente
    @PostMapping("/insertar")
    public void guardarPreguntaFrecuente(@RequestBody PreguntaFrecuente preguntaFrecuente) {
        preguntaFrecuenteService.guardarPreguntaFrecuente(preguntaFrecuente);
    }

    // Actualizar una PreguntaFrecuente existente
    @PutMapping("/actualizar/{id}")
    public void actualizarPreguntaFrecuente(@PathVariable Long id, @RequestBody PreguntaFrecuente preguntaActualizada) {
        preguntaFrecuenteService.actualizarPreguntaFrecuente(id, preguntaActualizada);
    }

    // Eliminar lógicamente una PreguntaFrecuente
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<String> eliminarPreguntaFrecuente(@PathVariable Long id) {
        boolean eliminado = preguntaFrecuenteService.eliminar(id);
        if (eliminado) {
            return ResponseEntity.ok("Pregunta frecuente eliminada");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Buscar PreguntaFrecuente por nombre (solo activas)
    @GetMapping("/listarPorNombre")
    public ResponseEntity<List<PreguntaFrecuente>> buscarPorNombre(@RequestParam String nombre) {
        List<PreguntaFrecuente> preguntas = preguntaFrecuenteService.buscarPorNombre(nombre);
        return ResponseEntity.ok(preguntas);
    }

    // Listar todas las PreguntasFrecuentes activas
    @GetMapping("/listar")
    public ResponseEntity<List<PreguntaFrecuente>> listarTodasLasPreguntas() {
        List<PreguntaFrecuente> preguntasActivas = preguntaFrecuenteService.listarTodasPreguntasFrecuentes();
        return ResponseEntity.ok(preguntasActivas);
    }

    @PutMapping("/responder/{id}")
    public void responderPreguntaFrecuente(@PathVariable Long id, @RequestBody String respuesta) {
        preguntaFrecuenteService.responderPreguntaFrecuente(id, respuesta);
    }
}
