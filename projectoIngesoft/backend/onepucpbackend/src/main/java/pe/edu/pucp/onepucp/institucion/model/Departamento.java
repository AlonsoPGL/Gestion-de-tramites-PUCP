package pe.edu.pucp.onepucp.institucion.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.rrhh.model.Persona;

@Entity
@Getter
@Setter
@NoArgsConstructor
@PrimaryKeyJoinColumn(name = "id")

public class Departamento extends Unidad {

    
    @OneToOne
    @JsonIgnoreProperties({"secciones","departamento","asistente","jefe","seccion", "facultad","especialidad"})
    @JoinColumn(name="jefe_id") 
    private Persona jefe;
    
    private boolean activo;
    @JsonIgnoreProperties({"secciones","departamento","asistente","jefe","seccion", "facultad","especialidad"})
    @OneToMany(mappedBy = "departamento")
    private List<Seccion> secciones; 
}
