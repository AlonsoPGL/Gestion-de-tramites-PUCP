package pe.edu.pucp.onepucp.rrhh.dto;
import java.util.Base64;

import pe.edu.pucp.onepucp.rrhh.model.Permiso;

public class PermisoDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private String icono; // En formato Base64

    // Constructor para mapear desde la entidad `Permiso`
    public PermisoDTO(Permiso permiso) {
        this.id = permiso.getId();
        this.nombre = permiso.getNombre();
        this.descripcion = permiso.getDescripcion();
        this.icono = permiso.getIcono() != null ? Base64.getEncoder().encodeToString(permiso.getIcono()) : null;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getIcono() {
        return icono;
    }

    public void setIcono(String icono) {
        this.icono = icono;
    }

    // Getters y Setters

    
}
