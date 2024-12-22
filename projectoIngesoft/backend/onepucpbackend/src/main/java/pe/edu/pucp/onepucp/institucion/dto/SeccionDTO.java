package pe.edu.pucp.onepucp.institucion.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.rrhh.dto.PersonaDTO;
@Getter
@Setter
@NoArgsConstructor
public class SeccionDTO extends UnidadDTO{ 
    private boolean activo;
    @JsonIgnoreProperties({"secciones","departamento","asistente","jefe","seccion", "facultad","especialidad"})
    private DepartamentoDTO departamento;
    @JsonIgnoreProperties({"secciones","departamento","asistente","jefe","seccion", "facultad","especialidad"})
    private PersonaDTO jefe;

    @JsonIgnoreProperties({"secciones","asistente","departamento","jefe","seccion", "facultad","especialidad"})
    private PersonaDTO asistente;
}
