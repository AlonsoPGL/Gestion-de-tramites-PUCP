package pe.edu.pucp.onepucp.institucion.dto;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.institucion.model.TipoHorario;
import pe.edu.pucp.onepucp.rrhh.dto.AlumnoDTOInsert;
import pe.edu.pucp.onepucp.rrhh.dto.PersonaDTO;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HorarioInsertDTO {

    private Long idHorario;
    
    @JsonIgnoreProperties({"horarios","cuenta","tipo","unidad","especialidad","seccion"})	
    private CursoDTO curso;
    private String codigo;
    private boolean visible;
    private String nombreCurso;
    private String codigoCurso;
    private double creditoCurso;
    private int cantAlumnos; // Cantidad de alumnos en el horario
    @JsonIgnoreProperties({"horarios","cuenta","tipo","unidad","especialidad","seccion"})	
    private PersonaDTO delegado; // Delegado del horario
    private TipoHorario tipoHorario;
    @JsonIgnoreProperties({"horarios","cuenta","tipo","unidad","especialidad","seccion"})	
    private List<AlumnoDTOInsert> alumnos;
    
}
