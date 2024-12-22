package pe.edu.pucp.onepucp.actas.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Table(name="acta_reunion_especialidad")
@Entity
public class ActaReunionEspecialidad extends ActaReunion{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;
    

}
