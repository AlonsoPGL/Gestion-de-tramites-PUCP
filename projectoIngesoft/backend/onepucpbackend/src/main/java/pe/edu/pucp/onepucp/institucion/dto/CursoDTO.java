package pe.edu.pucp.onepucp.institucion.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.institucion.model.Semestre;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@JsonInclude(JsonInclude.Include.NON_NULL)
public class CursoDTO {
    private Long idCurso;
    private String codigo;
    private String nombre;
    private double creditos;
    private boolean activo;
    //private List<PlanDeEstudio> planesDeEstudio;

    // Relación con Horario (Uno a muchos)
    private List<HorarioDTO> horarios;
    private EspecialidadDTO especialidad;
    private List<Semestre> semestres;

    //metedo que imprime todos los datos del curso
    
    public String imprimeCursoDTO(){
        return """
                Curso: %s
                Código: %s
                Créditos: %s
                Activo: %s 
                Tiene examen: %s
                Tiene laboratorio: %s
                Tiene clase: %s
                Tiene práctica: %s
                """.formatted(this.nombre, this.codigo, this.creditos, this.activo,this.tiene_examen,this.tiene_laboratorio,this.tiene_clase,this.tiene_practica);
    }
    private SeccionDTOInsersion seccion;
    private boolean tiene_examen;
    private boolean tiene_laboratorio;
    private boolean tiene_clase; 
    private boolean tiene_practica;
    
}
