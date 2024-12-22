package pe.edu.pucp.onepucp.postulaciones.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import pe.edu.pucp.onepucp.postulaciones.model.CalificacionPostulante;

public interface CalificacionPostulanteRepository extends CrudRepository<CalificacionPostulante, Long> {
    // Aquí puedes agregar métodos personalizados si los necesitas
    List<CalificacionPostulante> findByPostulacionId(Long id);
    
}