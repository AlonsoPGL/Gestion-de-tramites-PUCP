package pe.edu.pucp.onepucp.institucion.dto; 
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.rrhh.dto.PersonaDTO;
import pe.edu.pucp.onepucp.rrhh.dto.PersonaDTO2;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EspecialidadDTO  extends UnidadDTO{   
    private boolean activo;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private PersonaDTO2 coordinador;

    private FacultadDTO facultad;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private PersonaDTO2 asistenteDeCarrera;

    private boolean habilitarEnvioSolicitudCursos;



    public String getImpresionEspecialidad(){
        // imprime todos los datos de la especialdiad  DTO pero en bloque
        return "EspecialidadDTO{" +
                "id=" + this.getId() + 
                ", codigo='" + this.getCodigo() + '\'' +
                ", nombre='" + this.getNombre() + '\'' +
                ", telefonoContacto='" + this.getTelefonoContacto() + '\'' +
                ", correoContacto='" + this.getCorreoContacto() + '\'' +
                ", direccionWeb='" + this.getDireccionWeb() + '\'' +
                ", tipo=" + this.getTipo() +
                ", activo=" + this.activo +
                ", coordinador=" + this.coordinador +
                ", facultad=" + this.facultad +
                ", asistenteDeCarrera=" + this.asistenteDeCarrera +
                '}';
                
    }





    public EspecialidadDTO(Long id2, String nombre2) {
        this.setId(id2);
        this.setNombre(nombre2);
    }
}
