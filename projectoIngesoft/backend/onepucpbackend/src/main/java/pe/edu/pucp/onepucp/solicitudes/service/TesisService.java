package pe.edu.pucp.onepucp.solicitudes.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import pe.edu.pucp.onepucp.rrhh.dto.AlumnoDTO;
import pe.edu.pucp.onepucp.rrhh.model.Alumno;
import pe.edu.pucp.onepucp.solicitudes.model.Tesis;
import pe.edu.pucp.onepucp.solicitudes.repository.TesisRepository;

@Service
public class TesisService {
    @Autowired
    private TesisRepository repository;

    public List<Tesis> listarSolicitudesPorIdAlumno(Long idAlumno) {
        return repository.findByIntegrantes_id( idAlumno);
    }

    public List<Tesis> listarSolicitudesPorId(Long isEspecialidad) {
        return repository.findByEspecialidad_id( isEspecialidad);
    }
    public List<Tesis> listarTesis() {
    
        List<Tesis> tesis = repository.findAll();
        return tesis;
    }

    // Obtener integrantes por tesis
    public List<AlumnoDTO> obtenerIntegrantesPorTesis(Long tesisId) {
        List<Alumno> alumnosEncontrados = repository.findAlumnosByTesisId(tesisId);
        if(alumnosEncontrados.isEmpty()){
            throw new EntityNotFoundException("La tesis con id "+ tesisId + " no tiene integrantes registrados");
            //return null;
        }

        // Mapeando cada Alumno a AlumnoDTO
        return alumnosEncontrados.stream()
            .map(alumno -> new AlumnoDTO(alumno.getCodigo(), alumno.getNombre(), alumno.getApellidoPaterno(), alumno.getEmail()))
            .collect(Collectors.toList());
    }

    public Tesis actualizarTesis(Tesis tesis) {
        return repository.save(tesis);
    }
}
