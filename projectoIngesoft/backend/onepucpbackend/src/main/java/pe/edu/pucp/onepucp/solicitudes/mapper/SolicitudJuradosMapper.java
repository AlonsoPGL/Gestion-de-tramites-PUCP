package pe.edu.pucp.onepucp.solicitudes.mapper;

import pe.edu.pucp.onepucp.rrhh.dto.AlumnoDTO;
import pe.edu.pucp.onepucp.rrhh.dto.PersonaDTO;
import pe.edu.pucp.onepucp.rrhh.model.Alumno;
import pe.edu.pucp.onepucp.rrhh.model.Persona;
import pe.edu.pucp.onepucp.solicitudes.dto.SolicitudJuradoDTOO;
import pe.edu.pucp.onepucp.solicitudes.dto.TesisDTO;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudJurados;
import java.util.ArrayList;
import java.util.List;

public class SolicitudJuradosMapper {

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
    public static SolicitudJuradoDTOO toDTO(SolicitudJurados solicitud){
        SolicitudJuradoDTOO dto = new SolicitudJuradoDTOO();
        dto.setId(solicitud.getId());
        dto.setFechaCreacion(solicitud.getFechaCreacion());
        dto.setEstado(solicitud.getEstado());
        PersonaDTO emi=new PersonaDTO();
        emi.setId(solicitud.getEmisor().getId());
        emi.setNombre(solicitud.getEmisor().getNombre());
        emi.setCodigo(solicitud.getEmisor().getCodigo());
        emi.setApellidoPaterno(solicitud.getEmisor().getApellidoPaterno());
        emi.setApellidoMaterno(solicitud.getEmisor().getApellidoMaterno());
        dto.setEmisor(emi);

        List<PersonaDTO> jurados = new ArrayList<>();

        for (Persona p: solicitud.getJurados()){
           PersonaDTO dtojur=new PersonaDTO();
           dtojur=PersonaToDto(p);
            jurados.add(dtojur);
        }
        TesisDTO dtotesis=new TesisDTO();
        List<PersonaDTO>asesores=new ArrayList<>();
        List<AlumnoDTO>intergrantes=new ArrayList<>();
        dtotesis.setId(solicitud.getTesis().getId());
        dtotesis.setTitulo(solicitud.getTesis().getTitulo());
        for(Persona per: solicitud.getTesis().getAsesores()){
            PersonaDTO dtoper=new PersonaDTO();
            dtoper=PersonaToDto(per);
            asesores.add(dtoper);
        }
        for(Alumno per: solicitud.getTesis().getIntegrantes()){
            AlumnoDTO dtoal=new AlumnoDTO();
            dtoal=AlumnoToDto(per);
            intergrantes.add(dtoal);
        }
        dtotesis.setIntegrantes(intergrantes);
        dtotesis.setAsesores(asesores);
        dto.setTesis(dtotesis);
        dto.setJurados(jurados);
        return dto;
    }
    public static SolicitudJurados toEntity(SolicitudJuradoDTOO dto){
        if (dto == null) {
            return null;
        }
        SolicitudJurados entity = new SolicitudJurados();
        return entity;
    }
}
