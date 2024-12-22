package pe.edu.pucp.onepucp.institucion.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.preguntas.model.Encuesta;
import lombok.AllArgsConstructor;

import java.util.List;

import org.hibernate.mapping.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Table(name="jefe_de_practica")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JefeDePractica {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idJefeDePractica;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private int calificacionAnual;

    @Column(nullable = false)
    private boolean activo;

    //relacion con encuesta - se maneja con el tipo de encuesta

    
    @ManyToMany(mappedBy = "jps")
    private List<Horario> horarios;
    //@JsonManagedReference(value = "horarios-jps")
    /*@OneToMany(mappedBy = "jp") // Mapeo de la relación
    @JsonManagedReference(value = "PuntajeJP")
    private List<Puntaje_Encuesta_X_JP> puntajesEncuestas;*/

}
