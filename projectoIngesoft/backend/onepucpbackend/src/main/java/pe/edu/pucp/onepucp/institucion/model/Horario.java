package pe.edu.pucp.onepucp.institucion.model;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.preguntas.model.Encuesta;
import pe.edu.pucp.onepucp.rrhh.model.Alumno;
import pe.edu.pucp.onepucp.rrhh.model.Docente;

@Entity
@Table(name = "horario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Horario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idHorario;

    // Relación con Curso (Muchos a uno)
    @ManyToOne
    @JoinColumn(name = "idCurso", nullable = false)
    @JsonBackReference
    private Curso curso;

    // Relación con Sesión: Un Horario tiene 0 o muchas Sesiones
    @OneToMany(mappedBy = "horario", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Sesion> sesiones;

    @ManyToMany
    @JoinTable(
            name = "horario_docente",
            joinColumns = @JoinColumn(name = "horario_id"),
            inverseJoinColumns = @JoinColumn(name = "docente_id")
    )
    private List<Docente> docentes;

    @ManyToMany
    @JoinTable(
            name = "horario_alumno",
            joinColumns = @JoinColumn(name = "horario_id"),
            inverseJoinColumns = @JoinColumn(name = "alumno_id")
    )
    private List<Alumno> alumnos;
    

    @Column(nullable = false)
    private String nombreCurso;
        
    @Column(nullable = false)
    private String codigoCurso;

    @Column(nullable = false)
    private double creditoCurso;
    //valor por defecto null
    
    
    @ManyToOne
    @JsonIgnoreProperties({"horarios_delegado","delegado","alumno","horarios"})
    @JoinColumn(name = "idDelegado")
    private Alumno delegado;

    @Column(nullable = false)
    private int cantAlumnos;

    @Column(nullable = false)
    private boolean visible;

    @Column(nullable = false)
    private boolean activo;

    @Column(nullable = false)
    private String codigo;
   


    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
        name = "horario_x_Jefe_De_Practica",
        joinColumns = @JoinColumn(name = "idHorario"),
        inverseJoinColumns = @JoinColumn(name = "idJefeDePractica")
    )
    //@JsonBackReference(value = "horarios-jps") // Esta es la parte "gestionada"
    private List<JefeDePractica> jps;
    @JsonIgnoreProperties({"horarios","horariosDelegado","horariosJp","coordinador","horario"})
    @ManyToOne
    @JoinColumn(name = "idEncuestaDocente")
    private Encuesta encuestaDocente;

    @ManyToOne
    @JoinColumn(name = "idEncuestaJp")
    private Encuesta encuestaJp;
    @Enumerated(EnumType.STRING)
    TipoHorario tipoHorario;
    /*@OneToMany(mappedBy = "horario", cascade = CascadeType.ALL)
    @JsonManagedReference // Esta está bien
    private List<Matricula> matriculas;*/
    
    //relacion con jps  
    //! FUNCIONES
    /*public List<Alumno> alumnos_en_riesgo (){
    return matriculas.stream()
        .filter(Matricula::isMatriculaenRiesgo)
        .map(Matricula::getAlumno)
        .collect(Collectors.toList());
    }*/
    @ManyToOne
    @JoinColumn(name = "semestre_id") // Define la columna FK en la tabla Horario
    private Semestre semestre;
}