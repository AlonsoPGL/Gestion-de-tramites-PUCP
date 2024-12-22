package pe.edu.pucp.onepucp.institucion.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "plan_de_estudio")
public class PlanDeEstudio  {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPlanDeEstudio;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false)
    private boolean activo;
    
    @OneToOne
    @JoinColumn(name = "id")
    private Especialidad especialidad;


}
