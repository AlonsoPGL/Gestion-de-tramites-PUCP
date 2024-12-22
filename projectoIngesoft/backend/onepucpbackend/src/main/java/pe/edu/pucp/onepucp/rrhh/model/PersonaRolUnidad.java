package pe.edu.pucp.onepucp.rrhh.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import pe.edu.pucp.onepucp.institucion.model.Unidad;

@Entity
@Table(name = "persona_x_rol_x_unidad")
public class PersonaRolUnidad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "persona_id")
    @JsonBackReference(value = "persona-rol")
    private Persona persona;

    @ManyToOne
    @JoinColumn(name = "rol_id")
    @JsonBackReference(value = "rol-persona")
    private Rol rol;

    @ManyToOne
    @JoinColumn(name = "unidad_id")
    private Unidad unidad
    ; 
    @Column(name = "estado")
    private boolean estado; // true = activo, false = desactivado para esa persona

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Persona getPersona() {
        return persona;
    }

    public void setPersona(Persona persona) {
        this.persona = persona;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol= rol;
    }

    public boolean isEstado() {
        return estado;
    }

    public void setEstado(boolean estado) {
        this.estado = estado;
    }

    public Unidad getUnidad() {
        return unidad;
    }

    public void setUnidad(Unidad unidad) {
        this.unidad = unidad;
    }

    
}
