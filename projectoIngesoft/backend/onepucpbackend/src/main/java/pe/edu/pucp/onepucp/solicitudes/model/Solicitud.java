package pe.edu.pucp.onepucp.solicitudes.model;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import pe.edu.pucp.onepucp.rrhh.model.Persona;

@Table(name="solicitud")
@Entity
@Getter
@Setter
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
public class Solicitud {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;
    @JsonIgnoreProperties({"emisor","horarios"})
    @ManyToOne
    @JoinColumn(name = "emisor_id")
    private Persona emisor;
    @JsonIgnoreProperties({"receptor","horarios"})
    @ManyToOne
    @JoinColumn(name = "receptor_id")
    private Persona receptor;

    private String correo;
    private String motivo;

    @Enumerated(EnumType.STRING)
    private EstadoSolicitud estado;
    
    //TODAVIA VOY A EVALUAR SI MANEJARLO COMO DATE O DATETIME
    //@Temporal(TemporalType.DATE)
    private Date fechaCreacion;
    private String observacion;
    
    @Lob
    @Column(name = "documento", columnDefinition="LONGBLOB")
    private byte[] documento;

    @Enumerated(EnumType.STRING)
    private TipoSolicitud tipo; 

    // private boolean activo;
}
