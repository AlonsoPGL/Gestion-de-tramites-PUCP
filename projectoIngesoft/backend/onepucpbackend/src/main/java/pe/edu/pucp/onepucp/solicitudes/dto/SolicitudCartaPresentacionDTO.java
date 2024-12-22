package pe.edu.pucp.onepucp.solicitudes.dto;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pe.edu.pucp.onepucp.institucion.dto.CursoDTO;
import pe.edu.pucp.onepucp.institucion.dto.EspecialidadDTO;
import pe.edu.pucp.onepucp.institucion.model.Curso;
import pe.edu.pucp.onepucp.institucion.model.Especialidad;
import pe.edu.pucp.onepucp.rrhh.dto.AlumnoDTO;
import pe.edu.pucp.onepucp.rrhh.dto.DocenteDTO;
import pe.edu.pucp.onepucp.rrhh.dto.PersonaDTO;
import pe.edu.pucp.onepucp.rrhh.model.Alumno;
import pe.edu.pucp.onepucp.rrhh.model.Docente;
import pe.edu.pucp.onepucp.solicitudes.model.EstadoSolicitud;
import pe.edu.pucp.onepucp.solicitudes.model.TipoSolicitud;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
public class SolicitudCartaPresentacionDTO {
    private Long id;
    private PersonaDTO emisor;
    private DocenteDTO profesor;
    private PersonaDTO receptor;
    private String correo;
    private String motivo;
    private EstadoSolicitud estado;
    private Date fechaCreacion;
    private String observacion;
    private TipoSolicitud tipo;
    private boolean tieneDocumento; 
    private String empresaPractica;

    
    private byte[] documento;

    private List<AlumnoDTO> integrantes;

 
    private String actividadesDesarrollar;
    
    private CursoDTO curso;

    
    private EspecialidadDTO especialidad;
}
