package pe.edu.pucp.onepucp.preguntas.model;

import java.util.ArrayList;
import java.util.List;
import jakarta.annotation.Generated;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSubTypes;

//esto es para poder enviarle el tipo de pregunta defrente desde el front uu
/*@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "@class"
)
@JsonSubTypes({
    @JsonSubTypes.Type(value = PreguntaTextBox.class, name = "PreguntaTextBox"),
    @JsonSubTypes.Type(value = PreguntaOpcionMultiple.class, name = "PreguntaOpcionMultiple")
})*/

@Table(name = "pregunta")
@Entity
public class Pregunta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPregunta;

    private int numeracion;
    private String descripcion;

    @ManyToOne
    @JoinColumn(name = "idEncuesta", nullable = false)  // Llave foránea
    @JsonBackReference(value = "encuesta-pregunta") //para evitar relaciones circulares busaso //recordarrr
    //@JsonIgnore
    private Encuesta encuesta;
    
    @Column(nullable = true) 
    private boolean activo;


    public TipoPregunta getTipo() {
        return tipo;
    }

    public void setTipo(TipoPregunta tipo) {
        this.tipo = tipo;
    }

    /*@OneToMany(mappedBy = "pregunta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RespuestasTxt_X_Docente> respuestaTXTDocente;
    
    @OneToMany(mappedBy = "pregunta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RespuestasTxt_X_JP> respuestaTXTJp; */



    @Enumerated(EnumType.STRING)
    private TipoPregunta tipo;

    public Pregunta(String descripcion, Encuesta encuesta, Long id_Pregunta, int numeracion,boolean activo,TipoPregunta tipo) {
        this.descripcion = descripcion;
        this.encuesta = encuesta;
        this.idPregunta = id_Pregunta;
        this.numeracion = numeracion;
        this.activo = activo;
        this.tipo = tipo;
    }

    public Pregunta() {
    }

    public Long getId_Pregunta() {
        return idPregunta;
    }

    public void setId_Pregunta(Long id_Pregunta) {
        this.idPregunta = id_Pregunta;
    }

    public int getNumeracion() {
        return numeracion;
    }

    public void setNumeracion(int numeracion) {
        this.numeracion = numeracion;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Encuesta getEncuesta() {
        return encuesta;
    }

    public void setEncuesta(Encuesta encuesta) {
        this.encuesta = encuesta;
    }
    
    
    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }

}
