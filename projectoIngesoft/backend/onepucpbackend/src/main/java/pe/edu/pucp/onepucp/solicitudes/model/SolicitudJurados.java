package pe.edu.pucp.onepucp.solicitudes.model;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.rrhh.model.Persona;

@Entity
@Getter
@Setter
@NoArgsConstructor
@PrimaryKeyJoinColumn(referencedColumnName = "id")
public class SolicitudJurados extends Solicitud{
  
    //private ArrayList<Alumno>alumnos;
    //NO USAR ESTE ATRIBUTO
    private String temaTesis;

    @ManyToOne
    @JoinColumn(name = "id_tesis")  // Nombre de la columna en la base de datos
    private Tesis tesis;    

    @OneToOne
    @JoinColumn(name = "asesor_id")
    private Persona asesor;

    @OneToOne
    @JoinColumn(name = "coasesor_id")
    private Persona coAsesor;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
        name = "solicitud_jurados_X_jurados",  // Nombre de la tabla intermedia
        joinColumns = @JoinColumn(name = "solicitud_id"),  // Clave foránea hacia Solicitud
        inverseJoinColumns = @JoinColumn(name = "jurado_id")  // Clave foránea hacia Docente
    )
    private List<Persona>jurados;
    
    

    
}
