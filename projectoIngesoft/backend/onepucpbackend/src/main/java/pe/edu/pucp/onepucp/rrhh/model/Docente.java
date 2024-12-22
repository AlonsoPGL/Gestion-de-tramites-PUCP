package pe.edu.pucp.onepucp.rrhh.model;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.institucion.model.Horario;

@Entity
@PrimaryKeyJoinColumn(referencedColumnName = "id")
@NoArgsConstructor
public class Docente extends Persona {

    private int calificacionAnual;

    /* @OneToMany(mappedBy = "docente") // Mapeo de la relación
    @JsonManagedReference(value = "docente-puntaje") // Usar el mismo nombre de referencia que en Puntaje_Encuesta_X_Docente
    private List<Puntaje_Encuesta_X_Docente> puntajesEncuestas;*/

    public int getCalificacionAnual() {
        return calificacionAnual;
    }
    
    public void setCalificacionAnual(int calificacionAnual) {
        this.calificacionAnual = calificacionAnual;
    }

}
