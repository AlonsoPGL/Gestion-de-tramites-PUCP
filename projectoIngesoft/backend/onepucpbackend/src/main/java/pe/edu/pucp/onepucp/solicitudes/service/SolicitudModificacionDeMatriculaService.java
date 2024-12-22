package pe.edu.pucp.onepucp.solicitudes.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pe.edu.pucp.onepucp.institucion.dto.EspecialidadDTO;
import pe.edu.pucp.onepucp.institucion.dto.HorarioDTO;
import pe.edu.pucp.onepucp.institucion.model.Especialidad;
import pe.edu.pucp.onepucp.institucion.model.Horario;
import pe.edu.pucp.onepucp.institucion.repository.EspecialidadRepository;
import pe.edu.pucp.onepucp.institucion.repository.HorarioRepository;
import pe.edu.pucp.onepucp.rrhh.dto.DocenteDTO;
import pe.edu.pucp.onepucp.rrhh.model.Docente;
import pe.edu.pucp.onepucp.rrhh.model.Persona;
import pe.edu.pucp.onepucp.solicitudes.dto.solicitudModificacionDeMatriculaDTO;
import pe.edu.pucp.onepucp.solicitudes.model.EstadoSolicitud;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudModificacionDeMatricula;
import pe.edu.pucp.onepucp.solicitudes.repository.SolicitudModificacionRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Date;
@Service
public class SolicitudModificacionDeMatriculaService {

    @Autowired
    private SolicitudModificacionRepository repository;
    @Autowired
    private EspecialidadRepository especialidadRepo;

    @Autowired
    private HorarioRepository horarioRepo;

    @Autowired
    private SolicitudModificacionRepository solicitudRepo;

    public List<SolicitudModificacionDeMatricula> findAll() {
        return repository.findAll();
    }

    public Optional<SolicitudModificacionDeMatricula> findById(Long id) {
        return repository.findById(id);
    }

    public SolicitudModificacionDeMatricula save(SolicitudModificacionDeMatricula solicitud) {
        return repository.save(solicitud);
    }

    
     public List<solicitudModificacionDeMatriculaDTO> obtenerTodasLasSolicitudes() {
        List<SolicitudModificacionDeMatricula> solicitudes = repository.findAll();
        return solicitudes.stream().map(this::convertirAFormatoDTO).collect(Collectors.toList());
    }

    public solicitudModificacionDeMatriculaDTO convertirAFormatoDTO(SolicitudModificacionDeMatricula solicitud) {
        // Convertir los horarios solicitados a su formato DTO
        List<HorarioDTO> horariosDTO = solicitud.getHorariosSolicitados().stream()
                .map(this::convertirHorarioAFormatoDTO)
                .collect(Collectors.toList());
    
        // Crear y llenar el DTO de Especialidad
        EspecialidadDTO especialidadDTO = new EspecialidadDTO();
        especialidadDTO.setNombre(solicitud.getEspecialidad().getNombre());
        especialidadDTO.setId(solicitud.getEspecialidad().getId());
    
        // Crear el DTO de SolicitudModificacionDeMatricula
        solicitudModificacionDeMatriculaDTO soli = new solicitudModificacionDeMatriculaDTO();
    
        // Establecer los valores en el DTO
        soli.setCodigoAlumno(solicitud.getCodigoAlumno());
        soli.setNombreAlumno(solicitud.getNombreAlumno());
        soli.setEmisor_id(solicitud.getEmisor().getId());
        soli.setEspecialidad(especialidadDTO);
        soli.setHorariosSolicitados(horariosDTO);
        soli.setId_solicitud(solicitud.getId());
        soli.setEstado(solicitud.getEstado());
        // Retornar el DTO
        return soli;
    }
    

    // Método para convertir un Horario a HorarioDTO
    private HorarioDTO convertirHorarioAFormatoDTO(Horario horario) {
        // Convertir la lista de docentes a DocenteDTO
        List<DocenteDTO> docentesDTO = horario.getDocentes().stream()
                .map(this::convertirDocenteAFormatoDTO)
                .collect(Collectors.toList());

        return new HorarioDTO(
                horario.getIdHorario(),
                horario.getCodigo(),
                horario.getCodigoCurso(),
                horario.getNombreCurso(),
                horario.getCreditoCurso(),
                docentesDTO
        );
    }

    // Método para convertir un Docente a DocenteDTO
    private DocenteDTO convertirDocenteAFormatoDTO(Docente docente) {
        return new DocenteDTO(
docente
        );
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public List<SolicitudModificacionDeMatricula> findByEmisorId(Long emisorId) {
        return repository.findByEmisor_Id(emisorId);
    }

    

    public void createSolicitud(solicitudModificacionDeMatriculaDTO dto) {
    // Validar y obtener la Especialidad
    Especialidad especialidad = especialidadRepo.findById(dto.getEspecialidad().getId())
            .orElseThrow(() -> new RuntimeException("Especialidad no encontrada"));

    // Validar y obtener los Horarios
    List<Horario> horarios = dto.getHorariosSolicitados().stream()
            .map(h -> horarioRepo.findById(h.getIdHorario())
                    .orElseThrow(() -> new RuntimeException("Horario no encontrado")))
            .collect(Collectors.toList());

    // Crear la entidad SolicitudModificacionDeMatricula
    SolicitudModificacionDeMatricula solicitud = new SolicitudModificacionDeMatricula();
    solicitud.setCodigoAlumno(dto.getCodigoAlumno());
    solicitud.setNombreAlumno(dto.getNombreAlumno());
    solicitud.setCorreo(dto.getCorreo());
    solicitud.setEspecialidad(especialidad);
    solicitud.setHorariosSolicitados(horarios);
    solicitud.setEstado(dto.getEstado());
    // Establecer el emisor y la fecha de creación
    Persona per=new Persona();
    per.setId(dto.getEmisor_id());
    solicitud.setEmisor(per); // O reemplazar por el ID dinámico del usuario autenticado
    solicitud.setFechaCreacion(new Date());

    // Guardar en la base de datos
    solicitudRepo.save(solicitud);
}
    public List<solicitudModificacionDeMatriculaDTO> obtenerSolicitudesPorIdEmisor(Long idEmisor) {
        List<SolicitudModificacionDeMatricula> solicitudes = repository.findByEmisor_Id(idEmisor);
    return solicitudes.stream().map(this::convertirAFormatoDTO).collect(Collectors.toList());
    }

    public SolicitudModificacionDeMatricula updateSolicitud(Long id, solicitudModificacionDeMatriculaDTO dto) {
        // Verificar si la solicitud existe
        SolicitudModificacionDeMatricula solicitud = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada con el ID: " + id));
    
        // Actualizar los campos de la solicitud
        solicitud.setCodigoAlumno(dto.getCodigoAlumno());
        solicitud.setNombreAlumno(dto.getNombreAlumno());
        solicitud.setCorreo(dto.getCorreo());
        solicitud.setEstado(dto.getEstado());
        // Actualizar la especialidad (si es necesario)
        if (dto.getEspecialidad() != null) {
            Especialidad especialidad = especialidadRepo.findById(dto.getEspecialidad().getId())
                    .orElseThrow(() -> new RuntimeException("Especialidad no encontrada con el ID: " + dto.getEspecialidad().getId()));
            solicitud.setEspecialidad(especialidad);
        }
    
        // Actualizar los horarios solicitados (si es necesario)
        if (dto.getHorariosSolicitados() != null) {
            List<Horario> horarios = dto.getHorariosSolicitados().stream()
                    .map(h -> horarioRepo.findById(h.getIdHorario())
                            .orElseThrow(() -> new RuntimeException("Horario no encontrado con el ID: " + h.getIdHorario())))
                    .collect(Collectors.toList());
            solicitud.setHorariosSolicitados(horarios);
        }
    
        // Actualizar la fecha de última modificación
        
    
        // Guardar la solicitud actualizada en el repositorio
        return repository.save(solicitud);
    }
    
    public List<solicitudModificacionDeMatriculaDTO> obtenerSolicitudesPorEspecialidad(Long especialidadId) {
        // Consultar solicitudes por especialidad
        List<SolicitudModificacionDeMatricula> solicitudes = repository.findByEspecialidad_Id(especialidadId);
    
        // Convertir entidades a DTO
        return solicitudes.stream()
                .map(this::convertirAFormatoDTO)
                .collect(Collectors.toList());
    }
    

}
