package pe.edu.pucp.onepucp.institucion.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter

@NoArgsConstructor
public class CursoDTO2 {
    private Long idCurso;


    public CursoDTO2(Long idCurso, String codigo, String nombre, double creditos, boolean activo, List<HorarioDTO2> horarios) {
        this.idCurso = idCurso;
        this.codigo = codigo;
        this.nombre = nombre;
        this.creditos = creditos;
        this.activo = activo;
        this.horarios = new ArrayList<HorarioDTO2>();
    }
    public CursoDTO2(Long idCurso, String codigo, String nombre, double creditos, boolean activo) {
        this.idCurso = idCurso;
        this.codigo = codigo;
        this.nombre = nombre;
        this.creditos = creditos;
        this.activo = activo;

    }
    private String codigo;
    private String nombre;
    private double creditos;
    private boolean activo;
    private List<HorarioDTO2> horarios;
    private boolean tiene_laboratorio; 
    private boolean tiene_practica;
    private boolean tiene_clase;
    private boolean tiene_examen;

}
