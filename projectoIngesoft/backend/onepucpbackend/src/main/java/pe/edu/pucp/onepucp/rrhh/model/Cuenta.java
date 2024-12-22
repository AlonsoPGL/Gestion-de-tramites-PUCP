package pe.edu.pucp.onepucp.rrhh.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name="cuenta")
@Entity
@Getter
@Setter
@NoArgsConstructor
public class Cuenta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id") // Especifica el nombre de la columna
    private Long id;

    @Column(name = "usuario", nullable = false) // Especifica el nombre de la columna y que no puede ser nulo
    private String usuario;

    @Column(name = "contrasenia", nullable = false)
    private String contrasenia;

    @Column(name = "activo")
    private boolean activo;



}
