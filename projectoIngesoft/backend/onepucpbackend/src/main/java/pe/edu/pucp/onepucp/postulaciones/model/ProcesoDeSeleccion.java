package pe.edu.pucp.onepucp.postulaciones.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.CascadeType;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "proceso_de_seleccion")
@Getter
@Setter
@NoArgsConstructor
public class ProcesoDeSeleccion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int cantidadVacantes;
    private int totalSeleccionados;
    private boolean activo;
    private String nombre;

    @Lob
    @Column(name = "requisitos", columnDefinition="MEDIUMBLOB")
    private byte[] requisitos;

    private Double maximo_puntaje;
    private Date fechaInicio;
    private Date fechaFin;
    private String puesto;

    @OneToMany(mappedBy = "procesoDeSeleccion", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference

    private List<CriterioSeleccion> criteriosSeleccion;

    @Enumerated(EnumType.STRING)
    private Frecuencia frecuencia;

    @Enumerated(EnumType.STRING)
    private Modalidad modalidad;


}