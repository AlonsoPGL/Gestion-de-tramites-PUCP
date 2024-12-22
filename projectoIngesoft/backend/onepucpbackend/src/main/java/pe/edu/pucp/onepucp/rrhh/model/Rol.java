package pe.edu.pucp.onepucp.rrhh.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import pe.edu.pucp.onepucp.institucion.model.TipoUnidad;
import pe.edu.pucp.onepucp.institucion.model.Unidad;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@Table(name="rol")
@Entity
@NoArgsConstructor
public class Rol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;
    private String nombre;
    private String descripcion;

    private boolean activo=true;

    @Enumerated(EnumType.STRING)
    private TipoUnidad tipo;

    public Long getId() {
        return Id;
    }
    public void setId(Long id) {
        Id = id;
    }
    public String getNombre() {
        return nombre;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    @OneToMany(mappedBy = "rol", cascade = CascadeType.ALL)
    @JsonIgnore // Evita la carga automática de PermisoRoles al serializar a JSON
    private List<PermisoRol> permisoRoles; // permisos por defecto del rol

    public List<PermisoRol> getPermisoRoles() {
        return permisoRoles;
    }
    public void setPermisoRoles(List<PermisoRol> permisoRoles) {
        this.permisoRoles = permisoRoles;
    }
    public boolean isActivo() {
        return activo;
    }
    public void setActivo(boolean activo) {
        this.activo = activo;
    }
    
    

    
    
}
