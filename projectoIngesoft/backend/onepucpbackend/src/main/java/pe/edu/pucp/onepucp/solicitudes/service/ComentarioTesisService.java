package pe.edu.pucp.onepucp.solicitudes.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.transaction.Transactional;
import pe.edu.pucp.onepucp.rrhh.model.Persona;
import pe.edu.pucp.onepucp.solicitudes.dto.ComentarioTesisDTO;
import pe.edu.pucp.onepucp.solicitudes.mapper.ComentarioTesisMapper;
import pe.edu.pucp.onepucp.solicitudes.model.ComentarioTesis;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudTemaTesis;
import pe.edu.pucp.onepucp.solicitudes.repository.ComentarioTesisRepository;
import pe.edu.pucp.onepucp.solicitudes.repository.SolicitudTemaTesisRepository;

import org.springframework.stereotype.Service;

@Service
public class ComentarioTesisService {
     @Autowired
    private ComentarioTesisRepository comentarioTesisRepository;

    @Autowired
    private SolicitudTemaTesisRepository repo;
    public List<ComentarioTesisDTO> listarComentariosPorSolicitud(Long solicitudId) {
        return comentarioTesisRepository.findBySolicitudTemaTesisId(solicitudId)
                .stream()
                .map(ComentarioTesisMapper::toDTO)
                .collect(Collectors.toList());
    }

    
    @Transactional
    public ComentarioTesis crearComentario(ComentarioTesisDTO comentarioTesisDTO) {
        // Creamos una instancia de la entidad ComentarioTesis para persistir directamente
        ComentarioTesis comentarioTesis = new ComentarioTesis();
        comentarioTesis.setComentario(comentarioTesisDTO.getComentario());
        comentarioTesis.setFecha(comentarioTesisDTO.getFecha());
        comentarioTesis.setActivo(comentarioTesisDTO.isActivo());
        comentarioTesis.setAprobado(comentarioTesisDTO.isAprobado());

        // Establecemos el revisor si está presente en el DTO
        if (comentarioTesisDTO.getRevisor() != null) {
            comentarioTesis.setRevisor(new Persona());
            comentarioTesis.getRevisor().setId(comentarioTesisDTO.getRevisor().getId());
        }

        // Establecemos la solicitud relacionada si está presente en el DTO
        if (comentarioTesisDTO.getSolicitudTemaTesisId() != null) {
            System.out.print("llegue");
            SolicitudTemaTesis solicitud = repo
                    .findById(comentarioTesisDTO.getSolicitudTemaTesisId().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Solicitud no encontrada"));
            comentarioTesis.setSolicitudTemaTesis(solicitud);
        }

        // Guardamos la entidad y devolvemos el DTO resultante
        ComentarioTesis comentarioGuardado = comentarioTesisRepository.save(comentarioTesis);
        return comentarioGuardado;
    }
    //!ACTUALIZAR COMENTARIO TESIS
    @Transactional
    public ComentarioTesis actualizarComentario(ComentarioTesis comentarioTesis) {
        return comentarioTesisRepository.save(comentarioTesis);
    }
}
