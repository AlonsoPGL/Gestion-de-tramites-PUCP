
package pe.edu.pucp.onepucp.institucion.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import  lombok.Setter;
import pe.edu.pucp.onepucp.rrhh.model.Rol;

@Table(name = "unidad")
@Getter
@Setter
@NoArgsConstructor
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public class Unidad {

    //!_______Attributes_______!
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = false)
    private String codigo;
    private String nombre;
    private String telefonoContacto;
    private String correoContacto;
    private String direccionWeb;
    

    
    @Enumerated(EnumType.STRING)
    private TipoUnidad tipo; 
    
    //!_______Constructors_______!
    public Unidad(String codigo, String correoContacto, String direccionWeb, Long id, String nombre, String telefonoContacto) {
        this.codigo = codigo;
        this.correoContacto = correoContacto;
        this.direccionWeb = direccionWeb;
        this.id = id;
        this.nombre = nombre;
        this.telefonoContacto = telefonoContacto;
    }
    public Unidad(Long id, String codigo, String nombre, String telefonoContacto, String correoContacto,
            String direccionWeb, TipoUnidad tipo) {
        this.id = id;
        this.codigo = codigo;
        this.nombre = nombre;
        this.telefonoContacto = telefonoContacto;
        this.correoContacto = correoContacto;
        this.direccionWeb = direccionWeb;
        this.tipo = tipo;
    }
    //!__________##________________
    
    
}
