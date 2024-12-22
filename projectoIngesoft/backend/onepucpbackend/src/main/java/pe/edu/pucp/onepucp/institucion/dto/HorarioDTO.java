package pe.edu.pucp.onepucp.institucion.dto;

import java.time.LocalTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.rrhh.dto.AlumnoDTO;
import pe.edu.pucp.onepucp.rrhh.dto.DocenteDTO;
import pe.edu.pucp.onepucp.institucion.model.TipoHorario;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HorarioDTO {
    private Long idHorario;

    private String codigo;
    // Relación con Curso (Muchos a uno)

   // private Curso curso;
    private String nombreCurso;
    private LocalTime horaInicio;

    private LocalTime horaFin;
    private List<DocenteDTO> docentes;
    private List <JefeDePracticaDTO> jps;
    private String codigoCurso;
    private double creditoCurso;
    // @Column(nullable = false)

 

    private AlumnoDTO delegado;
    private int cantAlumnos;
    private boolean visible;
    private boolean activo;
    private List<SesionDTO> sesiones;

    public HorarioDTO(String codigo, String codigoCurso, String nombreCurso, double creditoCurso, List<DocenteDTO> docentes){
        this.codigo = codigo; // este es como el codigo de un horario del curso (OBSERVAR)
        this.codigoCurso = codigoCurso; 
        this.nombreCurso = nombreCurso;
        this.creditoCurso = creditoCurso;
        this.docentes = docentes;
        //this.horaInicio = horaInicio;
        //this.horaFin = horaFin;
    }

    public HorarioDTO(Long idHorario, String codigo, String codigoCurso, String nombreCurso, double creditoCurso, List<DocenteDTO> docentes, List <JefeDePracticaDTO> jps){
        this.idHorario = idHorario;
        this.codigo = codigo; // este es como el codigo de un horario del curso (OBSERVAR)
        this.codigoCurso = codigoCurso; 
        this.nombreCurso = nombreCurso;
        this.creditoCurso = creditoCurso;
        this.docentes = docentes;
        this.jps = jps;
    }

    public HorarioDTO(Long idHorario, String codigo, String codigoCurso, String nombreCurso, double creditoCurso, List<DocenteDTO> docentes){
        this.idHorario = idHorario;
        this.codigo = codigo; // este es como el codigo de un horario del curso (OBSERVAR)
        this.codigoCurso = codigoCurso; 
        this.nombreCurso = nombreCurso;
        this.creditoCurso = creditoCurso;
        this.docentes = docentes;
    }
    TipoHorario tipoHorario;
}

