package pe.edu.pucp.onepucp.postulaciones.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pe.edu.pucp.onepucp.postulaciones.model.CriterioSeleccion;
import pe.edu.pucp.onepucp.postulaciones.service.CriterioSeleccionService;

import java.util.List;

@RestController
@RequestMapping("/criterios")
public class CriterioSeleccionController {

    @Autowired
    private CriterioSeleccionService criterioSeleccionService;

    @GetMapping("/proceso-activo")
    public ResponseEntity<List<CriterioSeleccion>> obtenerCriteriosPorProcesoActivo() {
        List<CriterioSeleccion> criterios = criterioSeleccionService.obtenerCriteriosPorProcesoActivo();

        if (criterios.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(criterios);
    }
    @PostMapping("/insertar")
    public ResponseEntity<?> insertarCriterioSeleccion(@RequestParam Long id, @RequestBody CriterioSeleccion criterioSeleccion){
        criterioSeleccionService.guardarCriterioSeleccion(id,criterioSeleccion);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}