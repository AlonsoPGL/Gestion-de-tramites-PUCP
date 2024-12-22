package pe.edu.pucp.onepucp.solicitudes.controller;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;
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

import pe.edu.pucp.onepucp.rrhh.model.Persona;
import pe.edu.pucp.onepucp.rrhh.repository.DocenteRepository;
import pe.edu.pucp.onepucp.rrhh.repository.PersonaRepository;
import pe.edu.pucp.onepucp.solicitudes.dto.SolicitudJuradoDTOO;
import pe.edu.pucp.onepucp.solicitudes.model.*;
import pe.edu.pucp.onepucp.rrhh.model.Docente;
import pe.edu.pucp.onepucp.solicitudes.repository.TesisRepository;
import pe.edu.pucp.onepucp.solicitudes.service.SolicitudJuradosService;

@RestController
@RequestMapping("solicitudes/jurados")
public class SolicitudJuradosController {
    @Autowired
    private SolicitudJuradosService service;
    @Autowired
    PersonaRepository personaRepository;
    @Autowired
    TesisRepository tesisRepository;
    @Autowired
    DocenteRepository docenteRepository;
    @GetMapping("/listar")
    public ResponseEntity<List<SolicitudJurados>> listarSolicitudesDeJurados() {
        List<SolicitudJurados> solicitudJurados = service.listarSolicitudesDeJurados();
        List<SolicitudJurados> solicitudJuradosActivas = solicitudJurados.stream()  
                .collect(Collectors.toList());
        Collections.reverse(solicitudJuradosActivas);
        return ResponseEntity.ok(solicitudJuradosActivas);
    }
    @GetMapping("/listar2")
    public ResponseEntity<List<SolicitudJuradoDTOO>> listarSolicitudesDeJurados2() {
        List<SolicitudJuradoDTOO> solicitudJurados = service.listarSolicitudesDeJurados2();
       // List<SolicitudJurados> solicitudJuradosActivas = solicitudJurados.stream()
              //Collections.reverse(solicitudJuradosActivas);
        return ResponseEntity.ok(solicitudJurados);
    }
    @GetMapping("/listarPorTitulo")
    public List<SolicitudJurados> listarPorTitulo(@RequestParam String titulo) {
        return service.listarPorTituloTesis(titulo);

    }
    @PostMapping("/insertar2")
    public ResponseEntity<?> insertarSolicitudJurado(@RequestBody Map<String, Object> solicitudJurado){
        try{
            //Obtener o validar el emisor
            SolicitudJurados solicitud = new SolicitudJurados();
            solicitud.setFechaCreacion(new Date());
            solicitud.setEstado(EstadoSolicitud.EN_PROCESO);
            // Llenar los campos necesarios
            if(solicitudJurado.containsKey("emisor")){
                Map<String, Object> emisorData= (Map<String, Object>) solicitudJurado.get("emisor");
                Long emisorId = obtenerLongDesdeMap(emisorData,"id");
                Persona emisor = personaRepository.findById(emisorId)
                        .orElseThrow(() -> new RuntimeException("Emisor no encontrado"));
                solicitud.setEmisor(emisor);
            }
            Persona receptor = null;
            /*if(solicitudJurados.containsKey("receptor")){
                Map<String, Object> receptorData= (Map<String, Object>) solicitudJurados.get("receptor");
                Long receptorId = obtenerLongDesdeMap(receptorData,"id");
                receptor = personaRepository.findById(receptorId)
                        .orElseThrow(() -> new RuntimeException("Emisor no encontrado"));
                solicitud.setReceptor(receptor);
            }*/

            solicitud.setCorreo(solicitudJurado.get("correo").toString());
            solicitud.setMotivo(solicitudJurado.get("motivo").toString());
            solicitud.setTemaTesis(solicitudJurado.get("temaTesis").toString());
            solicitud.setEstado(EstadoSolicitud.valueOf(solicitudJurado.get("estado").toString()));
            solicitud.setTipo(TipoSolicitud.valueOf(solicitudJurado.get("tipo").toString()));
            // Procesar la fecha de creación
            String fechaCreacionString = solicitudJurado.get("fechaCreacion").toString();
            Date fechaCreacion = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").parse(fechaCreacionString);
            solicitud.setFechaCreacion(fechaCreacion);

            if(solicitudJurado.containsKey("tesis")){
                Map<String, Object> tesisData= (Map<String, Object>) solicitudJurado.get("tesis");
                Long tesisId = obtenerLongDesdeMap(tesisData,"id");
                Tesis tesis = tesisRepository.findById(tesisId)
                        .orElseThrow(() -> new RuntimeException("Tesis no encontrada"));
                solicitud.setTesis(tesis);
            }

            SolicitudJurados nuevaSolicitud = service.insertarSolicitudJurados(solicitud);
            return ResponseEntity.ok(nuevaSolicitud);


        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al guardar la solicitud: " + e.getMessage());
        }
    }
    // Método para obtener Long desde el mapa, manejando la conversión de Integer a Long
    private Long obtenerLongDesdeMap(Map<String, Object> data, String key) {
        Object idObj = data.get(key);
        if (idObj instanceof Long) {
            return (Long) idObj;
        } else if (idObj instanceof Integer) {
            return Long.valueOf((Integer) idObj); // Conversión de Integer a Long
        } else {
            throw new IllegalArgumentException("ID no válido para la clave: " + key);
        }
    }
    @PostMapping("/insertar")
    public ResponseEntity<SolicitudJurados> crearSolicitudJurado(@RequestBody SolicitudJurados solicitudJurados) {

        SolicitudJurados nuevaSolicitud = service.guardarSolicitudJurados(solicitudJurados);
        return ResponseEntity.ok(nuevaSolicitud);
    }

  @PutMapping("/actualizar2/{id}")
    public ResponseEntity<?> actualizarSolicitudJurado(@PathVariable Long id, @RequestBody Map<String, Object> solicitudJurados){
      try{
          Optional<SolicitudJurados> solicitudOpcional=service.obtenerPorId(id);

      if (!solicitudOpcional.isPresent()) {
          return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Solicitud no encontrada");
      }

      SolicitudJurados solicitud = solicitudOpcional.get();
      if(solicitudJurados.containsKey("receptor")){
          Map<String, Object> receptorData= (Map<String, Object>) solicitudJurados.get("receptor");
          Long receptorId = obtenerLongDesdeMap(receptorData,"id");
          Persona receptor = personaRepository.findById(receptorId)
                  .orElseThrow(() -> new RuntimeException("Emisor no encontrado"));
          solicitud.setReceptor(receptor);
      }


      solicitud.setEstado(EstadoSolicitud.valueOf(solicitudJurados.get("estado").toString()));
      if(solicitudJurados.containsKey("jurados")){
          List<Map<String,Object>> ternaJuradoData = (List<Map<String,Object>>)solicitudJurados.get("jurados");
          List<Persona> ternaJurado = convertirADocentes(ternaJuradoData);
          for(Persona persona : ternaJurado){
              Persona personaexistente = docenteRepository.findByDocenteId(persona.getId());
              solicitud.getJurados().add(personaexistente);
          }
      }
      SolicitudJurados nuevaSolicitud = service.insertarSolicitudJurados(solicitud);
      return ResponseEntity.ok(nuevaSolicitud);
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar la solicitud: " + e.getMessage());
      }


    }
    private List<Persona> convertirADocentes(List<Map<String, Object>> dataList){
        List<Persona> docentes = new ArrayList<>();
        for(Map<String, Object> data: dataList){
            Long id = obtenerLongDesdeMap(data,"id");
            Docente docenteExistente = docenteRepository.findByDocenteId(id);
            docentes.add(docenteExistente);
        }
        return docentes;
    }
    @PostMapping("/actualizar")
    public ResponseEntity<?> actualizarSolicitudDeJurado(@RequestBody SolicitudJurados solicitudJurados) {
        SolicitudJurados solicitudGuardada = service.guardarSolicitudJurados(solicitudJurados);

        return ResponseEntity.status(HttpStatus.OK).build();

    }
    
    @GetMapping("/obtenerJurados/{id}")
    public ResponseEntity<List<Persona>> listarJuradosDeSolicitud(@PathVariable Long id) {
        List<Persona> jurados = service.obtenerJuradosDeSolicitud(id);
        if (jurados != null) {
            return ResponseEntity.ok(jurados);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    @GetMapping("/obtenerSolicitud/{id}")
    public ResponseEntity<SolicitudJuradoDTOO> obtenerSolicitudPorId(@PathVariable Long id) {
        SolicitudJuradoDTOO solicitudDTO = service.obtenerSolicitudPorId(id);
        if (solicitudDTO != null) {
            return ResponseEntity.ok(solicitudDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

}
