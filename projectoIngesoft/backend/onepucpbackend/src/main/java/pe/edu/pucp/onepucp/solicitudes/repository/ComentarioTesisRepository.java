package pe.edu.pucp.onepucp.solicitudes.repository;
import java.util.List;

import org.springframework.data.repository.CrudRepository;

import pe.edu.pucp.onepucp.solicitudes.model.ComentarioTesis;

public interface ComentarioTesisRepository extends CrudRepository<ComentarioTesis,Long>{
    List<ComentarioTesis> findBySolicitudTemaTesisId(Long solicitudId);
    //inactivar comentarios de tesistas
    
}
