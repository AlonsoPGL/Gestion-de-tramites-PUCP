package pe.edu.pucp.onepucp.solicitudes.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.institucion.dto.EspecialidadDTO;
import pe.edu.pucp.onepucp.institucion.dto.EspecialidadPedidosCusoDTO;
import pe.edu.pucp.onepucp.institucion.dto.FacultadDTO;
import pe.edu.pucp.onepucp.institucion.model.Facultad;
import pe.edu.pucp.onepucp.institucion.model.Semestre;
import pe.edu.pucp.onepucp.rrhh.model.Persona;
import pe.edu.pucp.onepucp.solicitudes.model.EstadoSolicitud;
import pe.edu.pucp.onepucp.solicitudes.model.Solicitud;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudPedidoCurso;
import pe.edu.pucp.onepucp.solicitudes.model.TipoSolicitud;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class SolicitudPedidosCursosDTO {
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

    private List<SolicitudPedidoCursoDTO> solicitudPedidoCursos;

   // @Enumerated(EnumType.STRING)
    private TipoSolicitud tipo;



}
