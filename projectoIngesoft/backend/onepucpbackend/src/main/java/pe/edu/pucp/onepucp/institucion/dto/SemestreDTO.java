package pe.edu.pucp.onepucp.institucion.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SemestreDTO {
    private Long IdSemestre;
    private String nombre;
    private Date fechaInicio;
    private Date fechaFin;

    
    private boolean activo;


   // private List<Curso> cursos;
}
