package pe.edu.pucp.onepucp.institucion.controller;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
 
import pe.edu.pucp.onepucp.institucion.model.Institucion;
import pe.edu.pucp.onepucp.institucion.service.InstitucionService;


@RestController
@RequestMapping("/institucion/institucion")

public class InstitucionController {
     @Autowired
    private InstitucionService institucionService;

    //!Obtener por ID
    @GetMapping("/obtener/{id}")
    public ResponseEntity<Institucion> obtenerInstitucionPorId(@PathVariable Long id) {
        Optional<Institucion> institucion = institucionService.obtenerPorId(id);
        if (institucion.isPresent()) {
            return ResponseEntity.ok(institucion.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
     @PutMapping("actualizar/{id}")
    public ResponseEntity<Institucion> actualizarInstitucion(@PathVariable Long id, @RequestBody Institucion institucionActualizada) {
        Optional<Institucion> institucionExistente = institucionService.obtenerPorId(id);
        if (institucionExistente.isPresent()) {
            institucionActualizada.setIdInstitucion(id);  // Asegurarse de que el ID no cambie
            Institucion actualizada = institucionService.guardar(institucionActualizada);
            return ResponseEntity.ok(actualizada);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

}
