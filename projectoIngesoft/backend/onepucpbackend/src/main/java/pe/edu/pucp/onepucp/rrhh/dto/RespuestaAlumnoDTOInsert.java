package pe.edu.pucp.onepucp.rrhh.dto;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.institucion.dto.FacultadDTO;

@Getter
@Setter
@NoArgsConstructor
public class RespuestaAlumnoDTOInsert {
    private List<AlumnoDTOInsert> alumnoGuardados;
    private List<String> errores; 
}
