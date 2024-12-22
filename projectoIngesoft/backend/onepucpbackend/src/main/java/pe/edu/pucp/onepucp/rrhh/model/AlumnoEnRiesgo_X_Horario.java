package pe.edu.pucp.onepucp.rrhh.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.institucion.model.Horario;
import pe.edu.pucp.onepucp.rrhh.model.Alumno;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudInfoAlumnoEnRiesgo;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name="AlumnoEnRiesgo_X_Horario")
public class AlumnoEnRiesgo_X_Horario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "horario_id")
    private Horario horario;

    @ManyToOne
    @JoinColumn(name = "alumno_id")
    private Alumno alumno;
    
    private Long vez;
    private String motivo;
    private Boolean activo;
    private Long cantSolInfo; // cantidad de solicitudes de informacion
    private LocalDateTime fechaUltimaSolicitud; 
    private Long cantSolXResponder;
    private Long cantRespuestaXLeer;
    
    // Agregar esta relación
    @OneToMany(mappedBy = "alumnoEnRiesgoXHorario")
    private List<SolicitudInfoAlumnoEnRiesgo> solicitudes;

}