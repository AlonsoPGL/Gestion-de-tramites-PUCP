package pe.edu.pucp.onepucp.preguntas.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import pe.edu.pucp.onepucp.institucion.model.Horario;
import pe.edu.pucp.onepucp.institucion.model.JefeDePractica;
import pe.edu.pucp.onepucp.institucion.repository.JefeDePracticaRepository;
import pe.edu.pucp.onepucp.preguntas.model.Encuesta;
import pe.edu.pucp.onepucp.preguntas.model.Pregunta;
import pe.edu.pucp.onepucp.preguntas.model.RespuestasTxt_X_Docente;
import pe.edu.pucp.onepucp.preguntas.model.RespuestasTxt_X_JP;
import pe.edu.pucp.onepucp.preguntas.repository.EncuestaRepository;
import pe.edu.pucp.onepucp.preguntas.repository.PreguntaRepository;
import pe.edu.pucp.onepucp.preguntas.repository.RespuestasTxt_X_DocenteRepository;
import pe.edu.pucp.onepucp.preguntas.repository.RespuestasTxt_X_JPRepository;
import pe.edu.pucp.onepucp.rrhh.model.Alumno;
import pe.edu.pucp.onepucp.rrhh.repository.DocenteRepository;
import pe.edu.pucp.onepucp.rrhh.model.Docente;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class PreguntaService {
    
    @Autowired
    private PreguntaRepository preguntaRepository;

    @Autowired
    private EncuestaRepository encuestaRepository;

    @Autowired
    private RespuestasTxt_X_DocenteRepository respuestaTXTDocenteRepository;

    @Autowired
    private RespuestasTxt_X_JPRepository respuestaTXTJpRepository;

    @Autowired
    private DocenteRepository docenteRepository;

    @Autowired
    private JefeDePracticaRepository jpRepository;

    public Pregunta crearPregunta (Pregunta pregunta){
        return preguntaRepository.save(pregunta);
    }

    public List<Pregunta> obtenerPreguntasPorIdEncuesta(Long idEncuesta) {
        return preguntaRepository.listarEncuestaID(idEncuesta);
    }

    public void insertarRespuestaDocente(Long preguntaId, Long docenteID,String respuesta) {
            RespuestasTxt_X_Docente respuestaTexto = new RespuestasTxt_X_Docente();
            
            Docente docente = docenteRepository.findById(docenteID).orElseThrow(() -> new EntityNotFoundException("Docente no encontrado"));;
            Pregunta pregunta = preguntaRepository.findById(preguntaId).orElseThrow(() -> new EntityNotFoundException("Pregunta no encontrada"));;

            respuestaTexto.setDocente(docente); 
            respuestaTexto.setPregunta(pregunta);
            respuestaTexto.setRespuesta(respuesta);
            respuestaTXTDocenteRepository.save(respuestaTexto);       
    }

    public void insertarRespuestaJP(Long preguntaId, Long jpID,String respuesta) {
        RespuestasTxt_X_JP respuestaTexto = new RespuestasTxt_X_JP();
        
        JefeDePractica jp = jpRepository.findById(jpID).orElseThrow(() -> new EntityNotFoundException("Jefe de práctica no encontrado"));;
        Pregunta pregunta = preguntaRepository.findById(preguntaId).orElseThrow(() -> new EntityNotFoundException("Pregunta no encontrada"));;

        respuestaTexto.setJp(jp); 
        respuestaTexto.setPregunta(pregunta);
        respuestaTexto.setRespuesta(respuesta);
        respuestaTXTJpRepository.save(respuestaTexto);       
    }

    public List<RespuestasTxt_X_Docente> obtenerRespuestasProfesor(Long idEncuesta,Long idencuesta) {
        return respuestaTXTDocenteRepository.listarRespuestas(idEncuesta,idencuesta);
    }

    public List<RespuestasTxt_X_JP	> obtenerRespuestasJP(Long idJp, Long idencuesta) {
        return respuestaTXTJpRepository.listarRespuestas(idJp,idencuesta);
    }

}
