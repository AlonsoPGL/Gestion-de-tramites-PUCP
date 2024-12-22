package pe.edu.pucp.onepucp.solicitudes.mapper;

import java.util.ArrayList;
import java.util.List;

import pe.edu.pucp.onepucp.institucion.dto.CursoDTO;
import pe.edu.pucp.onepucp.institucion.dto.EspecialidadDTO;
import pe.edu.pucp.onepucp.institucion.dto.HorarioDTO;
import pe.edu.pucp.onepucp.institucion.dto.SesionDTO;
import pe.edu.pucp.onepucp.institucion.mapper.HorarioMapper;
import pe.edu.pucp.onepucp.institucion.model.Horario;
import pe.edu.pucp.onepucp.institucion.model.Sesion;
import pe.edu.pucp.onepucp.rrhh.dto.AlumnoDTO;
import pe.edu.pucp.onepucp.rrhh.dto.DocenteDTO;
import pe.edu.pucp.onepucp.rrhh.dto.PersonaDTO;
import pe.edu.pucp.onepucp.rrhh.model.Alumno;
import pe.edu.pucp.onepucp.solicitudes.dto.SolicitudCartaPresentacionDTO;
import pe.edu.pucp.onepucp.solicitudes.dto.SolicitudMatriculaAdicionalDTO;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudCartaPresentacion;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudMatricula;

public class SolicitudMatriculaAdicionalMapper {
    public static SolicitudMatriculaAdicionalDTO toDTO(SolicitudMatricula solicitud) {
        SolicitudMatriculaAdicionalDTO dto = new SolicitudMatriculaAdicionalDTO();
        dto.setId(solicitud.getId());
        dto.setFechaCreacion(solicitud.getFechaCreacion());
        dto.setEstadoSolicitud(solicitud.getEstado());
        dto.setObservacion(solicitud.getObservacion());
        dto.setMotivo(solicitud.getMotivo());
        PersonaDTO per=new PersonaDTO();
        per.setId(solicitud.getEmisor().getId());
        per.setNombre(solicitud.getEmisor().getNombre());
        per.setApellidoPaterno(solicitud.getEmisor().getApellidoPaterno());
        per.setApellidoMaterno(solicitud.getEmisor().getApellidoMaterno());
        per.setCodigo(solicitud.getEmisor().getCodigo());
        dto.setEmisor(per);
        List<HorarioDTO> horarios=new ArrayList<>();
        
        EspecialidadDTO especialidadDTO=new EspecialidadDTO();
        if (solicitud.getEspecialidad() != null) {
            Long id = solicitud.getEspecialidad().getId();
            // continua con el resto del código
            especialidadDTO.setId(id);
        } else {
            // Manejar el caso cuando Especialidad es null
            especialidadDTO.setId(1L);
        }

        for (Horario h : solicitud.getHorariosSolicitados()) {
            HorarioDTO horarioDTO = new HorarioDTO();
            horarioDTO.setIdHorario(h.getIdHorario());
            horarioDTO.setCodigo(h.getCodigo());
            horarioDTO.setCodigoCurso(h.getCodigoCurso());
            horarioDTO.setCreditoCurso(h.getCreditoCurso());
            horarioDTO.setNombreCurso(h.getNombreCurso());

            List <SesionDTO> sesionesdto=new ArrayList<>();
            for(Sesion s: h.getSesiones()){
                SesionDTO sdto=new SesionDTO();
                sdto.setIdSesion(s.getIdSesion());    
                sdto.setDia(s.getDia());
                sdto.setHoraFin(s.getHoraFin());
                sdto.setHoraInicio(s.getHoraInicio());
                sesionesdto.add(sdto);
            }
            horarioDTO.setSesiones(sesionesdto);
            
            horarios.add(horarioDTO);
        }
        dto.setHorariosSeleccionados(horarios);
        
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
