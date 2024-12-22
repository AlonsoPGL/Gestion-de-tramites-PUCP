package pe.edu.pucp.onepucp.solicitudes.dto;

import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.institucion.dto.EspecialidadPedidosCusoDTO;
import pe.edu.pucp.onepucp.institucion.dto.PlanDeEstudioXCursoDTO;
import pe.edu.pucp.onepucp.institucion.model.PlanDeEstudio;
import pe.edu.pucp.onepucp.institucion.model.Semestre;
import pe.edu.pucp.onepucp.solicitudes.model.EstadoSolicitud;
import pe.edu.pucp.onepucp.solicitudes.model.TipoSolicitud;

import java.util.Date;
import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudPedidosCursosXplanDTO {
    private Long id;
    private Semestre semestre;
    private EspecialidadPedidosCusoDTO especialidad;

//    @JsonIgnoreProperties({"emisor","horarios"})
//    @ManyToOne
//    @JoinColumn(name = "emisor_id")
//    private Persona emisor;
//    @JsonIgnoreProperties({"receptor","horarios"})
//    @ManyToOne
//    @JoinColumn(name = "receptor_id")
//    private Persona receptor;

    private String correo;
    private String motivo;

    // @Enumerated(EnumType.STRING)
    private EstadoSolicitud estado;

    //TODAVIA VOY A EVALUAR SI MANEJARLO COMO DATE O DATETIME
    //@Temporal(TemporalType.DATE)
    private Date fechaCreacion;
    private String observacion;


    private List<PlanDeEstudioXCursoDTO> planDeEstudioXCursoDTO;

    // @Enumerated(EnumType.STRING)
    private TipoSolicitud tipo;

}
