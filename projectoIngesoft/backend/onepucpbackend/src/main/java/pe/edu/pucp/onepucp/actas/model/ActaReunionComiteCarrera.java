package pe.edu.pucp.onepucp.actas.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Table(name="acta_reunion_comite_carrera")
@Entity
public class ActaReunionComiteCarrera extends ActaReunion{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;
}
