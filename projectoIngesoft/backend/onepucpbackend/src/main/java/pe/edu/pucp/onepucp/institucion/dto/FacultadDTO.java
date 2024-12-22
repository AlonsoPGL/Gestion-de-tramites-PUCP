package pe.edu.pucp.onepucp.institucion.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import pe.edu.pucp.onepucp.rrhh.dto.PersonaDTO;
@Data
@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
public class FacultadDTO extends UnidadDTO{
    private boolean activo;
    @JsonIgnoreProperties({"secciones","departamento","asistente","jefe","seccion", "facultad","especialidad"})
    private PersonaDTO secretarioAcademico;
    //private 
    public String impresionfacultad(){
        String impresion = "Facultad: "+this.getNombre()+"\n";

        impresion += "Código: "+this.getCodigo()+"\n";
        if(this.secretarioAcademico != null){
            impresion += "Secretario Académico: "+this.secretarioAcademico.getNombre()+" "+this.secretarioAcademico.getApellidoPaterno()+"\n";
        }
        return impresion;
       
    }
}
