package pe.edu.pucp.onepucp.solicitudes.mapper;


import java.util.List; 
import pe.edu.pucp.onepucp.solicitudes.dto.SolicitudDTO;
import pe.edu.pucp.onepucp.solicitudes.model.Solicitud;

public interface ISolicitudMapper {
    SolicitudDTO toDto(Solicitud solicitud);
    Solicitud toEntity(SolicitudDTO dto);
    List<SolicitudDTO> toDtoList(List<Solicitud> solicitudes);
}