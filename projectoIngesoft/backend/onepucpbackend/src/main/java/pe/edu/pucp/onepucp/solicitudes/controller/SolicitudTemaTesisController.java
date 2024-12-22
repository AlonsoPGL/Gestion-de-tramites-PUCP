package pe.edu.pucp.onepucp.solicitudes.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
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

import pe.edu.pucp.onepucp.solicitudes.dto.SolicitudTemaTesisDTO;
import pe.edu.pucp.onepucp.solicitudes.mapper.SolicitudTemaTesisMapper;
import pe.edu.pucp.onepucp.solicitudes.model.EstadoAprobacion;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudTemaTesis;
import pe.edu.pucp.onepucp.solicitudes.service.SolicitudTemaTesisService;
@RestController
@RequestMapping("/solicitudes/solicitudTemaTesis")
public class SolicitudTemaTesisController {
    @Autowired
    private SolicitudTemaTesisService service;
    //!INSERTAR
    @PostMapping("/insertar")
    public SolicitudTemaTesisDTO insertarSolicitudTemaTesis(@RequestParam("unidadId") Long unidadId,@RequestBody SolicitudTemaTesisDTO solicitudTemaTesis) {
        SolicitudTemaTesisDTO nuevaSolicitudTemaTesis = service.insertarSolicitudTemaTesis(unidadId,solicitudTemaTesis);
        return nuevaSolicitudTemaTesis;
    }
    @GetMapping("/listar")
    public List<SolicitudTemaTesisDTO> listarSolicitudesTemaTesis() {
        // Obtener la lista de solicitudes desde el servicio
        List<SolicitudTemaTesis> solicitudes = service.listarSolicitudesTemaTesis();

        // Convertir cada entidad en su DTO correspondiente
        return solicitudes.stream()
                .map(SolicitudTemaTesisMapper::toDTO)  // Usamos el mapper para convertir la entidad a DTO
                .collect(Collectors.toList());  // Recogemos los DTOs en una lista
    }

    @GetMapping("/listarPorIdEspecialidad/{idEspecialidad}")
    public List<SolicitudTemaTesisDTO> listarSolicitudesTemaTesisPorIdEspecialidad(@PathVariable Long idEspecialidad) {
        // Obtener la lista de solicitudes desde el servicio
        List<SolicitudTemaTesis> solicitudes = service.listarSolicitudesPorIdEspecialidad(idEspecialidad);

        // Convertir cada entidad en su DTO correspondiente
        return solicitudes.stream()
                .map(SolicitudTemaTesisMapper::toDTO)  // Usamos el mapper para convertir la entidad a DTO
                .collect(Collectors.toList());  // Recogemos los DTOs en una lista
    }

    @GetMapping("/buscarPorTesis/{id}")
    public Optional<SolicitudTemaTesisDTO> buscarPorTesis(@PathVariable Long id){
        Optional<SolicitudTemaTesis> solicitudTemaTesisOptional = service.buscarSolicitudTemaTesisPorId(id);

        if(solicitudTemaTesisOptional.isPresent()) {
            // Convertir la entidad a DTO y devolverlo envuelto en un Optional
            SolicitudTemaTesisDTO solicitudTemaTesisDTO = SolicitudTemaTesisMapper.toDTO(solicitudTemaTesisOptional.get());
            return Optional.of(solicitudTemaTesisDTO);
        } else {
            return Optional.empty();
        }
    }
    @GetMapping("/buscar/{id}")
public Optional<SolicitudTemaTesisDTO> buscarSolicitudTemaTesisPorId(@PathVariable Long id) {
    Optional<SolicitudTemaTesis> solicitudTemaTesisOptional = service.buscarSolicitudTemaTesisPorId(id);
    
    if(solicitudTemaTesisOptional.isPresent()) {
        // Convertir la entidad a DTO y devolverlo envuelto en un Optional
        SolicitudTemaTesisDTO solicitudTemaTesisDTO = SolicitudTemaTesisMapper.toDTO(solicitudTemaTesisOptional.get());
        return Optional.of(solicitudTemaTesisDTO);
    } else {
        return Optional.empty();
    }
}

    //!BUSCAR DOCUMENTO_SOLICITUD_TESIS_POR_ID_SOLICITUD
    @GetMapping("/buscarDocumentoSolicitudTesis/{id}")
    public byte[] buscarDocumentoSolicitudTesisPorId(@PathVariable Long id){
        byte[] documento = service.buscarDocumentoSolicitudTesisPorId(id);
        return documento;
    }
    //!BUSCAR ESTADO_SOLICITUD_POR_ID_SOLICITUD
    @GetMapping("/buscarEstadoSolicitud/{id}")
    public EstadoAprobacion buscarEstadoSolicitudPorId(@PathVariable Long id){
        EstadoAprobacion estado = service.buscarEstadoSolicitudPorId(id);
        return estado;
    }
    @GetMapping("/buscarPorIdAlumno/{id}")
public SolicitudTemaTesisDTO buscarSolicitudTemaTesisPorIdAlumno(@PathVariable Long id) {
    SolicitudTemaTesis solicitudTemaTesis = service.buscarSolicitudTemaTesisPorIdAlumno(id);
    
    // Convertir la entidad a DTO usando el Mapper
    return SolicitudTemaTesisMapper.toDTO(solicitudTemaTesis);
}

    //!BUSCAR POR ID ASESOR
    @GetMapping("/listarPorIdAsesor/{id}")
    public List<SolicitudTemaTesisDTO> listarSolicitudesPorAsesor(@PathVariable Long id) {
    // Obtener las solicitudes desde el servicio
    List<SolicitudTemaTesis> solicitudes = service.listarSolicitudesPorIdAsesor(id);

    // Convertir las solicitudes a DTOs usando el mapper
    return solicitudes.stream()
            .map(SolicitudTemaTesisMapper::toDTO)  // Convertir cada entidad a DTO
            .collect(Collectors.toList());  // Recoger los resultados en una lista
    }

    @GetMapping("/listarPorId/{id}")
    public List<SolicitudTemaTesisDTO> listarSolicitudesPorId(@PathVariable Long id) {
    // Obtener las solicitudes desde el servicio
    List<SolicitudTemaTesis> solicitudes = service.listarSolicitudesPorId(id);

    // Convertir las solicitudes a DTOs usando el mapper
    return solicitudes.stream()
            .map(SolicitudTemaTesisMapper::toDTO)  // Convertir cada entidad a DTO
            .collect(Collectors.toList());  // Recoger los resultados en una lista
}

    //!ACTUALIZAR
    @PutMapping("/actualizar/{id}")
    public SolicitudTemaTesis actualizarSolicitudTemaTesis(@PathVariable Long id, @RequestBody SolicitudTemaTesis solicitudTemaTesis) {
        SolicitudTemaTesis solicitudTemaTesisActualizada = service.actualizarSolicitudTemaTesis(id, solicitudTemaTesis);
        return solicitudTemaTesisActualizada;
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstadoEnvio(@PathVariable Long id, @RequestBody String nuevoEstado) {


        EstadoAprobacion estado = EstadoAprobacion.valueOf(nuevoEstado.toUpperCase());
        service.actualizarEstadoSolicitud(id, estado);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
    

}
