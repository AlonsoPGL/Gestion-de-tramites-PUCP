package pe.edu.pucp.onepucp.solicitudes.dto;

import pe.edu.pucp.onepucp.institucion.dto.EspecialidadDTO;
import pe.edu.pucp.onepucp.institucion.dto.HorarioDTO;
import pe.edu.pucp.onepucp.solicitudes.model.EstadoSolicitud;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class solicitudModificacionDeMatriculaDTO {
    private Long emisor_id;
    private Long id_solicitud;
    private String codigoAlumno;
    private String nombreAlumno;
    private String correo;
    private EstadoSolicitud estado;
    private EspecialidadDTO especialidad;  // Usamos EspecialidadDTO en vez de ID
    private List<HorarioDTO> horariosSolicitados;
}
