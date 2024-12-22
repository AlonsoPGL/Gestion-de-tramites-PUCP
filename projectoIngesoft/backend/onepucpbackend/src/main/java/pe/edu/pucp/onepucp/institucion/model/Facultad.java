package pe.edu.pucp.onepucp.institucion.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.preguntas.model.Encuesta;
import pe.edu.pucp.onepucp.rrhh.model.Alumno;
import pe.edu.pucp.onepucp.rrhh.model.Persona;
@Entity
@Getter
@Setter
@NoArgsConstructor
@PrimaryKeyJoinColumn(name = "id")
public class Facultad extends Unidad {

    //!_______Attributes_______!
    private boolean activo;

    @OneToMany(mappedBy = "facultad")
    @JsonIgnoreProperties("facultad") 
    private List<Especialidad> especialidades;

    @JsonIgnore
    @OneToMany(mappedBy = "facultad")
    private List<Alumno> alumnos; 

    @OneToMany(mappedBy = "facultad", cascade = CascadeType.ALL)
    @JsonIgnore // Esta anotación evita que la lista de encuestas se serialice
    private List<Encuesta> encuestas; 

    @OneToOne
    @JsonIgnoreProperties("facultad,especialidades")
    private Persona secretarioAcademico;
    //!_______Constructors_______!
    public Facultad(boolean activo, List<Especialidad> especialidades, List<Alumno> alumnos, List<Encuesta> encuestas) {
        this.activo = activo;
        this.especialidades = especialidades;
        this.alumnos = alumnos;
        this.encuestas = encuestas;
    }
}
