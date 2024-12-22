package pe.edu.pucp.onepucp.solicitudes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pe.edu.pucp.onepucp.solicitudes.model.SolicitudConvocatoriaNuevosDocentes;
import pe.edu.pucp.onepucp.solicitudes.service.SolicitudConvocatoriaNuevosDocentesService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("solicitudConvocatoriaNuevosDocentes")
public class SolicitudConvocatoriaNuevosDocentesController {
    @Autowired
    private SolicitudConvocatoriaNuevosDocentesService service;

    @PostMapping("/insertar")
    public ResponseEntity<?> insertarSolicitudConvocatoriaNuevosDocentes(@RequestBody SolicitudConvocatoriaNuevosDocentes solicitudConvocatoriaNuevosDocentes){
       service.guardarSolicitudConvocatoriaNuevosDocentes(solicitudConvocatoriaNuevosDocentes);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    @GetMapping("/obtenerDocumento")
    public ResponseEntity<?> obtenerDocumentoDeSolicitudConvocatoriaNuevosDocentes(@RequestParam Long id){
        byte[] documento = service.obtenerDocumentoDeSolicitudConvocatoriaNuevosDocentes(id);
        if(documento == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(documento);
    }
    
    
}
