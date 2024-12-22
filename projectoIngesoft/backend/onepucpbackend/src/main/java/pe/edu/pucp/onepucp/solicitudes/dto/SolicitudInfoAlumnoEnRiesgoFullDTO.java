package pe.edu.pucp.onepucp.solicitudes.dto;

import lombok.Getter;
import lombok.Setter;
import pe.edu.pucp.onepucp.rrhh.dto.AlumnoEnRiesgo_X_HorarioDTO;

import java.time.LocalDateTime;

@Getter
@Setter
public class SolicitudInfoAlumnoEnRiesgoFullDTO {
    private Long id;
    private AlumnoEnRiesgo_X_HorarioDTO alumnoEnRiesgoXHorarioDTO;
    private String comentario;
    private Long puntajeRendimiento;
    private Boolean abierto;
    private Boolean activo;
    private LocalDateTime fechaSolicitud;
    private LocalDateTime fechaRespuesta;
    private Boolean leido;

    public SolicitudInfoAlumnoEnRiesgoFullDTO(Long id, String comentario, Long puntajeRendimiento,
            Boolean abierto, Boolean activo, LocalDateTime fechaSolicitud, LocalDateTime fechaRespuesta){
        this.id = id;
        this.comentario = comentario;
        this.puntajeRendimiento = puntajeRendimiento;
        this.abierto = abierto;
        this.activo = activo;
        this.fechaSolicitud = fechaSolicitud;
        this.fechaRespuesta = fechaRespuesta;
        this.leido = false;
    }

    public SolicitudInfoAlumnoEnRiesgoFullDTO(Long id, String comentario, Long puntajeRendimiento,
            Boolean abierto, Boolean activo, LocalDateTime fechaSolicitud, LocalDateTime fechaRespuesta, Boolean leido){
        this.id = id;
        this.comentario = comentario;
        this.puntajeRendimiento = puntajeRendimiento;
        this.abierto = abierto;
        this.activo = activo;
        this.fechaSolicitud = fechaSolicitud;
        this.fechaRespuesta = fechaRespuesta;
        this.leido = leido;
    }
}
