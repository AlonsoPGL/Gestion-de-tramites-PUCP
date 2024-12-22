package pe.edu.pucp.onepucp.rrhh.dto;

import pe.edu.pucp.onepucp.rrhh.model.Rol;

public class RolDTO {
    private Long Id;
    private String nombre;
    private String descripcion;

    public RolDTO(Rol rol){
        this.Id = rol.getId();
        this.nombre = rol.getNombre();
        this.descripcion = rol.getDescripcion();
    }
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

    
}
