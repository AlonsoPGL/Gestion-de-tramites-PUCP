package pe.edu.pucp.onepucp.institucion.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PlanDeEstudioXCursoDTO {
    private Long id;
    private PlanDeEstudioDTO planDeEstudio;
    
    private int cantHorarios;
    private CursoDTO curso;
    private int ciclo;
    private boolean esElectivo;
    private boolean activo; 
}
