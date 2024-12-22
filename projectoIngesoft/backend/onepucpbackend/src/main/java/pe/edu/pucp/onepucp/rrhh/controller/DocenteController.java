package pe.edu.pucp.onepucp.rrhh.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import pe.edu.pucp.onepucp.rrhh.dto.DocenteDTO;
import pe.edu.pucp.onepucp.rrhh.model.Docente;
import pe.edu.pucp.onepucp.rrhh.model.Persona;
import pe.edu.pucp.onepucp.rrhh.service.DocenteService;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/rrhh/docente")
public class DocenteController {
    @Autowired
   private DocenteService service;
    @GetMapping("/listar")
    public List<DocenteDTO> listarDocente() {
        //logger.info("Listando todas las personas...");
        List<DocenteDTO> docentes = service.obtenerTodosLosDocentes();
       // logger.info("Se encontraron {} personas", personas.size()); // Log con el tamaño de la lista
        return docentes;
    }
    @GetMapping("/buscarPorParametros")
    public ResponseEntity<?> buscarDocentes(
            @RequestParam(required = false) String apellidoPaterno,
            @RequestParam(required = false) String apellidoMaterno,
            @RequestParam(required = false) String nombres,
            @RequestParam(required = false) Integer codigo) {

        try {
            // Realizar la búsqueda
            List<DocenteDTO> docentes = service.buscarDocentesPorCriterios(
                    apellidoPaterno,
                    apellidoMaterno,
                    nombres,
                    codigo
            );

            // Si no se encuentran docentes, devolver un 404
            if (docentes.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontraron docentes con los criterios proporcionados.");
            }

            // Devolver la lista de docentes encontrados
            return ResponseEntity.ok(docentes);

        } catch (Exception e) {
            // Cualquier otro error inesperado, devolver un 500
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno del servidor.");
        }
    }

    @GetMapping("/buscarPorId/{idDocente}")
    public ResponseEntity<DocenteDTO> buscarDocente(@PathVariable Long idDocente) {
        // Buscar docente usando el servicio
        DocenteDTO docente = service.obtenerDocentePorId(idDocente);
        
        if (docente == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Devuelve 404 si no hay resultados
        }
        
        return ResponseEntity.ok(docente); // Devuelve 200 y la lista de alumnos
    }
}
