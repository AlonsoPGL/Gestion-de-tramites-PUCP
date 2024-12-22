package pe.edu.pucp.onepucp.rrhh.dto;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.institucion.dto.HorarioDTO;
import pe.edu.pucp.onepucp.rrhh.dto.AlumnoDTO;



@Getter
@Setter
@NoArgsConstructor
public class AlumnoEnRiesgo_X_HorarioDTO {
    
    private Long id;
    private AlumnoDTO alumno;
    private HorarioDTO horario;
    private Long vez;   
    private String motivo;
    private Boolean enRiesgo;
    private Long cantSolXResponder;
    private Long cantRespuestaXLeer;

    public AlumnoEnRiesgo_X_HorarioDTO(Long id, Long vez, String motivo, AlumnoDTO alumno, HorarioDTO horario){
        this.id = id;
        this.vez = vez;
        this.motivo = motivo;
        this.enRiesgo = true;
        this.alumno = alumno;
        this.horario = horario;
        this.cantSolXResponder = (long) 0;
        this.cantRespuestaXLeer = (long) 0;
    }

    public AlumnoEnRiesgo_X_HorarioDTO(Long id, Long vez, String motivo, AlumnoDTO alumno, HorarioDTO horario, Long cantSolXResponder, Long cantRespuestaXLeer){
        this.id = id;
        this.vez = vez;
        this.motivo = motivo;
        this.enRiesgo = true;
        this.alumno = alumno;
        this.horario = horario;
        this.cantSolXResponder = cantSolXResponder;
        this.cantRespuestaXLeer = cantRespuestaXLeer;
    }
}
