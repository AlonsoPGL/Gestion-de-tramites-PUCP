package pe.edu.pucp.onepucp.preguntas.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import pe.edu.pucp.onepucp.institucion.dto.PlanDeEstudioDTO;
import pe.edu.pucp.onepucp.preguntas.DTO.EncuestaDTO;
import pe.edu.pucp.onepucp.preguntas.model.Encuesta;
import pe.edu.pucp.onepucp.preguntas.model.TipoEncuesta;
import pe.edu.pucp.onepucp.preguntas.service.EncuestaService;

@RestController
@RequestMapping("/preguntas/encuesta")
public class EncuestaControler {
    @Autowired
    EncuestaService encuestaService;
    private static final Logger logger = LoggerFactory.getLogger(PreguntaControler.class);

    private  ModelMapper modelMapper;

    @PostMapping("/insertar")
    public Encuesta insertarEncuesta(@RequestBody EncuestaDTO encuesta) {
        logger.info("Iniciando inserción de la encuesta : {} ", encuesta.getTitulo());
        Encuesta nuevaEncuesta = encuestaService.crearEncuesta(encuesta);
        logger.info("Encuesta {} insertada con exito:", nuevaEncuesta.getId_Encuesta()); // Log de éxito
        return nuevaEncuesta;
    }

    @PostMapping("/insertarJP")
    public Encuesta insertarEncuestaJP(@RequestBody EncuestaDTO encuesta) {
        logger.info("Iniciando inserción de la encuesta : {} ", encuesta.getTitulo());
        Encuesta nuevaEncuesta = encuestaService.crearEncuestaJP(encuesta);
        logger.info("Encuesta {} insertada con exito:", nuevaEncuesta.getId_Encuesta()); // Log de éxito
        return nuevaEncuesta;
    }

    @GetMapping("/listar")
    public ArrayList<Encuesta> listarEncuestas() {
        logger.info("Listando todas las encuestas...");
        ArrayList<Encuesta> encuestas = encuestaService.obtenerTodasEncuestas();
        logger.info("Se encontraron {}  encuestas", encuestas.size()); // Log con el tamaño de la lista
        return encuestas;
    }

    @GetMapping("/listarPaginacion")
    public ResponseEntity<Page<EncuestaDTO>> listarEncuestasPaginacion(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam TipoEncuesta tipo) { // Agrega este parámetro
        modelMapper = new ModelMapper();
        logger.info("Listando todas las encuestas activas de tipo {} en la página: {}, tamaño: {}", tipo, page, size);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("idEncuesta").descending());
        
        Page<Encuesta> encuestaPage = encuestaService.obtenerEncuestasPaginadasPorTipo(tipo, pageable);
        Page<EncuestaDTO> encuestaDTO = encuestaPage.map(encuesta -> modelMapper.map(encuesta, EncuestaDTO.class));
        return ResponseEntity.ok(encuestaDTO);
    }

    @GetMapping("/listarJP")
    public ArrayList<Encuesta> listarEncuestasJP() {
        logger.info("Listando todas las encuestas de JP...");
        ArrayList<Encuesta> encuestas = encuestaService.obtenerTodasEncuestasJP();
        logger.info("Se encontraron {}  encuestas", encuestas.size()); // Log con el tamaño de la lista
        return encuestas;
    }

    @DeleteMapping("/eliminar/{id}")
    public String eliminarEncuesta(@PathVariable Long id) {
        logger.info("Iniciando eliminación de encuesta con id: {}", id);

        boolean eliminado = encuestaService.eliminarEncuesta(id);
        if (eliminado) {
            logger.info("Encuesta con id {} eliminada con éxito", id);
            return "Encuesta eliminada con éxito";
        } else {
            logger.error("Error al eliminar la Encuesta con id {}", id); // Log de error
            return "Error al eliminar la Encuesta o no existe";
        }
    }
    @PutMapping("/actualizar/{id}") //OJO CON EL REQUESTBODY
    public Encuesta actualizarPersona(@PathVariable Long id, @RequestBody EncuestaDTO encuestaActualizada) {
        logger.info("Iniciando actualización de encuesta con id: {}", id);
        
        Encuesta encuesta = encuestaService.actualizarEncuesta(id, encuestaActualizada);
        
        if (encuesta != null) {
            logger.info("Encuesta con id {} actualizada con éxito", id);
        } else {
            logger.error("Error al actualizar la encuesta con id {}", id); // Log de error si falla
        }
        return encuesta;
    }

    /* 
    @PostMapping("/asignarEncuestaDocenteHorarios/{idEncuesta}")
    public ResponseEntity<String> asignarEncuestaDocenteHorarios(@PathVariable Long idEncuesta) {
    try {
        encuestaService.asignarEncuestaDocenteHorarios(idEncuesta);
        return ResponseEntity.ok("Encuesta Docente asignada a todos los horarios de la facultad exitosamente");
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
    }   


    @PostMapping("/asignarEncuestaJpHorarios/{idEncuesta}")
    public ResponseEntity<String> asignarEncuestaJpHorarios(@PathVariable Long idEncuesta) {
    try {
        encuestaService.asignarEncuestaJPHorarios(idEncuesta);
        return ResponseEntity.ok("Encuesta JP asignada a todos los horarios de la facultad exitosamente");
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
    }

    */



    //OPTIMIZAR ESTA FUNCION SE ESTAN PASANDO PREGUNTAS INECESARIAMENTE
    @GetMapping("/listarEncuestasProfesor/{idProfe}")
    public ResponseEntity<List<Encuesta>> obtenerEncuestasProfesor(@PathVariable Long idProfe) {
        List<Encuesta> encuestas = encuestaService.obtenerEncuestasProfesor(idProfe);
        
        if (encuestas.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(encuestas);
        }
        
        return ResponseEntity.ok(encuestas);
    }  


    @GetMapping("/listarEncuestasJP/{idJpe}")
    public ResponseEntity<List<Encuesta>> obtenerEncuestasJp(@PathVariable Long idJpe) {
        List<Encuesta> encuestas = encuestaService.obtenerEncuestasJp(idJpe);
        
        if (encuestas.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(encuestas);
        }
        
        return ResponseEntity.ok(encuestas);
    }  

    @PostMapping("/asignarHorariosEncuestaDocente")
    public void asignarEncuestaDocente(@RequestBody Long encuesta) {
        logger.info("Iniciando inserción de la encuesta : {} ", encuesta);
        encuestaService.asignarEncuestaDocenteHorarios(encuesta);
        logger.info("Encuesta {} asignada con exito:", encuesta); // Log de éxito
    }

    @PostMapping("/asignarHorariosEncuestaJP")
    public void asignarEncuestaJp(@RequestBody Long encuesta) {
        logger.info("Iniciando inserción de la encuesta : {} ", encuesta);
        encuestaService.asignarEncuestaJPHorarios(encuesta);
        logger.info("Encuesta {} asignada con exito:", encuesta); // Log de éxito
    }

    @PostMapping("/verificarAsignaciones")
    public ResponseEntity<Map<Long, Boolean>> verificarAsignaciones(@RequestBody List<Long> encuestaIds) {
        Map<Long, Boolean> resultado = encuestaService.verificarAsignaciones(encuestaIds);
        return ResponseEntity.ok(resultado);
    }

    @PostMapping("/verificarAsignacionesJP")
    public ResponseEntity<Map<Long, Boolean>> verificarAsignacionesJP(@RequestBody List<Long> encuestaIds) {
        Map<Long, Boolean> resultado = encuestaService.verificarAsignacionesJP(encuestaIds);
        return ResponseEntity.ok(resultado);
    }
}