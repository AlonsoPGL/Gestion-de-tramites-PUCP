package pe.edu.pucp.onepucp.solicitudes.dto;

import java.util.Date;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.rrhh.dto.PersonaDTO;
import pe.edu.pucp.onepucp.solicitudes.model.EstadoSolicitud;
import pe.edu.pucp.onepucp.solicitudes.model.TipoSolicitud;

@Getter
@Setter
@NoArgsConstructor
public class SolicitudDTO {
    private Long id;
    private PersonaDTO emisor;
    private PersonaDTO receptor;
    private String correo;
    private String motivo;
    private EstadoSolicitud estado;
    private Date fechaCreacion;
    private String observacion;
    private TipoSolicitud tipo;
    private boolean tieneDocumento;  // En lugar de enviar el byte[] completo
}
