package pe.edu.pucp.onepucp.institucion.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.institucion.model.TipoUnidad;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EspecialidadDTO2 {
    public EspecialidadDTO2(Long idEspecialidad2, String nombre2) {
        //TODO Auto-generated constructor stub
    }
    private Long idEspecialidad;
    private String nombre;
    private String telefonoContacto;
    private String correoContacto;
    private String direccionWeb;
    private String codigo;
    private TipoUnidad tipo;
    private boolean activo;


}
