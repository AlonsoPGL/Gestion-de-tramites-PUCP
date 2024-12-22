package pe.edu.pucp.onepucp.preguntas.model;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn; 
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany; 
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.institucion.model.Facultad;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "encuesta")
@Entity
public class Encuesta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEncuesta;

    private boolean esIntermedia;
    private Date   fechaInicio;
    private Date  fechaFin;
    private String titulo;
    
    @OneToMany(mappedBy = "encuesta", cascade = CascadeType.ALL, orphanRemoval = true) //fetch = FetchType.LAZY may be usefull
    @JsonManagedReference(value = "encuesta-pregunta")
    private List<Pregunta> preguntas;

    @Column(nullable = true) 
    private boolean activo;

    @Column(nullable = true) 
    @Enumerated(EnumType.STRING)
    private TipoEncuesta tipo;

    @ManyToOne
    @JsonIgnoreProperties({"encuestas","encuestaDocente","encuestaJP","coordinador", "encuesta","especialidades"})
    @JoinColumn(name = "id_facultad", referencedColumnName = "id") // Clave foránea en Encuesta
    private Facultad facultad;  

    public Long getId_Encuesta() {
        return idEncuesta;
    } 
}
