package pe.edu.pucp.onepucp.rrhh.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Table(name="postulante")
@Entity
public class Postulante  extends Persona{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    //private Postulacion postulacion;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
