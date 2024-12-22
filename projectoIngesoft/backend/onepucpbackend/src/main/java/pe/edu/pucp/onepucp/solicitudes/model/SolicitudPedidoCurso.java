package pe.edu.pucp.onepucp.solicitudes.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.institucion.model.Curso;

import java.util.Arrays;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor

@Table(name = "solicitudpedidos_curso")
public class SolicitudPedidoCurso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id") // This is the primary key of the join table (you can adjust this if needed)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_solicitud_pedido", referencedColumnName = "id")
    @JsonIgnore// Foreign key to SolicitudPedido
    private SolicitudPedidosCursos solicitudPedidoCurso;

    @ManyToOne(cascade = CascadeType.ALL )
    @JoinColumn(name = "id_curso", referencedColumnName = "idCurso") // Foreign key to Curso
    private Curso curso;

    @JoinColumn(name="cant_horarios")
    private int cantHorarios;



}