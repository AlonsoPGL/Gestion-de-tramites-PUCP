package pe.edu.pucp.onepucp.institucion.model;
 
import java.util.Date; 

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id; 
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "semestre")
public class Semestre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idSemestre;

    @Column(nullable = false, length = 50)
    private String nombre;

    private Date  fechaInicio;
    private Date  fechaFin;
    @Column(nullable = false)
    private boolean activo;  

}
