package pe.edu.pucp.onepucp.solicitudes.mapper;

import pe.edu.pucp.onepucp.solicitudes.dto.ComentarioTesisDTO;
import pe.edu.pucp.onepucp.solicitudes.dto.SolicitudTemaTesisDTO;
import pe.edu.pucp.onepucp.solicitudes.model.ComentarioTesis;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudTemaTesis;
import pe.edu.pucp.onepucp.solicitudes.dto.TesisDTO;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import pe.edu.pucp.onepucp.rrhh.dto.AlumnoDTO;
import pe.edu.pucp.onepucp.rrhh.dto.PersonaDTO;
import pe.edu.pucp.onepucp.rrhh.model.Persona;
import pe.edu.pucp.onepucp.rrhh.model.Alumno;

public class SolicitudTemaTesisMapper {
    public static PersonaDTO PersonaToDto(Persona persona) {
        PersonaDTO personaDTO=new PersonaDTO();
        personaDTO.setId(persona.getId());
        personaDTO.setNombre(persona.getNombre());
        personaDTO.setApellidoPaterno(persona.getApellidoPaterno());
        personaDTO.setApellidoMaterno(persona.getApellidoMaterno());
        personaDTO.setEmail(persona.getEmail());
        personaDTO.setCodigo(persona.getCodigo());
        personaDTO.setActivo(persona.isActivo());
         // Si necesitas convertir Unidad a UnidadDTO
        personaDTO.setTipo(persona.getTipo());
        
       return personaDTO;
    }
    public static AlumnoDTO AlumnoToDto(Alumno alumno) {
        AlumnoDTO alumnoDTO=new AlumnoDTO();
        alumnoDTO.setId(alumno.getId());
        alumnoDTO.setNombre(alumno.getNombre());
        alumnoDTO.setApellidoPaterno(alumno.getApellidoPaterno());
        alumnoDTO.setApellidoMaterno(alumno.getApellidoMaterno());
        alumnoDTO.setEmail(alumno.getEmail());
        alumnoDTO.setCodigo(alumno.getCodigo());
        alumnoDTO.setActivo(alumno.isActivo());
         // Si necesitas convertir Unidad a UnidadDTO 
        
       return alumnoDTO;
    }
    public static SolicitudTemaTesisDTO toDTO(SolicitudTemaTesis entity) {
        if (entity == null) {
            return null;
        }
        SolicitudTemaTesisDTO dto = new SolicitudTemaTesisDTO();
        dto.setAprobadoPorAsesor(entity.isAprobadoPorAsesor());
        dto.setAprobadoPorCoordinador(entity.isAprobadoPorCoordinador());
        dto.setAprobadoPorDirector(entity.isAprobadoPorDirector());
        dto.setId(entity.getId());

        if (entity.getComentarios() != null) {
            List<ComentarioTesisDTO> comentariosDTO = entity.getComentarios().stream()
                    .map(ComentarioTesisMapper::toDTO)
                    .toList();
            dto.setComentarios(comentariosDTO);
        }
        dto.setEstadoAprobacion(entity.getEstadoAprobacion());
        TesisDTO dtotesis=new TesisDTO();
        PersonaDTO emisor=new PersonaDTO();
        List<PersonaDTO>asesores=new ArrayList<>();
        List<AlumnoDTO>intergrantes=new ArrayList<>();
        dtotesis.setId(entity.getTesis().getId());
        dtotesis.setTitulo(entity.getTesis().getTitulo());
        for(Persona per: entity.getTesis().getAsesores()){
            PersonaDTO dtoper=new PersonaDTO();
            dtoper=PersonaToDto(per);
            asesores.add(dtoper);
        }
        for(Alumno per: entity.getTesis().getIntegrantes()){
            AlumnoDTO dtoal=new AlumnoDTO();
            dtoal=AlumnoToDto(per);
            intergrantes.add(dtoal);
        }
        dtotesis.setIntegrantes(intergrantes);
        dtotesis.setAsesores(asesores);
        dtotesis.setJurados(null);
        emisor.setId(entity.getEmisor().getId());
        emisor.setNombre(entity.getEmisor().getNombre());
        emisor.setApellidoPaterno(entity.getEmisor().getApellidoPaterno());
        emisor.setApellidoMaterno(entity.getEmisor().getApellidoMaterno());
        emisor.setEmail(entity.getEmisor().getEmail());
        emisor.setCodigo(entity.getEmisor().getCodigo());
        dto.setTesis(dtotesis);
        dto.setFechaCreacion(entity.getFechaCreacion());
        dto.setEmisor(emisor);
        //dto.setAlumno(AlumnoMapper.toDTO(entity.getAlumno()));
        return dto;
    }
    
    public static SolicitudTemaTesis toEntity(SolicitudTemaTesisDTO dto) {
        if (dto == null) {
            return null;
        }
        SolicitudTemaTesis entity = new SolicitudTemaTesis();
        entity.setAprobadoPorAsesor(dto.isAprobadoPorAsesor());
        entity.setAprobadoPorCoordinador(dto.isAprobadoPorCoordinador());
        entity.setAprobadoPorDirector(dto.isAprobadoPorDirector());
        if (dto.getComentarios() != null) {
            List<ComentarioTesis> comentarios = dto.getComentarios().stream()
                    .map(ComentarioTesisMapper::toEntity)
                    .toList();
            entity.setComentarios(comentarios);
        }
        entity.setEstadoAprobacion(dto.getEstadoAprobacion());
        return entity;
    }
}
