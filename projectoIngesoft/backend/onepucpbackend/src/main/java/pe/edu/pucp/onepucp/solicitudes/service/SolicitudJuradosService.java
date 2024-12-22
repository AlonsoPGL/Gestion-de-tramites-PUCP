package pe.edu.pucp.onepucp.solicitudes.service;

import org.modelmapper.ModelMapper;
import org.modelmapper.Converter;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import pe.edu.pucp.onepucp.institucion.dto.CursoDTO;
import pe.edu.pucp.onepucp.rrhh.model.Persona;
import pe.edu.pucp.onepucp.rrhh.dto.PersonaDTO;
import pe.edu.pucp.onepucp.rrhh.repository.PersonaRepository;
import pe.edu.pucp.onepucp.solicitudes.dto.SolicitudJuradoDTOO;
import pe.edu.pucp.onepucp.solicitudes.mapper.SolicitudJuradosMapper;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudJurados;
import pe.edu.pucp.onepucp.solicitudes.repository.SolicitudCartaPresentacionRepository;
import pe.edu.pucp.onepucp.solicitudes.repository.SolicitudJuradosRepository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;
@Service
public class SolicitudJuradosService {
    @Autowired
    private SolicitudJuradosRepository repository;

    @Autowired
    private PersonaRepository personaRepository;

    public List<SolicitudJurados> listarSolicitudesDeJurados() {
        return (List<SolicitudJurados>) repository.findAll();
    }
    public List<SolicitudJuradoDTOO> listarSolicitudesDeJurados2() {
        List<SolicitudJurados> solicitudes = repository.findAll();
        return solicitudes.stream().map(SolicitudJuradosMapper::toDTO).collect(Collectors.toList());
    }


    @Transactional
    public SolicitudJurados insertarSolicitudJurados(SolicitudJurados soli){
        return repository.save(soli);
    }
    @Transactional
    public SolicitudJurados guardarSolicitudJurados(SolicitudJurados solicitudJurados) {
        // Verificar y cargar asesor, coAsesor y jurados desde la base de datos para
        // evitar detached entities
        if (solicitudJurados.getAsesor() != null && solicitudJurados.getAsesor().getId() != null) {
            solicitudJurados.setAsesor(personaRepository.findById(solicitudJurados.getAsesor().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Asesor no encontrado")));
        }

        if (solicitudJurados.getCoAsesor() != null && solicitudJurados.getCoAsesor().getId() != null) {
            solicitudJurados.setCoAsesor(personaRepository.findById(solicitudJurados.getCoAsesor().getId())
                    .orElseThrow(() -> new EntityNotFoundException("CoAsesor no encontrado")));
        }

        // Cargar jurados desde la base de datos
        List<Persona> jurados = new ArrayList<>();
        for (Persona jurado : solicitudJurados.getJurados()) {
            jurados.add(personaRepository.findById(jurado.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Jurado no encontrado")));
        }
        solicitudJurados.setJurados(jurados);
        // solicitudJurados.setActivo(true);
        //Verifica si el id existe para actualizar o insertar
        return repository.save(solicitudJurados);
    }

    public List<SolicitudJurados> listarPorTituloTesis(String tituloTesis) {
        return repository.findByTituloTesisContaining(tituloTesis);
    }

    public List<Persona> obtenerJuradosDeSolicitud(Long solicitudId) {
        SolicitudJurados solicitud = repository.findById(solicitudId)
                .orElseThrow(() -> new EntityNotFoundException("Solicitud de jurados no encontrada"));

        return solicitud.getJurados();
    }
    public Optional<SolicitudJurados> obtenerPorId(Long id){
        return repository.findById(id);
    }
    public SolicitudJuradoDTOO obtenerSolicitudPorId(Long solicitudId) {
        // Obtener la entidad SolicitudJurados por ID
        SolicitudJurados solicitud = repository.findById(solicitudId)
                .orElseThrow(() -> new EntityNotFoundException("Solicitud de jurados no encontrada"));

        return solicitud == null ? null : SolicitudJuradosMapper.toDTO(solicitud);
    }
}
