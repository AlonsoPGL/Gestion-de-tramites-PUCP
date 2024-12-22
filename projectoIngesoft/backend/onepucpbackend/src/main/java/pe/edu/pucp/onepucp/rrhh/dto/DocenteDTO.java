package pe.edu.pucp.onepucp.rrhh.dto;

import jakarta.persistence.*;
import lombok.*;
import pe.edu.pucp.onepucp.rrhh.model.Cuenta;
import pe.edu.pucp.onepucp.rrhh.model.Docente;
import pe.edu.pucp.onepucp.rrhh.model.Rol;
import pe.edu.pucp.onepucp.rrhh.model.TipoPersona;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DocenteDTO {
    private Long id;
    private String nombre;
    private String apellidoPaterno;
    private String apellidoMaterno;

    private String email;


    private int codigo;

    private boolean activo;

   // private List<PermisoPersona> personaPermisos; // Permisos personalizados con estado

   // private Rol rol;
   // private int calificacionAnual;

   public DocenteDTO(Docente docente){
        this.id = docente.getId();
        this.nombre = docente.getNombre();
        this.apellidoPaterno = docente.getApellidoPaterno();
        this.apellidoMaterno = docente.getApellidoMaterno();
        this.email = docente.getEmail();
        this.codigo = docente.getCodigo();
        this.activo = docente.isActivo();
   }
}
