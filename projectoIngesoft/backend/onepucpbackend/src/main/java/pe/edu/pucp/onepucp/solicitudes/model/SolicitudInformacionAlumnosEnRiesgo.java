package pe.edu.pucp.onepucp.solicitudes.model;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;

import jakarta.persistence.OneToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.institucion.model.Horario;
import pe.edu.pucp.onepucp.rrhh.model.Alumno;

@Entity
@Getter
@Setter
@NoArgsConstructor
@PrimaryKeyJoinColumn(referencedColumnName = "id")
public class SolicitudInformacionAlumnosEnRiesgo  extends Solicitud {
    private Boolean activo;
    private int nivelRendimiento;
    private Boolean abiertoCerrado;  // true / false

    @OneToOne  // Uno a muchos desde el alumno a la solicitud
    @JoinColumn(name = "id_alumno")
    private Alumno alumno;

    @OneToOne
    @JoinColumn(name = "id_horario")
    private Horario horario;
    
    
    //añadir puntaje
}
