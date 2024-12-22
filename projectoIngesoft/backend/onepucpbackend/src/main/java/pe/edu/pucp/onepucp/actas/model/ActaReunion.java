package pe.edu.pucp.onepucp.actas.model;

import java.sql.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;

@Table(name="acta_reunion")
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public class ActaReunion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;
    private Date fechaRegistro;

    @Enumerated(EnumType.STRING)
    private EstadoActaReunion estado;
    private byte[] documento;
    private boolean activo;
    public Long getId() {
        return Id;
    }
    public void setId(Long id) {
        Id = id;
    }
    public Date getFechaRegistro() {
        return fechaRegistro;
    }
    public void setFechaRegistro(Date fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }
    public EstadoActaReunion getEstado() {
        return estado;
    }
    public void setEstado(EstadoActaReunion estado) {
        this.estado = estado;
    }
    public byte[] getDocumento() {
        return documento;
    }
    public void setDocumento(byte[] documento) {
        this.documento = documento;
    }
    public boolean isActivo() {
        return activo;
    }
    public void setActivo(boolean activo) {
        this.activo = activo;
    }
}
