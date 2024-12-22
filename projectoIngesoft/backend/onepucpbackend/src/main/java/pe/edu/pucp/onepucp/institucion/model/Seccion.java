package pe.edu.pucp.onepucp.institucion.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.rrhh.model.Persona;



@Getter
@Setter
@NoArgsConstructor
@jakarta.persistence.Entity
@jakarta.persistence.PrimaryKeyJoinColumn(name = "id")
public class Seccion extends Unidad {

    //!_______Attributes_______!
    @OneToOne 
    @JoinColumn(name = "jefe_id")
    @JsonIgnoreProperties({"secciones","departamento","asistente","jefe","seccion", "facultad","especialidad"})
    private Persona jefe;

    private boolean activo;

    @ManyToOne   
    @JoinColumn(name = "idDepartamento")
    @JsonIgnoreProperties({"secciones","departamento","asistente","jefe","seccion", "facultad","especialidad"})
    private Departamento departamento; 
    @OneToOne
    @JsonIgnoreProperties({"secciones","departamento","asistente","jefe","seccion", "facultad","especialidad"})
    @JoinColumn(name = "asistente_id")
    private Persona asistente;
    
}
