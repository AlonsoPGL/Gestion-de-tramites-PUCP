package pe.edu.pucp.onepucp.rrhh.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrimaryKeyJoinColumn;
import lombok.Getter;
import  lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.institucion.model.Facultad;
import pe.edu.pucp.onepucp.institucion.model.Horario;
import pe.edu.pucp.onepucp.rrhh.dto.AlumnoDTO;
import pe.edu.pucp.onepucp.solicitudes.model.Tesis;
@Entity
@PrimaryKeyJoinColumn(referencedColumnName = "id")
@Getter
@Setter
@NoArgsConstructor
public class Alumno extends Persona {

    private Boolean enRiesgo;

    @ManyToOne
    private Facultad facultad;


    // Relacionado bidireccionalmente
    @JsonIgnoreProperties({"alumnos"})
    @ManyToMany(mappedBy = "alumnos")
    private List<Horario> horarios;
    
    @ManyToOne
    @JsonManagedReference
    @JoinColumn(name = "tesis_id")
    private Tesis tesis;
    
    @JsonIgnoreProperties({"alumno", "horarios_delegado","docentes","delegado"})	
    @OneToMany(mappedBy = "delegado") 
    private List<Horario> horarios_delegado;

    public AlumnoDTO toDTO() {
        AlumnoDTO alumnoDTO = new AlumnoDTO();
        alumnoDTO.setId(this.getId() != null ? this.getId() : 0L); // Valor predeterminado si el ID es null
        alumnoDTO.setNombre(this.getNombre() != null ? this.getNombre() : ""); // Manejo seguro para nombre
        alumnoDTO.setApellidoPaterno(this.getApellidoPaterno() != null ? this.getApellidoPaterno() : "");
        alumnoDTO.setApellidoMaterno(this.getApellidoMaterno() != null ? this.getApellidoMaterno() : "");
        alumnoDTO.setEmail(this.getEmail() != null ? this.getEmail() : ""); // Manejo seguro para email
        alumnoDTO.setCodigo(this.getCodigo() > 0 ? this.getCodigo() : 0); // Manejo seguro para código
        alumnoDTO.setActivo(this.isActivo()); // `boolean` no puede ser null
        alumnoDTO.setEnRiesgo(this.getEnRiesgo() != null ? this.getEnRiesgo() : false); // Valor predeterminado si es null
        return alumnoDTO;
    }
    
}
