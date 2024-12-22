package pe.edu.pucp.onepucp.institucion.dto;

import pe.edu.pucp.onepucp.rrhh.dto.AlumnoDTO; 
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AllArgsConstructor;


@Getter
@NoArgsConstructor
@AllArgsConstructor
@Setter
public  class AlumnoHorarioDTO {
    AlumnoDTO alumno;
    HorarioInsertDTO horario;
}
