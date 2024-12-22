package pe.edu.pucp.onepucp.solicitudes.model;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.rrhh.model.Persona;

@Table(name="ComentarioTesis")
@Entity
@Getter
@Setter
@NoArgsConstructor
public class ComentarioTesis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String comentario;
    @ManyToOne
    @JoinColumn(name = "revisor_id")
    private Persona revisor;
    private Date fecha;
    @ManyToOne
    @JoinColumn(name = "solicitud_tema_tesis_id")
    @JsonBackReference // Parte manejada de la relación
    private SolicitudTemaTesis solicitudTemaTesis;

    private boolean activo;

    private byte[] file_revision;
    private boolean aprobado;
}
