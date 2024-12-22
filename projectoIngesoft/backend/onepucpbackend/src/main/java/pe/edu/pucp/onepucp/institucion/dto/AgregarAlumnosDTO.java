package pe.edu.pucp.onepucp.institucion.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.rrhh.dto.AlumnoDTOInsert;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AgregarAlumnosDTO {
    private Long idHorario;
    private List<AlumnoDTOInsert> alumnos;
}