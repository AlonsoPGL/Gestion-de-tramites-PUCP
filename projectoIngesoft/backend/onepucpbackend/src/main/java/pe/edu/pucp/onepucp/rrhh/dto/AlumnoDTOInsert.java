package pe.edu.pucp.onepucp.rrhh.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Setter
public class AlumnoDTOInsert {
    Long id;
    String nombre;
    String apellidoPaterno;
    String apellidoMaterno;
    String correo;
    String telefono;
    String direccion; 
    int codigo;
}
