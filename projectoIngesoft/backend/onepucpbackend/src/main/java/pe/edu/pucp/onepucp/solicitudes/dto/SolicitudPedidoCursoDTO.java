package pe.edu.pucp.onepucp.solicitudes.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.institucion.dto.CursoDTO;
import pe.edu.pucp.onepucp.institucion.dto.CursoDTO2;

import java.util.List;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SolicitudPedidoCursoDTO {
    private Long id;
    private CursoDTO curso;
    private int cantHorarios;
}
