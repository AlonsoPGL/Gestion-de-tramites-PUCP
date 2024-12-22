package pe.edu.pucp.onepucp.institucion.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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

import pe.edu.pucp.onepucp.institucion.dto.CursoDTO;
import pe.edu.pucp.onepucp.institucion.model.Curso;
import pe.edu.pucp.onepucp.institucion.service.CursoService;

@RestController
@RequestMapping("/institucion/curso")
public class CursoController {

    @Autowired
    CursoService service;

    // Insertar Curso
    @PostMapping("/insertar")
    public ResponseEntity<CursoDTO> insertarCurso(@RequestBody CursoDTO cursoDTO) {
        try {
            CursoDTO cursoInsertado = service.insertarCurso(cursoDTO);
            return ResponseEntity.ok(cursoInsertado);  // Retorna el curso insertado
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();  // En caso de error con los datos
        }
    }

    // Actualizar Curso
    @PutMapping("/actualizar/{idCurso}")
    public ResponseEntity<Object> actualizarCurso(
            @PathVariable Long idCurso,
            @RequestBody CursoDTO cursoDTO) {
        try {
            CursoDTO cursoActualizado = service.actualizarCursoParcial(idCurso, cursoDTO);
            return ResponseEntity.ok(cursoActualizado);  // Retorna el curso actualizado
        } catch (RuntimeException e) {  // Puedes capturar una RuntimeException si el curso no es encontrado
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Curso no encontrado");
            errorResponse.put("message", "No se encontró un curso con el ID proporcionado");

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);  // Respuesta con 404 y cuerpo JSON
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error interno");
            errorResponse.put("message", "Ocurrió un error inesperado en el servidor");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);  // Respuesta con 500 y cuerpo JSON
        }
    }

    // Soft Delete: Marcar como Inactivo
    @DeleteMapping("/eliminar/{idCurso}")
    public ResponseEntity<Void> eliminarCurso(@PathVariable Long idCurso) {
        try {
            service.eliminarCurso(idCurso);  // Marca el curso como inactivo
            return ResponseEntity.noContent().build();  // Retorna 204 (sin contenido)
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();  // Si no se encuentra el curso
        }
    }

    // Endpoint para buscar cursos por código, nombre y facultad
    @GetMapping("/buscarPorCodigoNombreFacultad")
    public ResponseEntity<?> buscarPorCodigoNombreYFacultad(
            @RequestParam String codigo,
            @RequestParam String nombre,
            @RequestParam String facultad) {
        List<CursoDTO> cursos = service.getCursoDTOByCodigoNombreAndFacultad(codigo, nombre, facultad);

        if (cursos.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontraron cursos con el código: " + codigo + ", nombre: " + nombre + " y facultad: " + facultad);
        }

        return ResponseEntity.ok(cursos);
    }

    @GetMapping("/buscarCursoNombreCodigoFacultad")
    public List<CursoDTO> buscarCursosNombreCodigoFacultad(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String codigo,
            @RequestParam(required = false) String nombreFacultad) {
        return service.buscarCursosNombreCodigoFacultad(nombre, codigo, nombreFacultad);
    }

    @GetMapping("/listar")
    public Page<CursoDTO> listarCursos(@RequestParam(defaultValue = "0") int page, // Página por defecto 0
            @RequestParam(defaultValue = "4") int size) {
        //logger.info("Listando todas las personas...");
        Pageable pageable = PageRequest.of(page, size);
        Page<CursoDTO> cursos = service.obtenerTodasLosCursos(pageable);
        //logger.info("Se encontraron {} personas", personas.size()); // Log con el tamaño de la lista
        return cursos;
    }

    // Endpoint para obtener cursos por especialidad y semestre
    @GetMapping("/buscarPorEspecialidadSemestre")
    public ResponseEntity<?> buscarPorEspecialidadYSemestre(
            @RequestParam String especialidad,
            @RequestParam String semestre) {
        // Llamar al repositorio para obtener los cursos
        List<CursoDTO> cursos = service.buscarPorEspecialidadYSemestre(especialidad, semestre);
        if (cursos.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontraron cursos para este semestre y especialidad");
        }

        return ResponseEntity.ok(cursos);
    }
    @GetMapping("/buscarPorEspecialidad")
    public ResponseEntity<?> buscarPorEspecialidad(
            @RequestParam String especialidad
    ){
        List<CursoDTO> cursos = service.buscarEspecialidad(especialidad);
        if(cursos.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontraron cursos para esta especialidad");
        }
        return ResponseEntity.ok(cursos);
    }
    //http://localhost:8080/institucion/curso/existePorCodigo?codigo=CS101
    //!EXISTE
    @GetMapping("/existePorCodigo")
    public ResponseEntity<?> existePorCodigo(@RequestParam String codigo) {
        boolean existe = service.existePorCodigo(codigo);
        return ResponseEntity.ok(existe);
    }
}
