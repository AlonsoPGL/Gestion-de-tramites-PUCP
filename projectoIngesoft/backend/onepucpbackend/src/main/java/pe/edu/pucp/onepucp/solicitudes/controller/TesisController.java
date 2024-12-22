package pe.edu.pucp.onepucp.solicitudes.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pe.edu.pucp.onepucp.rrhh.dto.AlumnoDTO;
import pe.edu.pucp.onepucp.rrhh.model.Alumno;
import pe.edu.pucp.onepucp.solicitudes.dto.TesisDTO;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudTemaTesis;
import pe.edu.pucp.onepucp.solicitudes.model.Tesis;
import pe.edu.pucp.onepucp.solicitudes.service.SolicitudTemaTesisService;
import pe.edu.pucp.onepucp.solicitudes.service.TesisService;

import pe.edu.pucp.onepucp.solicitudes.model.Tesis;
import pe.edu.pucp.onepucp.solicitudes.service.TesisService;

@RestController
@RequestMapping("solicitudes/tesis")
public class TesisController {


    @Autowired
    private TesisService service;

   @GetMapping("listarPorAlumno/{idAlumno}")
       private ResponseEntity<List<Tesis>> listarTemaTesisDeAlumnos(@PathVariable Long idAlumno){
           List<Tesis> solicitudTemaTesis =
                   service.listarSolicitudesPorIdAlumno(idAlumno);
           if (solicitudTemaTesis.isEmpty()) {
               return ResponseEntity.noContent().build();  // Si no hay solicitudes, responde con 204 No Content
           }
           return ResponseEntity.ok(solicitudTemaTesis);
   }
   //@PostMapping("actualizar/estado")


   //!Listar todas las tesis
    @GetMapping("listar")
    public List<Tesis> listarTesis() {
        return service.listarTesis();
    }


    @GetMapping("/{id}/integrantes")
    public ResponseEntity<List<AlumnoDTO>> obtenerIntegrantesTesis(@PathVariable Long id) {
        List<AlumnoDTO> integrantes = service.obtenerIntegrantesPorTesis(id);
        //return integrantes.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(integrantes);
        //List<AlumnoDTO> integrantes = service.obtenerIntegrantesPorTesis(id);
        if (integrantes.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(integrantes);
    }
    
    @GetMapping("listar/{id}")
    private ResponseEntity<List<Tesis>> listarTemaTesisDeEspecialidad(@PathVariable Long id){
        List<Tesis> solicitudTemaTesis =
                service.listarSolicitudesPorId(id);
        if (solicitudTemaTesis.isEmpty()) {
            return ResponseEntity.noContent().build();  // Si no hay solicitudes, responde con 204 No Content
        }
        return ResponseEntity.ok(solicitudTemaTesis);
    }


}
