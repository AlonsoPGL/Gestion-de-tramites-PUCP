package pe.edu.pucp.onepucp.rrhh.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.institucion.dto.EspecialidadDTO;
import pe.edu.pucp.onepucp.institucion.dto.UnidadDTO;
import pe.edu.pucp.onepucp.institucion.model.Especialidad;
import pe.edu.pucp.onepucp.institucion.model.Seccion;
import pe.edu.pucp.onepucp.rrhh.model.Cuenta;
import pe.edu.pucp.onepucp.rrhh.model.Rol;
import pe.edu.pucp.onepucp.rrhh.model.TipoPersona;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PersonaSolTesisDTO {
    private Long id;
    private String nombre; 
    private String apellidoPaterno;
    private String apellidoMaterno;
    private String email;
    private int codigo;
    private boolean activo;    
    private TipoPersona tipo; 
    
    
}