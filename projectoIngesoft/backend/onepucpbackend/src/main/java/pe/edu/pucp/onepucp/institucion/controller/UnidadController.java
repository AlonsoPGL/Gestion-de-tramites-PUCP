package pe.edu.pucp.onepucp.institucion.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import pe.edu.pucp.onepucp.institucion.model.TipoUnidad;
import pe.edu.pucp.onepucp.institucion.service.UnidadService;



@RestController
@RequestMapping("/gestionUnidad/unidad")
public class UnidadController {

    @Autowired
    UnidadService serviceUnidad;

    public UnidadController(UnidadService serviceUnidad) {
        this.serviceUnidad = serviceUnidad;
    }

    @GetMapping("/listarUnidadSeleccionada")
    public ResponseEntity<List<?>> listarUnidadesPorTipo(@RequestParam("tipo") TipoUnidad tipoUnidad) {
        List<?> unidades = serviceUnidad.listarUnidadesPorTipo(tipoUnidad);
        return ResponseEntity.ok(unidades);
    }
}
