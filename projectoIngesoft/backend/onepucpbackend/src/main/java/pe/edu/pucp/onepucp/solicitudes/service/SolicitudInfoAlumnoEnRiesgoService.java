// SolicitudInfoAlumnoEnRiesgoService.java
package pe.edu.pucp.onepucp.solicitudes.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pe.edu.pucp.onepucp.institucion.dto.HorarioDTO;
import pe.edu.pucp.onepucp.rrhh.dto.AlumnoDTO;
import pe.edu.pucp.onepucp.rrhh.dto.AlumnoEnRiesgo_X_HorarioDTO;
import pe.edu.pucp.onepucp.rrhh.model.AlumnoEnRiesgo_X_Horario;
import pe.edu.pucp.onepucp.rrhh.repository.AlumnoEnRiesgo_X_HorarioRepository;
import pe.edu.pucp.onepucp.rrhh.service.AlumnoService;
import pe.edu.pucp.onepucp.solicitudes.dto.SolicitudInfoAlumnoEnRiesgoDTO;
import pe.edu.pucp.onepucp.solicitudes.dto.SolicitudInfoAlumnoEnRiesgoFullDTO;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudInfoAlumnoEnRiesgo;
import pe.edu.pucp.onepucp.solicitudes.repository.SolicitudInfoAlumnoEnRiesgoRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.ArrayList;
import java.util.List;

@Service
public class SolicitudInfoAlumnoEnRiesgoService {

    @Autowired
    private SolicitudInfoAlumnoEnRiesgoRepository solicitudRepository;

    @Autowired
    private AlumnoEnRiesgo_X_HorarioRepository alumnoEnRiesgoXHorarioRepository;

    @Autowired
    private AlumnoService alumnoService;

    public List<SolicitudInfoAlumnoEnRiesgoDTO> crearSolicitudes(List<Long> idsAlumnoEnRiesgoXHorario) {
        List<SolicitudInfoAlumnoEnRiesgoDTO> solicitudesDTO = new ArrayList<>();
        for (Long id : idsAlumnoEnRiesgoXHorario) {
            SolicitudInfoAlumnoEnRiesgo nuevaSolicitud = crearSolicitudIndividual(id);
            SolicitudInfoAlumnoEnRiesgoDTO solicitudDTO = convertirASolicitudDTO(nuevaSolicitud);
            solicitudesDTO.add(solicitudDTO);
        }
        return solicitudesDTO;
    }
    
    public SolicitudInfoAlumnoEnRiesgo crearSolicitudIndividual(Long IdAlumnoEnRiesgoXHorario) {
        SolicitudInfoAlumnoEnRiesgo solicitud = new SolicitudInfoAlumnoEnRiesgo();
        System.out.println("\nCreando solicitud...");
        // Obtener AlumnoEnRiesgo_X_Horario por ID
        AlumnoEnRiesgo_X_Horario alumnoEnRiesgoXHorario = alumnoEnRiesgoXHorarioRepository.findById(IdAlumnoEnRiesgoXHorario)
                .orElseThrow(() -> new RuntimeException("AlumnoEnRiesgo_X_Horario no encontrado"));

        // Actualizando cantidad de solicitudes por responder, este lo verá el docente a cargo del horario
        alumnoEnRiesgoXHorario.setCantSolXResponder(alumnoEnRiesgoXHorario.getCantSolXResponder() + 1);
        System.out.println("\nAumentando cantidad de solicitudes x responder en 1. Ahora " + alumnoEnRiesgoXHorario.getCantSolXResponder());
        alumnoEnRiesgoXHorarioRepository.save(alumnoEnRiesgoXHorario);

        // Guardando informacion de solicitud
        solicitud.setAlumnoEnRiesgoXHorario(alumnoEnRiesgoXHorario);
        solicitud.setComentario(null);        
        solicitud.setPuntajeRendimiento(null);
        solicitud.setActivo(true);
        // Establecer fechaSolicitud con la hora actual
        solicitud.setFechaSolicitud(LocalDateTime.now());
        solicitud.setAbierto(true);
        solicitud.setFechaRespuesta(null);
        solicitud.setLeido(false);

        return solicitudRepository.save(solicitud);
    }

    private SolicitudInfoAlumnoEnRiesgoDTO convertirASolicitudDTO(SolicitudInfoAlumnoEnRiesgo solicitud) {
        // Lógica para convertir la entidad a DTO
        SolicitudInfoAlumnoEnRiesgoDTO solicitudDTO = new  SolicitudInfoAlumnoEnRiesgoDTO(solicitud.getId(), solicitud.getAlumnoEnRiesgoXHorario().getId(), solicitud.getComentario(), 
                solicitud.getPuntajeRendimiento(), solicitud.getAbierto(), solicitud.getActivo(), solicitud.getFechaSolicitud(), solicitud.getFechaRespuesta(), solicitud.getLeido());

        return solicitudDTO;
    }

    // Método para actualizar una solicitud existente (por idSolicitud)
    public SolicitudInfoAlumnoEnRiesgoDTO actualizarSolicitud(Long idSolicitud, Long puntaje, String comentario) {
        SolicitudInfoAlumnoEnRiesgo solicitud = solicitudRepository.findById(idSolicitud)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        if(solicitud.getAbierto()){
            System.out.println("\nActualizando solicitud");
            // Obtener AlumnoEnRiesgo_X_Horario por ID
            AlumnoEnRiesgo_X_Horario alumnoEnRiesgoXHorario = alumnoEnRiesgoXHorarioRepository.findById(solicitud.getAlumnoEnRiesgoXHorario().getId())
                    .orElseThrow(() -> new RuntimeException("AlumnoEnRiesgo_X_Horario no encontrado"));
            // Actualizando cantidad de solicitudes por responder, este lo verá el docente a cargo del horario
            alumnoEnRiesgoXHorario.setCantSolXResponder(alumnoEnRiesgoXHorario.getCantSolXResponder() - 1);
            System.out.println("\nDisminuyendo cantidad de solicitudes x responder en 1. Ahora " + alumnoEnRiesgoXHorario.getCantSolXResponder());
            // Actualizando cantidad de solicitudes respondidas por leer, este lo verá el director de carrera
            alumnoEnRiesgoXHorario.setCantRespuestaXLeer(alumnoEnRiesgoXHorario.getCantRespuestaXLeer() + 1);
            System.out.println("Aumentando cantidad de respuestas x leer en 1. Ahora " + alumnoEnRiesgoXHorario.getCantRespuestaXLeer());
            alumnoEnRiesgoXHorarioRepository.save(alumnoEnRiesgoXHorario);
        }
        // Guardando informacion de solicitud
        solicitud.setPuntajeRendimiento(puntaje);
        solicitud.setComentario(comentario);
        solicitud.setAbierto(false);
        // Establecer fechaRespuesta con la hora actual
        solicitud.setFechaRespuesta(LocalDateTime.now());

        SolicitudInfoAlumnoEnRiesgo nuevaSolicitud = solicitudRepository.save(solicitud);
        SolicitudInfoAlumnoEnRiesgoDTO solicitudDTO = convertirASolicitudDTO(nuevaSolicitud);
        return solicitudDTO;
    }
    
    // Método para listar historial de solicitudes de un alumno en riesgo x horario
    public List<SolicitudInfoAlumnoEnRiesgoDTO> listarSolicitudesPorAlumnoEnRiesgoXHorario(Long idAluxhor) {
        List<SolicitudInfoAlumnoEnRiesgo> solicitudes = solicitudRepository.findSolicitudesByAlumnoEnRiesgoXHorarioId(idAluxhor);
        
        List<SolicitudInfoAlumnoEnRiesgoDTO> solicitudesDTO = new ArrayList<>();
        for (SolicitudInfoAlumnoEnRiesgo solicitud : solicitudes) {
            SolicitudInfoAlumnoEnRiesgoDTO dto = convertirASolicitudDTO(solicitud);
            solicitudesDTO.add(dto);
        }
            
        return solicitudesDTO;
    }

    // Método para listar historial de solicitudes de un alumno en riesgo en un horario/curso específico
    public List<SolicitudInfoAlumnoEnRiesgo> listarSolicitudesPorAlumnoYHorario(Long alumnoId, Long horarioId) {
        return solicitudRepository.findSolicitudesByAlumnoIdAndHorarioId(alumnoId, horarioId);
    }

    // Método para listar todos los alumnos en riesgo junto con los puntajes recibidos
    public List<AlumnoEnRiesgo_X_Horario> listarAlumnosEnRiesgoConPuntajes() {
        return alumnoEnRiesgoXHorarioRepository.findAllConPuntajes();
    }

    // Metodo para obtener informacion de una solicitud en particular
    public SolicitudInfoAlumnoEnRiesgoDTO obtenerInformacion(Long solicitudId){
        SolicitudInfoAlumnoEnRiesgo solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        return convertirASolicitudDTO(solicitud);
    }
    

    // Método para listar todas las solicitudes de informacion y devolver en DTOs para la MATRIZ
    public List<SolicitudInfoAlumnoEnRiesgoFullDTO> listarInformacionFull() {
        List<SolicitudInfoAlumnoEnRiesgo> solicitudes = solicitudRepository.findAllActive();
        
        List<SolicitudInfoAlumnoEnRiesgoFullDTO> solicitudesFullDTO = new ArrayList<>();
        for (SolicitudInfoAlumnoEnRiesgo solicitud : solicitudes) {
            SolicitudInfoAlumnoEnRiesgoFullDTO dto = convertirASolicitudFullDTO(solicitud);
            solicitudesFullDTO.add(dto);
        }
        
        return solicitudesFullDTO;
    }
    // Convertir a full DTO 
    public SolicitudInfoAlumnoEnRiesgoFullDTO convertirASolicitudFullDTO(SolicitudInfoAlumnoEnRiesgo solicitud) {
        SolicitudInfoAlumnoEnRiesgoFullDTO solicitudFullDTO = new  SolicitudInfoAlumnoEnRiesgoFullDTO(solicitud.getId(), solicitud.getComentario(), 
                solicitud.getPuntajeRendimiento(), solicitud.getAbierto(), solicitud.getActivo(), solicitud.getFechaSolicitud(), solicitud.getFechaRespuesta());
        AlumnoEnRiesgo_X_HorarioDTO aluEnRiesgo_X_HorarioDTO = alumnoService.obtenerUnAlumnoEnRiesgo_X_HorarioDTO(solicitud.getAlumnoEnRiesgoXHorario().getId());
        solicitudFullDTO.setAlumnoEnRiesgoXHorarioDTO(aluEnRiesgo_X_HorarioDTO);
        return solicitudFullDTO;
    }
    // Método para obtener una solicitud de informacion y devolver en DTOs
    public SolicitudInfoAlumnoEnRiesgoFullDTO obtenerInformacionFull(Long id) {
        Optional<SolicitudInfoAlumnoEnRiesgo> solicitudEncontrada = solicitudRepository.findById(id);
        
        if(solicitudEncontrada.isPresent()){
            SolicitudInfoAlumnoEnRiesgo solicitud = solicitudEncontrada.get();
            SolicitudInfoAlumnoEnRiesgoFullDTO dto = convertirASolicitudFullDTO(solicitud);            
            return dto;
        }
        System.out.println("\nNo se encontró la solicitud. F\n");
        return null;       
    }
    // Método para listar las solicitudes de informacion de un alumno en particular y devolver Full DTOs
    public List<SolicitudInfoAlumnoEnRiesgoFullDTO> listarInformacionxAlumnoFull(Long id) {
        List<SolicitudInfoAlumnoEnRiesgo> solicitudes = solicitudRepository.findAllActivexAlumno(id);
        
        List<SolicitudInfoAlumnoEnRiesgoFullDTO> solicitudesFullDTO = new ArrayList<>();
        for (SolicitudInfoAlumnoEnRiesgo solicitud : solicitudes) {
            SolicitudInfoAlumnoEnRiesgoFullDTO dto = convertirASolicitudFullDTO(solicitud);
            solicitudesFullDTO.add(dto);
        }
        
        return solicitudesFullDTO;
    }

    // Revision de solicitud
    public Boolean revisionSolicitud(Long idSolicitud, Boolean leido){
        System.out.println("\nIniciando revision solicitud...");
        
        SolicitudInfoAlumnoEnRiesgo solicitud = solicitudRepository.findById(idSolicitud)
            .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
        
        System.out.println("\nEncontrando de solicitud en riesgo...");

        if(!solicitud.getAbierto()){
            AlumnoEnRiesgo_X_Horario alumnoEnRiesgoXHorario = alumnoEnRiesgoXHorarioRepository.findById(solicitud.getAlumnoEnRiesgoXHorario().getId())
                .orElseThrow(() -> new RuntimeException("AlumnoEnRiesgo_X_Horario no encontrado"));
                System.out.println("\nEncontrado alumno en riesgo...");
            
            System.out.println("\n El alumno en riesgo es " + alumnoEnRiesgoXHorario.getAlumno().getNombre());
            //if(leido && !solicitud.getLeido()){
            if(leido){
                System.out.println("\nCASO Visualizacion");
                if(!solicitud.getLeido()){
                    // Caso de ingresar a visualizar
                    System.out.println("\nSe envio parametro leido="+leido+" y la solicitud tiene atribudo leido="+solicitud.getLeido());
                    // Bool Leido true y  la solicitud aún no tiene estado leido
                    solicitud.setLeido(leido);
                    alumnoEnRiesgoXHorario.setCantRespuestaXLeer(alumnoEnRiesgoXHorario.getCantRespuestaXLeer()-1);   
                    // Guardando cambios
                    alumnoEnRiesgoXHorarioRepository.save(alumnoEnRiesgoXHorario);   
                    solicitudRepository.save(solicitud);
                }else{
                    System.out.println("\n Caso de ingresar de nuevo a visualizar, pero la solicitud tiene atribudo leido="+solicitud.getLeido());
                }
            }else{
                if(solicitud.getLeido()){
                    // No leido
                    System.out.println("\n Esto debería ser MARCAR NO LEIDO");
                    System.out.println("Dado que parametro es: debería ser MARCAR NO LEIDO");
                    solicitud.setLeido(leido);
                    alumnoEnRiesgoXHorario.setCantRespuestaXLeer(alumnoEnRiesgoXHorario.getCantRespuestaXLeer()+1);  
                    // Guardando cambios
                    alumnoEnRiesgoXHorarioRepository.save(alumnoEnRiesgoXHorario);
                    solicitudRepository.save(solicitud);
                }else{
                    System.out.println("\nCASO NO HACER NADA: No leido y entrar para Marcar No Leído");
                }
                // No leido y vuelve a entrar para no volver a leer   
            }           
        }
        return true;
    }
}
