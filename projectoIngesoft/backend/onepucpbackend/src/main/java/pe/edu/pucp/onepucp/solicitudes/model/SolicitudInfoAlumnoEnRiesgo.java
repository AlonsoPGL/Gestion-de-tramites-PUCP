// SolicitudInfoAlumnoEnRiesgo.java
package pe.edu.pucp.onepucp.solicitudes.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.rrhh.model.AlumnoEnRiesgo_X_Horario;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "SolicitudInfoAlumnoEnRiesgo")
public class SolicitudInfoAlumnoEnRiesgo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación con AlumnoEnRiesgo_X_Horario
    @ManyToOne
    @JoinColumn(name = "alumno_en_riesgo_horario_id")
    private AlumnoEnRiesgo_X_Horario alumnoEnRiesgoXHorario;

    private String comentario;
    
    private LocalDateTime fechaSolicitud;
    private LocalDateTime fechaRespuesta;

    private Long puntajeRendimiento;
    private Boolean activo;
    private Boolean abierto;
    private Boolean leido;
}
