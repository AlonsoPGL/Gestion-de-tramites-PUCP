package pe.edu.pucp.onepucp.rrhh.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.institucion.dto.EspecialidadDTO;
import pe.edu.pucp.onepucp.institucion.dto.UnidadDTO;
import pe.edu.pucp.onepucp.institucion.model.Especialidad;
import pe.edu.pucp.onepucp.institucion.model.Seccion;
import pe.edu.pucp.onepucp.institucion.dto.SeccionDTO;
import pe.edu.pucp.onepucp.rrhh.model.Cuenta;
import pe.edu.pucp.onepucp.rrhh.model.Rol;
import pe.edu.pucp.onepucp.rrhh.model.TipoPersona;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PersonaDTO {
    private Long id;
    private String nombre;
    private EspecialidadDTO especialidad;
    private SeccionDTO seccion;
    private String apellidoPaterno;
    private String apellidoMaterno;
    private String email;
    private int codigo;
    private boolean activo;    
    private UnidadDTO unidad;
    private TipoPersona tipo;
    private Cuenta cuenta;
    private Rol rol;
    public PersonaDTO(Long id, String nombre, EspecialidadDTO especialidad, String apellidoPaterno, String apellidoMaterno,
            String email, int codigo, TipoPersona tipo, Cuenta cuenta) {
        this.id = id;
        this.nombre = nombre;
        this.especialidad = especialidad;
        this.apellidoPaterno = apellidoPaterno;
        this.apellidoMaterno = apellidoMaterno;
        this.email = email;
        this.codigo = codigo;
        this.tipo = tipo;
        this.cuenta = cuenta;
    }
    
    
}