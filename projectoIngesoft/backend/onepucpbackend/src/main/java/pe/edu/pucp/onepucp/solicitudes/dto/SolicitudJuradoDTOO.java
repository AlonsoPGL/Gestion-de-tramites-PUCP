package pe.edu.pucp.onepucp.solicitudes.dto;

import jakarta.persistence.CascadeType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.Data;
import pe.edu.pucp.onepucp.rrhh.dto.PersonaDTO;
import pe.edu.pucp.onepucp.rrhh.model.Persona;
import pe.edu.pucp.onepucp.solicitudes.model.EstadoSolicitud;
import pe.edu.pucp.onepucp.solicitudes.model.Solicitud;
import pe.edu.pucp.onepucp.solicitudes.model.Tesis;

import java.util.Date;
import java.util.List;
@Data
public class SolicitudJuradoDTOO {
    private Long id;
    private String temaTesis;

   // Nombre de la columna en la base de datos
    private TesisDTO tesis;
    private PersonaDTO receptor;
    private String correo;
    private String motivo;
    private EstadoSolicitud estado;
    private Date fechaCreacion;
    private PersonaDTO emisor;
    private PersonaDTO asesor;


    private PersonaDTO coAsesor;


    private List<PersonaDTO> jurados;
}
