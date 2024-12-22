package pe.edu.pucp.onepucp.rrhh.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.institucion.model.Especialidad;  // Agregar esta anotación
import pe.edu.pucp.onepucp.institucion.model.Horario;

@Entity  // Agregar esta anotación
@Table(name = "alumno_en_riesgo")  // Es buena práctica especificar el nombre de la tabla
@Getter
@Setter
@NoArgsConstructor
public class AlumnoEnRiesgo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String apellidoPaterno;
    private String apellidoMaterno;
    private String codigo;
    private String semestre;
    @ManyToOne
    @JoinColumn(name = "horario_id")
    private Horario horario;//!Cambiar a horario
    private int vez;
    
    @ManyToOne
    @JoinColumn(name = "especialidad_id")
    private Especialidad especialidad;
}
