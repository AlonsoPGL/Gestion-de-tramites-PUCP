package pe.edu.pucp.onepucp.rrhh.model;

public class PermisoRolDTO {
    private Long permisoId;
    private String permisoNombre;
    private String permisoDescripcion;
    private boolean estado;

    // Constructor
    public PermisoRolDTO(Long permisoId, String permisoNombre, String permisoDescripcion, boolean estado) {
        this.permisoId = permisoId;
        this.permisoNombre = permisoNombre;
        this.permisoDescripcion = permisoDescripcion;
        this.estado = estado;
    }

    // Getters y Setters
    public Long getPermisoId() {
        return permisoId;
    }

    public void setPermisoId(Long permisoId) {
        this.permisoId = permisoId;
    }

    public String getPermisoNombre() {
        return permisoNombre;
    }

    public void setPermisoNombre(String permisoNombre) {
        this.permisoNombre = permisoNombre;
    }

    public boolean isEstado() {
        return estado;
    }

    public void setEstado(boolean estado) {
        this.estado = estado;
    }

    public String getPermisoDescripcion() {
        return permisoDescripcion;
    }

    public void setPermisoDescripcion(String permisoDescripcion) {
        this.permisoDescripcion = permisoDescripcion;
    }

    
}
