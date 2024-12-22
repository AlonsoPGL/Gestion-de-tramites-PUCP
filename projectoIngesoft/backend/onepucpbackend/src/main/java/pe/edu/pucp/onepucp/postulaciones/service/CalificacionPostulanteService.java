package pe.edu.pucp.onepucp.postulaciones.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import pe.edu.pucp.onepucp.postulaciones.model.CalificacionPostulante;
import pe.edu.pucp.onepucp.postulaciones.repository.CalificacionPostulanteRepository;

@Service
public class CalificacionPostulanteService {

    @Autowired
    private CalificacionPostulanteRepository calificacionPostulanteRepository;

    @Transactional
    public List<CalificacionPostulante> registrarCalificaciones(List<CalificacionPostulante> calificaciones) {
        Iterable<CalificacionPostulante> savedCalificaciones = calificacionPostulanteRepository.saveAll(calificaciones);
        List<CalificacionPostulante> resultList = new ArrayList<>();
        savedCalificaciones.forEach(resultList::add);
        return resultList;
    }
    @Transactional
    public List<CalificacionPostulante> listarCalificacionesPorPostulacion(Long idPostulacion) {
        return calificacionPostulanteRepository.findByPostulacionId(idPostulacion);
    }
  
}
