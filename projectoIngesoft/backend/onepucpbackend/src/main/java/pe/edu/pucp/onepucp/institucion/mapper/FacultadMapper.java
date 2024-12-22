package pe.edu.pucp.onepucp.institucion.mapper;

import org.springframework.stereotype.Component;

import pe.edu.pucp.onepucp.institucion.dto.FacultadDTO;
import pe.edu.pucp.onepucp.institucion.model.Facultad;

import java.util.List;
import java.util.stream.Collectors;
@Component
public class FacultadMapper {
    
    public FacultadDTO toDTO(Facultad facultad) {
        if (facultad == null) return null;
        
        FacultadDTO dto = new FacultadDTO();
        
        // Mapear campos de Unidad
        dto.setId(facultad.getId());
        dto.setCodigo(facultad.getCodigo());
        dto.setNombre(facultad.getNombre());
        dto.setTelefonoContacto(facultad.getTelefonoContacto());
        dto.setCorreoContacto(facultad.getCorreoContacto());
        dto.setDireccionWeb(facultad.getDireccionWeb());
        dto.setTipo(facultad.getTipo());
        
        // Mapear campos específicos de Facultad
        dto.setActivo(facultad.isActivo());
        
        return dto;
    }
    
    public List<FacultadDTO> toDTO(List<Facultad> facultades) {
        if (facultades == null) return null;
        return facultades.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
}