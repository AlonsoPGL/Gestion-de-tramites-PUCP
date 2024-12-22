package pe.edu.pucp.onepucp.institucion.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.institucion.model.TipoUnidad;



@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor 
public class UnidadDTO {
    private Long id;
    private String codigo;
    private String nombre;
    private String telefonoContacto;
    private String correoContacto;
    private String direccionWeb;
    private TipoUnidad tipo;
}
