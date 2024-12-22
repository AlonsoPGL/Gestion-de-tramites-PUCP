package pe.edu.pucp.onepucp.solicitudes.mapper;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

import pe.edu.pucp.onepucp.solicitudes.dto.SolicitudDTO;
import pe.edu.pucp.onepucp.solicitudes.model.Solicitud;

@Component
public class SolicitudMapper implements  ISolicitudMapper {
    
    private ModelMapper modelMapper;

    @Override
    public SolicitudDTO toDto(Solicitud solicitud) {
        modelMapper = new ModelMapper();
        return modelMapper.map(solicitud, SolicitudDTO.class);
    }

    @Override
    public Solicitud toEntity(SolicitudDTO dto) {
        modelMapper = new ModelMapper();
        return modelMapper.map(dto, Solicitud.class);
    }

    @Override
    public List<SolicitudDTO> toDtoList(List<Solicitud> solicitudes) {
        modelMapper = new ModelMapper();
        return solicitudes.stream().map(this::toDto).collect(Collectors.toList());
    }
}
