package pe.edu.pucp.onepucp.postulaciones.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
@Entity
@Table(name = "criterio_seleccion")
@Getter
@Setter
@NoArgsConstructor
public class CriterioSeleccion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_proceso_de_seleccion")
    @JsonBackReference
    private ProcesoDeSeleccion procesoDeSeleccion;
    private String nombre;
    private Double maximo_puntaje;
    private Date fechaCreacioN;



    @PrePersist
    protected void fecha() {
        this.fechaCreacioN = new Date();

    }

}

