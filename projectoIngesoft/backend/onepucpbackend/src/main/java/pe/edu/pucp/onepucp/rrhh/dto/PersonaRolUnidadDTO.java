package pe.edu.pucp.onepucp.rrhh.dto;

import pe.edu.pucp.onepucp.institucion.model.TipoUnidad;

public class PersonaRolUnidadDTO {
    private Long id;
    private Long idRol;
    private Long idUnidad;
    private String rolNombre;
    private String rolDescripcion;
    private boolean estado;
    private TipoUnidad tipo;
    private String unidadNombre;
    // Constructor
    public PersonaRolUnidadDTO(Long id,Long idRol,Long idUnidad, String rolNombre, String rolDescripcion,TipoUnidad tipo, String unidadNombre) {
        this.id= id;
        this.idRol = idRol;
        this.idUnidad = idUnidad;
        this.rolNombre = rolNombre;
        this.rolDescripcion = rolDescripcion;
        this.tipo = tipo;
        this.unidadNombre = unidadNombre;
    }

    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdRol() {
        return idRol;
    }

    public void setIdRol(Long idRol) {
        this.idRol = idRol;
    }
    
    
    public String getRolNombre() {
        return rolNombre;
    }

    public void setRolNombre(String rolNombre) {
        this.rolNombre = rolNombre;
    }

    public String getRolDescripcion() {
        return rolDescripcion;
    }

    public void setRolDescripcion(String rolDescripcion) {
        this.rolDescripcion = rolDescripcion;
    }

    public boolean isEstado() {
        return estado;
    }

    public void setEstado(boolean estado) {
        this.estado = estado;
    }

    public TipoUnidad getTipo() {
        return tipo;
    }

    public void setTipo(TipoUnidad tipo) {
        this.tipo = tipo;
    }

    public String getUnidadNombre() {
        return unidadNombre;
    }

    public void setUnidadNombre(String unidadNombre) {
        this.unidadNombre = unidadNombre;
    }


    public Long getIdUnidad() {
        return idUnidad;
    }


    public void setIdUnidad(Long idUnidad) {
        this.idUnidad = idUnidad;
    }

    
}
