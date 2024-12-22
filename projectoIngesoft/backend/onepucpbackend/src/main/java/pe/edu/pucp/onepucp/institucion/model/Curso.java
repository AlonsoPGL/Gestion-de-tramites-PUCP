package pe.edu.pucp.onepucp.institucion.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
 
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Table(name="curso")
@Entity
@Getter
@Setter
@NoArgsConstructor
public class Curso {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCurso;

    @Column(nullable = false)
    private String codigo;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private double creditos;

    @Column(nullable = false)
    private boolean activo;

    // @JsonIgnoreProperties("cursos")
    // @ManyToMany(mappedBy = "cursos")
    // private List<PlanDeEstudio> planesDeEstudio;

    // Relación con Horario (Uno a muchos)
    @OneToMany(mappedBy = "curso")
    @JsonManagedReference // Evitar ciclo
    private List<Horario> horarios;

    // Relación muchos a uno con Especialidad
    @ManyToOne
    @JoinColumn(name = "id", nullable = false)
    //@JsonBackReference
    private Especialidad especialidad;

    @ManyToMany
    @JoinTable(
        name = "semestre_curso",
        joinColumns = @JoinColumn(name = "curso_id"),
        inverseJoinColumns = @JoinColumn(name = "semestre_id")
    )
    private List<Semestre> semestres;
    /* 
    @ManyToMany
    @JoinTable(
        name = "curso_docente",
        joinColumns = @JoinColumn(name = "idCurso"),
        inverseJoinColumns = @JoinColumn(name = "idDocente")
    )
    private List<Docente> docentes;

*/  @JsonManagedReference
    @ManyToOne
    @JoinColumn(name = "id_seccion") 
    Seccion seccion; 

    private boolean tiene_laboratorio; 
    private boolean tiene_practica;
    private boolean tiene_clase;
    private boolean tiene_examen;
}
