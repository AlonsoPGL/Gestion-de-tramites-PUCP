package pe.edu.pucp.onepucp.solicitudes.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import pe.edu.pucp.onepucp.institucion.model.Horario;
import pe.edu.pucp.onepucp.institucion.repository.HorarioRepository;
import pe.edu.pucp.onepucp.rrhh.model.Alumno;
import pe.edu.pucp.onepucp.rrhh.repository.AlumnoRepository;
import pe.edu.pucp.onepucp.solicitudes.dto.SolicitudMatriculaAdicionalDTO;
import pe.edu.pucp.onepucp.solicitudes.mapper.SolicitudMatriculaAdicionalMapper;
import pe.edu.pucp.onepucp.solicitudes.model.EstadoSolicitud;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudMatricula;
import pe.edu.pucp.onepucp.solicitudes.repository.SolicitudMatriculaRepository;
@Service
public class SolicitudMatriculaService {
    @Autowired
    private SolicitudMatriculaRepository repository;
    

    private static final Logger logger = LoggerFactory.getLogger(SolicitudMatriculaService.class);


   @Transactional
    public List<SolicitudMatriculaAdicionalDTO> listarSolicitudesPorId(Long id) {
        return repository.findByEspecialidad_Id(id).stream()
                .map(SolicitudMatriculaAdicionalMapper::toDTO) // Usar el mapper
                .toList();
    }

    // Listar solicitudes por ID de persona (emisor)
    @Transactional
    public List<SolicitudMatriculaAdicionalDTO> listarSolicitudesPorIdPersona(Long idPersona) {
        return repository.findByEmisor_Id(idPersona).stream()
                .map(SolicitudMatriculaAdicionalMapper::toDTO) // Usar el mapper
                .toList();
    }

    public SolicitudMatricula insertarSolicitudMatricula(SolicitudMatricula solicitud) {
        // Log para registrar la solicitud antes de guardar
        logger.info("Guardando SolicitudMatricula: {}", solicitud);

        // Validar si la solicitud es correcta
        validarSolicitud(solicitud);  // Método opcional para validar antes de guardar

        // Guardar la solicitud en el repositorio
        SolicitudMatricula nuevaSolicitud = repository.save(solicitud);

        // Log para registrar el éxito de la operación
        logger.info("Solicitud guardada exitosamente con ID: {}", nuevaSolicitud.getId());

        return nuevaSolicitud;
    }

    // Método opcional para validaciones previas a guardar la solicitud
    private void validarSolicitud(SolicitudMatricula solicitud) {
        if (solicitud.getEspecialidad() == null) {
            throw new RuntimeException("La solicitud debe tener una especialidad asignada.");
        }
        if (solicitud.getHorariosSolicitados() == null || solicitud.getHorariosSolicitados().isEmpty()) {
            throw new RuntimeException("La solicitud debe tener al menos un horario asignado.");
        }
        // Puedes agregar otras validaciones según tus necesidades
    }

    
    @Transactional
    public Optional<SolicitudMatriculaAdicionalDTO> obtenerPorId(Long id) {
        return repository.findById(id)
            .map(SolicitudMatriculaAdicionalMapper::toDTO); // Usar el mapper para transformar
    }



    
    public  SolicitudMatricula actualizarSolicitudMatricula_Estado_y_Obserbacion(Long id, EstadoSolicitud estado, String observacion){
        Optional<SolicitudMatricula> solicitudMatriculaOpcional = repository.findById(id);
        if(solicitudMatriculaOpcional.isPresent()){
            SolicitudMatricula solicitudActualizada = solicitudMatriculaOpcional.get();
            solicitudActualizada.setEstado(estado);
            solicitudActualizada.setObservacion(observacion);
            return repository.save(solicitudActualizada);
        }
        return null;
    }
    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private HorarioRepository horarioRepository;

    @Transactional
    public List<Long> registrarHorariosParaAlumno(Long alumnoId, List<Long> horariosId) {
        Alumno alumno = alumnoRepository.findById(alumnoId)
                .orElseThrow(() -> new IllegalArgumentException("Alumno no encontrado"));

        List<Long> duplicados = new ArrayList<>();

        for (Long horarioId : horariosId) {
            System.out.println("valores:"+horarioId + "y "+alumnoId);
            boolean existeRelacion = horarioRepository.existsByIdHorarioAndAlumnos_Id(horarioId, alumnoId);

            if (!existeRelacion) {
                Horario horario = horarioRepository.findById(horarioId)
                        .orElseThrow(() -> new IllegalArgumentException("Horario no encontrado"));
                horario.getAlumnos().add(alumno);
                
                horarioRepository.save(horario);
            } else {
                System.out.println("HOLAAAAAAAAAAA");
                duplicados.add(horarioId); // Registrar duplicados
            }
        }

        return duplicados; // Retorna solo los IDs que ya existían
    }


}
