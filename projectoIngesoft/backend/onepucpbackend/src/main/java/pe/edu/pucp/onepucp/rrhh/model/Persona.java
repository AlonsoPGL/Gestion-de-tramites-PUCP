package pe.edu.pucp.onepucp.rrhh.model;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.institucion.model.Especialidad;
import pe.edu.pucp.onepucp.institucion.model.Seccion;

@Table(name = "persona")
@Entity
@Getter
@Setter
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
public class Persona {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String apellidoPaterno;
    private String apellidoMaterno;

    private String email;

    private int DNI;
    private int edad;
    private int codigo;

    private boolean activo;

    @Enumerated(EnumType.STRING)
    private TipoPersona tipo;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "cuenta_id")
    private Cuenta cuenta;

    // private List<JefeDePractica> jps;
    @OneToMany(mappedBy = "persona", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<PersonaRolUnidad> personaRol; // Permisos personalizados con estado

    @ManyToOne
    @JsonIgnoreProperties({"jefe", "personas", "coordinador"})
    @JoinColumn(name = "especialidad_id")
    private Especialidad especialidad;

    @ManyToOne
    @JsonIgnoreProperties({"jefe", "personas", "coordinador"})
    @JoinColumn(name = "seccion_id")
    private Seccion seccion;


}
