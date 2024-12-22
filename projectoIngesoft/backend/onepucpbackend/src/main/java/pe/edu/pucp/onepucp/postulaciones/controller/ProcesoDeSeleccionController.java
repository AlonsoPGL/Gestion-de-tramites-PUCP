package pe.edu.pucp.onepucp.postulaciones.controller;

import org.springframework.data.domain.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import pe.edu.pucp.onepucp.postulaciones.model.CriterioSeleccion;
import pe.edu.pucp.onepucp.postulaciones.model.ProcesoDeSeleccion;
import pe.edu.pucp.onepucp.postulaciones.service.ProcesoDeSeleccionService;

import java.util.List;

@RestController
@RequestMapping("procesoDeSeleccion")
public class ProcesoDeSeleccionController {
    @Autowired
    private ProcesoDeSeleccionService service;

    @PostMapping("/insertar")
    public ResponseEntity<?> crearProcesoDeSeleccion(@RequestBody ProcesoDeSeleccion procesoDeSeleccion){
        service.guardarProcesoDeSeleccion(procesoDeSeleccion);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/actualizar")
    public ResponseEntity<?> actualizarProcesoDeSeleccion(@RequestBody ProcesoDeSeleccion procesoDeSeleccion){
        service.guardarProcesoDeSeleccion(procesoDeSeleccion);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/listar")
    public ResponseEntity<Page<ProcesoDeSeleccion>> listarProcesoDeSelecion(@RequestParam(defaultValue = "0")int page,
                                                            @RequestParam(defaultValue = "5") int size){


         return ResponseEntity.ok( service.listarProcesoDeSelecionPaginado(page,size));
    }

    @GetMapping("/buscarRequisitos/{id}")
    public byte[] buscarRequisitosPorId(@PathVariable Long id){
        byte [] documento = service.buscarRequisitosPorId(id);
        return documento;
    }
}


