package pe.edu.pucp.onepucp.preguntas.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import pe.edu.pucp.onepucp.preguntas.model.Encuesta;
import pe.edu.pucp.onepucp.preguntas.model.Pregunta;
import pe.edu.pucp.onepucp.preguntas.model.RespuestasTxt_X_Docente;
import pe.edu.pucp.onepucp.preguntas.model.RespuestasTxt_X_JP;
import pe.edu.pucp.onepucp.preguntas.service.PreguntaService;

@RestController
@RequestMapping("/preguntas/pregunta")

public class PreguntaControler {

    // Declaramos el logger
    private static final Logger logger = LoggerFactory.getLogger(PreguntaControler.class);

    @Autowired
    PreguntaService preguntaService;

    @PostMapping("/insertar")
    public Pregunta insertarPregunta(@RequestBody Pregunta pregunta) {
        logger.info("Iniciando inserción de la pregunta de la encuesta: {} ", pregunta.getEncuesta().getId_Encuesta());

        Pregunta nuevaPregunta = preguntaService.crearPregunta(pregunta);

        logger.info("pregunta de la encuesta {} insertada con éxito:", nuevaPregunta.getEncuesta().getId_Encuesta()); // Log de éxito
        return nuevaPregunta;
    }

    @GetMapping("/listarPreguntas/{idEncuesta}")
    public ResponseEntity<List<Pregunta>> obtenerPreguntasPorIdEncuesta(@PathVariable Long idEncuesta) {
        List<Pregunta> preguntas = preguntaService.obtenerPreguntasPorIdEncuesta(idEncuesta);

        if (preguntas.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(preguntas);
        }

        return ResponseEntity.ok(preguntas);
    }

    @PostMapping("/insertarRespuestaDocente")
    public void insertarRespuestaDocente(@RequestParam Long preguntaId, @RequestParam Long docenteId, @RequestBody String respuesta) {
        preguntaService.insertarRespuestaDocente(preguntaId, docenteId, respuesta);
    }

    @PostMapping("/insertarRespuestaJP")
    public void insertarRespuestaJp(@RequestParam Long preguntaId, @RequestParam Long jpId, @RequestBody String respuesta) {
        preguntaService.insertarRespuestaJP(preguntaId, jpId, respuesta);
    }

    @GetMapping("/listarTodasLasRespuestasDocente/{idProfe}/{idencuesta}")
    public ResponseEntity<List<RespuestasTxt_X_Docente>> obtenerRespuestasProfesor(@PathVariable Long idProfe, @PathVariable Long idencuesta) {
        List<RespuestasTxt_X_Docente> respuestas = preguntaService.obtenerRespuestasProfesor(idProfe,idencuesta);
        
        if (respuestas.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuestas);
        }
        
        return ResponseEntity.ok(respuestas);
    }  

    @GetMapping("/listarTodasLasRespuestasJp/{idJp}/{idencuesta}")
    public ResponseEntity<List<RespuestasTxt_X_JP>> obtenerRespuestasJP(@PathVariable Long idJp, @PathVariable Long idencuesta) {
        List<RespuestasTxt_X_JP> respuestas = preguntaService.obtenerRespuestasJP(idJp,idencuesta);
        
        if (respuestas.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuestas);
        }
        
        return ResponseEntity.ok(respuestas);
    } 


   


}
