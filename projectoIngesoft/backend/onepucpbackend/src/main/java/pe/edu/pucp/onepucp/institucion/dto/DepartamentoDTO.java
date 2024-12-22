package pe.edu.pucp.onepucp.institucion.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.rrhh.dto.PersonaDTO;

@Getter
@Setter
@NoArgsConstructor
public class DepartamentoDTO extends UnidadDTO{ 
    private boolean activo;
    @JsonIgnoreProperties({"secciones","departamento","asistente","jefe","seccion", "facultad","especialidad","unidad","seccion"})
    private PersonaDTO jefe;  
    
    
     //!No se usa ya que solo se usa en el insertar y no se necesita en el listar de departamentos
}
