package pe.edu.pucp.onepucp.institucion.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

 
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PlanDeEstudioDTO {
    private Long idPlanDeEstudio;
    private String nombre;
    private boolean activo;
    private EspecialidadDTO especialidad;
    
}
