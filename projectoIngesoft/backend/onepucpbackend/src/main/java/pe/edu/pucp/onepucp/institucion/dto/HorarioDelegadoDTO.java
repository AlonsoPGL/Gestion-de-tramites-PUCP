package pe.edu.pucp.onepucp.institucion.dto;

import lombok.*;
import pe.edu.pucp.onepucp.institucion.model.Semestre;
import pe.edu.pucp.onepucp.rrhh.dto.AlumnoDTO;
import pe.edu.pucp.onepucp.rrhh.dto.DocenteDTO;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HorarioDelegadoDTO {//horario
    private String codigo;
    // Relación con Curso (Muchos a uno)
    private Long idHorario;
     private String cursoNombre;
     private List<SemestreDTO> semestres;
    //private LocalTime horaInicio;

   // private LocalTime horaFin;
    //private List<DocenteDTO> docentes;


    // @Column(nullable = false)

    private AlumnoDTO delegado;


   // private int cantAlumnos;


   //private boolean visible;


 //   private boolean activo;
}
