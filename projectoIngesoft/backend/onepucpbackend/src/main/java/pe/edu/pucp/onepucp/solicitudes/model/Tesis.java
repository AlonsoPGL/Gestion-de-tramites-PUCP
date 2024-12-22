package pe.edu.pucp.onepucp.solicitudes.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.institucion.model.Especialidad;
import pe.edu.pucp.onepucp.rrhh.model.Alumno;
import pe.edu.pucp.onepucp.rrhh.model.Persona;
@Entity 
@Getter
@Setter
@NoArgsConstructor
@Table(name = "Tesis")
public class Tesis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titulo;


    /*
    @OneToMany
    @JoinColumn(name = "tesis_id")
    private List<Alumno>integrantes;
        */
    /*
    @OneToMany(mappedBy = "tesis")
    private List<Alumno> integrantes;
*/
    
    @JsonIgnoreProperties({"tesis","horarios","horarios_delegado"})
    @OneToMany(mappedBy = "tesis")
    private List<Alumno> integrantes;

    @JsonIgnoreProperties({"tesis","horarios","horarios_delegado"})
    @ManyToMany
    @JoinTable(
            name = "tesis_x_asesor",  // Nombre de la tabla intermedia
            joinColumns = @JoinColumn(name = "id_tesis"),  // Columna en la tabla intermedia que referencia a Tesis
            inverseJoinColumns = @JoinColumn(name = "id_asesor")  // Columna en la tabla intermedia que referencia a Persona
    )
    private List<Persona>asesores;
    @ManyToMany
    @JoinTable(
            name = "tesis_x_jurado",  // Nombre de la tabla intermedia
            joinColumns = @JoinColumn(name = "id_tesis"),  // Columna en la tabla intermedia que referencia a Tesis
            inverseJoinColumns = @JoinColumn(name = "id_jurado")  // Columna en la tabla intermedia que referencia a Persona
    )
    @JsonIgnoreProperties({"tesis","horarios","horarios_delegado"})
    private List<Persona>jurados;
    @OneToOne
    @JoinColumn(name="id_solicitud")
    private SolicitudTemaTesis solicitudTemaTesis;

    
    @OneToMany(mappedBy = "tesis", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<SolicitudJurados> solicitudesJurados;

    @ManyToOne
    @JoinColumn(name = "id_especialidad")
    private Especialidad especialidad;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] documento;
}
