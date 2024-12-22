package pe.edu.pucp.onepucp.postulaciones.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pe.edu.pucp.onepucp.postulaciones.model.EstadoPostulacion;
import pe.edu.pucp.onepucp.postulaciones.model.Postulacion;
import pe.edu.pucp.onepucp.postulaciones.repository.PostulacionRepository;
import pe.edu.pucp.onepucp.postulaciones.service.PostulacionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/postulaciones")
public class PostulacionController {
    @Autowired
    PostulacionService servicio;

    
    @GetMapping("/listar")
    public List<Postulacion> ListarPostulaciones() {
        List<Postulacion> postulaciones= (List<Postulacion>)servicio.ListarPostulaciones(); 
        return postulaciones;
    }
    @GetMapping("/listarPorEstadoPostulacion")
    public List<Postulacion> ListarPostulacionesPorEstadoPostulacion(@RequestParam EstadoPostulacion estadoPostulacion) {
        List<Postulacion> postulaciones= (List<Postulacion>)servicio.ListarPostulacionesPorEstadoPostulacion(estadoPostulacion); 
        return postulaciones;
    }
    @PostMapping("/insertar")
    public ResponseEntity<?>crearPostulacion(@RequestBody Postulacion postulacion){
      servicio.insertarPostulacion(postulacion);
     return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    @PutMapping("/actualizar")
    public ResponseEntity<?>actualizarPostulacion(@RequestBody Postulacion postulacion){
        servicio.insertarPostulacion(postulacion);
        return ResponseEntity.ok().body("actulizado");
    }
    @GetMapping("/listarPrimeraEtapa")
    public List<Postulacion> ListarPostulacionesPrimeraEtapa() {
        List<Postulacion> postulaciones= (List<Postulacion>)servicio.ListarPostulacionesPrimeraEtapa(); 
        return postulaciones;
    }

    @GetMapping("/listarSegundaEtapa")
    public List<Postulacion> ListarPostulacionesSegundaEtapa() {
        List<Postulacion> postulaciones= (List<Postulacion>)servicio.ListarPostulacionesSegundaEtapa(); 
        return postulaciones;
    }

    @GetMapping("/listarEtapaFinal")
    public List<Postulacion> ListarPostulacionesEtapaFinal() {
        List<Postulacion> postulaciones= (List<Postulacion>)servicio.ListarPostulacionesEtapaFinal(); 
        return postulaciones;
    }
    
    @PutMapping("/{id}/estado")
    public ResponseEntity<String> updateEstado(
            @PathVariable Long id, 
            @RequestParam EstadoPostulacion nuevoEstado) {

        boolean updated = servicio.updateEstado(id, nuevoEstado);

        if (!updated) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok("Estado actualizado a " + nuevoEstado);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Postulacion> obtenerPostulacionPorId(@PathVariable Long id) {
        Postulacion postulacion = servicio.obtenerPorId(id);

        if (postulacion == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(postulacion);
    }
    @GetMapping("/buscarCV/{id}")
    public byte[] buscarCVPostulacionPorId(@PathVariable Long id){
        byte [] documento = servicio.buscarCVPorId(id);
        return documento;
    }
    @PutMapping("/{id}/puntaje")
    public ResponseEntity<String> updatePuntaje(
            @PathVariable Long id,
            @RequestParam double nuevoPuntaje
    ){
        boolean updated = servicio.updatePuntaje(id,nuevoPuntaje);
        if (!updated) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok("Puntaje actualizado a " + nuevoPuntaje);
    } 
    @GetMapping("/buscarReferencia/{id}")
    public byte[] buscarReferenciaPostulacionPorId(@PathVariable Long id){
        byte [] documento = servicio.buscarReferenciaPorId(id);
        return documento;
    }
    @PutMapping("/{id}/actualizarPuntuacionPostulacion")
    public ResponseEntity<String> updateDatosPuntuacion(
            @PathVariable Long id,
            @RequestParam double nuevoPuntaje,
            @RequestParam EstadoPostulacion nuevoEstado,
            @RequestParam String nuevaObservacion
    ){
        boolean updated = servicio.updateDatosPuntuacion(id,nuevoEstado,nuevoPuntaje,nuevaObservacion);
        if (!updated) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok("Puntuacion y datos actualizados");
    }       
}