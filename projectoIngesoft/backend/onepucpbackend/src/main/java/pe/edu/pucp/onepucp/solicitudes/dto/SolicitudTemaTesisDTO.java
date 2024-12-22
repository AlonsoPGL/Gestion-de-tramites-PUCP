package pe.edu.pucp.onepucp.solicitudes.dto;


import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



import pe.edu.pucp.onepucp.rrhh.dto.AlumnoDTO;
import pe.edu.pucp.onepucp.solicitudes.model.ComentarioTesis;
import pe.edu.pucp.onepucp.solicitudes.model.EstadoAprobacion;
import pe.edu.pucp.onepucp.solicitudes.dto.TesisDTO;

@Getter
@Setter
@NoArgsConstructor
public class SolicitudTemaTesisDTO extends SolicitudDTO {
    private boolean isAprobadoPorAsesor;
    private boolean isAprobadoPorCoordinador;
    private boolean isAprobadoPorDirector;
    @JsonIgnoreProperties("solicitudTemaTesis")
    private List<ComentarioTesisDTO> comentarios;
    private EstadoAprobacion estadoAprobacion;
    private TesisDTO tesis;
    private AlumnoDTO alumno;

    private byte[] documento;
}