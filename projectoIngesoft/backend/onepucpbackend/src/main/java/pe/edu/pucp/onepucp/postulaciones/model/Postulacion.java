package pe.edu.pucp.onepucp.postulaciones.model;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="postulacion")
@Getter
@Setter
@NoArgsConstructor
public class Postulacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String facultadPostula;
    private Date fechaPostulacion;
    @Lob
    @Column(name = "cv", columnDefinition="MEDIUMBLOB")
    private byte[] cv;
    private double puntaje;
    
    @Enumerated(EnumType.STRING)
    private EstadoPostulacion estado;

    @ManyToOne
    private ProcesoDeSeleccion procesoDeSeleccion;
    public EstadoPostulacion getEstado() {
        return estado;
    }
    public void setEstado(EstadoPostulacion estado) {
        this.estado = estado;
    }
    private String observaciones;
    private boolean aprobado;
    private String nombrePostulante;
    private String apelidoPaternoPostulante;
    private String apelidoMaternoPostulante;

    private String correo;
    public String getCorreo() {
        return correo;
    }
    public void setCorreo(String correo) {
        this.correo = correo;
    }

    private String DNI;
    private String celular;
    @Lob
    @Column(name = "referencias", columnDefinition="MEDIUMBLOB")
    private byte[] referencias;
    public byte[] getReferencias() {
        return referencias;
    }

    public void setReferencias(byte[] referencias) {
        this.referencias = referencias;
    }


    public String getCelular() {
        return celular;
    }

    public void setCelular(String celular) {
        this.celular = celular;
    }



    public String getNombrePostulante() {
        return nombrePostulante;
    }
    public void setNombrePostulante(String nombrePostulante) {
        this.nombrePostulante = nombrePostulante;
    }
    public String getApelidoPaternoPostulante() {
        return apelidoPaternoPostulante;
    }
    public void setApelidoPaternoPostulante(String apelidoPaternoPostulante) {
        this.apelidoPaternoPostulante = apelidoPaternoPostulante;
    }
    public String getApelidoMaternoPostulante() {
        return apelidoMaternoPostulante;
    }
    public void setApelidoMaternoPostulante(String apelidoMaternoPostulante) {
        this.apelidoMaternoPostulante = apelidoMaternoPostulante;
    }
    public String getDNI() {
        return DNI;
    }
    public void setDNI(String dni) {
        DNI = dni;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getFacultadPostula() {
        return facultadPostula;
    }
    public void setFacultadPostula(String faucultadPostula) {
        this.facultadPostula = faucultadPostula;
    }
    public Date getFechaPostulacion() {
        return fechaPostulacion;
    }
    public void setFechaPostulacion(Date fechaPostulacion) {
        this.fechaPostulacion = fechaPostulacion;
    }
    public byte[] getCv() {
        return cv;
    }
    public void setCv(byte[] cv) {
        this.cv = cv;
    }
    public double getPuntaje() {
        return puntaje;
    }
    public void setPuntaje(double puntaje) {
        this.puntaje = puntaje;
    }
    public String getObservaciones() {
        return observaciones;
    }
    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
    public boolean isAprobado() {
        return aprobado;
    }
    public void setAprobado(boolean aprobado) {
        this.aprobado = aprobado;
    }
}