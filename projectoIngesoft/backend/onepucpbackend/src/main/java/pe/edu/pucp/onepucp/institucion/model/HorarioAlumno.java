package pe.edu.pucp.onepucp.institucion.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "horario_alumno")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HorarioAlumno {
    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "horario_id")
    private Long horarioId;

    @Column(name = "alumno_id")
    private Long alumnoId;

    // Getters y setters
}
