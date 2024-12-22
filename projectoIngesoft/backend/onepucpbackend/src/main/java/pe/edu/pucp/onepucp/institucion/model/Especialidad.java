package pe.edu.pucp.onepucp.institucion.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.rrhh.model.Alumno;
import pe.edu.pucp.onepucp.rrhh.model.Persona;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudMatricula;




@Entity
@Getter
@Setter 
@NoArgsConstructor
@PrimaryKeyJoinColumn(name = "id")
public class Especialidad extends Unidad{ 

    @Column(nullable = false)
    private boolean activo;
    // Relación uno a muchos con Curso
    @OneToMany(mappedBy = "especialidad", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Curso> cursos;

    @JsonIgnore
    @OneToMany(mappedBy = "especialidad")
    private List<Alumno> alumnos;

    @OneToMany(mappedBy = "especialidad") // Relación inversa de uno a muchos
    @JsonIgnore
    private List<SolicitudMatricula> solicitudesMatricula; // Lista de solicitudes asociadas
    
    @ManyToOne 
    @JsonIgnoreProperties({"especialidades","especialidad","coordinador","facultad","asistenteDeCarrera"})
    @JoinColumn(name = "facultad_id")
    private Facultad facultad;  

    @OneToOne
    @JsonIgnoreProperties({"especialidades","especialidad","coordinador","facultad","asistenteDeCarrera"})
    @JoinColumn(name = "coordinador_id")
    private Persona coordinador;

    @OneToOne
    @JsonIgnoreProperties({"especialidades","especialidad","coordinador","facultad","asistenteDeCarrera"})
    @JoinColumn(name="asistente_de_carrera_id")   
    private Persona asistenteDeCarrera;
    
    @Column(nullable = false)
    private boolean habilitarEnvioSolicitudCursos;
}
