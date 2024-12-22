package pe.edu.pucp.onepucp.solicitudes.dto;

import lombok.Data;
import pe.edu.pucp.onepucp.institucion.dto.HorarioDTO;
import pe.edu.pucp.onepucp.institucion.dto.SesionDTO;
import pe.edu.pucp.onepucp.rrhh.dto.PersonaDTO;
import pe.edu.pucp.onepucp.rrhh.model.Persona;
import pe.edu.pucp.onepucp.solicitudes.model.EstadoSolicitud;

import java.util.Date;
import java.util.List;

@Data
public class SolicitudMatriculaAdicionalDTO {

    private Long id;                    // ID de la solicitud
    private PersonaDTO emisor;          // Solo algunos atributos de Persona (DTO personalizado)
    private EstadoSolicitud estadoSolicitud; // Estado de la solicitud
    private Date fechaCreacion;         // Fecha en que se creó la solicitud
    private List<HorarioDTO> horariosSeleccionados;
    private String observacion;
    private String motivo;
    // Constructor
    public SolicitudMatriculaAdicionalDTO(Long id, PersonaDTO emisor, EstadoSolicitud estadoSolicitud, Date fechaCreacion,List<HorarioDTO> horariosSeleccionados,String observacion,String motivo) {
        this.id = id;
        this.emisor = emisor;
        this.estadoSolicitud = estadoSolicitud;
        this.fechaCreacion = fechaCreacion;
        this.horariosSeleccionados=horariosSeleccionados;
        this.observacion=observacion;
        this.motivo=motivo;
    }
    public SolicitudMatriculaAdicionalDTO(){};
}
