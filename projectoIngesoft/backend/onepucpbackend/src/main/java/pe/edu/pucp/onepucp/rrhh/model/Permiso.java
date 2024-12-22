package pe.edu.pucp.onepucp.rrhh.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Table(name="permiso")
@Entity
public class Permiso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String descripcion;
    
    @Lob
    @Column(name = "icono", columnDefinition="BLOB")
    private byte[] icono; 

    @OneToMany(mappedBy = "permiso", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<PermisoRol> permisoRoles; // Relación con la tabla intermedia 
}
