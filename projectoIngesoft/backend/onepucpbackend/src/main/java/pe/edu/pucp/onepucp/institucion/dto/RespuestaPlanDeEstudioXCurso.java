package pe.edu.pucp.onepucp.institucion.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RespuestaPlanDeEstudioXCurso {
    private List<PlanDeEstudioXCursoDTO> relacionesGuardadas;
    private List<String> errores;
}
