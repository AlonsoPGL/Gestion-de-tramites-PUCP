package pe.edu.pucp.onepucp.institucion.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.institucion.model.Horario;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class JefeDePracticaDTO {
    private Long idJefeDePractica;
    private String nombre;
    private int calificacionAnual;
    private boolean activo;
       
}
