package pe.edu.pucp.onepucp.solicitudes.dto;

import java.util.List;
import lombok.Data;

@Data
public class SolicitudPedidosCursosDTO_insert {
    private Long especialidadId;
    private String semestreNombre;
    private List<SolicitudPedidoCursoDTO_insert> solicitudPedidoCursos;
    private String motivo;
}
