package pe.edu.pucp.onepucp.institucion.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.institucion.model.Semestre;
import jakarta.persistence.OneToOne;
import jakarta.persistence.CascadeType;
import jakarta.persistence.FetchType;


@Entity
@Table(name = "institucion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Institucion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idInstitucion;

    @Column(nullable = false)
    private String nombre;

    @Lob
    @Column(name = "logo", columnDefinition="MEDIUMBLOB")
    private byte[] logo;

    @Column(nullable = false)
    private boolean activo;

    // // Relación 1 a muchos con Semestre
    @OneToOne
    @JoinColumn(name = "semestre_id") // Define la columna FK en la tabla Horario
    private Semestre semestre;
    // // Relación 1 a muchos con Unidad
    // @OneToMany(mappedBy = "institucion", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    // @JsonIgnoreProperties("institucion")  // Ignorar la propiedad 'institucion' de la clase Unidad para evitar referencia cíclica
    // private List<Unidad> unidades;
}
