package pe.edu.pucp.onepucp.institucion.dto;

import lombok.Data;
import pe.edu.pucp.onepucp.solicitudes.dto.SolicitudPedidoCursoDTO_insert;

import java.util.List;
@Data
public class SolicitudPedidosCursoDTO_update {
    private Long especialidadId;
    private String semestreNombre;
    private List<SolicitudPedidoCursoDTO_insert> solicitudPedidoCursos;
    private String motivo;
    private Long id;
}
