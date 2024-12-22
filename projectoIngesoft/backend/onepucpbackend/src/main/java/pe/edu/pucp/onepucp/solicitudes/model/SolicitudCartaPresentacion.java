package pe.edu.pucp.onepucp.solicitudes.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
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
import jakarta.persistence.PrimaryKeyJoinColumn;
import pe.edu.pucp.onepucp.institucion.model.Curso;
import pe.edu.pucp.onepucp.institucion.model.Especialidad;
import pe.edu.pucp.onepucp.rrhh.model.Alumno;
import pe.edu.pucp.onepucp.rrhh.model.Docente;
import pe.edu.pucp.onepucp.rrhh.model.Persona;

@Entity
@PrimaryKeyJoinColumn(referencedColumnName = "id")
public class SolicitudCartaPresentacion extends Solicitud{
    @ManyToOne
    @JoinColumn(name = "profesor_id")
    private Docente profesor;
    //private Curso cursoMatriculado;
    @Column(name = "empresa_practica")
    private String empresaPractica;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
        name = "solicitud_carta_presentacion_X_integrantes",
        joinColumns = @JoinColumn(name = "solicitud_id"),
        inverseJoinColumns = @JoinColumn(name = "alumno_id")
    )
    @JsonManagedReference // Esta es la parte "gestionada"
    private List<Alumno> integrantes;

    @Column(name = "actividades_desarrollar")
    private String actividadesDesarrollar;
    @JsonIgnoreProperties({"solicitudes","horarios","horarios_delegado"})
    @ManyToOne
    @JoinColumn(name = "curso_id")
    private Curso curso;

    @ManyToOne
    @JoinColumn(name = "especialidad_id")
    private Especialidad especialidad;

    public Especialidad getEspecialidad() {
        return especialidad;
    }

    public void setEspecialidad(Especialidad especialidad) {
        this.especialidad = especialidad;
    }


    public Curso getCurso() {
        return curso;
    }
    public void setCurso(Curso curso) {
        this.curso = curso;
    }
    public List<Alumno> getIntegrantes() {
        return integrantes;
    }

    /*@ManyToOne
    @JoinColumn(name = "secretaria_id") // Nombre de la columna que tendrá la referencia en la base de datos
    private Persona secretaria; // La secretaria que maneja la solicitud

    @ManyToOne
    @JoinColumn(name = "director_id") // Nombre de la columna que tendrá la referencia en la base de datos
    private Persona director; // La secretaria que maneja la solicitud
*/
    public void setIntegrantes(List<Alumno> integrantes) {
        this.integrantes = integrantes;
    }
    

    public Docente getProfesor() {
        return profesor;
    }
    public void setProfesor(Docente profesor) {
        this.profesor = profesor;
    }
    public String getEmpresaPractica() {
        return empresaPractica;
    }
    public void setEmpresaPractica(String empresaPractica) {
        this.empresaPractica = empresaPractica;
    }
    

    
    public String getActividadesDesarrollar() {
        return actividadesDesarrollar;
    }
    public void setActividadesDesarrollar(String actividadesDesarrollar) {
        this.actividadesDesarrollar = actividadesDesarrollar;
    }

    public SolicitudCartaPresentacion() {
        this.integrantes = new ArrayList<>(); // Inicializas en el constructor
    }
}   
