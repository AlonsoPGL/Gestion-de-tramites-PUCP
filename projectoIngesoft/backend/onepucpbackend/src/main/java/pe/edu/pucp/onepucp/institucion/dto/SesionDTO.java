package pe.edu.pucp.onepucp.institucion.dto;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.institucion.model.Horario;

import java.time.LocalTime;
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SesionDTO {

    private int idSesion;


    private String dia;


    private LocalTime horaInicio;


    private LocalTime horaFin;

}
