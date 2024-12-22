// SolicitudInfoAlumnoEnRiesgoDTO.java
package pe.edu.pucp.onepucp.solicitudes.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class SolicitudInfoAlumnoEnRiesgoDTO {
    private Long id;
    private Long alumnoEnRiesgoXHorarioId;
    private String comentario;
    private Long puntajeRendimiento;
    private Boolean abierto;
    private Boolean activo;
    private LocalDateTime fechaSolicitud;
    private LocalDateTime fechaRespuesta;
    private Boolean leido;

    public SolicitudInfoAlumnoEnRiesgoDTO(Long id, Long alumnoEnRiesgoXHorarioId, String comentario, Long puntajeRendimiento,
            Boolean abierto, Boolean activo, LocalDateTime fechaSolicitud, LocalDateTime fechaRespuesta){
        this.id = id;
        this.alumnoEnRiesgoXHorarioId = alumnoEnRiesgoXHorarioId;
        this.comentario = comentario;
        this.puntajeRendimiento = puntajeRendimiento;
        this.abierto = abierto;
        this.activo = activo;
        this.fechaSolicitud = fechaSolicitud;
        this.fechaRespuesta = fechaRespuesta;
        this.leido = false;
    }

    public SolicitudInfoAlumnoEnRiesgoDTO(Long id, Long alumnoEnRiesgoXHorarioId, String comentario, Long puntajeRendimiento,
            Boolean abierto, Boolean activo, LocalDateTime fechaSolicitud, LocalDateTime fechaRespuesta, Boolean leido){
        this.id = id;
        this.alumnoEnRiesgoXHorarioId = alumnoEnRiesgoXHorarioId;
        this.comentario = comentario;
        this.puntajeRendimiento = puntajeRendimiento;
        this.abierto = abierto;
        this.activo = activo;
        this.fechaSolicitud = fechaSolicitud;
        this.fechaRespuesta = fechaRespuesta;
        this.leido = leido;
    }
}
