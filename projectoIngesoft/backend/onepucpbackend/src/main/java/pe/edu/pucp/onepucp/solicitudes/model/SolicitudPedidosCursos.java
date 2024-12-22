package pe.edu.pucp.onepucp.solicitudes.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;
import pe.edu.pucp.onepucp.institucion.model.Curso;
import pe.edu.pucp.onepucp.institucion.model.Especialidad;
import pe.edu.pucp.onepucp.institucion.model.Facultad;
import pe.edu.pucp.onepucp.institucion.model.PlanDeEstudio;
import pe.edu.pucp.onepucp.institucion.model.PlanDeEstudioXCurso;
import pe.edu.pucp.onepucp.institucion.model.Semestre;

import java.util.Date;
import java.util.List;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@PrimaryKeyJoinColumn(referencedColumnName = "id")
public class SolicitudPedidosCursos extends Solicitud{
    @ManyToOne
    @JoinColumn(name="id_semestre")
    private Semestre semestre;

    @ManyToOne
    @JoinColumn(name="id_especialidad")
    private Especialidad especialidad;

    //private Date fecha;
    //private String especialidad;
    @ManyToOne
    @JoinColumn(name="id_planestudio")
    private PlanDeEstudio planDeEstudio;

    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "id_soli_pedidos_cursos")
    private List<PlanDeEstudioXCurso> planDeEstudioXCursos;
//    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
//    @JoinColumn(name = "id_solicitud_pedido")  // This specifies the foreign key in the join table
//    private List<SolicitudPedidoCurso> solicitudPedidoCursos;


}
