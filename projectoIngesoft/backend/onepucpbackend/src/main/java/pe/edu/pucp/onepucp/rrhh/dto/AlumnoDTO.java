package pe.edu.pucp.onepucp.rrhh.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.rrhh.model.Alumno;
@Getter
@Setter
@NoArgsConstructor
public class AlumnoDTO {
    private Long id;
    private String nombre;
    private String apellidoPaterno;
    private String apellidoMaterno;
    
    private String email;

    private int codigo;
    private boolean enRiesgo;
    //private int idTesis;
    private boolean activo;

    public Alumno toEntity() {
        Alumno alumno = new Alumno();
        alumno.setId(this.id != null ? this.id : 0L); // Valor predeterminado si el ID es null
        alumno.setNombre(this.nombre != null ? this.nombre : ""); // Valor predeterminado para nombre
        alumno.setApellidoPaterno(this.apellidoPaterno != null ? this.apellidoPaterno : "");
        alumno.setApellidoMaterno(this.apellidoMaterno != null ? this.apellidoMaterno : "");
        alumno.setEmail(this.email != null ? this.email : ""); // Manejo seguro para email
        alumno.setCodigo(this.codigo > 0 ? this.codigo : 0); // Manejo seguro para código
        alumno.setActivo(this.activo); // `boolean` no puede ser null
        alumno.setEnRiesgo(this.enRiesgo);// Manejo seguro para enRiesgo
        return alumno;
    }
    
    
    public AlumnoDTO(int codigo, String nombre, String apellidoPaterno, String email) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.apellidoPaterno = apellidoPaterno;
        this.email = email;
    }

    public AlumnoDTO(int codigo, String nombre, String email) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.email = email;
    }

    public AlumnoDTO(Long id, int codigo, String nombre, String apellidoPaterno, String apellidoMaterno, String email) {
        this.id =  id;
        this.codigo = codigo;
        this.apellidoPaterno = apellidoPaterno;
        this.apellidoMaterno = apellidoMaterno;
        this.nombre = nombre;
        this.email = email;
    }
    public AlumnoDTO(Long id, String nombre, String apellidoPaterno, String apellidoMaterno, String email, int codigo, boolean activo, boolean enRiesgo) {
        this.id = id;
        this.nombre = nombre;
        this.apellidoPaterno = apellidoPaterno;
        this.apellidoMaterno = apellidoMaterno;
        this.email = email;
        this.codigo = codigo;
        this.activo = activo;
        this.enRiesgo = enRiesgo;
    }
    public AlumnoDTO(Long id, String nombre, String apellidoPaterno, String apellidoMaterno, String email, int codigo, boolean activo) {
        this.id = id;
        this.nombre = nombre;
        this.apellidoPaterno = apellidoPaterno;
        this.apellidoMaterno = apellidoMaterno;
        this.email = email;
        this.codigo = codigo;
        this.activo = activo;
    }
    
    public AlumnoDTO(Long id, int codigo, String nombre, String apellidoPaterno, String apellidoMaterno, String email, boolean activo) {
        this.id =  id;
        this.codigo = codigo;
        this.apellidoPaterno = apellidoPaterno;
        this.apellidoMaterno = apellidoMaterno;
        this.nombre = nombre;
        this.email = email;
        this.activo = activo;
    }
}
