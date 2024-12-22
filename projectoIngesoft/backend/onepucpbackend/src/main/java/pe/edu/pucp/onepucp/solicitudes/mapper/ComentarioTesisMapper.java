package pe.edu.pucp.onepucp.solicitudes.mapper;

import pe.edu.pucp.onepucp.solicitudes.dto.ComentarioTesisDTO;
import pe.edu.pucp.onepucp.solicitudes.model.ComentarioTesis;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudTemaTesis;
import pe.edu.pucp.onepucp.rrhh.dto.PersonaDTO;
import pe.edu.pucp.onepucp.rrhh.dto.PersonaSolTesisDTO;
import pe.edu.pucp.onepucp.rrhh.model.Persona;
import pe.edu.pucp.onepucp.solicitudes.dto.SolicitudTemaTesisDTO;

public class ComentarioTesisMapper {

    // Convertir de Entidad a DTO
    public static ComentarioTesisDTO toDTO(ComentarioTesis comentario) {
        if (comentario == null) {
            return null;
        }
        ComentarioTesisDTO comentariodto=new ComentarioTesisDTO();
        comentariodto.setId(comentario.getId());
        comentariodto.setAprobado(comentario.isAprobado());
        comentariodto.setActivo(comentario.isActivo());
        comentariodto.setComentario(comentario.getComentario());
        comentariodto.setFecha(comentario.getFecha());
       
        PersonaSolTesisDTO personadto=new PersonaSolTesisDTO();
        personadto.setId(comentario.getRevisor().getId());
        personadto.setApellidoMaterno(comentario.getRevisor().getApellidoMaterno());
        personadto.setApellidoPaterno(comentario.getRevisor().getApellidoPaterno());
        personadto.setCodigo(comentario.getRevisor().getCodigo());
        // personadto.setCuenta(comentario.getRevisor().getCuenta());
        personadto.setEmail(comentario.getRevisor().getEmail());
        personadto.setNombre(comentario.getRevisor().getNombre());

        SolicitudTemaTesisDTO solicituddto= new SolicitudTemaTesisDTO();
        solicituddto.setId(comentario.getSolicitudTemaTesis().getId());
        comentariodto.setSolicitudTemaTesisId(solicituddto);
        comentariodto.setRevisor(personadto);

        return comentariodto;
    }

    public static ComentarioTesis toEntity(ComentarioTesisDTO dto) {
        if (dto == null) {
            return null;
        }
    
        ComentarioTesis comentario = new ComentarioTesis();
        comentario.setId(dto.getId());
        comentario.setAprobado(dto.isAprobado());
        comentario.setActivo(dto.isActivo());
        comentario.setComentario(dto.getComentario());
        comentario.setFecha(dto.getFecha());
    
        if (dto.getRevisor() != null) {
            Persona revisor = new Persona();
            revisor.setId(dto.getRevisor().getId());
            revisor.setApellidoMaterno(dto.getRevisor().getApellidoMaterno());
            revisor.setApellidoPaterno(dto.getRevisor().getApellidoPaterno());
            revisor.setCodigo(dto.getRevisor().getCodigo());
            // revisor.setCuenta(dto.getRevisor().getCuenta());
            revisor.setEmail(dto.getRevisor().getEmail());
            comentario.setRevisor(revisor);
        }
    
        if (dto.getSolicitudTemaTesisId() != null) {
            SolicitudTemaTesis solicitud = new SolicitudTemaTesis();
            solicitud.setId(dto.getSolicitudTemaTesisId().getId());
            comentario.setSolicitudTemaTesis(solicitud);
        }
    
        return comentario;
    }
}

