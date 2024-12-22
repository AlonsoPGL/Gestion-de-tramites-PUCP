package pe.edu.pucp.onepucp.preguntas.DTO;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.institucion.dto.FacultadDTO;
import pe.edu.pucp.onepucp.institucion.model.Facultad;
import pe.edu.pucp.onepucp.preguntas.model.Pregunta;
import pe.edu.pucp.onepucp.preguntas.model.TipoEncuesta;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EncuestaDTO {
    private Long idEncuesta;

    private boolean esIntermedia;
    private Date   fechaInicio;
    private Date  fechaFin;
    private String titulo;
    
    private List<Pregunta> preguntas;

    private boolean activo;

    private TipoEncuesta tipo;

    private FacultadDTO facultad;  
}
