package pe.edu.pucp.onepucp.solicitudes.dto;
import java.util.List;
import pe.edu.pucp.onepucp.rrhh.dto.AlumnoDTO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.rrhh.dto.PersonaDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
@Getter
@Setter
@NoArgsConstructor
public class TesisDTO {
    private Long id;
    private String titulo;
    @JsonIgnoreProperties({"tesis","comentarios","solicitudTemaTesis"}) 
    private List<AlumnoDTO> integrantes;
    private List<PersonaDTO> asesores;
    private List<PersonaDTO> jurados;
    //private SolicitudTemaTesisDTO solicitudTemaTesis;
    private byte[] archivo;
}