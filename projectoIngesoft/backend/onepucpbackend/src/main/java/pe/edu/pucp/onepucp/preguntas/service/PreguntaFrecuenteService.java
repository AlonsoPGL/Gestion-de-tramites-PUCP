package pe.edu.pucp.onepucp.preguntas.service;
import java.util.Collections;
import java.util.List;
import java.util.Optional; 

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pe.edu.pucp.onepucp.preguntas.model.PreguntaFrecuente;
import pe.edu.pucp.onepucp.preguntas.repository.PreguntaFrecuenteRepository;
@Service
public class PreguntaFrecuenteService {

    private static final Logger logger = LoggerFactory.getLogger(EncuestaService.class);
    @Autowired
    private PreguntaFrecuenteRepository preguntaFrecuenteRepository;
    public List<PreguntaFrecuente> listarTodasPreguntasFrecuentes() {
        List<PreguntaFrecuente> preguntasObtenidas = preguntaFrecuenteRepository.findAllActive();
        Collections.reverse(preguntasObtenidas);
        return preguntasObtenidas;
    }

    public Optional<PreguntaFrecuente> obtenerPreguntaPorId(Long id) {
        Optional<PreguntaFrecuente> preguntaFrecuente = preguntaFrecuenteRepository.findById(id);
        return preguntaFrecuente.filter(PreguntaFrecuente::isActivo); // Filtra solo las activas
    }

    // insertar pregunta Frecuente
    public void guardarPreguntaFrecuente(PreguntaFrecuente preguntaFrecuente) {
        preguntaFrecuente.setActivo(true); // Activar la pregunta por defecto
        preguntaFrecuenteRepository.save(preguntaFrecuente);
    }

    public void actualizarPreguntaFrecuente(Long id, PreguntaFrecuente preguntaActualizada) {
        Optional<PreguntaFrecuente> preguntaFrecuenteOptional = preguntaFrecuenteRepository.findById(id);
        if (preguntaFrecuenteOptional.isPresent()) {
            PreguntaFrecuente preguntaExistente = preguntaFrecuenteOptional.get();
            
            preguntaExistente.setPregunta(preguntaActualizada.getPregunta());
            preguntaExistente.setRespuesta(preguntaActualizada.getRespuesta());
            preguntaExistente.setFechaRegistro(preguntaActualizada.getFechaRegistro());
            preguntaExistente.setActivo(preguntaActualizada.isActivo());
            preguntaExistente.setCategoria(preguntaActualizada.getCategoria());
            
            preguntaFrecuenteRepository.save(preguntaExistente);
        }
    }
    
    public boolean eliminar(Long id) {
        Optional<PreguntaFrecuente> preguntaFrecuenteOptional = preguntaFrecuenteRepository.findById(id);
        if (preguntaFrecuenteOptional.isPresent()) {
            PreguntaFrecuente preguntaFrecuente = preguntaFrecuenteOptional.get();
            preguntaFrecuente.setActivo(false); 
            preguntaFrecuenteRepository.save(preguntaFrecuente);
            return true;
        } else {
            return false;
        }
    }

    // Buscar preguntas frecuentes por nombre 
    public List<PreguntaFrecuente> buscarPorNombre(String pregunta) {
        return preguntaFrecuenteRepository.findByPreguntaContainingIgnoreCaseAndActivo(pregunta, true);
    }

    public void responderPreguntaFrecuente(Long id, String respuesta) {
        Optional<PreguntaFrecuente> preguntaFrecuenteOptional = preguntaFrecuenteRepository.findById(id);

        if (preguntaFrecuenteOptional.isPresent()) {
            PreguntaFrecuente preguntaFrecuente = preguntaFrecuenteOptional.get();
            preguntaFrecuente.setRespuesta(respuesta);  // Solo actualiza la respuesta
            preguntaFrecuenteRepository.save(preguntaFrecuente);
        } 
    }

}
