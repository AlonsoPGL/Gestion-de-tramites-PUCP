package pe.edu.pucp.onepucp.institucion.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Setter
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Entity
@Table(name = "plan_de_estudio_x_curso")
public class PlanDeEstudioXCurso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_plan_de_estudio")
    private PlanDeEstudio planDeEstudio;

    @JoinColumn(name = "cant_horarios")
    private int cantHorarios;

    @ManyToOne
    @JoinColumn(name = "id_curso")
    private Curso curso;
    private int ciclo;

    private boolean esElectivo;

    private boolean activo;


}
