package pe.edu.pucp.onepucp.solicitudes.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import pe.edu.pucp.onepucp.solicitudes.dto.SolicitudCartaPresentacionDTO;
import pe.edu.pucp.onepucp.solicitudes.mapper.SolicitudCartaPresentacionMapper;
import pe.edu.pucp.onepucp.solicitudes.model.EstadoSolicitud;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudCartaPresentacion;
import pe.edu.pucp.onepucp.solicitudes.repository.SolicitudCartaPresentacionRepository;

@Service
public class SolicitudCartaPresentacionService {

    @Autowired
    private SolicitudCartaPresentacionRepository solicitudRepository;

     @Transactional
    public SolicitudCartaPresentacion insertarSolicitudCartaPresentacion(SolicitudCartaPresentacion soli) {
        //Guardar la solicitud en el repositorio
        return solicitudRepository.save(soli);
    }

    public List<SolicitudCartaPresentacionDTO> listarPorIdAlumno(Long idAlumno) {
        List<SolicitudCartaPresentacion> solicitudes = solicitudRepository.findByIntegrantes_Id(idAlumno);
        return solicitudes.stream()
                .map(SolicitudCartaPresentacionMapper::toDTO)
                .collect(Collectors.toList());
    }

    public SolicitudCartaPresentacionDTO obtenerPorIdDTO(Long id) {
        SolicitudCartaPresentacion solicitud = solicitudRepository.findById(id)
                .orElse(null);
        return solicitud == null ? null : SolicitudCartaPresentacionMapper.toDTO(solicitud);
    }

    @Transactional
    public Optional<SolicitudCartaPresentacion> obtenerPorId(Long Id){
        return solicitudRepository.findById(Id);
    }


    public SolicitudCartaPresentacionDTO actualizarSolicitud(Long id, SolicitudCartaPresentacionDTO solicitudDTO) {
        SolicitudCartaPresentacion solicitudExistente = solicitudRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        solicitudExistente.setEstado(solicitudDTO.getEstado());
        solicitudExistente.setActividadesDesarrollar(solicitudDTO.getActividadesDesarrollar());
        // Actualizar otros campos según sea necesario

        SolicitudCartaPresentacion solicitudActualizada = solicitudRepository.save(solicitudExistente);
        return SolicitudCartaPresentacionMapper.toDTO(solicitudActualizada);
    }

    public List<SolicitudCartaPresentacionDTO> listarPorId(Long id) {
        List<SolicitudCartaPresentacion> solicitudes = solicitudRepository.findByEspecialidad_Id(id);
        return solicitudes.stream()
                .map(SolicitudCartaPresentacionMapper::toDTO)
                .collect(Collectors.toList());
    }
}

