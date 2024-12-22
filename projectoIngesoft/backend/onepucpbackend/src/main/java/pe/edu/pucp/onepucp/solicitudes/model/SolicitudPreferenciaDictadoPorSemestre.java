package pe.edu.pucp.onepucp.solicitudes.model;

import java.util.ArrayList;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import pe.edu.pucp.onepucp.rrhh.model.Docente;

@Entity
@PrimaryKeyJoinColumn(referencedColumnName = "id")
public class SolicitudPreferenciaDictadoPorSemestre extends Solicitud {

    @ManyToMany
    @JoinTable(
        name = "solicitud_preferencia_X_docente",  // Nombre de la tabla intermedia
        joinColumns = @JoinColumn(name = "solicitud_id"),  // Clave foránea hacia Solicitud
        inverseJoinColumns = @JoinColumn(name = "docente_id")  // Clave foránea hacia Docente
    )
    private ArrayList<Docente>docentes;

//    @OneToMany
//    @JoinColumn()
//    private ArrayList<Curso>cursos;
    private String semestre;

    public String getSemestre() {
        return semestre;
    }

    public void setSemestre(String semestre) {
        this.semestre = semestre;
    }

}
