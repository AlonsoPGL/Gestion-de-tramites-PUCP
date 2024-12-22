package pe.edu.pucp.onepucp.solicitudes.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.institucion.model.Especialidad;
import pe.edu.pucp.onepucp.institucion.model.Horario;

@Entity
@PrimaryKeyJoinColumn(referencedColumnName = "id")
@Getter
@Setter
@NoArgsConstructor
public class SolicitudMatricula extends Solicitud {

    private String codigoAlumno;
    private String nombreAlumno;
    private String correo;
    //private String motivoSolicitud;

    @ManyToOne
    @JoinColumn(name = "especialidad_id", nullable = false) // Relación con Especialidad
   
    @JsonIgnoreProperties("solicitudesMatricula")
    private Especialidad especialidad;

    @ManyToMany(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinTable(
        name = "solicitud_matricula_x_horarios_solicitados", // Nombre de la tabla de unión
        joinColumns = @JoinColumn(name = "solicitud_matricula_id"), // Columna en la tabla de unión que hace referencia a SolicitudMatricula
        inverseJoinColumns = @JoinColumn(name = "horarios_solicitados_id_horario") // Columna en la tabla de unión que hace referencia a Horario
    ) 
    @JsonIgnoreProperties("solicitudesMatricula")
    private List<Horario> horariosSolicitados= new ArrayList<>();
}