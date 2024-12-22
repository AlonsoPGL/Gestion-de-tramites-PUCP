package pe.edu.pucp.onepucp.solicitudes.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.rrhh.model.Alumno;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Getter
@Setter
@NoArgsConstructor
@PrimaryKeyJoinColumn(referencedColumnName = "id")
public class SolicitudTemaTesis extends Solicitud{
    private boolean isAprobadoPorAsesor;
    private boolean isAprobadoPorCoordinador;
    private boolean isAprobadoPorDirector;
    //private String comentarios;
    @OneToMany(mappedBy = "solicitudTemaTesis")
    @JsonManagedReference// Esto maneja la referencia inversa, evitando referencias cíclicas
    private List<ComentarioTesis> comentarios;
    
    @Enumerated(EnumType.STRING) // Esto almacenará el valor como texto en la BD
    private EstadoAprobacion estadoAprobacion;
    @OneToOne
    @JoinColumn(name = "tesis_id")
    @JsonIgnoreProperties("solicitudTemaTesis")
    private Tesis tesis;
    @OneToOne
    @JoinColumn(name = "alumno_id")
    private Alumno alumno;
}
