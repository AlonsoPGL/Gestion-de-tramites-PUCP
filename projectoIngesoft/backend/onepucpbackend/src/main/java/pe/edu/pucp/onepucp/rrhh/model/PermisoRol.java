package pe.edu.pucp.onepucp.rrhh.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "permiso_x_rol")
public class PermisoRol {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "permiso_id", nullable = false)
    @JsonBackReference(value = "permiso-rol") // Indica que esta es la parte "respaldada" de la relación
    private Permiso permiso;

    @ManyToOne
    @JoinColumn(name = "rol_id", nullable = false)
    @JsonBackReference(value = "rol-permiso") // Indica que esta es la parte "respaldada" de la relación
    private Rol rol;

    @Column(name = "estado")
    private boolean estado; // true: activo, false: inactivo

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Permiso getPermiso() {
        return permiso;
    }

    public void setPermiso(Permiso permiso) {
        this.permiso = permiso;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public boolean isEstado() {
        return estado;
    }

    public void setEstado(boolean estado) {
        this.estado = estado;
    }

    
}
