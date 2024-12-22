package pe.edu.pucp.onepucp.solicitudes.mapper;

import java.util.ArrayList;
import java.util.List;

import pe.edu.pucp.onepucp.institucion.dto.CursoDTO;
import pe.edu.pucp.onepucp.institucion.dto.EspecialidadDTO;
import pe.edu.pucp.onepucp.institucion.model.Especialidad;
import pe.edu.pucp.onepucp.rrhh.dto.AlumnoDTO;
import pe.edu.pucp.onepucp.rrhh.dto.DocenteDTO;
import pe.edu.pucp.onepucp.rrhh.dto.PersonaDTO;
import pe.edu.pucp.onepucp.rrhh.model.Alumno;
import pe.edu.pucp.onepucp.solicitudes.dto.SolicitudCartaPresentacionDTO;
import pe.edu.pucp.onepucp.solicitudes.model.EstadoSolicitud;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudCartaPresentacion;

public class SolicitudCartaPresentacionMapper {

    public static SolicitudCartaPresentacionDTO toDTO(SolicitudCartaPresentacion solicitud) {
        SolicitudCartaPresentacionDTO dto = new SolicitudCartaPresentacionDTO();
        dto.setId(solicitud.getId());
        dto.setFechaCreacion(solicitud.getFechaCreacion());
        dto.setEstado(solicitud.getEstado());
        PersonaDTO per=new PersonaDTO();
        per.setId(solicitud.getEmisor().getId());
        per.setNombre(solicitud.getEmisor().getNombre());
        per.setCodigo(solicitud.getEmisor().getCodigo());
        dto.setEmisor(per);
        CursoDTO cursoDTO=new CursoDTO();
        cursoDTO.setIdCurso(solicitud.getCurso().getIdCurso());
        cursoDTO.setNombre(solicitud.getCurso().getNombre());

        EspecialidadDTO especialidadDTO=new EspecialidadDTO();
        if (solicitud.getEspecialidad() != null) {
            Long id = solicitud.getEspecialidad().getId();
            // continua con el resto del código
            especialidadDTO.setId(id);
        } else {
            // Manejar el caso cuando Especialidad es null
            especialidadDTO.setId(1L);
        }
        
        cursoDTO.setEspecialidad(especialidadDTO);

        dto.setCurso(cursoDTO);
        DocenteDTO pro= new DocenteDTO();
        pro.setId(solicitud.getProfesor().getId());
        pro.setNombre(solicitud.getProfesor().getNombre());
        pro.setApellidoPaterno(solicitud.getProfesor().getApellidoPaterno());
        pro.setApellidoMaterno(solicitud.getProfesor().getApellidoMaterno());
        pro.setCodigo(solicitud.getProfesor().getCodigo());

        dto.setProfesor(pro);

        dto.setEspecialidad(especialidadDTO);
        List<AlumnoDTO> alumnos = new ArrayList<>();

        for (Alumno a: solicitud.getIntegrantes()){
            AlumnoDTO alu=new AlumnoDTO();
            alu.setId(a.getId());
            alu.setNombre(a.getNombre());
            alu.setApellidoPaterno(a.getApellidoPaterno());
            alu.setApellidoMaterno(a.getApellidoMaterno());
            alu.setEmail(a.getEmail()); 
            alu.setCodigo(a.getCodigo());
            alumnos.add(alu);
        }

        dto.setIntegrantes(alumnos);
        dto.setActividadesDesarrollar(solicitud.getActividadesDesarrollar());
        dto.setObservacion(solicitud.getObservacion());
        dto.setDocumento(solicitud.getDocumento());
        // Mapear otros campos según sea necesario
        return dto;
    }

    public static SolicitudCartaPresentacion toEntity(SolicitudCartaPresentacionDTO dto) {
        SolicitudCartaPresentacion solicitud = new SolicitudCartaPresentacion();
        solicitud.setId(dto.getId());
        solicitud.setFechaCreacion(dto.getFechaCreacion());
        solicitud.setEstado(dto.getEstado());
        // Asignar otros campos manualmente o con ayuda de servicios/repositorios
        return solicitud;
    }

}
