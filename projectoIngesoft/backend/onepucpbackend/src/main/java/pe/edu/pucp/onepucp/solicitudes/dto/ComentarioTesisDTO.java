package pe.edu.pucp.onepucp.solicitudes.dto;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.rrhh.dto.PersonaDTO;
import pe.edu.pucp.onepucp.rrhh.dto.PersonaSolTesisDTO;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudTemaTesis;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ComentarioTesisDTO {
    private Long id;
    private String comentario;
    private PersonaSolTesisDTO revisor;
    private Date fecha;
    @JsonIgnoreProperties("comentarios")
    private SolicitudTemaTesisDTO solicitudTemaTesisId; // Solo el ID de la solicitud
    private boolean activo;
    private boolean aprobado;
}
